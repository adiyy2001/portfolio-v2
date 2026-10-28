import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import worker from './index.js';

const token = 'test-token-value';
const digest = createHash('sha256').update(token).digest('hex');
const base = 'https://media.adrianturbinski.pl';
const id = 'abcdef0123456789abcdef01';
const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70, 0, 1]);
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]);

function fakeKv() {
  const store = new Map();
  return {
    store,
    async put(key, value, options) {
      store.set(key, { value, metadata: options?.metadata, ttl: options?.expirationTtl });
    },
    async getWithMetadata(key) {
      const hit = store.get(key);
      return hit ? { value: hit.value, metadata: hit.metadata } : { value: null, metadata: null };
    },
    async delete(key) {
      store.delete(key);
    },
    async list({ prefix }) {
      return { keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })) };
    },
  };
}

const makeEnv = () => ({ MEDIA: fakeKv(), UPLOAD_TOKEN_SHA256: digest });
const call = (env, method, path, init = {}) =>
  worker.fetch(new Request(`${base}${path}`, { method, ...init }), env);
const auth = { Authorization: `Bearer ${token}` };

test('PUT without token is rejected', async () => {
  const env = makeEnv();
  const response = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg' },
    body: jpeg,
  });
  assert.equal(response.status, 401);
  assert.equal(env.MEDIA.store.size, 0);
});

test('PUT with a wrong token is rejected', async () => {
  const env = makeEnv();
  const response = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', Authorization: 'Bearer nope' },
    body: jpeg,
  });
  assert.equal(response.status, 401);
});

test('missing hash binding rejects everything', async () => {
  const env = { MEDIA: fakeKv() };
  const response = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(response.status, 401);
});

test('upload, public GET and HEAD, then delete', async () => {
  const env = makeEnv();
  const put = await call(env, 'PUT', `/uploads/${id}/01.jpg?ttl=7200`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(put.status, 201);
  const info = await put.json();
  assert.equal(info.url, `${base}/uploads/${id}/01.jpg`);
  assert.equal(info.ttl, 7200);
  assert.equal(env.MEDIA.store.get(`${id}/01.jpg`).ttl, 7200);

  const get = await call(env, 'GET', `/uploads/${id}/01.jpg`);
  assert.equal(get.status, 200);
  assert.equal(get.headers.get('Content-Type'), 'image/jpeg');
  assert.equal(get.headers.get('Content-Length'), String(jpeg.length));
  assert.match(get.headers.get('X-Robots-Tag'), /noindex/);
  assert.deepEqual(new Uint8Array(await get.arrayBuffer()), jpeg);

  const head = await call(env, 'HEAD', `/uploads/${id}/01.jpg`);
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('Content-Length'), String(jpeg.length));

  const del = await call(env, 'DELETE', `/uploads/${id}/01.jpg`, { headers: auth });
  assert.equal(del.status, 200);
  const gone = await call(env, 'GET', `/uploads/${id}/01.jpg`);
  assert.equal(gone.status, 404);
});

test('delete by id removes the whole set', async () => {
  const env = makeEnv();
  for (const name of ['01.jpg', '02.jpg']) {
    await call(env, 'PUT', `/uploads/${id}/${name}`, {
      headers: { 'Content-Type': 'image/jpeg', ...auth },
      body: jpeg,
    });
  }
  const del = await call(env, 'DELETE', `/uploads/${id}`, { headers: auth });
  assert.deepEqual(await del.json(), { ok: true, deleted: 2 });
  assert.equal(env.MEDIA.store.size, 0);
});

test('ttl is clamped and defaults to three days', async () => {
  const env = makeEnv();
  await call(env, 'PUT', `/uploads/${id}/01.jpg?ttl=5`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(env.MEDIA.store.get(`${id}/01.jpg`).ttl, 3600);
  await call(env, 'PUT', `/uploads/${id}/02.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(env.MEDIA.store.get(`${id}/02.jpg`).ttl, 3 * 24 * 3600);
  await call(env, 'PUT', `/uploads/${id}/03.jpg?ttl=99999999`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(env.MEDIA.store.get(`${id}/03.jpg`).ttl, 14 * 24 * 3600);
});

test('rejects wrong content type, wrong bytes and bad paths', async () => {
  const env = makeEnv();
  const wrongType = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'text/html', ...auth },
    body: jpeg,
  });
  assert.equal(wrongType.status, 415);
  const wrongBytes = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: png,
  });
  assert.equal(wrongBytes.status, 415);
  const badId = await call(env, 'PUT', '/uploads/short/01.jpg', {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(badId.status, 400);
  const traversal = await call(env, 'PUT', `/uploads/${id}/..%2f01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: jpeg,
  });
  assert.equal(traversal.status, 400);
  const empty = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: new Uint8Array(),
  });
  assert.equal(empty.status, 413);
  assert.equal(env.MEDIA.store.size, 0);
});

test('png is accepted with its own type', async () => {
  const env = makeEnv();
  const put = await call(env, 'PUT', `/uploads/${id}/01.png`, {
    headers: { 'Content-Type': 'image/png', ...auth },
    body: png,
  });
  assert.equal(put.status, 201);
  const get = await call(env, 'GET', `/uploads/${id}/01.png`);
  assert.equal(get.headers.get('Content-Type'), 'image/png');
});

test('oversized body is rejected', async () => {
  const env = makeEnv();
  const big = new Uint8Array(8 * 1024 * 1024 + 1);
  big.set(jpeg);
  const response = await call(env, 'PUT', `/uploads/${id}/01.jpg`, {
    headers: { 'Content-Type': 'image/jpeg', ...auth },
    body: big,
  });
  assert.equal(response.status, 413);
});

test('other paths and methods are closed', async () => {
  const env = makeEnv();
  assert.equal((await call(env, 'GET', '/')).status, 404);
  assert.equal((await call(env, 'GET', '/uploads/')).status, 404);
  assert.equal((await call(env, 'GET', '/uploads/zzz/01.jpg')).status, 404);
  assert.equal((await call(env, 'POST', `/uploads/${id}/01.jpg`)).status, 405);
  const robots = await call(env, 'GET', '/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Allow: \//);
});

test('unknown key returns 404 that is not cached', async () => {
  const env = makeEnv();
  const response = await call(env, 'GET', `/uploads/${id}/09.jpg`);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
