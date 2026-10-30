import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { loadConfig } from '../src/config.js';
import { startWorker } from '../src/worker.js';
import { startFixtureServer } from './fixture-server.js';

async function fakeApi({ jobs, nextStatus, resultStatuses = [] }) {
  const received = { auth: [], results: [], polls: 0, attempts: 0 };
  const server = http.createServer((request, response) => {
    received.auth.push(request.headers.authorization);
    if (request.method === 'GET' && request.url === '/scan/jobs/next') {
      received.polls += 1;
      if (nextStatus && received.polls === 1) {
        response.writeHead(nextStatus);
        return response.end();
      }
      const job = jobs.shift();
      if (!job) {
        response.writeHead(204);
        return response.end();
      }
      response.writeHead(200, { 'content-type': 'application/json' });
      return response.end(JSON.stringify(job));
    }
    const match = /^\/scan\/jobs\/([^/]+)\/result$/.exec(request.url);
    if (request.method === 'POST' && match) {
      const chunks = [];
      request.on('data', chunk => chunks.push(chunk));
      request.on('end', () => {
        received.attempts += 1;
        const forced = resultStatuses.shift();
        if (forced) {
          received.rejected = (received.rejected ?? 0) + 1;
          received.bodies = [...(received.bodies ?? []), Buffer.concat(chunks).toString('utf8')];
          response.writeHead(forced, { 'content-type': 'application/json' });
          return response.end('{"error":"forced"}');
        }
        received.results.push({
          id: decodeURIComponent(match[1]),
          type: request.headers['content-type'],
          body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
        });
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end('{"ok":true}');
      });
      return undefined;
    }
    response.writeHead(404);
    return response.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    api: `http://127.0.0.1:${server.address().port}`,
    received,
    close: () => new Promise(resolve => server.close(resolve)),
  };
}

async function runUntilResults(config, options, count) {
  const controller = new AbortController();
  const finished = startWorker(config, { ...options, signal: controller.signal });
  const deadline = Date.now() + 120_000;
  while (options.received.results.length < count && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  controller.abort();
  await finished;
}

test('worker polls, scans the fixture and posts the result', async () => {
  const site = await startFixtureServer();
  const api = await fakeApi({ jobs: [{ id: 'job/42', url: `${site.origin}/`, lang: 'pl' }] });
  try {
    const config = {
      ...loadConfig({
        SCAN_API: api.api,
        SCANNER_TOKEN: 'test-token',
        SCAN_ALLOW_PRIVATE: '1',
        SCAN_MAX_PAGES: '3',
      }),
      pollIntervalMs: 50,
    };
    await runUntilResults(config, { received: api.received }, 1);
    assert.equal(api.received.results.length, 1);
    const [result] = api.received.results;
    assert.equal(result.id, 'job/42');
    assert.match(result.type, /application\/json/);
    assert.equal(result.body.status, 'done');
    assert.ok(result.body.html.startsWith('<!doctype html>'));
    assert.ok(result.body.summary.violations > 0);
    assert.equal(result.body.summary.engine.startsWith('axe-core'), true);
    assert.ok(api.received.auth.every(value => value === 'Bearer test-token'));
    assert.ok(api.received.polls >= 2);
  } finally {
    await api.close();
    await site.close();
  }
});

test('worker reports failed scans and survives a bad poll', async () => {
  const api = await fakeApi({
    jobs: [
      { id: 'a', url: 'http://127.0.0.1:1/', lang: 'pl' },
      { id: 'b', url: 'http://127.0.0.1:1/', lang: 'pl' },
    ],
    nextStatus: 500,
  });
  try {
    const config = {
      ...loadConfig({ SCAN_API: api.api, SCANNER_TOKEN: 'test-token' }),
      pollIntervalMs: 50,
    };
    let calls = 0;
    const scan = async () => {
      calls += 1;
      if (calls === 1) throw new Error('secret internal detail');
      const { ScanFailure } = await import('../src/scan.js');
      throw new ScanFailure('Adres nie może zostać przeskanowany.');
    };
    await runUntilResults(config, { received: api.received, scan }, 2);
    assert.equal(api.received.results.length, 2);
    const [first, second] = api.received.results;
    assert.equal(first.body.status, 'failed');
    assert.equal(first.body.error.includes('secret'), false);
    assert.equal(second.body.status, 'failed');
    assert.equal(second.body.error, 'Adres nie może zostać przeskanowany.');
    assert.equal(first.body.html, '');
    assert.equal(first.body.summary.pages, 0);
  } finally {
    await api.close();
  }
});

test('worker scans one job at a time', async () => {
  const api = await fakeApi({
    jobs: [
      { id: '1', url: 'x', lang: 'pl' },
      { id: '2', url: 'x', lang: 'pl' },
    ],
  });
  try {
    const config = { ...loadConfig({ SCAN_API: api.api, SCANNER_TOKEN: 't' }), pollIntervalMs: 20 };
    let running = 0;
    let peak = 0;
    const scan = async () => {
      running += 1;
      peak = Math.max(peak, running);
      await new Promise(resolve => setTimeout(resolve, 150));
      running -= 1;
      return { summary: { pages: 1 }, html: '<p>x</p>' };
    };
    await runUntilResults(config, { received: api.received, scan }, 2);
    assert.equal(peak, 1);
    assert.equal(
      api.received.results.every(item => item.body.status === 'done'),
      true,
    );
  } finally {
    await api.close();
  }
});

test('worker retries the same result after 5xx answers from the API', async () => {
  const api = await fakeApi({
    jobs: [{ id: 'retry', url: 'x', lang: 'pl' }],
    resultStatuses: [502, 503],
  });
  try {
    const config = {
      ...loadConfig({ SCAN_API: api.api, SCANNER_TOKEN: 't' }),
      pollIntervalMs: 20,
      resultRetryDelaysMs: [10, 10, 10],
    };
    const scan = async () => ({ summary: { pages: 1 }, html: '<p>x</p>' });
    await runUntilResults(config, { received: api.received, scan }, 1);
    assert.equal(api.received.attempts, 3);
    assert.equal(api.received.results.length, 1);
    const [success] = api.received.results;
    assert.equal(success.body.status, 'done');
    assert.deepEqual(
      api.received.bodies.map(text => JSON.parse(text)),
      [success.body, success.body],
    );
  } finally {
    await api.close();
  }
});

test('worker does not retry a 4xx answer and gives up after the last 5xx', async () => {
  const api = await fakeApi({
    jobs: [
      { id: 'bad', url: 'x', lang: 'pl' },
      { id: 'down', url: 'x', lang: 'pl' },
    ],
    resultStatuses: [400, 500, 500, 500, 500],
  });
  try {
    const config = {
      ...loadConfig({ SCAN_API: api.api, SCANNER_TOKEN: 't' }),
      pollIntervalMs: 20,
      resultRetryDelaysMs: [10, 10, 10],
    };
    const scan = async () => ({ summary: { pages: 1 }, html: '<p>x</p>' });
    const controller = new AbortController();
    const finished = startWorker(config, { scan, signal: controller.signal });
    const deadline = Date.now() + 10_000;
    while (api.received.attempts < 5 && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    controller.abort();
    await finished;
    assert.equal(api.received.attempts, 5);
    assert.equal(api.received.results.length, 0);
  } finally {
    await api.close();
  }
});
