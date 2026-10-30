import { fileURLToPath } from 'node:url';
import { loadConfig } from './config.js';
import { startWorker } from './worker.js';

export async function main(env = process.env) {
  const config = loadConfig(env);
  if (!config.token) {
    console.error('SCANNER_TOKEN is required');
    process.exitCode = 1;
    return;
  }
  if (config.allowPrivate) console.warn('SCAN_ALLOW_PRIVATE is set, private addresses are allowed');
  const controller = new AbortController();
  const stop = () => controller.abort();
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  const log = message => console.log(`${new Date().toISOString()} ${message}`);
  log(
    `worker started, api ${config.api}, proxy ${config.proxy || 'none'}, max pages ${config.maxPages}`,
  );
  await startWorker(config, { signal: controller.signal, log });
  log('worker stopped');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
