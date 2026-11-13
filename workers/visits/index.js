const site = 'https://adrianturbinski.pl';
const origins = new Set([site, 'https://www.adrianturbinski.pl']);

const dailyCap = 20000;
const retentionDays = 180;
const maxBody = 1000;
const maxMs = 3600000;
const maxCount = 50;
const kinds = new Set(['gclid', 'gbraid', 'wbraid', 'utm']);
const devices = new Set(['m', 't', 'd']);

const botAgent =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|phantom|selenium|puppeteer|playwright|python|curl|wget|http|monitor|preview|facebookexternalhit|adsbot|mediapartners|google-|favicon|java\/|go-http|okhttp|axios|node-fetch|scrapy/i;

const cors = origin => ({
  'Access-Control-Allow-Origin': origins.has(origin) ? origin : site,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const accepted = origin => new Response(null, { status: 204, headers: cors(origin) });

const warsawDay = (at = Date.now()) => new Date(at).toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
const utcDay = (at = Date.now()) => new Date(at).toISOString().slice(0, 10);

const number = (value, max) => {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, max);
};

const label = (value, pattern) => {
  const text = String(value ?? '');
  return pattern.test(text) ? text : null;
};

const slug = value => label(value, /^[a-z0-9._-]{0,40}$/);
const path = value => label(value, /^\/[A-Za-z0-9/_.%-]{0,119}$/);

export function readMessage(text) {
  if (text.length > maxBody) return null;
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;
  const message = {
    vid: label(raw.v, /^[a-f0-9]{16}$/),
    landing: path(raw.landing),
    last: path(raw.path),
    kind: kinds.has(raw.kind) ? raw.kind : null,
    src: slug(raw.src),
    med: slug(raw.med),
    cmp: slug(raw.cmp),
    term: slug(raw.term),
    dev: devices.has(raw.dev) ? raw.dev : null,
    pages: Math.max(1, number(raw.pages, maxCount)),
    ms: number(raw.ms, maxMs),
    scroll: number(raw.scroll, 100),
    tel: number(raw.tel, maxCount),
    mail: number(raw.mail, maxCount),
    form: number(raw.form, maxCount),
    cta: number(raw.cta, maxCount),
  };
  const required = ['vid', 'landing', 'last', 'kind', 'src', 'med', 'cmp', 'term', 'dev'];
  return required.every(key => message[key] !== null) ? message : null;
}

const upsertSql = `INSERT INTO visits (vid, day, at, updated, landing, last_path, kind, src, med, cmp, term, dev, pages, ms, scroll, tel, mail, form, cta)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(vid) DO UPDATE SET
  updated = excluded.updated,
  last_path = excluded.last_path,
  pages = MAX(pages, excluded.pages),
  ms = MAX(ms, excluded.ms),
  scroll = MAX(scroll, excluded.scroll),
  tel = MAX(tel, excluded.tel),
  mail = MAX(mail, excluded.mail),
  form = MAX(form, excluded.form),
  cta = MAX(cta, excluded.cta)`;

const usageSql = `INSERT INTO usage (day, messages) VALUES (?, 1)
ON CONFLICT(day) DO UPDATE SET messages = messages + 1`;

async function store(env, message) {
  const now = new Date().toISOString();
  const usageDay = utcDay();
  const usage = await env.VISITS.prepare('SELECT messages, capped FROM usage WHERE day = ?')
    .bind(usageDay)
    .first();
  if (usage && usage.messages >= dailyCap) {
    if (!usage.capped) {
      await env.VISITS.prepare('UPDATE usage SET capped = 1 WHERE day = ?').bind(usageDay).run();
    }
    return false;
  }
  await env.VISITS.batch([
    env.VISITS.prepare(upsertSql).bind(
      message.vid,
      warsawDay(),
      now,
      now,
      message.landing,
      message.last,
      message.kind,
      message.src,
      message.med,
      message.cmp,
      message.term,
      message.dev,
      message.pages,
      message.ms,
      message.scroll,
      message.tel,
      message.mail,
      message.form,
      message.cta,
    ),
    env.VISITS.prepare(usageSql).bind(usageDay),
  ]);
  return true;
}

async function receive(request, env, origin) {
  const agent = request.headers.get('User-Agent') || '';
  if (!agent || botAgent.test(agent)) return accepted(origin);
  if (request.headers.get('Sec-Fetch-Site') !== 'same-site') return accepted(origin);
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({
      key: request.headers.get('CF-Connecting-IP') || 'none',
    });
    if (!success) return accepted(origin);
  }
  const message = readMessage(await request.text());
  if (message) await store(env, message).catch(() => {});
  return accepted(origin);
}

