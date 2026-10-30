const guardPercent = 80;

export const limits = {
  kv_writes: 1000,
  kv_reads: 100000,
  kv_bytes: 1e9,
  d1_rows_written: 100000,
  d1_rows_read: 5000000,
  d1_bytes: 5e9,
};

export const thresholds = Object.fromEntries(
  Object.entries(limits).map(([metric, limit]) => [
    metric,
    Math.floor((limit * guardPercent) / 100),
  ]),
);

export const maxReportBytes = 5 * 1024 * 1024;

export const scanCost = {
  kv_writes: 3,
  kv_reads: 10,
  kv_bytes: maxReportBytes,
  d1_rows_written: 64,
  d1_rows_read: 500,
  d1_bytes: 64 * 1024,
};

export const reportStoreCost = { kv_writes: 2 };

const counters = ['kv_writes', 'kv_reads', 'd1_rows_written', 'd1_rows_read'];
const lightFlushAt = { kv_reads: 25, d1_rows_read: 1000 };
export const snapshotMaxAgeMs = 30 * 1000;

const upsertSql = `INSERT INTO usage (day, metric, value) VALUES (?, ?, ?)
ON CONFLICT(day, metric) DO UPDATE SET value = value + excluded.value
RETURNING metric, value`;
const gaugeSql = `INSERT INTO usage (day, metric, value) VALUES (?, ?, ?)
ON CONFLICT(day, metric) DO UPDATE SET value = excluded.value`;
const alertSql = `INSERT INTO usage (day, metric, value) VALUES (?, ?, 1)
ON CONFLICT(day, metric) DO NOTHING`;
const usageSql = 'SELECT day, metric, value FROM usage WHERE day >= ?';
const reportBytesSql =
  'SELECT COALESCE(SUM(report_bytes), 0) AS n FROM scans WHERE report_key IS NOT NULL';

export const utcDay = (at = Date.now()) => new Date(at).toISOString().slice(0, 10);

let carry = {};
let carriedSize = null;
let cached = null;
const alerted = new Set();

export function resetUsageState() {
  carry = {};
  carriedSize = null;
  cached = null;
  alerted.clear();
}

const sum = (target, source) => {
  for (const [metric, value] of Object.entries(source)) {
    if (value) target[metric] = (target[metric] ?? 0) + value;
  }
  return target;
};

function meterStatement(statement, record) {
  const wrapped = {
    inner: statement,
    bind: (...values) => meterStatement(statement.bind(...values), record),
    async run() {
      return record(await statement.run());
    },
    async all() {
      return record(await statement.all());
    },
    async first(column) {
      const { results } = record(await statement.all());
      const row = results?.[0] ?? null;
      return column && row ? row[column] : row;
    },
  };
  return wrapped;
}

function meterD1(database, record) {
  return {
    prepare: sql => meterStatement(database.prepare(sql), record),
    async batch(list) {
      const results = await database.batch(list.map(item => item.inner ?? item));
      results.forEach(result => record(result));
      return results;
    },
  };
}

function meterKv(namespace, add) {
  return {
    async put(...args) {
      add('kv_writes', 1);
      return namespace.put(...args);
    },
    async delete(...args) {
      add('kv_writes', 1);
      return namespace.delete(...args);
    },
    async get(...args) {
      add('kv_reads', 1);
      return namespace.get(...args);
    },
    async getWithMetadata(...args) {
      add('kv_reads', 1);
      return namespace.getWithMetadata(...args);
    },
  };
}

