import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from './index.js';
import consent from './consent.js';
import { resetUsageState, scanCost, thresholds } from './usage.js';
import { confirmMail, failureMail, reportMail, sequenceMail } from './views.js';

const bearer = 'test-scanner-token';
const digest = createHash('sha256').update(bearer).digest('hex');
const base = 'https://api.adrianturbinski.pl';
const site = 'https://adrianturbinski.pl';
const resend = 'https://api.resend.com/emails';
const turnstile = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const hour = 3600 * 1000;
const sha = text => createHash('sha256').update(text).digest('hex');
const ago = ms => new Date(Date.now() - ms).toISOString();

function fakeD1() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  const database = { db, sizeAfter: 4096 };
  const isRead = sql => /^\s*SELECT/i.test(sql);
  const statement = (sql, values = []) => ({
    bind: (...next) => statement(sql, next),
    async run() {
      const result = db.prepare(sql).run(...values);
      const changes = Number(result.changes);
      return {
        meta: {
          changes,
          rows_read: 0,
          rows_written: changes,
          size_after: database.sizeAfter,
        },
      };
    },
    async first() {
      return db.prepare(sql).get(...values) ?? null;
    },
    async all() {
      const results = db.prepare(sql).all(...values);
      const changes = isRead(sql) ? 0 : Number(db.prepare('SELECT changes() AS n').get().n);
      return {
        results,
        meta: {
          changes,
          rows_read: results.length,
          rows_written: changes,
          size_after: database.sizeAfter,
        },
      };
    },
  });
  return Object.assign(database, {
    prepare: sql => statement(sql),
    async batch(list) {
      db.exec('BEGIN');
      try {
        const done = [];
        for (const item of list) done.push(await item.all());
        db.exec('COMMIT');
        return done;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  });
}

function fakeKv() {
  const objects = new Map();
  return {
    objects,
    async put(key, value, options) {
      objects.set(key, { value, ...options });
    },
    async getWithMetadata(key) {
      const entry = objects.get(key);
      return entry
        ? { value: entry.value, metadata: entry.metadata ?? null }
        : { value: null, metadata: null };
    },
    async delete(key) {
      objects.delete(key);
    },
  };
}

function setup({ secrets = true, turnstileOk = true, resendOk = true, telegramOk = true } = {}) {
  resetUsageState();
  const calls = [];
  const mode = { resendOk };
  globalThis.fetch = async (url, init) => {
    const target = String(url);
    const raw = init?.body;
    const body =
      target === turnstile ? Object.fromEntries(new URLSearchParams(raw)) : JSON.parse(raw);
    calls.push({ url: target, init, body });
    if (target === turnstile) return Response.json({ success: turnstileOk });
    if (target === resend) return new Response('{}', { status: mode.resendOk ? 200 : 500 });
    return new Response('{}', { status: telegramOk ? 200 : 500 });
  };
  const env = {
    SCANS: fakeD1(),
    REPORTS: fakeKv(),
    RESEND_API_KEY: 're_test',
    IP_SALT: 'pepper',
    SCANNER_TOKEN_SHA256: digest,
    TG_TOKEN: 'tg',
    TG_CHAT: 'chat',
    ...(secrets ? { TURNSTILE_SECRET: 'ts-secret' } : {}),
  };
  const mails = () => calls.filter(call => call.url === resend).map(call => call.body);
  const telegram = () =>
    calls.filter(call => call.url.startsWith('https://api.telegram.org/')).map(call => call.body);
  return { env, calls, mails, telegram, mode };
}

let counter = 0;
const unique = () => {
  counter += 1;
  return {
    url: `https://site${counter}-example.com/`,
    email: `user${counter}@example.com`,
    ip: `203.0.113.${counter % 250}`,
  };
};

function scanRequest(fields = {}, { ip, headers = {} } = {}) {
  const defaults = unique();
  return new Request(`${base}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: site,
      'CF-Connecting-IP': ip ?? defaults.ip,
      'User-Agent': 'TestAgent/1.0',
      ...headers,
    },
    body: JSON.stringify({
      url: defaults.url,
      email: defaults.email,
      terms: true,
      marketing: false,
      lang: 'pl',
      consentVersion: consent.version,
      consentHash: sha(JSON.stringify(consent)),
      turnstile: 'turnstile-token',
      page: '/skaner/',
      startedAt: Date.now() - 10000,
      ...fields,
    }),
  });
}

const submit = (env, fields, options) => worker.fetch(scanRequest(fields, options), env);
const rows = (env, table) => env.SCANS.db.prepare(`SELECT * FROM ${table}`).all();
const scanRow = (env, id) => env.SCANS.db.prepare('SELECT * FROM scans WHERE id = ?').get(id);
const tokenIn = text => text.match(/[?&]t=([\w-]+)/)[1];

const confirmPost = (env, token) =>
  worker.fetch(
    new Request(`${base}/scan/confirm`, {
      method: 'POST',
      body: new URLSearchParams({ t: token }),
    }),
    env,
  );

const authed = (path, init = {}) =>
  new Request(`${base}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${bearer}`, ...init.headers },
  });

async function confirmed(ctx, fields, options) {
  const response = await submit(ctx.env, fields, options);
  assert.equal(response.status, 202);
  const mail = ctx.mails().at(-1);
  const confirm = await confirmPost(ctx.env, tokenIn(mail.text));
  assert.equal(confirm.status, 200);
  return rows(ctx.env, 'scans').at(-1).id;
}

async function runningJob(ctx, fields, options) {
  await confirmed(ctx, fields, options);
  const response = await worker.fetch(authed('/scan/jobs/next'), ctx.env);
  assert.equal(response.status, 200);
  return response.json();
}

const resultRequest = (id, body, withAuth = true) =>
  new Request(`${base}/scan/jobs/${id}/result`, {
    method: 'POST',
    headers: withAuth ? { Authorization: `Bearer ${bearer}` } : {},
    body: JSON.stringify(body),
  });

const summary = {
  pages: 12,
  violations: 7,
  critical: 1,
  serious: 2,
  moderate: 3,
  minor: 1,
  incomplete: 4,
  engine: 'axe-core',
};

test('unsafe or malformed addresses are rejected before anything is stored', async () => {
  const { env, mails } = setup();
  const rejected = [
    'http://127.0.0.1/',
    'http://2130706433/',
    'http://[::1]/',
    'http://[2001:db8::1]/',
    'http://8.8.8.8/',
    'http://localhost/',
    'http://printer.local/',
    'http://nas.internal/',
    'http://router.lan/',
    'http://box.home.arpa/',
    'http://intranet/',
    'ftp://example.com/',
    'file:///etc/passwd',
    'javascript:alert(1)',
    'https://user:secret@example.com/',
    'https://example.com:8080/',
    'https://example.com:22/',
    'https://example.123/',
    'https://exa_mple.com/',
    'not a url',
    '',
    `https://example.com/${'a'.repeat(2100)}`,
  ];
  for (const url of rejected) {
    const response = await submit(env, { url });
    assert.equal(response.status, 422, url);
    assert.equal((await response.json()).error, 'url', url);
  }
  assert.equal(rows(env, 'scans').length, 0);
  assert.equal(mails().length, 0);
});

test('a valid address is normalized to origin and path and keyed by the bare domain', async () => {
  const { env } = setup();
  const response = await submit(env, { url: 'https://www.Example-Shop.PL:443/oferta/?x=1#top' });
  assert.equal(response.status, 202);
  const [row] = rows(env, 'scans');
  assert.equal(row.url, 'https://www.example-shop.pl/oferta/');
  assert.equal(row.domain, 'example-shop.pl');
  const plain = await submit(env, { url: 'http://shop.example.org:80' });
  assert.equal(plain.status, 202);
  assert.equal(rows(env, 'scans')[1].url, 'http://shop.example.org/');
  const bare = await submit(env, { url: 'bare-domain.example.net' });
  assert.equal(bare.status, 202);
  assert.equal(rows(env, 'scans')[2].url, 'https://bare-domain.example.net/');
});

test('a wrong consent version is a 409 so the page gets reloaded', async () => {
  const { env, mails } = setup();
  const response = await submit(env, { consentVersion: 'old-version' });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error, 'consent_version');
  const missing = await submit(env, { consentVersion: undefined });
  assert.equal(missing.status, 409);
  assert.equal(rows(env, 'scans').length, 0);
  assert.equal(mails().length, 0);
});

test('terms and a plausible email are required', async () => {
  const { env } = setup();
  const noTerms = await submit(env, { terms: false });
  assert.equal(noTerms.status, 422);
  assert.equal((await noTerms.json()).error, 'terms');
  const stringTerms = await submit(env, { terms: 'true' });
  assert.equal(stringTerms.status, 422);
  for (const email of [
    '',
    'jan',
    'jan@',
    'jan@example',
    'a b@example.com',
    `${'a'.repeat(250)}@example.com`,
  ]) {
    const response = await submit(env, { email });
    assert.equal(response.status, 422, email);
    assert.equal((await response.json()).error, 'email', email);
  }
  assert.equal(rows(env, 'scans').length, 0);
});

test('the exact consent texts and their hashes are stored with the request evidence', async () => {
  const { env } = setup();
  const response = await submit(env, { marketing: true, page: '/skaner/' }, { ip: '198.51.100.7' });
  assert.equal(response.status, 202);
  const [scan] = rows(env, 'scans');
  const records = rows(env, 'consents');
  assert.deepEqual(records.map(r => r.kind).sort(), ['info', 'marketing', 'terms']);
  for (const record of records) {
    assert.equal(record.scan_id, scan.id);
    assert.equal(record.text, consent.pl[record.kind]);
    assert.equal(record.text_sha256, sha(consent.pl[record.kind]));
    assert.equal(record.version, String(consent.version));
    assert.equal(record.ip, '198.51.100.7');
    assert.equal(record.ua, 'TestAgent/1.0');
    assert.equal(record.page, '/skaner/');
  }
  assert.equal(records.find(r => r.kind === 'terms').granted, 1);
  assert.equal(records.find(r => r.kind === 'marketing').granted, 1);
  assert.equal(scan.marketing, 1);
  assert.equal(scan.ip_hash, sha(`pepper198.51.100.7`));
  assert.ok(!Object.values(scan).includes('198.51.100.7'));
  assert.equal(scan.status, 'pending');
});

