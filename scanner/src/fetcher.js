import zlib from 'node:zlib';
import { request } from 'playwright';
import { ProxyAgent, fetch as undiciFetch } from 'undici';
import { AGENT_SUFFIX } from './config.js';

const MAX_REDIRECTS = 5;
const MAX_BODY_BYTES = 20 * 1024 * 1024;

export async function createFetcher({ proxy, validator, timeoutMs = 10_000 }) {
  const context = await request.newContext({
    userAgent: AGENT_SUFFIX,
    proxy: proxy ? { server: proxy } : undefined,
    extraHTTPHeaders: { 'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.5' },
  });

  async function fetchText(startUrl, { deadline = Date.now() + timeoutMs } = {}) {
    let target = startUrl;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      const verdict = await validator.check(target);
      if (!verdict.ok) return null;
      const remaining = deadline - Date.now();
      if (remaining <= 0) return null;
      let response;
      try {
        response = await context.get(target, {
          maxRedirects: 0,
          timeout: remaining,
          failOnStatusCode: false,
        });
      } catch {
        return null;
      }
      const status = response.status();
      if (status >= 300 && status < 400) {
        const location = response.headers().location;
        if (!location) return { status, text: '', url: target };
        target = new URL(location, target).toString();
        continue;
      }
      const length = Number(response.headers()['content-length'] || 0);
      if (length > MAX_BODY_BYTES) return { status, text: '', url: target };
      let body = await response.body().catch(() => Buffer.alloc(0));
      if (body.length > MAX_BODY_BYTES) return { status, text: '', url: target };
      if (body.length > 2 && body[0] === 0x1f && body[1] === 0x8b) {
        try {
          body = zlib.gunzipSync(body, { maxOutputLength: MAX_BODY_BYTES });
        } catch {
          return { status, text: '', url: target };
        }
      }
      return { status, text: body.toString('utf8'), url: target };
    }
    return null;
  }

  async function resolveRedirects(startUrl, { guard, deadline = Date.now() + timeoutMs } = {}) {
    let target = startUrl;
    for (let hop = 0; hop < MAX_REDIRECTS; hop += 1) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) return { url: target };
      let response;
      try {
        response = await context.head(target, {
          maxRedirects: 0,
          timeout: remaining,
          failOnStatusCode: false,
        });
      } catch {
        return { url: target };
      }
      const status = response.status();
      const location = response.headers().location;
      if (status < 300 || status >= 400 || !location) return { url: target };
      let next;
      try {
        next = new URL(location, target).href;
      } catch {
        return { url: target };
      }
      if (!(await validator.check(next)).ok) return { url: next, block: { kind: 'unsafe' } };
      const block = await guard?.(next);
      if (block) return { url: next, block };
      target = next;
    }
    return { url: target };
  }

  async function postJson(url, data, { timeoutMs: postTimeout = 60_000, headers = {} } = {}) {
    return context.post(url, { data, headers, timeout: postTimeout, failOnStatusCode: false });
  }

  async function get(url, { headers = {}, timeoutMs: getTimeout = 30_000 } = {}) {
    return context.get(url, { headers, timeout: getTimeout, failOnStatusCode: false });
  }

  const dispatcher = proxy ? new ProxyAgent(proxy) : undefined;

  async function readLimited(response, maxBytes) {
    const chunks = [];
    let total = 0;
    for await (const chunk of response.body ?? []) {
      total += chunk.length;
      if (total > maxBytes) return null;
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async function fetchBytes(startUrl, { maxBytes, guard, deadline = Date.now() + timeoutMs }) {
    let target = startUrl;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      if (!(await validator.check(target)).ok) return { reason: 'unreachable' };
      if (hop > 0 && (await guard?.(target))) return { reason: 'unreachable' };
      const remaining = deadline - Date.now();
      if (remaining <= 0) return { reason: 'out-of-time' };
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), remaining);
      try {
        const response = await undiciFetch(target, {
          dispatcher,
          redirect: 'manual',
          signal: controller.signal,
          headers: { 'User-Agent': AGENT_SUFFIX },
        });
        const location = response.headers.get('location');
        if (response.status >= 300 && response.status < 400 && location) {
          await response.body?.cancel().catch(() => {});
          target = new URL(location, target).toString();
          continue;
        }
        if (response.status !== 200) {
          await response.body?.cancel().catch(() => {});
          return { reason: 'unreachable' };
        }
        if (Number(response.headers.get('content-length') || 0) > maxBytes) {
          controller.abort();
          return { reason: 'too-large' };
        }
        const body = await readLimited(response, maxBytes);
        return body ? { body, url: target } : { reason: 'too-large' };
      } catch {
        return { reason: 'unreachable' };
      } finally {
        clearTimeout(timer);
      }
    }
    return { reason: 'unreachable' };
  }

  async function postBinary(url, body, { timeoutMs: postTimeout = 60_000, headers = {} } = {}) {
    return context.post(url, {
      data: body,
      headers,
      timeout: postTimeout,
      failOnStatusCode: false,
    });
  }

  return {
    fetchText,
    fetchBytes,
    resolveRedirects,
    postJson,
    postBinary,
    get,
    dispose: async () => {
      await dispatcher?.close().catch(() => {});
      await context.dispose();
    },
  };
}
