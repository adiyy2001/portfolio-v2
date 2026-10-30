import axe from 'axe-core';
import { RESULT_RETRY_DELAYS_MS } from './config.js';
import { createFetcher } from './fetcher.js';
import { runScan, ScanFailure } from './scan.js';
import { createUrlValidator } from './ssrf.js';

function sleep(ms, signal) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

export function emptySummary() {
  return {
    pages: 0,
    violations: 0,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    incomplete: 0,
    engine: `axe-core ${axe.version}`,
  };
}

export async function startWorker(config, { scan = runScan, signal, log = () => {} } = {}) {
  const client = await createFetcher({
    proxy: config.proxy,
    validator: createUrlValidator({ allowPrivate: true }),
  });
  const headers = { Authorization: `Bearer ${config.token}` };

  async function nextJob() {
    try {
      const response = await client.get(`${config.api}/scan/jobs/next`, { headers });
      if (response.status() === 200) return await response.json();
      if (response.status() !== 204) log(`jobs/next returned ${response.status()}`);
    } catch (error) {
      log(`jobs/next failed: ${error.message}`);
    }
    return null;
  }

  async function sendResult(job, body) {
    const url = `${config.api}/scan/jobs/${encodeURIComponent(job.id)}/result`;
    const delays = config.resultRetryDelaysMs ?? RESULT_RETRY_DELAYS_MS;
    for (let attempt = 1; attempt <= delays.length + 1; attempt += 1) {
      let retryable = true;
      try {
        const response = await client.postJson(url, body, { headers });
        if (response.ok()) return true;
        retryable = response.status() >= 500;
        log(`result post returned ${response.status()} (attempt ${attempt})`);
      } catch (error) {
        log(`result post failed (attempt ${attempt}): ${error.message}`);
      }
      if (!retryable || attempt > delays.length || signal?.aborted) return false;
      await sleep(delays[attempt - 1], signal);
    }
    return false;
  }

  async function handle(job) {
    let body;
    try {
      const result = await scan(job, config, { log });
      body = { status: 'done', summary: result.summary, html: result.html };
    } catch (error) {
      const known = error instanceof ScanFailure;
      log(`scan ${job.id} failed: ${error.message}`);
      body = {
        status: 'failed',
        error: known ? error.message : 'Skan nie powiódł się z powodu błędu technicznego.',
        summary: emptySummary(),
        html: '',
      };
    }
    return sendResult(job, body);
  }

  try {
    while (!signal?.aborted) {
      const job = await nextJob();
      if (job) {
        await handle(job);
        continue;
      }
      await sleep(config.pollIntervalMs, signal);
    }
  } finally {
    await client.dispose().catch(() => {});
  }
}