const hex = buffer =>
  [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');

async function sha256(text) {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

function sameText(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function authorized(request, env) {
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const expected = String(env.STATS_TOKEN_SHA256 || '').toLowerCase();
  if (!token || expected.length !== 64) return false;
  return sameText(await sha256(token), expected);
}

const totals = `COUNT(*) AS visits,
  SUM(CASE WHEN ms >= 10000 THEN 1 ELSE 0 END) AS engaged,
  ROUND(AVG(ms) / 1000.0, 1) AS avg_seconds,
  ROUND(AVG(scroll), 0) AS avg_scroll,
  SUM(CASE WHEN scroll >= 50 THEN 1 ELSE 0 END) AS scrolled_half,
  SUM(CASE WHEN pages > 1 THEN 1 ELSE 0 END) AS more_pages,
  SUM(CASE WHEN dev = 'm' THEN 1 ELSE 0 END) AS mobile,
  SUM(CASE WHEN tel > 0 THEN 1 ELSE 0 END) AS phone_clicks,
  SUM(CASE WHEN mail > 0 THEN 1 ELSE 0 END) AS mail_clicks,
  SUM(CASE WHEN form > 0 THEN 1 ELSE 0 END) AS form_sent,
  SUM(CASE WHEN cta > 0 THEN 1 ELSE 0 END) AS cta_clicks`;

async function stats(request, env, url) {
  if (!(await authorized(request, env))) return new Response('Unauthorized', { status: 401 });
  const since = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('since') || '')
    ? url.searchParams.get('since')
    : warsawDay(Date.now() - 14 * 86400000);
  const byDay = await env.VISITS.prepare(
    `SELECT day, ${totals} FROM visits WHERE day >= ? AND cmp != 'selftest' GROUP BY day ORDER BY day`,
  )
    .bind(since)
    .all();
  const byLanding = await env.VISITS.prepare(
    `SELECT landing, kind, ${totals} FROM visits WHERE day >= ? AND cmp != 'selftest' GROUP BY landing, kind ORDER BY visits DESC LIMIT 30`,
  )
    .bind(since)
    .all();
  const byTerm = await env.VISITS.prepare(
    `SELECT cmp, term, ${totals} FROM visits WHERE day >= ? AND cmp != 'selftest' AND (cmp != '' OR term != '') GROUP BY cmp, term ORDER BY visits DESC LIMIT 30`,
  )
    .bind(since)
    .all();
  const usage = await env.VISITS.prepare(
    'SELECT day, messages, capped FROM usage WHERE day >= ? ORDER BY day',
  )
    .bind(since)
    .all();
  return new Response(
    JSON.stringify({
      since,
      byDay: byDay.results,
      byLanding: byLanding.results,
      byTerm: byTerm.results,
      usage: usage.results,
      dailyCap,
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

export async function purge(env, at = Date.now()) {
  const cutoff = warsawDay(at - retentionDays * 86400000);
  await env.VISITS.prepare('DELETE FROM visits WHERE day < ?').bind(cutoff).run();
  await env.VISITS.prepare('DELETE FROM usage WHERE day < ?').bind(cutoff).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    if (url.pathname === '/v/stats' && request.method === 'GET') return stats(request, env, url);
    if (url.pathname !== '/v/hit') return new Response('Not found', { status: 404 });
    if (request.method === 'OPTIONS' && origins.has(origin)) return accepted(origin);
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    if (!origins.has(origin)) return new Response(null, { status: 403 });
    return receive(request, env, origin);
  },
  async scheduled(event, env) {
    await purge(env);
  },
};