test('marketing consent is not recorded as granted when the box was not ticked', async () => {
  const { env } = setup();
  await submit(env, { marketing: false });
  await submit(env, { marketing: 'yes' });
  for (const scan of rows(env, 'scans')) assert.equal(scan.marketing, 0);
  for (const record of rows(env, 'consents').filter(r => r.kind === 'marketing'))
    assert.equal(record.granted, 0);
});

test('turnstile is verified with the secret, token and client ip', async () => {
  const { env, calls } = setup();
  const response = await submit(env, { turnstile: 'abc' }, { ip: '198.51.100.9' });
  assert.equal(response.status, 202);
  const check = calls.find(call => call.url === turnstile);
  assert.deepEqual(check.body, {
    secret: 'ts-secret',
    response: 'abc',
    remoteip: '198.51.100.9',
  });
});

test('a failed or missing turnstile answer is a 403 and nothing is stored', async () => {
  const failing = setup({ turnstileOk: false });
  const response = await submit(failing.env, {});
  assert.equal(response.status, 403);
  assert.equal(rows(failing.env, 'scans').length, 0);
  assert.equal(failing.mails().length, 0);
  const missing = setup();
  const noToken = await submit(missing.env, { turnstile: '' });
  assert.equal(noToken.status, 403);
});

test('without a turnstile secret the service is closed unless dev mode is on', async () => {
  const closed = setup({ secrets: false });
  assert.equal((await submit(closed.env, {})).status, 503);
  assert.equal(rows(closed.env, 'scans').length, 0);
  const { env, calls } = setup({ secrets: false });
  env.SCAN_DEV = '1';
  const response = await submit(env, { turnstile: undefined });
  assert.equal(response.status, 202);
  assert.ok(!calls.some(call => call.url === turnstile));
});

test('a form filled in under 2.5 seconds is dropped quietly', async () => {
  const { env, mails } = setup();
  const response = await submit(env, { startedAt: Date.now() - 500 });
  assert.equal(response.status, 202);
  assert.equal(rows(env, 'scans').length, 0);
  assert.equal(mails().length, 0);
});

test('a missing mail key gives 503 and a mail provider failure gives 502 without leftovers', async () => {
  const noKey = setup();
  delete noKey.env.RESEND_API_KEY;
  const unavailable = await submit(noKey.env, {});
  assert.equal(unavailable.status, 503);
  assert.equal(rows(noKey.env, 'scans').length, 0);

  const down = setup({ resendOk: false });
  const failed = await submit(down.env, {});
  assert.equal(failed.status, 502);
  assert.equal(rows(down.env, 'scans').length, 0);
  assert.equal(rows(down.env, 'consents').length, 0);
});

test('rate limit: one scan per domain in 24 hours, www counts as the same domain', async () => {
  const { env } = setup();
  assert.equal((await submit(env, { url: 'https://dup-example.com/' })).status, 202);
  const second = await submit(env, { url: 'https://www.dup-example.com/other/' });
  assert.equal(second.status, 429);
  const body = await second.json();
  assert.equal(body.reason, 'domain');
  assert.equal(rows(env, 'scans').length, 1);

  env.SCANS.db.prepare("UPDATE scans SET status = 'failed'").run();
  assert.equal((await submit(env, { url: 'https://dup-example.com/' })).status, 202);

  env.SCANS.db.prepare('UPDATE scans SET at = ?').run(ago(25 * hour));
  assert.equal((await submit(env, { url: 'https://dup-example.com/' })).status, 202);
});

test('rate limit: three requests per ip hash in 24 hours', async () => {
  const { env } = setup();
  const options = { ip: '198.51.100.20' };
  for (let i = 0; i < 3; i += 1) assert.equal((await submit(env, {}, options)).status, 202);
  const blocked = await submit(env, {}, options);
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).reason, 'ip');
  assert.equal((await submit(env, {}, { ip: '198.51.100.21' })).status, 202);
  env.SCANS.db.prepare('UPDATE scans SET at = ?').run(ago(25 * hour));
  assert.equal((await submit(env, {}, options)).status, 202);
});

test('rate limit: three requests per email in 24 hours, case insensitive', async () => {
  const { env } = setup();
  const emails = ['Same@Example.com', 'same@example.com', ' SAME@example.com '];
  for (const email of emails) assert.equal((await submit(env, { email })).status, 202);
  const blocked = await submit(env, { email: 'same@example.com' });
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).reason, 'email');
  assert.equal((await submit(env, { email: 'other@example.com' })).status, 202);
});

test('the double opt-in mail carries the link, the validity and no offer', async () => {
  const { env, calls, mails } = setup();
  await submit(env, { url: 'https://mailcheck.example.com/', email: 'jan@example.com' });
  const [mail] = mails();
  const call = calls.find(item => item.url === resend);
  assert.equal(call.init.headers.Authorization, 'Bearer re_test');
  assert.deepEqual(mail.to, ['jan@example.com']);
  assert.equal(mail.from, 'Adrian Turbiński <skaner@adrianturbinski.pl>');
  assert.equal(mail.reply_to, 'contact@adrianturbinski.pl');
  assert.match(mail.text, /https:\/\/api\.adrianturbinski\.pl\/scan\/confirm\?t=[\w-]{43}/);
  assert.match(mail.text, /24 godziny/);
  assert.match(mail.text, /zignoruj/);
  assert.match(mail.html, /scan\/confirm\?t=/);
  assert.match(mail.text, /mailcheck\.example\.com/);
  assert.doesNotMatch(mail.text, /oferta|wycen|rabat|cennik|zamów/i);
  const token = tokenIn(mail.text);
  const [scan] = rows(env, 'scans');
  assert.equal(scan.confirm_token_hash, sha(token));
  assert.ok(!Object.values(scan).includes(token));

  const custom = setup();
  custom.env.MAIL_FROM = 'Skaner <no-reply@example.org>';
  await submit(custom.env, {});
  assert.equal(custom.mails()[0].from, 'Skaner <no-reply@example.org>');
});

test('confirming rejects a wrong token and an expired link', async () => {
  const { env, mails } = setup();
  await submit(env, {});
  const token = tokenIn(mails()[0].text);
  const wrong = await worker.fetch(new Request(`${base}/scan/confirm?t=nope`), env);
  assert.equal(wrong.status, 404);
  assert.match(await wrong.text(), /nieważny/);
  const missing = await worker.fetch(new Request(`${base}/scan/confirm`), env);
  assert.equal(missing.status, 404);
  env.SCANS.db.prepare('UPDATE scans SET at = ?').run(ago(49 * hour));
  const expired = await worker.fetch(new Request(`${base}/scan/confirm?t=${token}`), env);
  assert.equal(expired.status, 410);
  assert.equal(rows(env, 'scans')[0].status, 'pending');
  assert.equal(rows(env, 'scans')[0].confirmed_at, null);
});

test('confirming queues the scan once and is idempotent', async () => {
  const { env, mails } = setup();
  await submit(env, {});
  const token = tokenIn(mails()[0].text);
  const first = await confirmPost(env, token);
  assert.equal(first.status, 200);
  const html = await first.text();
  assert.match(html, /#3b0d18/);
  assert.match(html, /#e9eff6/);
  assert.match(html, /kilkunastu minut/);
  assert.equal(first.headers.get('X-Robots-Tag'), 'noindex');
  const [queued] = rows(env, 'scans');
  assert.equal(queued.status, 'queued');
  assert.ok(queued.confirmed_at);

  const again = await confirmPost(env, token);
  assert.equal(again.status, 200);
  assert.match(await again.text(), /kilkunastu minut/);
  assert.equal(rows(env, 'scans')[0].confirmed_at, queued.confirmed_at);

  env.SCANS.db.prepare('UPDATE scans SET at = ?').run(ago(60 * hour));
  const late = await confirmPost(env, token);
  assert.equal(late.status, 200);
});

test('the job endpoints need the scanner token', async () => {
  const ctx = setup();
  const none = await worker.fetch(new Request(`${base}/scan/jobs/next`), ctx.env);
  assert.equal(none.status, 401);
  const wrong = await worker.fetch(
    new Request(`${base}/scan/jobs/next`, { headers: { Authorization: 'Bearer nope' } }),
    ctx.env,
  );
  assert.equal(wrong.status, 401);
  const result = await worker.fetch(
    resultRequest(crypto.randomUUID(), { status: 'failed' }, false),
    ctx.env,
  );
  assert.equal(result.status, 401);
  const noHash = { ...ctx.env, SCANNER_TOKEN_SHA256: undefined };
  const closed = await worker.fetch(authed('/scan/jobs/next'), noHash);
  assert.equal(closed.status, 401);
});

test('jobs/next hands out the oldest confirmed scan first and skips unconfirmed ones', async () => {
  const ctx = setup();
  const empty = await worker.fetch(authed('/scan/jobs/next'), ctx.env);
  assert.equal(empty.status, 204);

  await submit(ctx.env, { url: 'https://pending-example.com/' });
  const firstId = await confirmed(ctx, { url: 'https://first-example.com/' });
  const secondId = await confirmed(ctx, { url: 'https://second-example.com/' });
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET confirmed_at = ? WHERE id = ?')
    .run(ago(hour), secondId);

  const one = await (await worker.fetch(authed('/scan/jobs/next'), ctx.env)).json();
  assert.deepEqual(one, { id: secondId, url: 'https://second-example.com/', lang: 'pl' });
  const two = await (await worker.fetch(authed('/scan/jobs/next'), ctx.env)).json();
  assert.equal(two.id, firstId);
  const none = await worker.fetch(authed('/scan/jobs/next'), ctx.env);
  assert.equal(none.status, 204);
  const row = scanRow(ctx.env, firstId);
  assert.equal(row.status, 'running');
  assert.equal(row.attempts, 1);
  assert.ok(row.started_at);
  assert.equal(
    rows(ctx.env, 'scans').find(r => r.domain === 'pending-example.com').status,
    'pending',
  );
});

test('a job running for over 15 minutes returns to the queue, twice at most', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, { url: 'https://slow-example.com/' });
  const stale = id =>
    ctx.env.SCANS.db
      .prepare('UPDATE scans SET started_at = ? WHERE id = ?')
      .run(ago(20 * 60 * 1000), id);

  const fresh = await worker.fetch(authed('/scan/jobs/next'), ctx.env);
  assert.equal(fresh.status, 204);
  assert.equal(scanRow(ctx.env, job.id).status, 'running');

  stale(job.id);
  const retry = await (await worker.fetch(authed('/scan/jobs/next'), ctx.env)).json();
  assert.equal(retry.id, job.id);
  assert.equal(scanRow(ctx.env, job.id).attempts, 2);

  const mailsBefore = ctx.mails().length;
  stale(job.id);
  const exhausted = await worker.fetch(authed('/scan/jobs/next'), ctx.env);
  assert.equal(exhausted.status, 204);
  const row = scanRow(ctx.env, job.id);
  assert.equal(row.status, 'failed');
  assert.equal(row.error, 'timeout');
  const mail = ctx.mails().at(-1);
  assert.equal(ctx.mails().length, mailsBefore + 1);
  assert.match(mail.subject, /Nie udało się przeskanować: slow-example\.com/);
});