export function createMeter(env, notify) {
  const pending = {};
  let sizeAfter = null;
  const add = (metric, amount) => {
    if (amount) pending[metric] = (pending[metric] ?? 0) + amount;
  };
  const record = result => {
    const meta = result?.meta ?? {};
    add('d1_rows_read', meta.rows_read ?? result?.results?.length ?? 0);
    add('d1_rows_written', meta.rows_written ?? meta.changes ?? 0);
    if (Number.isFinite(meta.size_after)) sizeAfter = meta.size_after;
    return result;
  };
  const database = env.SCANS;
  const metered = {
    ...env,
    ...(database ? { SCANS: meterD1(database, record) } : {}),
    ...(env.REPORTS ? { REPORTS: meterKv(env.REPORTS, add) } : {}),
  };

  async function alertOnce(metric, value) {
    const day = utcDay();
    const marker = `${day}:${metric}`;
    if (alerted.has(marker)) return;
    alerted.add(marker);
    const claimed = await database.prepare(alertSql).bind(day, `alert:${metric}`).run();
    sum(carry, { d1_rows_written: 1 });
    if (!claimed.meta?.changes) return;
    await notify([
      'Skaner: limit Cloudflare',
      `Metryka: ${metric}`,
      `Wartość: ${value} z progu ${thresholds[metric]} (limit ${limits[metric]})`,
      'Nowe skany są wstrzymane do północy UTC.',
    ]);
  }

  async function flush() {
    if (!database) return;
    try {
      const totals = sum(sum({}, carry), pending);
      const size = sizeAfter ?? carriedSize;
      Object.keys(pending).forEach(metric => delete pending[metric]);
      sizeAfter = null;
      const writes = (totals.kv_writes ?? 0) + (totals.d1_rows_written ?? 0);
      const small = counters.every(metric => (totals[metric] ?? 0) < (lightFlushAt[metric] ?? 1));
      if (!writes && small) {
        carry = totals;
        carriedSize = size;
        return;
      }
      carry = {};
      carriedSize = null;
      const names = counters.filter(metric => totals[metric] > 0);
      totals.d1_rows_written =
        (totals.d1_rows_written ?? 0) + names.length + (names.includes('d1_rows_written') ? 0 : 1);
      if (!names.includes('d1_rows_written')) names.push('d1_rows_written');
      const day = utcDay();
      const statements = names.map(metric =>
        database.prepare(upsertSql).bind(day, metric, totals[metric]),
      );
      if (size !== null) statements.push(database.prepare(gaugeSql).bind(day, 'd1_bytes', size));
      const results = await database.batch(statements);
      cached = null;
      const crossed = [];
      for (const result of results) {
        for (const row of result?.results ?? []) {
          if (row.value >= thresholds[row.metric]) crossed.push([row.metric, row.value]);
        }
      }
      if (size !== null && size >= thresholds.d1_bytes) crossed.push(['d1_bytes', size]);
      for (const [metric, value] of crossed) await alertOnce(metric, value);
    } catch {
      return;
    }
  }

  async function load(maxAgeMs) {
    const now = Date.now();
    if (cached && cached.day === utcDay(now) && now - cached.at <= maxAgeMs) return cached.values;
    const day = utcDay(now);
    const { results } = await metered.SCANS.prepare(usageSql)
      .bind(utcDay(now - 24 * 3600 * 1000))
      .all();
    const values = {};
    let gaugeDay = '';
    for (const row of results) {
      if (row.day === day && counters.includes(row.metric)) values[row.metric] = row.value;
      if (row.metric === 'd1_bytes' && row.day >= gaugeDay) {
        gaugeDay = row.day;
        values.d1_bytes = row.value;
      }
    }
    cached = { day, at: now, values };
    return values;
  }

  async function usage({ withBytes = false, maxAgeMs = 0 } = {}) {
    if (!database) return {};
    const stored = { ...(await load(maxAgeMs)) };
    if (withBytes) {
      const row = await metered.SCANS.prepare(reportBytesSql).first();
      stored.kv_bytes = row?.n ?? 0;
    }
    const values = { ...stored };
    for (const [metric, amount] of Object.entries(sum(sum({}, carry), pending))) {
      if (counters.includes(metric)) values[metric] = (values[metric] ?? 0) + amount;
    }
    if (carriedSize !== null) values.d1_bytes = carriedSize;
    if (sizeAfter !== null) values.d1_bytes = sizeAfter;
    return values;
  }

  async function blocked(costs, options = {}) {
    const values = await usage({
      withBytes: costs.kv_bytes !== undefined,
      maxAgeMs: options.maxAgeMs,
    });
    let first = null;
    for (const [metric, cost] of Object.entries(costs)) {
      const used = values[metric] ?? 0;
      if (used >= thresholds[metric]) await alertOnce(metric, used).catch(() => {});
      if (used + cost > thresholds[metric] && !first) first = metric;
    }
    return first;
  }

  return { env: metered, flush, usage, blocked };
}
