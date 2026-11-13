import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker, { readMessage, purge } from './index.js';

const site = 'https://adrianturbinski.pl';
const base = 'https://api.adrianturbinski.pl';
const browser =
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
const token = 'visits-test-token';
const digest = createHash('sha256').update(token).digest('hex');

function database() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const statement = sql => ({
    bind: (...values) => ({
      run: async () => db.prepare(sql).run(...values),
      first: async () => db.prepare(sql).get(...values) ?? null,
      all: async () => ({ results: db.prepare(sql).all(...values) }),
      sql,
      values,
    }),
  });
  return {
    db,
    prepare: statement,
    async batch(items) {
      for (const item of items) db.prepare(item.sql).run(...item.values);
    },
  };
}

function environment(overrides = {}) {
  const store = database();
  return {
    store,
    env: {
      VISITS: store,
      LIMITER: { limit: async () => ({ success: true }) },
      STATS_TOKEN_SHA256: digest,
      ...overrides,
    },
  };
}

const body = (extra = {}) =>
  JSON.stringify({
    v: 'a1b2c3d4e5f60718',
    landing: '/uslugi/strony-internetowe/',
    path: '/uslugi/strony-internetowe/',
    kind: 'gclid',
    src: 'google',
    med: 'cpc',
    cmp: 'wroclaw',
    term: '',
    dev: 'm',
    pages: 1,
    ms: 4000,
    scroll: 30,
    tel: 0,
    mail: 0,
    form: 0,
    cta: 0,
    ...extra,
  });

const hit = (payload, headers = {}) =>
  new Request(`${base}/v/hit`, {
    method: 'POST',
    body: payload,
    headers: {
      Origin: site,
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': browser,
      'Content-Type': 'text/plain;charset=UTF-8',
      ...headers,
    },
  });

const rowsOf = store => store.db.prepare('SELECT * FROM visits').all();

test('stores a valid hit and answers 204 with CORS for the site only', async () => {
  const { env, store } = environment();
  const response = await worker.fetch(hit(body()), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), site);
  const rows = rowsOf(store);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].landing, '/uslugi/strony-internetowe/');
  assert.equal(rows[0].dev, 'm');
});

test('later beacons raise counters and never lower them', async () => {
  const { env, store } = environment();
  await worker.fetch(hit(body({ ms: 20000, scroll: 80, pages: 2, tel: 1 })), env);
  await worker.fetch(hit(body({ ms: 5000, scroll: 10, pages: 1, tel: 0, path: '/kontakt/' })), env);
  const rows = rowsOf(store);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].ms, 20000);
  assert.equal(rows[0].scroll, 80);
  assert.equal(rows[0].pages, 2);
  assert.equal(rows[0].tel, 1);
  assert.equal(rows[0].last_path, '/kontakt/');
});

test('rejects foreign origins and wrong methods', async () => {
  const { env, store } = environment();
  const foreign = await worker.fetch(hit(body(), { Origin: 'https://evil.example' }), env);
  assert.equal(foreign.status, 403);
  const get = await worker.fetch(new Request(`${base}/v/hit`), env);
  assert.equal(get.status, 405);
  assert.equal(rowsOf(store).length, 0);
});

test('answers the preflight only for the site', async () => {
  const { env } = environment();
  const ok = await worker.fetch(
    new Request(`${base}/v/hit`, { method: 'OPTIONS', headers: { Origin: site } }),
    env,
  );
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('Access-Control-Allow-Origin'), site);
  const bad = await worker.fetch(
    new Request(`${base}/v/hit`, { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }),
    env,
  );
  assert.equal(bad.status, 405);
});

test('drops bots, cross-site calls and empty agents silently', async () => {
  const { env, store } = environment();
  for (const agent of ['Googlebot/2.1', 'HeadlessChrome/130', 'curl/8.0', '']) {
    const response = await worker.fetch(hit(body(), { 'User-Agent': agent }), env);
    assert.equal(response.status, 204);
  }
  const cross = await worker.fetch(hit(body(), { 'Sec-Fetch-Site': 'cross-site' }), env);
  assert.equal(cross.status, 204);
  assert.equal(rowsOf(store).length, 0);
});