test('a finished scan is stored in KV, mailed without any offer and reported to Telegram', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, {
    url: 'https://done-example.com/',
    email: 'wlasciciel@example.com',
    marketing: true,
  });
  const before = ctx.mails().length;
  const response = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, mailed: true });

  const row = scanRow(ctx.env, job.id);
  assert.equal(row.status, 'done');
  assert.match(row.report_key, /^[\w-]{32}$/);
  assert.equal(JSON.parse(row.summary_json).violations, 7);
  const object = ctx.env.REPORTS.objects.get(`reports/${row.report_key}.html`);
  assert.equal(object.value, '<h1>Raport</h1>');
  assert.ok(object.expirationTtl >= 30 * 24 * 60 * 60);
  const days = (Date.parse(object.metadata.expires) - Date.now()) / (24 * hour);
  assert.ok(days > 29.9 && days <= 30);
  assert.equal(object.metadata.expires, row.report_expires);

  const [mail] = ctx.mails().slice(before);
  assert.deepEqual(mail.to, ['wlasciciel@example.com']);
  assert.equal(mail.subject, 'Raport dostępności: done-example.com');
  assert.ok(mail.text.includes(`https://api.adrianturbinski.pl/r/${row.report_key}`));
  assert.match(mail.text, /30 dni/);
  assert.match(mail.text, /7/);
  assert.match(mail.text, /12/);
  assert.ok(mail.text.includes(consent.pl.disclaimer));
  assert.match(mail.text, /Adrian Turbiński/);
  assert.match(mail.text, /polityka-prywatnosci/);
  assert.doesNotMatch(mail.text, /oferta|wycen|rabat|cennik|zamów|umów|zapraszam|usług/i);
  assert.doesNotMatch(mail.html, /oferta|wycen|rabat|cennik|zamów|umów|zapraszam|usług/i);
  assert.match(
    mail.headers['List-Unsubscribe'],
    /^<https:\/\/api\.adrianturbinski\.pl\/scan\/unsubscribe\?t=[\w-]+>$/,
  );
  assert.equal(mail.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');

  const [note] = ctx.telegram();
  assert.match(note.text, /done-example\.com/);
  assert.match(note.text, /done/);
  assert.match(note.text, /7/);
  assert.match(note.text, /Zgoda marketingowa: tak/);
  assert.ok(!note.text.includes('wlasciciel@example.com'));
  assert.ok(!note.text.includes('@'));
});

test('a worker without Telegram secrets still completes the scan', async () => {
  const ctx = setup();
  delete ctx.env.TG_TOKEN;
  const job = await runningJob(ctx, { url: 'https://notg-example.com/' });
  const response = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<p>x</p>' }),
    ctx.env,
  );
  assert.equal(response.status, 200);
  assert.equal(ctx.telegram().length, 0);
});

test('a failed scan sends a neutral mail and a Telegram note without the address', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, {
    url: 'https://broken-example.com/',
    email: 'ktos@example.com',
  });
  const before = ctx.mails().length;
  const response = await worker.fetch(
    resultRequest(job.id, { status: 'failed', error: 'navigation timeout at stack line 42' }),
    ctx.env,
  );
  assert.equal(response.status, 200);
  const row = scanRow(ctx.env, job.id);
  assert.equal(row.status, 'failed');
  assert.equal(row.error, 'navigation timeout at stack line 42');
  assert.equal(ctx.env.REPORTS.objects.size, 0);
  const [mail] = ctx.mails().slice(before);
  assert.deepEqual(mail.to, ['ktos@example.com']);
  assert.match(mail.subject, /Nie udało się przeskanować: broken-example\.com/);
  assert.ok(!mail.text.includes('stack line'));
  const [note] = ctx.telegram();
  assert.match(note.text, /broken-example\.com/);
  assert.match(note.text, /failed/);
  assert.match(note.text, /Zgoda marketingowa: nie/);
  assert.ok(!note.text.includes('@'));
});

test('result validation: unknown job, wrong state, bad status, empty or oversized html', async () => {
  const ctx = setup();
  const unknown = await worker.fetch(
    resultRequest(crypto.randomUUID(), { status: 'done', summary, html: 'x' }),
    ctx.env,
  );
  assert.equal(unknown.status, 404);

  const job = await runningJob(ctx, { url: 'https://valid-example.com/' });
  const badStatus = await worker.fetch(resultRequest(job.id, { status: 'weird' }), ctx.env);
  assert.equal(badStatus.status, 422);
  const noHtml = await worker.fetch(resultRequest(job.id, { status: 'done', summary }), ctx.env);
  assert.equal(noHtml.status, 422);
  const huge = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: 'x'.repeat(5 * 1024 * 1024 + 1) }),
    ctx.env,
  );
  assert.equal(huge.status, 413);
  assert.equal(scanRow(ctx.env, job.id).status, 'running');

  const ok = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: 'x' }),
    ctx.env,
  );
  assert.equal(ok.status, 200);
  const replay = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: 'x' }),
    ctx.env,
  );
  assert.equal(replay.status, 409);
  assert.equal(ctx.env.REPORTS.objects.size, 1);
});

async function reportFor(ctx, marketing = false) {
  const job = await runningJob(ctx, { marketing });
  await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  return scanRow(ctx.env, job.id);
}

test('a report is served with privacy headers until it expires', async () => {
  const ctx = setup();
  const row = await reportFor(ctx);
  const response = await worker.fetch(new Request(`${base}/r/${row.report_key}`), ctx.env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<h1>Raport</h1>');
  assert.match(response.headers.get('Content-Type'), /^text\/html/);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  assert.equal(response.headers.get('Cache-Control'), 'private, max-age=300');
  assert.equal(
    response.headers.get('Content-Security-Policy'),
    "default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; frame-ancestors 'none'",
  );
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');

  const missing = await worker.fetch(new Request(`${base}/r/${'a'.repeat(32)}`), ctx.env);
  assert.equal(missing.status, 404);
  const malformed = await worker.fetch(new Request(`${base}/r/..%2Fsecret`), ctx.env);
  assert.equal(malformed.status, 404);
});

test('an expired report answers 410 and is deleted', async () => {
  const ctx = setup();
  const row = await reportFor(ctx);
  const key = `reports/${row.report_key}.html`;
  ctx.env.REPORTS.objects.get(key).metadata.expires = ago(1000);
  const response = await worker.fetch(new Request(`${base}/r/${row.report_key}`), ctx.env);
  assert.equal(response.status, 410);
  assert.equal(ctx.env.REPORTS.objects.has(key), false);
  assert.equal(scanRow(ctx.env, row.id).report_key, null);
});

test('unsubscribing by GET withdraws marketing consent and records the withdrawal once', async () => {
  const ctx = setup();
  const before = ctx.mails().length;
  const row = await reportFor(ctx, true);
  const mail = ctx.mails().slice(before).at(-1);
  const link = mail.headers['List-Unsubscribe'].slice(1, -1);
  assert.ok(mail.text.includes(link));

  const response = await worker.fetch(new Request(link), ctx.env);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Zgoda wycofana/);
  const after = scanRow(ctx.env, row.id);
  assert.equal(after.marketing, 0);
  assert.ok(after.unsubscribed_at);
  const records = rows(ctx.env, 'consents').filter(r => r.kind === 'marketing');
  assert.equal(records.length, 2);
  const withdrawal = records.find(r => r.granted === 0);
  const original = records.find(r => r.granted === 1);
  assert.equal(withdrawal.text, original.text);
  assert.equal(withdrawal.text_sha256, original.text_sha256);
  assert.equal(withdrawal.scan_id, row.id);

  const again = await worker.fetch(new Request(link), ctx.env);
  assert.equal(again.status, 200);
  assert.equal(rows(ctx.env, 'consents').filter(r => r.kind === 'marketing').length, 2);
  assert.equal(scanRow(ctx.env, row.id).unsubscribed_at, after.unsubscribed_at);
});

test('one-click unsubscribe by POST works and a wrong token is rejected', async () => {
  const ctx = setup();
  const before = ctx.mails().length;
  const row = await reportFor(ctx, true);
  const link = ctx.mails().slice(before).at(-1).headers['List-Unsubscribe'].slice(1, -1);
  const response = await worker.fetch(
    new Request(link, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click',
    }),
    ctx.env,
  );
  assert.equal(response.status, 200);
  assert.equal(scanRow(ctx.env, row.id).marketing, 0);
  assert.ok(scanRow(ctx.env, row.id).unsubscribed_at);

  const wrong = await worker.fetch(new Request(`${base}/scan/unsubscribe?t=nope`), ctx.env);
  assert.equal(wrong.status, 404);
  const missing = await worker.fetch(
    new Request(`${base}/scan/unsubscribe`, { method: 'POST' }),
    ctx.env,
  );
  assert.equal(missing.status, 404);
});

test('the report mail leaves out the unsubscribe line when marketing was declined', async () => {
  const ctx = setup();
  const before = ctx.mails().length;
  await reportFor(ctx, false);
  const mail = ctx.mails().slice(before).at(-1);
  assert.doesNotMatch(mail.text, /wycofać/);
  assert.ok(mail.headers['List-Unsubscribe']);
});

