import consent from './consent.js';
import {
  createMeter,
  maxReportBytes,
  reportStoreCost,
  scanCost,
  snapshotMaxAgeMs,
  utcDay,
} from './usage.js';
import {
  confirmAskPage,
  confirmMail,
  failureMail,
  reportMail,
  replyTo,
  sequenceLength,
  sequenceMail,
  site,
  statusPage,
} from './views.js';

const api = 'https://api.adrianturbinski.pl';
const origins = new Set([site, 'https://www.adrianturbinski.pl']);
const defaultFrom = 'Adrian Turbiński <skaner@adrianturbinski.pl>';
const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const resendUrl = 'https://api.resend.com/emails';

const minFillMs = 2500;
const maxHtmlChars = 5 * 1024 * 1024;
const maxAttempts = 2;
const hour = 3600 * 1000;
const day = 24 * hour;
const confirmTtl = 24 * hour;
const runningTtl = 15 * 60 * 1000;
const reportTtl = 30 * day;
const reportStoreGraceSeconds = 7 * 24 * 60 * 60;
const pendingRetention = day;
const usageRetentionDays = 40;
const retentionYears = 3;
const sequenceDays = 14;
const sequenceOffsets = [2, 5, 9, 13];
const sequenceMinGap = 2 * day;
const sequenceBatch = 25;

const limits = { url: 2048, email: 254, page: 200, error: 500, summaryText: 60 };
const perDay = { domain: 1, ip: 3, email: 3 };
const consentKinds = ['terms', 'marketing', 'info'];
const summaryKeys = [
  'pages',
  'violations',
  'critical',
  'serious',
  'moderate',
  'minor',
  'incomplete',
];

const blockedSuffixes = ['.local', '.localhost', '.internal', '.lan', '.home.arpa'];
const labelPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const tldPattern = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reportKeyPattern = /^[A-Za-z0-9_-]{20,64}$/;
const jobIdPattern = /^[0-9a-f-]{36}$/;

const countSql = {
  domain: "SELECT COUNT(*) AS n FROM scans WHERE domain = ? AND at > ? AND status != 'failed'",
  ip: 'SELECT COUNT(*) AS n FROM scans WHERE ip_hash = ? AND at > ?',
  email: 'SELECT COUNT(*) AS n FROM scans WHERE email_key = ? AND at > ?',
};

const sharedSuffixes = new Set([
  'com.pl',
  'net.pl',
  'org.pl',
  'edu.pl',
  'gov.pl',
  'info.pl',
  'biz.pl',
  'waw.pl',
  'wroclaw.pl',
  'krakow.pl',
  'poznan.pl',
  'gda.pl',
  'gdansk.pl',
  'lodz.pl',
  'szczecin.pl',
  'katowice.pl',
  'lublin.pl',
  'bialystok.pl',
  'torun.pl',
  'olsztyn.pl',
  'rzeszow.pl',
  'opole.pl',
  'kielce.pl',
  'zgora.pl',
  'med.pl',
  'sklep.pl',
  'nom.pl',
  'shop.pl',
  'co.uk',
  'org.uk',
  'com.au',
  'co.jp',
  'com.br',
  'github.io',
  'netlify.app',
  'vercel.app',
  'pages.dev',
  'workers.dev',
  'wixsite.com',
  'myshopify.com',
  'blogspot.com',
]);

const insertScanSql = `INSERT INTO scans (id, at, lang, url, domain, email, email_key, ip_hash, ua, status, confirm_token_hash, unsubscribe_token_hash, marketing, page)
SELECT ?, ?, 'pl', ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?
WHERE (SELECT COUNT(*) FROM scans WHERE domain = ? AND at > ? AND status != 'failed') < ?
AND (? = '' OR (SELECT COUNT(*) FROM scans WHERE ip_hash = ? AND at > ?) < ?)
AND (SELECT COUNT(*) FROM scans WHERE email_key = ? AND at > ?) < ?`;

const cors = origin => ({
  'Access-Control-Allow-Origin': origins.has(origin) ? origin : site,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origin) },
  });

const plainJson = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const clip = (value, max) =>
  String(value ?? '')
    .trim()
    .slice(0, max);