test('drops hits over the rate limit', async () => {
  const { env, store } = environment({ LIMITER: { limit: async () => ({ success: false }) } });
  const response = await worker.fetch(hit(body()), env);
  assert.equal(response.status, 204);
  assert.equal(rowsOf(store).length, 0);
});

test('rejects malformed, oversized and unknown payloads', () => {
  assert.equal(readMessage('not json'), null);
  assert.equal(readMessage('x'.repeat(1001)), null);
  assert.equal(readMessage(body({ v: 'short' })), null);
  assert.equal(readMessage(body({ kind: 'other' })), null);
  assert.equal(readMessage(body({ landing: 'https://evil.example/' })), null);
  assert.equal(readMessage(body({ src: 'Bad Value!' })), null);
  assert.equal(readMessage(body({ dev: 'x' })), null);
});

test('clamps numeric fields', () => {
  const message = readMessage(body({ ms: 99999999, scroll: 500, tel: -3, pages: 9999 }));
  assert.equal(message.ms, 3600000);
  assert.equal(message.scroll, 100);
  assert.equal(message.tel, 0);
  assert.equal(message.pages, 50);
});

test('stores no ip, agent or click id', async () => {
  const { env, store } = environment();
  await worker.fetch(hit(body(), { 'CF-Connecting-IP': '203.0.113.9' }), env);
  const columns = store.db.prepare('PRAGMA table_info(visits)').all().map(column => column.name);
  assert.ok(!columns.some(name => /ip|agent|ua|gclid|gbraid|wbraid/.test(name)));
  assert.ok(!JSON.stringify(rowsOf(store)).includes('203.0.113.9'));
});

test('stops writing at the daily cap and flags it', async () => {
  const { env, store } = environment();
  const day = new Date().toISOString().slice(0, 10);
  store.db.prepare('INSERT INTO usage (day, messages) VALUES (?, ?)').run(day, 20000);
  const response = await worker.fetch(hit(body()), env);
  assert.equal(response.status, 204);
  assert.equal(rowsOf(store).length, 0);
  assert.equal(store.db.prepare('SELECT capped FROM usage WHERE day = ?').get(day).capped, 1);
});

test('stats need the bearer token and exclude selftest visits', async () => {
  const { env } = environment();
  await worker.fetch(hit(body()), env);
  await worker.fetch(hit(body({ v: 'ffffffffffffffff', cmp: 'selftest' })), env);
  const denied = await worker.fetch(new Request(`${base}/v/stats`), env);
  assert.equal(denied.status, 401);
  const wrong = await worker.fetch(
    new Request(`${base}/v/stats`, { headers: { Authorization: 'Bearer nope' } }),
    env,
  );
  assert.equal(wrong.status, 401);
  const ok = await worker.fetch(
    new Request(`${base}/v/stats`, { headers: { Authorization: `Bearer ${token}` } }),
    env,
  );
  assert.equal(ok.status, 200);
  const data = await ok.json();
  assert.equal(data.byDay.reduce((sum, row) => sum + row.visits, 0), 1);
  assert.equal(data.byLanding[0].landing, '/uslugi/strony-internetowe/');
  assert.equal(data.dailyCap, 20000);
});

test('purge removes visits older than the retention window', async () => {
  const { env, store } = environment();
  store.db
    .prepare(
      `INSERT INTO visits (vid, day, at, updated, landing, last_path, kind, src, med, cmp, term, dev)
       VALUES ('0000000000000001', '2020-01-01', 'x', 'x', '/', '/', 'gclid', 'google', 'cpc', '', '', 'd')`,
    )
    .run();
  await worker.fetch(hit(body()), env);
  await purge(env);
  assert.equal(rowsOf(store).length, 1);
});