test('the daily cron removes expired reports and stale unconfirmed scans only', async () => {
  const ctx = setup();
  const expired = await reportFor(ctx);
  const live = await reportFor(ctx);
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET report_expires = ? WHERE id = ?')
    .run(ago(1000), expired.id);

  await submit(ctx.env, { url: 'https://stale-example.com/' });
  await submit(ctx.env, { url: 'https://fresh-example.com/' });
  const staleId = rows(ctx.env, 'scans').find(r => r.domain === 'stale-example.com').id;
  const freshId = rows(ctx.env, 'scans').find(r => r.domain === 'fresh-example.com').id;
  ctx.env.SCANS.db.prepare('UPDATE scans SET at = ? WHERE id = ?').run(ago(8 * 24 * hour), staleId);
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET at = ? WHERE id = ?')
    .run(ago(8 * 24 * hour), expired.id);

  await worker.scheduled({}, ctx.env, { waitUntil: promise => promise });
  await new Promise(resolve => setTimeout(resolve, 20));

  assert.equal(ctx.env.REPORTS.objects.has(`reports/${expired.report_key}.html`), false);
  assert.equal(ctx.env.REPORTS.objects.has(`reports/${live.report_key}.html`), true);
  assert.equal(scanRow(ctx.env, expired.id).report_key, null);
  assert.ok(scanRow(ctx.env, expired.id));
  assert.equal(scanRow(ctx.env, live.id).report_key, live.report_key);
  assert.equal(scanRow(ctx.env, staleId), undefined);
  assert.equal(rows(ctx.env, 'consents').filter(r => r.scan_id === staleId).length, 0);
  assert.ok(scanRow(ctx.env, freshId));
  assert.equal(rows(ctx.env, 'consents').filter(r => r.scan_id === freshId).length, 3);
  assert.ok(rows(ctx.env, 'consents').filter(r => r.scan_id === expired.id).length > 0);
});

test('cors: preflight for the site, a foreign origin is refused, unknown paths are 404', async () => {
  const { env } = setup();
  const preflight = await worker.fetch(
    new Request(`${base}/scan`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://www.adrianturbinski.pl' },
    }),
    env,
  );
  assert.equal(preflight.status, 204);
  assert.equal(
    preflight.headers.get('Access-Control-Allow-Origin'),
    'https://www.adrianturbinski.pl',
  );
  const foreign = await submit(env, {}, { headers: { Origin: 'https://evil.example' } });
  assert.equal(foreign.status, 403);
  const ok = await submit(env, {});
  assert.equal(ok.headers.get('Access-Control-Allow-Origin'), site);
  assert.equal((await worker.fetch(new Request(`${base}/scan`), env)).status, 405);
  assert.equal((await worker.fetch(new Request(`${base}/nothing`), env)).status, 404);
});

const commercial = /oferta|wycen|rabat|cennik|zamów|umów|zapraszam|usług|promocj|kup/i;

test('status pages are standalone: no script, no external resources, a strict policy', async () => {
  const ctx = setup();
  const row = await reportFor(ctx);
  ctx.env.REPORTS.objects.get(`reports/${row.report_key}.html`).metadata.expires = ago(1000);
  const responses = [
    await worker.fetch(new Request(`${base}/scan/confirm?t=nope`), ctx.env),
    await worker.fetch(new Request(`${base}/scan/unsubscribe?t=nope`), ctx.env),
    await worker.fetch(new Request(`${base}/r/${row.report_key}`), ctx.env),
    await worker.fetch(new Request(`${base}/r/${'b'.repeat(32)}`), ctx.env),
  ];
  assert.deepEqual(
    responses.map(response => response.status),
    [404, 404, 410, 404],
  );
  for (const response of responses) {
    const html = await response.text();
    assert.match(html, /^<!doctype html><html lang="pl">/);
    assert.match(html, /<h1>/);
    assert.doesNotMatch(html, /<script|<img|<link|@import|url\(http/i);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.match(response.headers.get('Content-Security-Policy'), /default-src 'none'/);
  }
});

test('each status page says what happened and where to go next', async () => {
  const ctx = setup();
  const invalid = await (
    await worker.fetch(new Request(`${base}/scan/confirm?t=nope`), ctx.env)
  ).text();
  assert.match(invalid, /Link jest nieważny/);
  assert.ok(invalid.includes(`href="${site}/skaner/"`));
  assert.match(invalid, /24 godziny/);
  const unsubscribe = await (
    await worker.fetch(new Request(`${base}/scan/unsubscribe?t=nope`), ctx.env)
  ).text();
  assert.match(unsubscribe, /Link do wypisu jest nieważny/);
  assert.match(unsubscribe, /mailto:contact@adrianturbinski\.pl/);
  const unknown = await (
    await worker.fetch(new Request(`${base}/r/${'c'.repeat(32)}`), ctx.env)
  ).text();
  assert.match(unknown, /Nie ma takiego raportu/);
  assert.match(unknown, /30 dni/);
});

test('mail html is table based, 600 px wide, readable in dark mode and has no external resources', () => {
  const link = `${base}/scan/confirm?t=abc`;
  const mails = [
    confirmMail('shop.example.com', link),
    reportMail(
      { domain: 'shop.example.com', marketing: 1 },
      { violations: 12, pages: 7 },
      `${base}/r/abc`,
      new Date(Date.now() + 30 * 24 * hour).toISOString(),
      `${base}/scan/unsubscribe?t=abc`,
    ),
    failureMail({ domain: 'shop.example.com' }),
  ];
  for (const mail of mails) {
    assert.match(mail.html, /^<!doctype html><html lang="pl">/);
    assert.match(mail.html, /max-width:600px/);
    assert.match(mail.html, /prefers-color-scheme:dark/);
    assert.match(mail.html, /<meta name="color-scheme" content="light dark">/);
    assert.match(mail.html, /<table role="presentation"/);
    assert.doesNotMatch(mail.html, /<script|<img|<link|@import|@font-face|url\(/i);
    assert.doesNotMatch(mail.html, /src=|background-image/i);
    assert.ok(mail.text.length > 0);
  }
});

test('mail html escapes everything that comes from the input', () => {
  const hostile = '"><script>alert(1)</script>';
  const mails = [
    confirmMail(hostile, `${base}/scan/confirm?t="${hostile}`),
    reportMail(
      { domain: hostile, marketing: 1 },
      { violations: 1, pages: 1 },
      `${base}/r/"${hostile}`,
      new Date().toISOString(),
      `${base}/scan/unsubscribe?t="${hostile}`,
    ),
    failureMail({ domain: hostile }),
  ];
  for (const mail of mails) {
    assert.ok(!mail.html.includes('<script>'));
    assert.ok(!mail.html.includes(hostile));
    assert.ok(mail.html.includes('&quot;&gt;&lt;script&gt;'));
  }
});

test('the confirmation and report mails stay transactional in html and text', () => {
  const confirm = confirmMail('shop.example.com', `${base}/scan/confirm?t=abc`);
  const report = reportMail(
    { domain: 'shop.example.com', marketing: 0 },
    { violations: 0, pages: 3 },
    `${base}/r/abc`,
    new Date(Date.now() + 30 * 24 * hour).toISOString(),
    `${base}/scan/unsubscribe?t=abc`,
  );
  const failure = failureMail({ domain: 'shop.example.com' });
  for (const mail of [confirm, report, failure]) {
    assert.doesNotMatch(mail.text, commercial);
    assert.doesNotMatch(mail.html, commercial);
  }
  assert.match(confirm.html, /24 godziny/);
  assert.match(report.html, /30 dni/);
  assert.ok(report.html.includes(consent.pl.disclaimer));
  assert.doesNotMatch(report.html, /Wycofaj zgodę/);
});

test('the report mail counts errors with the right Polish form', () => {
  const label = count =>
    reportMail(
      { domain: 'shop.example.com', marketing: 0 },
      { violations: count, pages: 2 },
      `${base}/r/abc`,
      new Date().toISOString(),
      '',
    ).html;
  assert.match(label(1), />1<\/td>[^]*potwierdzony błąd</);
  assert.match(label(3), /potwierdzone błędy</);
  assert.match(label(5), /potwierdzonych błędów</);
  assert.match(label(12), /potwierdzonych błędów</);
  assert.match(label(22), /potwierdzone błędy</);
  assert.match(label(0), /potwierdzonych błędów</);
});

const year = new Date().getUTCFullYear();
const inYear = (back, tail = '-06-15T10:00:00.000Z') => `${year - back}${tail}`;

test('a form filled in under 2.5 seconds by the monotonic clock is dropped quietly', async () => {
  const { env, mails } = setup();
  for (const fillMs of [0, 1, 2499]) {
    const response = await submit(env, { fillMs, startedAt: Date.now() - 60000 });
    assert.equal(response.status, 202, String(fillMs));
  }
  assert.equal(rows(env, 'scans').length, 0);
  assert.equal(mails().length, 0);
});

test('fillMs of 2.5 seconds or more is accepted whatever the client clock says', async () => {
  const { env } = setup();
  const skewed = await submit(env, { fillMs: 2500, startedAt: Date.now() + 3600 * 1000 });
  assert.equal(skewed.status, 202);
  const fresh = await submit(env, { fillMs: 9000, startedAt: Date.now() });
  assert.equal(fresh.status, 202);
  assert.equal(rows(env, 'scans').length, 2);
});

test('a missing, negative or invalid fillMs falls back to startedAt and never loses a skewed request', async () => {
  const { env } = setup();
  for (const fillMs of [undefined, -5, 'fast', null, Number.NaN]) {
    const response = await submit(env, { fillMs, startedAt: Date.now() + 60000 });
    assert.equal(response.status, 202);
  }
  assert.equal(rows(env, 'scans').length, 5);
  const quick = await submit(env, { fillMs: -1, startedAt: Date.now() - 500 });
  assert.equal(quick.status, 202);
  const missing = await submit(env, { startedAt: Date.now() - 500 });
  assert.equal(missing.status, 202);
  assert.equal(rows(env, 'scans').length, 5);
  const slow = await submit(env, { fillMs: -1, startedAt: Date.now() - 10000 });
  assert.equal(slow.status, 202);
  assert.equal(rows(env, 'scans').length, 6);
});

test('parallel requests cannot exceed the domain, ip and email limits', async () => {
  const domain = setup();
  const sameDomain = await Promise.all(
    Array.from({ length: 4 }, () => submit(domain.env, { url: 'https://race-example.com/' })),
  );
  assert.deepEqual(sameDomain.map(r => r.status).sort(), [202, 429, 429, 429]);
  assert.equal(rows(domain.env, 'scans').length, 1);
  assert.equal(rows(domain.env, 'consents').length, 3);
  const blocked = sameDomain.find(r => r.status === 429);
  assert.equal((await blocked.json()).reason, 'domain');

  const byIp = setup();
  const sameIp = await Promise.all(
    Array.from({ length: 6 }, () => submit(byIp.env, {}, { ip: '198.51.100.77' })),
  );
  assert.equal(sameIp.filter(r => r.status === 202).length, 3);
  assert.equal(rows(byIp.env, 'scans').length, 3);

  const byEmail = setup();
  const sameEmail = await Promise.all(
    Array.from({ length: 6 }, () => submit(byEmail.env, { email: 'race@example.com' })),
  );
  assert.equal(sameEmail.filter(r => r.status === 202).length, 3);
  const refused = await Promise.all(sameEmail.filter(r => r.status === 429).map(r => r.json()));
  assert.ok(refused.every(body => body.reason === 'email'));
  assert.equal(rows(byEmail.env, 'scans').length, 3);
});

test('ipv6 addresses are keyed by their /64 prefix and ipv4 by the full address', async () => {
  const { env } = setup();
  const sameNetwork = [
    '2001:db8:1:2::1',
    '2001:0DB8:0001:0002:aaaa:bbbb:cccc:dddd',
    '2001:db8:1:2:ffff::',
  ];
  for (const ip of sameNetwork) assert.equal((await submit(env, {}, { ip })).status, 202);
  const [first] = rows(env, 'scans');
  assert.equal(first.ip_hash, sha('pepper2001:db8:1:2::/64'));
  assert.ok(rows(env, 'scans').every(row => row.ip_hash === first.ip_hash));
  assert.deepEqual(
    rows(env, 'consents').map(row => row.ip),
    sameNetwork.flatMap(ip => [ip, ip, ip]),
  );
  const blocked = await submit(env, {}, { ip: '2001:db8:1:2:1:2:3:4' });
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).reason, 'ip');
  assert.equal((await submit(env, {}, { ip: '2001:db8:1:3::1' })).status, 202);
  assert.equal((await submit(env, {}, { ip: '::ffff:198.51.100.5' })).status, 202);
  assert.equal(rows(env, 'scans').at(-1).ip_hash, sha('pepper198.51.100.5'));
  assert.equal((await submit(env, {}, { ip: '198.51.100.5' })).status, 202);
  assert.equal((await submit(env, {}, { ip: '198.51.100.6' })).status, 202);
});