const hex = buffer =>
  [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');

const base64url = buffer =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const randomToken = bytes => base64url(crypto.getRandomValues(new Uint8Array(bytes)));

async function sha256(text) {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

async function unsubscribeToken(env, id) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(env.IP_SALT || 'dev-salt')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`unsubscribe:${id}`)),
  );
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
  const expected = String(env.SCANNER_TOKEN_SHA256 || '').toLowerCase();
  if (!token || expected.length !== 64) return false;
  return sameText(await sha256(token), expected);
}

let consentHashPromise;
const currentConsentHash = () => (consentHashPromise ??= sha256(JSON.stringify(consent)));

const ago = ms => new Date(Date.now() - ms).toISOString();
const fromNow = ms => new Date(Date.now() + ms).toISOString();

function registrableDomain(host) {
  const labels = host.split('.');
  for (let size = labels.length; size >= 2; size -= 1) {
    if (!sharedSuffixes.has(labels.slice(-size).join('.'))) continue;
    return size === labels.length ? host : labels.slice(-(size + 1)).join('.');
  }
  return labels.slice(-2).join('.');
}

function expandIpv6(text) {
  let address = text.split('%')[0].toLowerCase();
  const dotted = address.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (dotted) {
    const [a, b, c, d] = dotted.slice(1).map(Number);
    if ([a, b, c, d].some(part => part > 255)) return null;
    address = `${address.slice(0, dotted.index)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = address.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...tail];
  if (!groups.every(group => /^[0-9a-f]{1,4}$/.test(group))) return null;
  return groups.map(group => parseInt(group, 16));
}

function ipKey(ip) {
  if (!ip.includes(':')) return ip;
  const groups = expandIpv6(ip);
  if (!groups) return ip;
  if (groups.slice(0, 5).every(group => group === 0) && groups[5] === 0xffff)
    return `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`;
  return `${groups
    .slice(0, 4)
    .map(group => group.toString(16))
    .join(':')}::/64`;
}

function emailKey(email) {
  const at = email.lastIndexOf('@');
  let local = email.slice(0, at).toLowerCase();
  let domain = email.slice(at + 1).toLowerCase();
  const plus = local.indexOf('+');
  if (plus > 0) local = local.slice(0, plus);
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
    domain = 'gmail.com';
  }
  return `${local}@${domain}`;
}

function displayHost(row) {
  try {
    return new URL(row.url).hostname.replace(/^www\./, '');
  } catch {
    return row.domain;
  }
}

function filledTooFast(fields) {
  const fill = fields.fillMs;
  if (typeof fill === 'number' && Number.isFinite(fill) && fill >= 0) return fill < minFillMs;
  const startedAt = Number(fields.startedAt);
  const elapsed = Date.now() - startedAt;
  return startedAt > 0 && elapsed >= 0 && elapsed < minFillMs;
}

function parseTarget(raw) {
  let text = String(raw ?? '').trim();
  if (!text || text.length > limits.url) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(text)) text = `https://${text}`;
  let parsed;
  try {
    parsed = new URL(text);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (parsed.username || parsed.password) return null;
  if (!['', '80', '443'].includes(parsed.port)) return null;
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (host.startsWith('[') || /^[0-9.]+$/.test(host) || host.length > 253) return null;
  if (host === 'localhost' || blockedSuffixes.some(suffix => host.endsWith(suffix))) return null;
  const labels = host.split('.');
  if (labels.length < 2 || !labels.every(label => labelPattern.test(label))) return null;
  if (!tldPattern.test(labels[labels.length - 1])) return null;
  const port = parsed.port ? `:${parsed.port}` : '';
  return {
    url: `${parsed.protocol}//${host}${port}${parsed.pathname}`,
    host: host.replace(/^www\./, ''),
    domain: registrableDomain(host.replace(/^www\./, '')),
  };
}

const validEmail = value => value.length <= limits.email && emailPattern.test(value);

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: String(token).slice(0, 2048),
  });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetch(turnstileUrl, { method: 'POST', body });
    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}

