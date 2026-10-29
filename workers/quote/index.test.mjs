import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import worker from './index.js';

const token = 'test-leads-token';
const digest = createHash('sha256').update(token).digest('hex');
const base = 'https://api.adrianturbinski.pl';
const site = 'https://adrianturbinski.pl';

function fakeD1() {
  const rows = [];
  return {
    rows,
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async run() {
              const [at, lang, service, budget, page, source, code, bot] = values;
              rows.push({
                id: rows.length + 1,
                at,
                lang,
                service,
                budget,
                page,
                source,
                code,
                bot,
              });
            },
            async all() {
              assert.match(sql, /bot = 0/);
              return {
                results: rows
                  .filter(r => r.bot === 0 && r.at > values[0])
                  .map(row =>
                    Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'bot')),
                  ),
              };
            },
          };
        },
      };
    },
  };
}

function setup({ telegramOk = true } = {}) {
  const sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push({ url, body: JSON.parse(init.body) });
    return new Response('{}', { status: telegramOk ? 200 : 500 });
  };
  const env = { LEADS: fakeD1(), LEADS_TOKEN_SHA256: digest, TG_TOKEN: 't', TG_CHAT: 'c' };
  return { env, sent };
}

const quote = fields =>
  new Request(`${base}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: site },
    body: JSON.stringify({
      lang: 'pl',
      contact: 'jan@example.com',
      message: 'Strona dla gabinetu',
      elapsed: 9000,
      ...fields,
    }),
  });

test('a lead is stored with its source and without contact or message', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(
    quote({
      service: 'sites',
      page: '/uslugi/',
      source: 'facebook/reel/ile-kosztuje-strona-internetowa',
    }),
    env,
  );
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  const [row] = env.LEADS.rows;
  assert.equal(row.source, 'facebook/reel/ile-kosztuje-strona-internetowa');
  assert.equal(row.page, '/uslugi/');
  assert.equal(row.bot, 0);
  assert.ok(!Object.values(row).includes('jan@example.com'));
  assert.ok(!Object.values(row).includes('Strona dla gabinetu'));
});

test('a bot submission is stored as bot and not sent to Telegram', async () => {
  const { env, sent } = setup();
  await worker.fetch(quote({ website: 'spam' }), env);
  assert.equal(sent.length, 0);
  assert.equal(env.LEADS.rows[0].bot, 1);
});

test('a storage failure does not block the Telegram delivery', async () => {
  const { env, sent } = setup();
  env.LEADS = {
    prepare: () => ({ bind: () => ({ run: async () => Promise.reject(new Error('d1 down')) }) }),
  };
  const response = await worker.fetch(quote({ source: 'ref:ig' }), env);
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
});

test('the lead list needs the bearer token', async () => {
  const { env } = setup();
  const response = await worker.fetch(new Request(`${base}/leads`), env);
  assert.equal(response.status, 401);
  const wrong = await worker.fetch(
    new Request(`${base}/leads`, { headers: { Authorization: 'Bearer nope' } }),
    env,
  );
  assert.equal(wrong.status, 401);
});

test('the lead list returns human leads after the given time', async () => {
  const { env } = setup();
  await worker.fetch(quote({ source: 'ref:ig' }), env);
  await worker.fetch(quote({ website: 'spam' }), env);
  const response = await worker.fetch(
    new Request(`${base}/leads?since=2000-01-01T00:00:00Z`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    env,
  );
  assert.equal(response.status, 200);
  const { leads } = await response.json();
  assert.equal(leads.length, 1);
  assert.equal(leads[0].source, 'ref:ig');
});