test('the domain key is the registrable domain, so subdomains share a limit and hosting tenants do not', async () => {
  const cases = [
    ['https://www.example-shop.pl/', 'example-shop.pl'],
    ['https://a.b.sklep.com.pl/oferta', 'sklep.com.pl'],
    ['https://sklep.com.pl', 'sklep.com.pl'],
    ['https://Sklep.KRAKOW.pl.', 'sklep.krakow.pl'],
    ['https://shop.example.org', 'example.org'],
    ['https://x.example.co.uk', 'example.co.uk'],
    ['https://klient.github.io', 'klient.github.io'],
    ['https://www.klient.netlify.app', 'klient.netlify.app'],
    ['https://a.b.klient.myshopify.com', 'klient.myshopify.com'],
    ['https://blog.klient.blogspot.com', 'klient.blogspot.com'],
    ['https://bücher.example.com.au', 'example.com.au'],
    ['https://münchen.de', 'xn--mnchen-3ya.de'],
    ['https://sub.münchen.de', 'xn--mnchen-3ya.de'],
  ];
  for (const [url, domain] of cases) {
    const { env } = setup();
    assert.equal((await submit(env, { url })).status, 202, url);
    assert.equal(rows(env, 'scans')[0].domain, domain, url);
  }
  const { env } = setup();
  assert.equal((await submit(env, { url: 'https://one.dup.com.pl/' })).status, 202);
  const same = await submit(env, { url: 'https://two.dup.com.pl/' });
  assert.equal(same.status, 429);
  assert.equal((await same.json()).reason, 'domain');
  assert.equal((await submit(env, { url: 'https://tenant-a.github.io/' })).status, 202);
  assert.equal((await submit(env, { url: 'https://tenant-b.github.io/' })).status, 202);
});

test('the email limit uses a normalized address while the original is kept for sending', async () => {
  const { env, mails } = setup();
  const variants = [
    'Jan.Kowalski+a@Gmail.com',
    'jankowalski@googlemail.com',
    ' j.a.n.kowalski+zzz@gmail.com ',
  ];
  for (const email of variants) assert.equal((await submit(env, { email })).status, 202, email);
  const stored = rows(env, 'scans');
  assert.deepEqual(
    stored.map(row => row.email),
    ['Jan.Kowalski+a@Gmail.com', 'jankowalski@googlemail.com', 'j.a.n.kowalski+zzz@gmail.com'],
  );
  assert.ok(stored.every(row => row.email_key === 'jankowalski@gmail.com'));
  assert.deepEqual(
    mails().map(mail => mail.to[0]),
    ['Jan.Kowalski+a@Gmail.com', 'jankowalski@googlemail.com', 'j.a.n.kowalski+zzz@gmail.com'],
  );
  const blocked = await submit(env, { email: 'jan.kowalski+4@gmail.com' });
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).reason, 'email');

  const other = setup();
  for (const email of ['a.b@example.com', 'ab@example.com', 'ab+tag@Example.com'])
    assert.equal((await submit(other.env, { email })).status, 202, email);
  assert.deepEqual(
    rows(other.env, 'scans').map(row => row.email_key),
    ['a.b@example.com', 'ab@example.com', 'ab@example.com'],
  );
});

test('a consent hash that differs from the worker copy is a 409 like a wrong version', async () => {
  const { env, mails } = setup();
  const wrong = await submit(env, { consentHash: sha('older consent') });
  assert.equal(wrong.status, 409);
  assert.equal((await wrong.json()).error, 'consent_hash');
  const missing = await submit(env, { consentHash: undefined });
  assert.equal(missing.status, 409);
  assert.equal(rows(env, 'scans').length, 0);
  assert.equal(mails().length, 0);
  const right = await submit(env, { consentHash: sha(JSON.stringify(consent)) });
  assert.equal(right.status, 202);
});

test('opening the confirmation link changes nothing and offers a confirm button', async () => {
  const { env, mails } = setup();
  await submit(env, {});
  const token = tokenIn(mails()[0].text);
  for (let i = 0; i < 2; i += 1) {
    const page = await worker.fetch(new Request(`${base}/scan/confirm?t=${token}`), env);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /<form method="post" action="\/scan\/confirm">/);
    assert.ok(html.includes(`<input type="hidden" name="t" value="${token}">`));
    assert.match(html, />Potwierdzam i zlecam skan</);
    assert.match(html, /#3b0d18/);
    assert.match(page.headers.get('Content-Security-Policy'), /form-action 'self'/);
    assert.match(page.headers.get('Content-Security-Policy'), /default-src 'none'/);
    assert.equal(page.headers.get('X-Robots-Tag'), 'noindex');
    assert.doesNotMatch(html, /<script/);
    assert.equal(rows(env, 'scans')[0].status, 'pending');
    assert.equal(rows(env, 'scans')[0].confirmed_at, null);
  }
  const posted = await confirmPost(env, token);
  assert.equal(posted.status, 200);
  assert.match(await posted.text(), /Adres potwierdzony/);
  assert.equal(rows(env, 'scans')[0].status, 'queued');
});

test('wrong, expired and missing tokens behave the same for GET and POST', async () => {
  const { env, mails } = setup();
  await submit(env, {});
  const token = tokenIn(mails()[0].text);
  const get = path => worker.fetch(new Request(`${base}${path}`), env);
  assert.equal((await get('/scan/confirm?t=nope')).status, 404);
  assert.equal((await get('/scan/confirm')).status, 404);
  assert.equal((await confirmPost(env, 'nope')).status, 404);
  const empty = await worker.fetch(new Request(`${base}/scan/confirm`, { method: 'POST' }), env);
  assert.equal(empty.status, 404);
  const queryOnly = await worker.fetch(
    new Request(`${base}/scan/confirm?t=${token}`, { method: 'POST' }),
    env,
  );
  assert.equal(queryOnly.status, 404);
  assert.equal(rows(env, 'scans')[0].status, 'pending');
  env.SCANS.db.prepare('UPDATE scans SET at = ?').run(ago(49 * hour));
  assert.equal((await get(`/scan/confirm?t=${token}`)).status, 410);
  assert.equal((await confirmPost(env, token)).status, 410);
  assert.equal(rows(env, 'scans')[0].status, 'pending');
});

test('the confirmation mail asks to open the link and confirm', async () => {
  const { env, mails } = setup();
  await submit(env, {});
  const [mail] = mails();
  assert.match(mail.text, /Otwórz link i potwierdź/);
  assert.match(mail.html, /Otwórz link i potwierdź/);
});

test('a report mail failure answers 502, keeps the job running and a repeat succeeds', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, { url: 'https://retry-example.com/' });
  ctx.mode.resendOk = false;
  const failed = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(failed.status, 502);
  const row = scanRow(ctx.env, job.id);
  assert.equal(row.status, 'running');
  assert.equal(row.report_key, null);
  assert.equal(row.summary_json, null);
  assert.equal(ctx.env.REPORTS.objects.size, 0);
  assert.equal(ctx.telegram().length, 0);

  ctx.mode.resendOk = true;
  const again = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(again.status, 200);
  const done = scanRow(ctx.env, job.id);
  assert.equal(done.status, 'done');
  assert.match(done.report_key, /^[\w-]{32}$/);
  assert.equal(ctx.env.REPORTS.objects.size, 1);
  assert.equal(ctx.telegram().length, 1);
  const replay = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(replay.status, 409);
});

test('the service answers 503 when a mail key, turnstile secret or ip salt is missing', async () => {
  for (const name of ['RESEND_API_KEY', 'TURNSTILE_SECRET', 'IP_SALT']) {
    const { env } = setup();
    delete env[name];
    const response = await submit(env, {});
    assert.equal(response.status, 503, name);
    assert.equal((await response.json()).error, 'unavailable', name);
    assert.equal(rows(env, 'scans').length, 0);
    env.SCAN_DEV = '0';
    assert.equal((await submit(env, {})).status, 503, name);
  }
  const dev = setup();
  delete dev.env.IP_SALT;
  dev.env.SCAN_DEV = '1';
  assert.equal((await submit(dev.env, {})).status, 202);
});