async function sendMail(env, message) {
  if (!env.RESEND_API_KEY) return false;
  try {
    const response = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: env.MAIL_FROM || defaultFrom, reply_to: replyTo, ...message }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function notifyTelegram(env, lines) {
  if (!env.TG_TOKEN || !env.TG_CHAT) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TG_CHAT,
        text: lines.join('\n'),
        disable_web_page_preview: true,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const invalidLink = status => statusPage('confirmInvalid', status);

async function handleScan(request, env, origin, meter) {
  if (origin && !origins.has(origin)) return json({ ok: false, error: 'origin' }, 403, origin);
  const configured = env.RESEND_API_KEY && env.TURNSTILE_SECRET && env.IP_SALT;
  if (!env.SCANS || (!configured && env.SCAN_DEV !== '1'))
    return json({ ok: false, error: 'unavailable' }, 503, origin);

  let fields;
  try {
    fields = await request.json();
  } catch {
    return json({ ok: false, error: 'body' }, 400, origin);
  }
  if (!fields || typeof fields !== 'object') return json({ ok: false, error: 'body' }, 400, origin);

  if (filledTooFast(fields)) return json({ ok: true }, 202, origin);

  if (String(fields.consentVersion ?? '') !== String(consent.version))
    return json({ ok: false, error: 'consent_version' }, 409, origin);
  if (fields.consentHash !== (await currentConsentHash()))
    return json({ ok: false, error: 'consent_hash' }, 409, origin);
  if (fields.terms !== true) return json({ ok: false, error: 'terms' }, 422, origin);

  const target = parseTarget(fields.url);
  if (!target) return json({ ok: false, error: 'url' }, 422, origin);
  const email = clip(fields.email, limits.email + 1);
  if (!validEmail(email)) return json({ ok: false, error: 'email' }, 422, origin);
  const mailbox = emailKey(email);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(env, fields.turnstile, ip)))
    return json({ ok: false, error: 'turnstile' }, 403, origin);

  try {
    if (await meter.blocked(scanCost)) return json({ ok: false, error: 'capacity' }, 503, origin);
  } catch {
    return json({ ok: false, error: 'storage' }, 500, origin);
  }

  const ipHash = ip ? await sha256(`${env.IP_SALT || ''}${ipKey(ip)}`) : '';
  const since = ago(day);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const ua = clip(request.headers.get('User-Agent'), 300);
  const page = clip(fields.page, limits.page);
  const marketing = fields.marketing === true;
  const confirmToken = randomToken(32);
  const unsubscribeHash = await sha256(await unsubscribeToken(env, id));

  let inserted;
  try {
    inserted = await env.SCANS.prepare(insertScanSql)
      .bind(
        id,
        now,
        target.url,
        target.domain,
        email,
        mailbox,
        ipHash,
        ua,
        await sha256(confirmToken),
        unsubscribeHash,
        marketing ? 1 : 0,
        page,
        target.domain,
        since,
        perDay.domain,
        ipHash,
        ipHash,
        since,
        perDay.ip,
        mailbox,
        since,
        perDay.email,
      )
      .run();
  } catch {
    return json({ ok: false, error: 'storage' }, 500, origin);
  }
  if (!inserted.meta?.changes) {
    const subjects = { domain: target.domain, ip: ipHash, email: mailbox };
    let reason = 'other';
    for (const name of ['domain', 'ip', 'email']) {
      if (name === 'ip' && !ipHash) continue;
      const row = await env.SCANS.prepare(countSql[name]).bind(subjects[name], since).first();
      if (row.n >= perDay[name]) {
        reason = name;
        break;
      }
    }
    return json({ ok: false, error: 'rate', reason }, 429, origin);
  }

  const granted = { terms: 1, marketing: marketing ? 1 : 0, info: 1 };
  const statements = [];
  for (const kind of consentKinds) {
    const text = consent.pl[kind];
    statements.push(
      env.SCANS.prepare(
        'INSERT INTO consents (id, scan_id, at, kind, version, text, text_sha256, granted, ip, ua, page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ).bind(
        crypto.randomUUID(),
        id,
        now,
        kind,
        String(consent.version),
        text,
        await sha256(text),
        granted[kind],
        ip,
        ua,
        page,
      ),
    );
  }
  try {
    await env.SCANS.batch(statements);
  } catch {
    await env.SCANS.prepare('DELETE FROM scans WHERE id = ?')
      .bind(id)
      .run()
      .catch(() => {});
    return json({ ok: false, error: 'storage' }, 500, origin);
  }

  const link = `${api}/scan/confirm?t=${confirmToken}`;
  const sent = await sendMail(env, { to: [email], ...confirmMail(target.host, link) });
  if (!sent) {
    await env.SCANS.batch([
      env.SCANS.prepare('DELETE FROM consents WHERE scan_id = ?').bind(id),
      env.SCANS.prepare('DELETE FROM scans WHERE id = ?').bind(id),
    ]).catch(() => {});
    return json({ ok: false, error: 'mail' }, 502, origin);
  }
  return json({ ok: true }, 202, origin);
}

