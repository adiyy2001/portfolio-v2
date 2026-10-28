const prefix = '/uploads/';
const keyPattern = /^[a-z0-9]{16,40}\/[a-z0-9-]{1,40}\.(jpg|png)$/;
const idPattern = /^[a-z0-9]{16,40}$/;
const types = { jpg: 'image/jpeg', png: 'image/png' };
const maxBytes = 8 * 1024 * 1024;
const minTtl = 3600;
const maxTtl = 14 * 24 * 3600;
const defaultTtl = 3 * 24 * 3600;

const noindex = {
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
};

const reply = (body, status, headers = {}) =>
  new Response(body, { status, headers: { ...noindex, ...headers } });

const json = (body, status) =>
  reply(JSON.stringify(body), status, { 'Content-Type': 'application/json; charset=utf-8' });

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
  const expected = String(env.UPLOAD_TOKEN_SHA256 || '').toLowerCase();
  if (!token || expected.length !== 64) return false;
  return sameText(await sha256(token), expected);
}

function looksLike(kind, bytes) {
  if (kind === 'jpg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
}

function ttlFrom(url) {
  const asked = Number(url.searchParams.get('ttl'));
  if (!Number.isFinite(asked) || asked <= 0) return defaultTtl;
  return Math.min(maxTtl, Math.max(minTtl, Math.floor(asked)));
}

async function serve(request, env, key) {
  const { value, metadata } = await env.MEDIA.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!value) return reply('Not found', 404, { 'Cache-Control': 'no-store' });
  const headers = {
    'Content-Type': metadata?.type || types[key.split('.').pop()],
    'Content-Length': String(value.byteLength),
    'Cache-Control': 'public, max-age=3600',
  };
  return reply(request.method === 'HEAD' ? null : value, 200, headers);
}

async function store(request, env, url, key) {
  const kind = key.split('.').pop();
  const declared = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  if (declared !== types[kind]) return json({ ok: false, error: 'type' }, 415);
  const declaredLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes)
    return json({ ok: false, error: 'size' }, 413);
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > maxBytes)
    return json({ ok: false, error: 'size' }, 413);
  if (!looksLike(kind, new Uint8Array(body))) return json({ ok: false, error: 'content' }, 415);
  const ttl = ttlFrom(url);
  await env.MEDIA.put(key, body, { expirationTtl: ttl, metadata: { type: types[kind] } });
  return json({ ok: true, url: `${url.origin}${prefix}${key}`, bytes: body.byteLength, ttl }, 201);
}

async function remove(env, rest) {
  if (idPattern.test(rest)) {
    const listed = await env.MEDIA.list({ prefix: `${rest}/` });
    await Promise.all(listed.keys.map(entry => env.MEDIA.delete(entry.name)));
    return json({ ok: true, deleted: listed.keys.length }, 200);
  }
  if (keyPattern.test(rest)) {
    await env.MEDIA.delete(rest);
    return json({ ok: true, deleted: 1 }, 200);
  }
  return json({ ok: false, error: 'path' }, 400);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/robots.txt')
      return reply('User-agent: *\nAllow: /\n', 200, { 'Content-Type': 'text/plain; charset=utf-8' });
    if (!url.pathname.startsWith(prefix)) return reply('Not found', 404);
    const rest = url.pathname.slice(prefix.length);
    const method = request.method;

    if (method === 'GET' || method === 'HEAD') {
      if (!keyPattern.test(rest)) return reply('Not found', 404);
      return serve(request, env, rest);
    }
    if (method === 'PUT' || method === 'DELETE') {
      if (!(await authorized(request, env))) return json({ ok: false, error: 'auth' }, 401);
      if (method === 'DELETE') return remove(env, rest);
      if (!keyPattern.test(rest)) return json({ ok: false, error: 'path' }, 400);
      return store(request, env, url, rest);
    }
    return reply('Method not allowed', 405, { Allow: 'GET, HEAD, PUT, DELETE' });
  },
};