test('the daily cron enforces the privacy policy retention periods', async () => {
  const ctx = setup();
  const make = async (fields, confirmedAt, marketingGranted = false) => {
    const id = await confirmed(ctx, { marketing: marketingGranted, ...fields });
    ctx.env.SCANS.db
      .prepare('UPDATE scans SET at = ?, confirmed_at = ? WHERE id = ?')
      .run(confirmedAt, confirmedAt, id);
    ctx.env.SCANS.db.prepare('UPDATE consents SET at = ? WHERE scan_id = ?').run(confirmedAt, id);
    return id;
  };
  const withdraw = (id, at) => {
    ctx.env.SCANS.db
      .prepare('UPDATE scans SET marketing = 0, unsubscribed_at = ? WHERE id = ?')
      .run(at, id);
    ctx.env.SCANS.db
      .prepare(
        "INSERT INTO consents (id, scan_id, at, kind, version, text, text_sha256, granted) VALUES (?, ?, ?, 'marketing', '1', 't', 'h', 0)",
      )
      .run(crypto.randomUUID(), id, at);
  };

  const inside = await make({}, inYear(3, '-12-31T23:00:00.000Z'));
  const outside = await make({}, inYear(4, '-01-02T00:00:00.000Z'));
  const sequenceRunning = await make({}, inYear(4, '-12-25T10:00:00.000Z'), true);
  const sequenceOver = await make({}, inYear(5), true);
  const withdrawnRecently = await make({}, inYear(6), true);
  withdraw(withdrawnRecently, inYear(3, '-03-01T10:00:00.000Z'));
  const withdrawnLongAgo = await make({}, inYear(6), true);
  withdraw(withdrawnLongAgo, inYear(4, '-12-31T23:59:00.000Z'));
  const withdrawnEdge = await make({}, inYear(6), true);
  withdraw(withdrawnEdge, inYear(3, '-12-31T23:59:00.000Z'));

  await worker.scheduled({}, ctx.env);

  const alive = id => Boolean(scanRow(ctx.env, id));
  const consentsOf = id => rows(ctx.env, 'consents').filter(r => r.scan_id === id).length;
  assert.equal(alive(inside), true);
  assert.equal(consentsOf(inside), 3);
  assert.equal(alive(outside), false);
  assert.equal(consentsOf(outside), 0);
  assert.equal(alive(sequenceRunning), true, 'sequence end falls in the next year');
  assert.equal(consentsOf(sequenceRunning), 3);
  assert.equal(alive(sequenceOver), false);
  assert.equal(consentsOf(sequenceOver), 0);
  assert.equal(alive(withdrawnRecently), true);
  assert.equal(consentsOf(withdrawnRecently), 4);
  assert.equal(
    rows(ctx.env, 'consents').filter(r => r.scan_id === withdrawnRecently && r.granted === 0)
      .length,
    1,
  );
  assert.equal(alive(withdrawnLongAgo), false);
  assert.equal(consentsOf(withdrawnLongAgo), 0);
  assert.equal(alive(withdrawnEdge), true);
  assert.equal(consentsOf(withdrawnEdge), 4);

  await worker.scheduled({}, ctx.env);
  assert.equal(alive(inside), true);
  assert.equal(alive(sequenceRunning), true);
  assert.equal(alive(withdrawnRecently), true);
});

const dayMs = 24 * hour;

async function finishedScan(ctx, fields = {}) {
  const job = await runningJob(ctx, { marketing: true, ...fields });
  const response = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(response.status, 200);
  return scanRow(ctx.env, job.id);
}

const rewind = (ctx, id, days, sentDaysAgo = null) =>
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET confirmed_at = ?, sequence_sent_at = ? WHERE id = ?')
    .run(
      ago(days * dayMs + hour),
      sentDaysAgo === null ? null : ago(sentDaysAgo * dayMs + hour),
      id,
    );

const runCron = ctx => worker.scheduled({}, ctx.env);
const sequenceMails = (ctx, since = 0) =>
  ctx
    .mails()
    .slice(since)
    .filter(mail => /Wiadomość \d z 4\./.test(mail.text));

const sequenceSubjects = [
  /^Jak przeczytać raport dla /,
  /^Czego automatyczny skan nie widzi na /,
  /^Kogo dotyczy ustawa o dostępności$/,
  /^Ręczny audyt dostępności dla /,
];

test('only done, confirmed, marketing scans without a withdrawal receive the sequence', async () => {
  const ctx = setup();
  const eligible = await finishedScan(ctx, { email: 'zgoda@example.com' });
  const declined = await finishedScan(ctx, { marketing: false, email: 'bez-zgody@example.com' });
  const withdrawn = await finishedScan(ctx, { email: 'wypis@example.com' });
  const flagged = await finishedScan(ctx, { email: 'flaga@example.com' });
  const failed = await finishedScan(ctx, { email: 'porazka@example.com' });
  const queuedId = await confirmed(ctx, { marketing: true, email: 'kolejka@example.com' });
  const unconfirmed = await submit(ctx.env, {
    marketing: true,
    email: 'niepotwierdzony@example.com',
  });
  assert.equal(unconfirmed.status, 202);

  const db = ctx.env.SCANS.db;
  db.prepare('UPDATE scans SET marketing = 0, unsubscribed_at = ? WHERE id = ?').run(
    ago(hour),
    withdrawn.id,
  );
  db.prepare('UPDATE scans SET unsubscribed_at = ? WHERE id = ?').run(ago(hour), flagged.id);
  db.prepare("UPDATE scans SET status = 'failed' WHERE id = ?").run(failed.id);
  for (const id of [eligible.id, declined.id, withdrawn.id, flagged.id, failed.id, queuedId])
    rewind(ctx, id, 3);

  const before = ctx.mails().length;
  await runCron(ctx);
  const sent = sequenceMails(ctx, before);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, ['zgoda@example.com']);
  assert.equal(ctx.mails().length, before + 1);
  assert.equal(scanRow(ctx.env, eligible.id).sequence_step, 1);
  for (const id of [declined.id, withdrawn.id, flagged.id, failed.id, queuedId])
    assert.equal(scanRow(ctx.env, id).sequence_step, 0);
});

test('the sequence goes out on day 2, 5, 9 and 13 after confirmation, one mail per run', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  const offsets = [2, 5, 9, 13];
  for (const [index, offset] of offsets.entries()) {
    const sentAgo = index === 0 ? null : offsets[index] - offsets[index - 1];
    ctx.env.SCANS.db
      .prepare('UPDATE scans SET confirmed_at = ?, sequence_sent_at = ? WHERE id = ?')
      .run(ago(offset * dayMs - hour), sentAgo === null ? null : ago(sentAgo * dayMs), row.id);
    let before = ctx.mails().length;
    await runCron(ctx);
    assert.equal(sequenceMails(ctx, before).length, 0, `nothing before day ${offset}`);
    assert.equal(scanRow(ctx.env, row.id).sequence_step, index);

    rewind(ctx, row.id, offset, sentAgo);
    before = ctx.mails().length;
    await runCron(ctx);
    const sent = sequenceMails(ctx, before);
    assert.equal(sent.length, 1, `one mail on day ${offset}`);
    assert.match(sent[0].subject, sequenceSubjects[index]);
    assert.equal(scanRow(ctx.env, row.id).sequence_step, index + 1);
    assert.ok(scanRow(ctx.env, row.id).sequence_sent_at);
  }
});

test('a day by day simulation sends exactly four mails and none after day 14', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  const sentOn = [];
  let lastSentDay = null;
  for (let simulatedDay = 0; simulatedDay <= 20; simulatedDay += 1) {
    rewind(ctx, row.id, simulatedDay, lastSentDay === null ? null : simulatedDay - lastSentDay);
    const before = ctx.mails().length;
    await runCron(ctx);
    if (sequenceMails(ctx, before).length) {
      sentOn.push(simulatedDay);
      lastSentDay = simulatedDay;
    }
  }
  assert.deepEqual(sentOn, [2, 5, 9, 13]);
  assert.equal(scanRow(ctx.env, row.id).sequence_step, 4);
});

test('nothing is sent after day 14 and a finished sequence never grows past four', async () => {
  const ctx = setup();
  const late = await finishedScan(ctx);
  const lastStep = await finishedScan(ctx);
  const finished = await finishedScan(ctx);
  rewind(ctx, late.id, 14.5);
  rewind(ctx, lastStep.id, 14.5, 5);
  ctx.env.SCANS.db.prepare('UPDATE scans SET sequence_step = 3 WHERE id = ?').run(lastStep.id);
  rewind(ctx, finished.id, 13.5, 5);
  ctx.env.SCANS.db.prepare('UPDATE scans SET sequence_step = 4 WHERE id = ?').run(finished.id);

  const before = ctx.mails().length;
  await runCron(ctx);
  await runCron(ctx);
  assert.equal(sequenceMails(ctx, before).length, 0);
  assert.equal(scanRow(ctx.env, late.id).sequence_step, 0);
  assert.equal(scanRow(ctx.env, lastStep.id).sequence_step, 3);
  assert.equal(scanRow(ctx.env, finished.id).sequence_step, 4);
});

test('a repeated or parallel cron run does not send the same step twice', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  rewind(ctx, row.id, 2);
  const before = ctx.mails().length;
  await runCron(ctx);
  await runCron(ctx);
  assert.equal(sequenceMails(ctx, before).length, 1);

  const other = await finishedScan(ctx);
  rewind(ctx, other.id, 2);
  const parallelBefore = ctx.mails().length;
  let queue = Promise.resolve();
  const serialized = {
    ...ctx.env,
    SCANS: {
      ...ctx.env.SCANS,
      prepare: ctx.env.SCANS.prepare,
      batch: list => (queue = queue.then(() => ctx.env.SCANS.batch(list))),
    },
  };
  await Promise.all([1, 2, 3].map(() => worker.scheduled({}, serialized)));
  assert.equal(sequenceMails(ctx, parallelBefore).length, 1);
  assert.equal(scanRow(ctx.env, other.id).sequence_step, 1);
});

test('a mail provider failure keeps the step and the next run retries', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  rewind(ctx, row.id, 2);
  ctx.mode.resendOk = false;
  const before = ctx.mails().length;
  await runCron(ctx);
  assert.equal(ctx.mails().length, before + 1);
  assert.equal(scanRow(ctx.env, row.id).sequence_step, 0);
  assert.equal(scanRow(ctx.env, row.id).sequence_sent_at, null);

  ctx.mode.resendOk = true;
  await runCron(ctx);
  assert.equal(ctx.mails().length, before + 2);
  assert.equal(scanRow(ctx.env, row.id).sequence_step, 1);
  assert.ok(scanRow(ctx.env, row.id).sequence_sent_at);

  await runCron(ctx);
  assert.equal(ctx.mails().length, before + 2);
});