async function handleConfirm(request, url, env) {
  const posting = request.method === 'POST';
  let token = url.searchParams.get('t') || '';
  if (posting) {
    const form = await request.formData().catch(() => null);
    token = String(form?.get('t') ?? '');
  }
  token = token.slice(0, 200);
  if (!token || !env.SCANS) return invalidLink(404);
  const row = await env.SCANS.prepare(
    'SELECT id, at, confirmed_at FROM scans WHERE confirm_token_hash = ?',
  )
    .bind(await sha256(token))
    .first();
  if (!row) return invalidLink(404);
  if (!row.confirmed_at && Date.parse(row.at) + confirmTtl < Date.now()) return invalidLink(410);
  if (!posting) return confirmAskPage(token);
  if (!row.confirmed_at) {
    await env.SCANS.prepare(
      "UPDATE scans SET confirmed_at = ?, status = 'queued' WHERE id = ? AND confirmed_at IS NULL AND status = 'pending'",
    )
      .bind(new Date().toISOString(), row.id)
      .run();
  }
  return statusPage('confirmed');
}

async function handleUnsubscribe(request, url, env) {
  const token = url.searchParams.get('t') || '';
  if (!token || !env.SCANS) return statusPage('unsubscribeInvalid', 404);
  const row = await env.SCANS.prepare(
    'SELECT id, marketing, unsubscribed_at FROM scans WHERE unsubscribe_token_hash = ?',
  )
    .bind(await sha256(token))
    .first();
  if (!row) return statusPage('unsubscribeInvalid', 404);
  if (!row.unsubscribed_at) {
    const now = new Date().toISOString();
    await env.SCANS.prepare('UPDATE scans SET unsubscribed_at = ?, marketing = 0 WHERE id = ?')
      .bind(now, row.id)
      .run();
    if (row.marketing) {
      const original = await env.SCANS.prepare(
        "SELECT version, text, text_sha256 FROM consents WHERE scan_id = ? AND kind = 'marketing' ORDER BY at LIMIT 1",
      )
        .bind(row.id)
        .first();
      const text = original?.text ?? consent.pl.marketing;
      await env.SCANS.prepare(
        "INSERT INTO consents (id, scan_id, at, kind, version, text, text_sha256, granted, ip, ua, page) VALUES (?, ?, ?, 'marketing', ?, ?, ?, 0, ?, ?, '')",
      )
        .bind(
          crypto.randomUUID(),
          row.id,
          now,
          original?.version ?? String(consent.version),
          text,
          original?.text_sha256 ?? (await sha256(text)),
          request.headers.get('CF-Connecting-IP') || '',
          clip(request.headers.get('User-Agent'), 300),
        )
        .run();
    }
  }
  return statusPage('unsubscribed');
}

const capacityReason =
  'Skaner osiągnął dzienny limit zasobów i nie mógł zapisać raportu. Możesz spróbować jutro.';

async function finishFailed(env, row, reason) {
  const host = displayHost(row);
  await sendMail(env, { to: [row.email], ...failureMail({ ...row, domain: host, reason }) });
  await notifyTelegram(env, [
    `Skaner: ${host}`,
    'Status: failed',
    'Błędy: brak danych',
    `Zgoda marketingowa: ${row.marketing ? 'tak' : 'nie'}`,
  ]);
}

