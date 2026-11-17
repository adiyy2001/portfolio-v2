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
              const wanted = Number(sql.match(/bot = (\d)/)[1]);
              return {
                results: rows
                  .filter(r => r.bot === wanted && r.at > values[0])
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

test('a fast but valid submission is stored as suspect and still alerts the owner with the reason', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(quote({ elapsed: 2086, source: 'ref:ig' }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sent.length, 1);
  const text = sent[0].body.text;
  assert.match(text, /MOŻLIWY BOT/);
  assert.match(text, /2086 ms/);
  assert.match(text, /jan@example\.com/);
  assert.match(text, /Strona dla gabinetu/);
  assert.equal(env.LEADS.rows.length, 1);
  assert.equal(env.LEADS.rows[0].bot, 2);
});

test('a submission without any fill time measurement is also alerted as suspect', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(quote({ elapsed: 0 }), env);
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].body.text, /MOŻLIWY BOT: brak pomiaru/);
  assert.equal(env.LEADS.rows[0].bot, 2);
});

test('a fast submission at the threshold boundary is normal from 2500 ms', async () => {
  const { env, sent } = setup();
  await worker.fetch(quote({ elapsed: 2499 }), env);
  await worker.fetch(quote({ elapsed: 2500 }), env);
  assert.equal(sent.length, 2);
  assert.match(sent[0].body.text, /MOŻLIWY BOT/);
  assert.doesNotMatch(sent[1].body.text, /MOŻLIWY BOT/);
  assert.deepEqual(
    env.LEADS.rows.map(row => row.bot),
    [2, 0],
  );
});

test('a normal submission is stored as human and alerted without a bot mark', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(quote({ elapsed: 9000 }), env);
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0].body.text, /MOŻLIWY BOT/);
  assert.equal(env.LEADS.rows[0].bot, 0);
});

test('a honeypot hit stays silent even when it was also fast', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(quote({ website: 'spam', elapsed: 100 }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sent.length, 0);
  assert.equal(env.LEADS.rows[0].bot, 1);
});

test('a fast submission with an unreachable contact is refused, not silently accepted', async () => {
  const { env, sent } = setup();
  const response = await worker.fetch(quote({ elapsed: 500, contact: 'abc' }), env);
  assert.equal(response.status, 422);
  assert.equal(sent.length, 0);
  assert.equal(env.LEADS.rows.length, 0);
});

test('a fast submission whose delivery fails is reported as failed, not as success', async () => {
  const { env, sent } = setup({ telegramOk: false });
  const response = await worker.fetch(quote({ elapsed: 500 }), env);
  assert.equal(response.status, 502);
  assert.equal(sent.length, 1);
});

test('the suspect review list returns only suspect rows and the normal list leaves them out', async () => {
  const { env } = setup();
  await worker.fetch(quote({ elapsed: 9000, source: 'ref:ig' }), env);
  await worker.fetch(quote({ elapsed: 800, source: 'ref:fb' }), env);
  await worker.fetch(quote({ website: 'spam', source: 'ref:bot' }), env);
  const headers = { Authorization: `Bearer ${token}` };
  const normal = await worker.fetch(
    new Request(`${base}/leads?since=2000-01-01T00:00:00Z`, { headers }),
    env,
  );
  assert.deepEqual(
    (await normal.json()).leads.map(lead => lead.source),
    ['ref:ig'],
  );
  const review = await worker.fetch(
    new Request(`${base}/leads?review=suspect&since=2000-01-01T00:00:00Z`, { headers }),
    env,
  );
  assert.deepEqual(
    (await review.json()).leads.map(lead => lead.source),
    ['ref:fb'],
  );
  const anonymous = await worker.fetch(new Request(`${base}/leads?review=suspect`), env);
  assert.equal(anonymous.status, 401);
});