test('a failed retry after an earlier mail restores the previous send time', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  rewind(ctx, row.id, 2);
  await runCron(ctx);
  const first = scanRow(ctx.env, row.id).sequence_sent_at;
  rewind(ctx, row.id, 5, 3);
  const previous = ago(3 * dayMs + hour);
  ctx.mode.resendOk = false;
  await runCron(ctx);
  const after = scanRow(ctx.env, row.id);
  assert.equal(after.sequence_step, 1);
  assert.equal(after.sequence_sent_at, previous);
  assert.ok(first);
});

test('unsubscribing from a sequence mail stops every later mail', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  rewind(ctx, row.id, 2);
  const before = ctx.mails().length;
  await runCron(ctx);
  const [mail] = sequenceMails(ctx, before);
  const link = mail.headers['List-Unsubscribe'].slice(1, -1);
  const response = await worker.fetch(new Request(link), ctx.env);
  assert.equal(response.status, 200);
  assert.equal(scanRow(ctx.env, row.id).marketing, 0);

  rewind(ctx, row.id, 13, 4);
  const after = ctx.mails().length;
  await runCron(ctx);
  assert.equal(sequenceMails(ctx, after).length, 0);
  assert.equal(scanRow(ctx.env, row.id).sequence_step, 1);
});

test('every sequence mail carries the unsubscribe headers, link, sender context and no fear copy', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx, { email: 'adresat@example.com' });
  const offsets = [2, 5, 9, 13];
  for (const [index, offset] of offsets.entries()) {
    rewind(ctx, row.id, offset, index === 0 ? null : offset - offsets[index - 1]);
    const before = ctx.mails().length;
    await runCron(ctx);
    const [mail] = sequenceMails(ctx, before);
    assert.ok(mail, `mail ${index + 1}`);
    assert.deepEqual(mail.to, ['adresat@example.com']);
    assert.equal(mail.reply_to, 'contact@adrianturbinski.pl');
    const header = mail.headers['List-Unsubscribe'];
    assert.match(header, /^<https:\/\/api\.adrianturbinski\.pl\/scan\/unsubscribe\?t=[\w-]+>$/);
    assert.equal(mail.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
    const link = header.slice(1, -1);
    assert.ok(mail.text.includes(link));
    assert.ok(mail.html.includes(link));
    assert.match(mail.text, new RegExp(`Wiadomość ${index + 1} z 4\\.`));
    assert.match(mail.text, /Adrian Turbiński, ul\. Przejazdowa 21C lok\. 19, 51-167 Wrocław/);
    assert.match(mail.text, /polityka-prywatnosci/);
    assert.match(mail.html, /<table role="presentation"/);
    assert.doesNotMatch(mail.html, /<script|<img|https?:\/\/[^"']*\.(png|jpg|gif)/);
    assert.doesNotMatch(
      `${mail.subject}${mail.text}`,
      /\u2014|\u2013|\bAI\b|kar[aąęy]\b|grzywn|sankcj|pozw/i,
    );
  }
});

test('mail contents follow the report and stay inside the consent', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  const reportLink = `https://api.adrianturbinski.pl/r/${row.report_key}`;
  const mailAt = async (index, offset, sentAgo) => {
    rewind(ctx, row.id, offset, sentAgo);
    const before = ctx.mails().length;
    await runCron(ctx);
    return sequenceMails(ctx, before)[0];
  };
  const first = await mailAt(0, 2, null);
  assert.ok(first.text.includes(reportLink));
  assert.match(first.text, /Potwierdzone błędy: 7, przeskanowane strony: 12\./);
  assert.match(first.text, /Krytyczne: 1, poważne: 2, umiarkowane: 3, drobne: 1\./);
  assert.match(first.text, /Trzy najważniejsze problemy/);

  const second = await mailAt(1, 5, 3);
  assert.ok(second.text.includes(`${reportLink}#reczne`));
  assert.match(second.text, /klawiatur/);
  assert.match(second.text, /czytnik ekranu/);
  assert.match(second.text, /kontrast/);
  assert.match(second.text, /nie rozstrzygnął: 4/);

  const third = await mailAt(2, 9, 4);
  assert.match(third.text, /26 kwietnia 2024/);
  assert.match(third.text, /Dz\.U\. 2024 poz\. 731/);
  assert.match(third.text, /mikroprzedsiębiorców \(art\. 4 pkt 1\)/);
  assert.match(third.text, /nie porada prawna/);

  const fourth = await mailAt(3, 13, 4);
  assert.ok(fourth.text.includes('https://adrianturbinski.pl/#kontakt'));
  assert.ok(fourth.text.includes('contact@adrianturbinski.pl'));
  assert.match(fourth.text, /audyt/i);
  assert.match(fourth.text, /ostatnia wiadomość/);
  assert.doesNotMatch(fourth.text, /\d+\s?(zł|PLN|EUR)/i);
});

test('an expired report leaves the sequence mail with a new scan link instead', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET report_expires = ? WHERE id = ?')
    .run(ago(hour), row.id);
  rewind(ctx, row.id, 2);
  const before = ctx.mails().length;
  await runCron(ctx);
  const [mail] = sequenceMails(ctx, before);
  assert.ok(!mail.text.includes(row.report_key));
  assert.ok(mail.text.includes('https://adrianturbinski.pl/skaner/'));
});

test('sequence mail html escapes the domain and keeps the counts plain', () => {
  const links = {
    report: 'https://api.adrianturbinski.pl/r/abc',
    unsubscribe: 'https://u.example/x',
  };
  const mail = sequenceMail(0, { domain: '<b>x</b>.pl' }, summary, links);
  assert.doesNotMatch(mail.html, /<b>x<\/b>/);
  assert.match(mail.html, /&lt;b&gt;x&lt;\/b&gt;\.pl/);
  const clean = sequenceMail(0, { domain: 'ok.pl' }, { ...summary, violations: 0 }, links);
  assert.match(clean.text, /Skan nie potwierdził błędów/);
  const cleanLast = sequenceMail(3, { domain: 'ok.pl' }, { ...summary, violations: 0 }, links);
  assert.match(cleanLast.text, /Skan strony ok\.pl nie potwierdził błędów\./);
  assert.doesNotMatch(cleanLast.text, /błędy: 0/);
});

test('the cron still cleans up and reports an error when the sequence columns are missing', async () => {
  const ctx = setup();
  const row = await finishedScan(ctx);
  ctx.env.SCANS.db.exec('ALTER TABLE scans DROP COLUMN sequence_step');
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET report_expires = ? WHERE id = ?')
    .run(ago(1000), row.id);
  const before = ctx.mails().length;
  await assert.rejects(runCron(ctx), /sequence_step/);
  assert.equal(ctx.mails().length, before);
  assert.equal(scanRow(ctx.env, row.id).report_key, null);
});

const today = () => new Date().toISOString().slice(0, 10);
const usageValue = (env, metric, at = today()) =>
  env.SCANS.db.prepare('SELECT value FROM usage WHERE day = ? AND metric = ?').get(at, metric)
    ?.value;
const seedUsage = (env, metric, value, at = today()) =>
  env.SCANS.db
    .prepare(
      'INSERT INTO usage (day, metric, value) VALUES (?, ?, ?) ON CONFLICT(day, metric) DO UPDATE SET value = excluded.value',
    )
    .run(at, metric, value);
const seedStoredBytes = (env, bytes) =>
  env.SCANS.db
    .prepare(
      "INSERT INTO scans (id, at, lang, url, domain, email, ip_hash, status, confirm_token_hash, unsubscribe_token_hash, report_key, report_bytes) VALUES ('seed-bytes', ?, 'pl', 'https://seed.example/', 'seed.example', 'seed@example.com', '', 'done', 'seed-confirm', 'seed-unsubscribe', 'seedkey', ?)",
    )
    .run(ago(1000), bytes);

const capacityFamilies = [
  ['kv_writes', 'kv_writes', (env, value) => seedUsage(env, 'kv_writes', value)],
  ['kv_reads', 'kv_reads', (env, value) => seedUsage(env, 'kv_reads', value)],
  ['kv_bytes', 'kv_bytes', (env, value) => seedStoredBytes(env, value)],
  ['d1_rows_written', 'd1_rows_written', (env, value) => seedUsage(env, 'd1_rows_written', value)],
  ['d1_rows_read', 'd1_rows_read', (env, value) => seedUsage(env, 'd1_rows_read', value)],
  [
    'd1_bytes',
    'd1_bytes',
    (env, value) => {
      env.SCANS.sizeAfter = value;
    },
  ],
];

const gateReadSlack = { d1_rows_read: 5 };

for (const [title, metric, seed] of capacityFamilies) {
  test(`new scans are refused at 80 percent of ${title} and accepted with one scan of headroom below`, async () => {
    const atLimit = setup();
    seed(atLimit.env, thresholds[metric]);
    const refused = await submit(atLimit.env, {});
    assert.equal(refused.status, 503);
    assert.deepEqual(await refused.json(), { ok: false, error: 'capacity' });
    assert.equal(rows(atLimit.env, 'scans').length, metric === 'kv_bytes' ? 1 : 0);
    assert.equal(rows(atLimit.env, 'consents').length, 0);
    assert.equal(atLimit.mails().length, 0);

    const noRoom = setup();
    seed(noRoom.env, thresholds[metric] - scanCost[metric] + 1);
    assert.equal((await submit(noRoom.env, {})).status, 503);

    const fits = setup();
    seed(fits.env, thresholds[metric] - scanCost[metric] - (gateReadSlack[metric] ?? 0));
    const accepted = await submit(fits.env, {});
    assert.equal(accepted.status, 202);
    assert.equal(fits.mails().length, 1);
  });
}

test('a day without counters accepts scans and yesterday counters do not block', async () => {
  const ctx = setup();
  const yesterday = new Date(Date.now() - 24 * hour).toISOString().slice(0, 10);
  seedUsage(ctx.env, 'kv_writes', 1000, yesterday);
  seedUsage(ctx.env, 'd1_rows_written', 100000, yesterday);
  assert.equal((await submit(ctx.env, {})).status, 202);
});