async function nextJob(request, env) {
  if (!(await authorized(request, env))) return new Response('Unauthorized', { status: 401 });
  if (!env.SCANS) return new Response('Not configured', { status: 503 });
  const cutoff = ago(runningTtl);
  const { results: timedOut } = await env.SCANS.prepare(
    "UPDATE scans SET status = 'failed', error = 'timeout' WHERE status = 'running' AND started_at < ? AND attempts >= ? RETURNING id, url, domain, email, marketing",
  )
    .bind(cutoff, maxAttempts)
    .all();
  await env.SCANS.prepare(
    "UPDATE scans SET status = 'queued' WHERE status = 'running' AND started_at < ? AND attempts < ?",
  )
    .bind(cutoff, maxAttempts)
    .run();
  for (const row of timedOut) await finishFailed(env, row);

  const job = await env.SCANS.prepare(
    "UPDATE scans SET status = 'running', started_at = ?, attempts = attempts + 1 WHERE id = (SELECT id FROM scans WHERE status = 'queued' ORDER BY confirmed_at, at LIMIT 1) AND status = 'queued' RETURNING id, url, lang",
  )
    .bind(new Date().toISOString())
    .first();
  if (!job) return new Response(null, { status: 204 });
  return plainJson({ id: job.id, url: job.url, lang: job.lang });
}

function cleanSummary(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const summary = {};
  for (const key of summaryKeys) {
    const value = Number(source[key]);
    summary[key] = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  }
  summary.engine = clip(source.engine, limits.summaryText);
  return summary;
}

async function receiveResult(request, env, id, meter) {
  if (!(await authorized(request, env))) return new Response('Unauthorized', { status: 401 });
  if (!env.SCANS) return new Response('Not configured', { status: 503 });
  if (!jobIdPattern.test(id)) return plainJson({ ok: false, error: 'id' }, 404);

  let body;
  try {
    const text = await request.text();
    if (text.length > maxHtmlChars + 65536) return plainJson({ ok: false, error: 'size' }, 413);
    body = JSON.parse(text);
  } catch {
    return plainJson({ ok: false, error: 'body' }, 400);
  }
  if (!body || (body.status !== 'done' && body.status !== 'failed'))
    return plainJson({ ok: false, error: 'status' }, 422);

  const row = await env.SCANS.prepare(
    'SELECT id, url, domain, email, marketing, status FROM scans WHERE id = ?',
  )
    .bind(id)
    .first();
  if (!row) return plainJson({ ok: false, error: 'unknown' }, 404);
  if (row.status !== 'running') return plainJson({ ok: false, error: 'state' }, 409);

  if (body.status === 'failed') {
    await env.SCANS.prepare("UPDATE scans SET status = 'failed', error = ? WHERE id = ?")
      .bind(clip(body.error, limits.error), id)
      .run();
    await finishFailed(env, row);
    return plainJson({ ok: true });
  }

  const html = typeof body.html === 'string' ? body.html : '';
  if (!html) return plainJson({ ok: false, error: 'html' }, 422);
  if (html.length > maxHtmlChars) return plainJson({ ok: false, error: 'size' }, 413);
  if (!env.REPORTS) return plainJson({ ok: false, error: 'storage' }, 503);
  const htmlBytes = new TextEncoder().encode(html).length;
  if (htmlBytes > maxReportBytes) return plainJson({ ok: false, error: 'size' }, 413);

  let full;
  try {
    full = await meter.blocked({ ...reportStoreCost, kv_bytes: htmlBytes });
  } catch {
    return plainJson({ ok: false, error: 'storage' }, 503);
  }
  if (full) {
    await env.SCANS.prepare("UPDATE scans SET status = 'failed', error = 'capacity' WHERE id = ?")
      .bind(id)
      .run();
    await finishFailed(env, row, capacityReason);
    return plainJson({ ok: false, error: 'capacity' }, 422);
  }

  const summary = cleanSummary(body.summary);
  const reportKey = randomToken(24);
  const objectKey = `reports/${reportKey}.html`;
  const expires = fromNow(reportTtl);
  await env.REPORTS.put(objectKey, html, {
    metadata: { expires },
    expirationTtl: Math.ceil(reportTtl / 1000) + reportStoreGraceSeconds,
  });

  const host = displayHost(row);
  const unsubscribeLink = `${api}/scan/unsubscribe?t=${await unsubscribeToken(env, id)}`;
  const message = reportMail(
    { ...row, domain: host },
    summary,
    `${api}/r/${reportKey}`,
    expires,
    unsubscribeLink,
  );
  const mailed = await sendMail(env, {
    to: [row.email],
    ...message,
    headers: unsubscribeHeaders(unsubscribeLink),
  });
  if (!mailed) {
    await env.REPORTS.delete(objectKey).catch(() => {});
    return plainJson({ ok: false, error: 'mail' }, 502);
  }
  await env.SCANS.prepare(
    "UPDATE scans SET status = 'done', report_key = ?, report_expires = ?, summary_json = ?, error = NULL, report_bytes = ? WHERE id = ?",
  )
    .bind(reportKey, expires, JSON.stringify(summary), htmlBytes, id)
    .run();
  await notifyTelegram(env, [
    `Skaner: ${host}`,
    'Status: done',
    `Błędy: ${summary.violations} (strony: ${summary.pages})`,
    `Zgoda marketingowa: ${row.marketing ? 'tak' : 'nie'}`,
  ]);
  return plainJson({ ok: true, mailed: true });
}

