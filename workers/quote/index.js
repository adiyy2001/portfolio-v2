const site = 'https://adrianturbinski.pl';
const origins = new Set([site, 'https://www.adrianturbinski.pl']);
const mail = 'adrian.turbinski@gmail.com';
const minFillMs = 2500;

const limits = {
  service: 40,
  budget: 40,
  message: 2000,
  contact: 200,
  page: 200,
  code: 20,
  source: 120,
};

const sentPage = { pl: `${site}/wycena/wyslano/`, en: `${site}/en/quote/sent/` };

const failText = {
  pl: {
    title: 'Nie udało się wysłać',
    body: 'Formularz chwilowo nie działa. Napisz proszę bezpośrednio:',
    back: 'Wróć na stronę',
  },
  en: {
    title: 'Sending failed',
    body: 'The form is not working right now. Please write directly:',
    back: 'Back to the site',
  },
};

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

const clip = (value, max) =>
  String(value ?? '')
    .replace(/\s+\n/g, '\n')
    .trim()
    .slice(0, max);

const cleanCode = value =>
  clip(value, limits.code)
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');

const cleanSource = value => clip(value, limits.source).replace(/[^A-Za-z0-9:/._-]/g, '');

const reachable = contact =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || contact.replace(/\D/g, '').length >= 9;

const failPage = lang => {
  const t = failText[lang];
  return new Response(
    `<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t.title}</title><body style="font:18px/1.5 system-ui,sans-serif;max-width:36em;margin:15vh auto;padding:0 24px;background:#3b0d18;color:#e9eff6"><h1>${t.title}</h1><p>${t.body} <a style="color:#9dbbe0" href="mailto:${mail}">${mail}</a>, +48 731 985 567.</p><p><a style="color:#9dbbe0" href="${site}/">${t.back}</a></p></body></html>`,
    { status: 502, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
};

async function readFields(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return { fields: await request.json(), html: false };
  const form = await request.formData();
  return { fields: Object.fromEntries(form), html: true };
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
  const expected = String(env.LEADS_TOKEN_SHA256 || '').toLowerCase();
  if (!token || expected.length !== 64) return false;
  return sameText(await sha256(token), expected);
}

async function store(env, lead, bot) {
  if (!env.LEADS) return;
  await env.LEADS.prepare(
    'INSERT INTO leads (at, lang, service, budget, page, source, code, bot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(
      new Date().toISOString(),
      lead.lang,
      lead.service,
      lead.budget,
      lead.page,
      lead.source,
      lead.code,
      bot ? 1 : 0,
    )
    .run();
}

async function listLeads(request, env, url) {
  if (!(await authorized(request, env))) return new Response('Unauthorized', { status: 401 });
  if (!env.LEADS) return new Response('Not configured', { status: 503 });
  const since = url.searchParams.get('since') || '1970-01-01T00:00:00Z';
  const { results } = await env.LEADS.prepare(
    'SELECT id, at, lang, service, budget, page, source, code FROM leads WHERE bot = 0 AND at > ? ORDER BY at',
  )
    .bind(since)
    .all();
  return new Response(JSON.stringify({ leads: results }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function notify(env, lead) {
  const lines = [
    `Nowe zapytanie o wycenę (${lead.lang.toUpperCase()})`,
    `Usługa: ${lead.service || 'nie wybrano'}`,
    `Budżet: ${lead.budget || 'nie podano'}`,
    `Kontakt: ${lead.contact}`,
    `Strona: ${lead.page || 'brak'}`,
    `Źródło: ${lead.source || 'brak'}`,
    `Kod: ${lead.code || 'brak'}`,
    '',
    lead.message || '(bez opisu)',
  ];
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
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    if (url.pathname === '/leads' && request.method === 'GET') return listLeads(request, env, url);
    if (url.pathname !== '/quote') return new Response('Not found', { status: 404 });
    if (request.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    if (origin && !origins.has(origin)) return json({ ok: false, error: 'origin' }, 403, origin);

    let parsed;
    try {
      parsed = await readFields(request);
    } catch {
      return json({ ok: false, error: 'body' }, 400, origin);
    }
    const { fields, html } = parsed;
    const lang = fields.lang === 'en' ? 'en' : 'pl';
    const lead = {
      lang,
      service: clip(fields.service, limits.service),
      budget: clip(fields.budget, limits.budget),
      message: clip(fields.message, limits.message),
      contact: clip(fields.contact, limits.contact),
      page: clip(fields.page, limits.page),
      code: cleanCode(fields.code),
      source: cleanSource(fields.source),
    };
    const elapsed = Number(fields.elapsed);
    const bot = Boolean(fields.website) || (Number.isFinite(elapsed) && elapsed < minFillMs);

    if (!bot && !reachable(lead.contact)) {
      if (html) return failPage(lang);
      return json({ ok: false, error: 'contact' }, 422, origin);
    }

    await store(env, lead, bot).catch(() => {});
    const delivered = bot ? true : await notify(env, lead).catch(() => false);
    if (!delivered)
      return html ? failPage(lang) : json({ ok: false, error: 'delivery' }, 502, origin);
    if (html) return Response.redirect(sentPage[lang], 303);
    return json({ ok: true }, 200, origin);
  },
};