test('counters are flushed once per request and accumulate over requests', async () => {
  const ctx = setup();
  const waiting = [];
  const run = request => worker.fetch(request, ctx.env, { waitUntil: work => waiting.push(work) });
  const first = await run(scanRequest());
  assert.equal(first.status, 202);
  assert.equal(waiting.length, 1);
  await Promise.all(waiting);
  const afterFirst = usageValue(ctx.env, 'd1_rows_written');
  assert.ok(afterFirst >= 4);
  assert.ok(usageValue(ctx.env, 'd1_rows_read') >= 0);
  assert.equal(usageValue(ctx.env, 'd1_bytes'), 4096);

  const second = await run(scanRequest());
  assert.equal(second.status, 202);
  await Promise.all(waiting);
  assert.ok(usageValue(ctx.env, 'd1_rows_written') >= afterFirst + 4);
  assert.equal(rows(ctx.env, 'usage').filter(row => row.metric === 'd1_rows_written').length, 1);
});

test('kv puts and deletes count as writes, reads are flushed in batches', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, {});
  const done = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(done.status, 200);
  assert.equal(usageValue(ctx.env, 'kv_writes'), 1);
  const { report_key: key, report_bytes: bytes } = scanRow(ctx.env, job.id);
  assert.equal(bytes, new TextEncoder().encode('<h1>Raport</h1>').length);

  for (let i = 0; i < 24; i += 1)
    assert.equal((await worker.fetch(new Request(`${base}/r/${key}`), ctx.env)).status, 200);
  assert.equal(usageValue(ctx.env, 'kv_reads'), undefined);
  assert.equal((await worker.fetch(new Request(`${base}/r/${key}`), ctx.env)).status, 200);
  assert.equal(usageValue(ctx.env, 'kv_reads'), 25);

  const failing = setup();
  const failingJob = await runningJob(failing, {});
  failing.mode.resendOk = false;
  const failed = await worker.fetch(
    resultRequest(failingJob.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    failing.env,
  );
  assert.equal(failed.status, 502);
  assert.equal(usageValue(failing.env, 'kv_writes'), 2);
});

test('stored bytes are the sum of live report sizes and not of expired ones', async () => {
  const ctx = setup();
  seedStoredBytes(ctx.env, thresholds.kv_bytes);
  assert.equal((await submit(ctx.env, {})).status, 503);
  ctx.env.SCANS.db.prepare("UPDATE scans SET report_key = NULL WHERE id = 'seed-bytes'").run();
  assert.equal((await submit(ctx.env, {})).status, 202);
});

test('a result is refused and the scan marked failed when kv writes are at the threshold', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, {});
  seedUsage(ctx.env, 'kv_writes', thresholds.kv_writes - 1);
  const before = ctx.mails().length;
  const response = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { ok: false, error: 'capacity' });
  const row = scanRow(ctx.env, job.id);
  assert.equal(row.status, 'failed');
  assert.equal(row.error, 'capacity');
  assert.equal(row.report_key, null);
  assert.equal(ctx.env.REPORTS.objects.size, 0);
  const sent = ctx.mails().slice(before);
  assert.equal(sent.length, 1);
  assert.match(sent[0].subject, /^Nie udało się przeskanować/);
  assert.match(sent[0].text, /dzienny limit/);
  assert.equal(usageValue(ctx.env, 'kv_writes'), thresholds.kv_writes - 1);
});

test('a result is stored just below the kv write threshold and refused when it would not fit in storage', async () => {
  const fits = setup();
  const job = await runningJob(fits, {});
  seedUsage(fits.env, 'kv_writes', thresholds.kv_writes - 2);
  const stored = await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    fits.env,
  );
  assert.equal(stored.status, 200);
  assert.equal(fits.env.REPORTS.objects.size, 1);

  const full = setup();
  const fullJob = await runningJob(full, {});
  seedStoredBytes(full.env, thresholds.kv_bytes - 10);
  const html = 'x'.repeat(11);
  const refused = await worker.fetch(
    resultRequest(fullJob.id, { status: 'done', summary, html }),
    full.env,
  );
  assert.equal(refused.status, 422);
  assert.equal(scanRow(full.env, fullJob.id).status, 'failed');
  assert.equal(full.env.REPORTS.objects.size, 0);

  const exact = setup();
  const exactJob = await runningJob(exact, {});
  seedStoredBytes(exact.env, thresholds.kv_bytes - 11);
  const accepted = await worker.fetch(
    resultRequest(exactJob.id, { status: 'done', summary, html }),
    exact.env,
  );
  assert.equal(accepted.status, 200);
});

test('a report view past the kv read threshold shows the friendly unavailable page', async () => {
  const ctx = setup();
  const job = await runningJob(ctx, {});
  await worker.fetch(
    resultRequest(job.id, { status: 'done', summary, html: '<h1>Raport</h1>' }),
    ctx.env,
  );
  const { report_key: key } = scanRow(ctx.env, job.id);

  seedUsage(ctx.env, 'kv_reads', thresholds.kv_reads);
  resetUsageState();
  const busy = await worker.fetch(new Request(`${base}/r/${key}`), ctx.env);
  assert.equal(busy.status, 503);
  const page = await busy.text();
  assert.match(page, /chwilowo niedostępny/);
  assert.match(page, /Spróbuj jutro/);
  assert.match(page, /<html lang="pl">/);
  assert.equal(busy.headers.get('Cache-Control'), 'no-store');

  seedUsage(ctx.env, 'kv_reads', thresholds.kv_reads - 1);
  resetUsageState();
  const open = await worker.fetch(new Request(`${base}/r/${key}`), ctx.env);
  assert.equal(open.status, 200);
  assert.equal(await open.text(), '<h1>Raport</h1>');
});

test('a malformed report key never touches kv or the usage table', async () => {
  const ctx = setup();
  seedUsage(ctx.env, 'kv_reads', thresholds.kv_reads);
  const response = await worker.fetch(new Request(`${base}/r/short`), ctx.env);
  assert.equal(response.status, 404);
});

test('the telegram alert goes out once per metric and day when 80 percent is crossed', async () => {
  const ctx = setup();
  mock.timers.enable({ apis: ['Date'], now: Date.now() });
  try {
    const id = await confirmedFirst(ctx);
    assert.ok(id);
    const alerts = () => ctx.telegram().filter(note => note.text.includes('limit Cloudflare'));
    assert.equal(alerts().length, 0);

    seedUsage(ctx.env, 'd1_rows_written', thresholds.d1_rows_written - 1);
    resetUsageState();
    await worker.fetch(authed('/scan/jobs/next'), ctx.env);
    assert.equal(alerts().length, 1);
    assert.match(alerts()[0].text, /d1_rows_written/);
    assert.equal(usageValue(ctx.env, 'alert:d1_rows_written'), 1);

    await worker.fetch(authed('/scan/jobs/next'), ctx.env);
    resetUsageState();
    await worker.fetch(authed('/scan/jobs/next'), ctx.env);
    assert.equal(alerts().length, 1);

    mock.timers.setTime(Date.now() + 24 * hour);
    resetUsageState();
    seedUsage(ctx.env, 'd1_rows_written', thresholds.d1_rows_written - 1);
    await submit(ctx.env, {});
    await worker.fetch(authed('/scan/jobs/next'), ctx.env);
    assert.equal(alerts().length, 2);
  } finally {
    mock.timers.reset();
  }
});

async function confirmedFirst(ctx) {
  const response = await submit(ctx.env, {});
  assert.equal(response.status, 202);
  const confirm = await confirmPost(ctx.env, tokenIn(ctx.mails().at(-1).text));
  assert.equal(confirm.status, 200);
  return rows(ctx.env, 'scans').at(-1).id;
}

test('the stored size alert fires for a database near its storage limit', async () => {
  const ctx = setup();
  ctx.env.SCANS.sizeAfter = thresholds.d1_bytes;
  await submit(ctx.env, {});
  const alerts = ctx.telegram().filter(note => note.text.includes('d1_bytes'));
  assert.equal(alerts.length, 1);
  assert.equal(usageValue(ctx.env, 'd1_bytes'), thresholds.d1_bytes);
  const refused = await submit(ctx.env, {});
  assert.equal(refused.status, 503);
  assert.equal(ctx.telegram().filter(note => note.text.includes('d1_bytes')).length, 1);
});

test('the cron deletes usage rows older than 40 days and keeps newer ones', async () => {
  const ctx = setup();
  const dayOf = days => new Date(Date.now() - days * 24 * hour).toISOString().slice(0, 10);
  seedUsage(ctx.env, 'kv_writes', 1, dayOf(41));
  seedUsage(ctx.env, 'alert:kv_writes', 1, dayOf(41));
  seedUsage(ctx.env, 'kv_writes', 2, dayOf(39));
  seedUsage(ctx.env, 'kv_writes', 3, dayOf(0));
  await worker.scheduled({}, ctx.env);
  const days = rows(ctx.env, 'usage').map(row => row.day);
  assert.ok(!days.includes(dayOf(41)));
  assert.ok(days.includes(dayOf(39)));
  assert.equal(usageValue(ctx.env, 'kv_writes', dayOf(0)), 3);
});

test('the cron stops deleting expired reports from kv at the write threshold', async () => {
  const ctx = setup();
  const finished = await finishedScan(ctx);
  ctx.env.SCANS.db
    .prepare('UPDATE scans SET report_expires = ? WHERE id = ?')
    .run(ago(1000), finished.id);
  seedUsage(ctx.env, 'kv_writes', thresholds.kv_writes);
  await worker.scheduled({}, ctx.env);
  assert.equal(ctx.env.REPORTS.objects.has(`reports/${finished.report_key}.html`), true);
  assert.equal(scanRow(ctx.env, finished.id).report_key, finished.report_key);

  seedUsage(ctx.env, 'kv_writes', 0);
  resetUsageState();
  await worker.scheduled({}, ctx.env);
  assert.equal(ctx.env.REPORTS.objects.has(`reports/${finished.report_key}.html`), false);
  assert.equal(scanRow(ctx.env, finished.id).report_key, null);
});

test('a database error while reading usage fails closed for new scans', async () => {
  const ctx = setup();
  const broken = {
    ...ctx.env,
    SCANS: {
      ...ctx.env.SCANS,
      prepare: sql => {
        if (/FROM usage/.test(sql)) throw new Error('down');
        return ctx.env.SCANS.prepare(sql);
      },
    },
  };
  const response = await submit(broken, {});
  assert.equal(response.status, 500);
  assert.equal(rows(ctx.env, 'scans').length, 0);
});