async function serveReport(env, key, meter) {
  if (!env.REPORTS || !reportKeyPattern.test(key)) return statusPage('reportUnknown', 404);
  try {
    if (await meter.blocked({ kv_reads: 1 }, { maxAgeMs: snapshotMaxAgeMs }))
      return statusPage('reportBusy', 503);
  } catch {
    return statusPage('reportBusy', 503);
  }
  const objectKey = `reports/${key}.html`;
  const { value: html, metadata } = await env.REPORTS.getWithMetadata(objectKey);
  if (html === null) return statusPage('reportUnknown', 404);
  const expires = Date.parse(metadata?.expires || '');
  if (Number.isFinite(expires) && expires < Date.now()) {
    const roomToDelete = !(await meter
      .blocked({ kv_writes: 1 }, { maxAgeMs: snapshotMaxAgeMs })
      .catch(() => 'unknown'));
    if (roomToDelete) {
      await env.REPORTS.delete(objectKey).catch(() => {});
      await env.SCANS?.prepare('UPDATE scans SET report_key = NULL WHERE report_key = ?')
        .bind(key)
        .run()
        .catch(() => {});
    }
    return statusPage('reportExpired', 410);
  }
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'private, max-age=300',
      'Content-Security-Policy':
        "default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function cleanup(env, meter) {
  if (!env.SCANS) return;
  const now = new Date().toISOString();
  if (env.REPORTS) {
    const { results } = await env.SCANS.prepare(
      'SELECT id, report_key FROM scans WHERE report_key IS NOT NULL AND report_expires < ?',
    )
      .bind(now)
      .all();
    for (const row of results) {
      if (await meter.blocked({ kv_writes: 1 }, { maxAgeMs: snapshotMaxAgeMs })) break;
      await env.REPORTS.delete(`reports/${row.report_key}.html`);
      await env.SCANS.prepare('UPDATE scans SET report_key = NULL WHERE id = ?').bind(row.id).run();
    }
  }
  const cutoff = ago(pendingRetention);
  const lastYear = new Date().getUTCFullYear() - retentionYears - 1;
  const expiredScans = `CAST(substr(COALESCE(scans.confirmed_at, scans.at), 1, 4) AS INTEGER) <= ?
    AND NOT (
      scans.marketing = 1
      AND CAST(strftime('%Y', datetime(COALESCE(scans.confirmed_at, scans.at), '+${sequenceDays} days')) AS INTEGER) > ?
    )
    AND NOT EXISTS (
      SELECT 1 FROM consents w
      WHERE w.scan_id = scans.id AND w.kind = 'marketing' AND w.granted = 0
        AND CAST(substr(w.at, 1, 4) AS INTEGER) > ?
    )`;
  await env.SCANS.batch([
    env.SCANS.prepare(
      "DELETE FROM consents WHERE scan_id IN (SELECT id FROM scans WHERE status = 'pending' AND at < ?)",
    ).bind(cutoff),
    env.SCANS.prepare("DELETE FROM scans WHERE status = 'pending' AND at < ?").bind(cutoff),
    env.SCANS.prepare(
      `DELETE FROM consents WHERE scan_id IN (SELECT scans.id FROM scans WHERE ${expiredScans})`,
    ).bind(lastYear, lastYear, lastYear),
    env.SCANS.prepare(`DELETE FROM scans WHERE ${expiredScans}`).bind(lastYear, lastYear, lastYear),
    env.SCANS.prepare('DELETE FROM usage WHERE day < ?').bind(
      utcDay(Date.now() - usageRetentionDays * day),
    ),
  ]);
}

function parseSummary(raw) {
  try {
    return cleanSummary(JSON.parse(raw));
  } catch {
    return cleanSummary(null);
  }
}

function unsubscribeHeaders(link) {
  return {
    'List-Unsubscribe': `<${link}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

async function sendSequenceMail(env, row, step, now) {
  const claimed = await env.SCANS.prepare(
    "UPDATE scans SET sequence_step = ?, sequence_sent_at = ? WHERE id = ? AND sequence_step = ? AND status = 'done' AND marketing = 1 AND unsubscribed_at IS NULL",
  )
    .bind(step + 1, now, row.id, step)
    .run();
  if (!claimed.meta?.changes) return;

  let delivered = false;
  try {
    const unsubscribe = `${api}/scan/unsubscribe?t=${await unsubscribeToken(env, row.id)}`;
    const live = row.report_key && Date.parse(row.report_expires || '') > Date.now();
    const message = sequenceMail(
      step,
      { domain: displayHost(row) },
      parseSummary(row.summary_json),
      { report: live ? `${api}/r/${row.report_key}` : '', unsubscribe },
    );
    delivered = await sendMail(env, {
      to: [row.email],
      ...message,
      headers: unsubscribeHeaders(unsubscribe),
    });
  } finally {
    if (!delivered)
      await env.SCANS.prepare(
        'UPDATE scans SET sequence_step = ?, sequence_sent_at = ? WHERE id = ? AND sequence_step = ? AND sequence_sent_at = ?',
      )
        .bind(step, row.sequence_sent_at, row.id, step + 1, now)
        .run();
  }
}

async function runSequence(env) {
  if (!env.SCANS) return;
  const due = sequenceOffsets
    .map((_, step) => `(sequence_step = ${step} AND confirmed_at <= ?)`)
    .join(' OR ');
  const { results } = await env.SCANS.prepare(
    `SELECT id, url, domain, email, confirmed_at, report_key, report_expires, summary_json, sequence_step, sequence_sent_at
    FROM scans
    WHERE marketing = 1 AND status = 'done' AND unsubscribed_at IS NULL
      AND sequence_step < ${sequenceLength}
      AND confirmed_at > ?
      AND (sequence_sent_at IS NULL OR sequence_sent_at <= ?)
      AND (${due})
    ORDER BY confirmed_at
    LIMIT ${sequenceBatch}`,
  )
    .bind(
      ago(sequenceDays * day),
      ago(sequenceMinGap),
      ...sequenceOffsets.map(offset => ago(offset * day)),
    )
    .all();
  for (const row of results) {
    await sendSequenceMail(env, row, row.sequence_step, new Date().toISOString());
  }
}

async function dailyJobs(env, meter) {
  const outcomes = await Promise.allSettled([cleanup(env, meter), runSequence(env)]);
  const failed = outcomes.find(outcome => outcome.status === 'rejected');
  if (failed) throw failed.reason;
}

async function route(request, env, meter) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  const origin = request.headers.get('Origin') || '';

  if (path === '/scan') {
    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (method !== 'POST') return new Response('Method not allowed', { status: 405 });
    return handleScan(request, env, origin, meter);
  }
  if (path === '/scan/confirm' && (method === 'GET' || method === 'POST'))
    return handleConfirm(request, url, env);
  if (path === '/scan/unsubscribe' && (method === 'GET' || method === 'POST'))
    return handleUnsubscribe(request, url, env);
  if (path === '/scan/jobs/next' && method === 'GET') return nextJob(request, env);
  const result = path.match(/^\/scan\/jobs\/([^/]+)\/result$/);
  if (result && method === 'POST') return receiveResult(request, env, result[1], meter);
  const report = path.match(/^\/r\/([^/]+)$/);
  if (report && method === 'GET') return serveReport(env, report[1], meter);
  return new Response('Not found', { status: 404 });
}

async function settle(ctx, work) {
  if (ctx?.waitUntil) ctx.waitUntil(work);
  else await work;
}

export default {
  async fetch(request, env, ctx) {
    const meter = createMeter(env, lines => notifyTelegram(env, lines));
    try {
      return await route(request, meter.env, meter);
    } finally {
      await settle(ctx, meter.flush());
    }
  },

  async scheduled(event, env, ctx) {
    const meter = createMeter(env, lines => notifyTelegram(env, lines));
    const work = dailyJobs(meter.env, meter).finally(() => meter.flush());
    await settle(ctx, work);
  },
};
