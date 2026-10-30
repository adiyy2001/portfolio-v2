export const AGENT_TOKEN = 'AdrianTurbinskiA11yScanner';
export const AGENT_SUFFIX = `${AGENT_TOKEN} (+https://adrianturbinski.pl/skaner/)`;
export const TASK_LIMIT_MS = 6 * 60 * 1000;
export const PAGE_LIMIT_MS = 60 * 1000;
export const GOTO_TIMEOUT_MS = 20 * 1000;
export const POLL_INTERVAL_MS = 10 * 1000;
export const RESULT_RETRY_DELAYS_MS = [5 * 1000, 30 * 1000, 2 * 60 * 1000];

export function loadConfig(env = process.env) {
  const maxPages = Number.parseInt(env.SCAN_MAX_PAGES ?? '', 10);
  return {
    api: (env.SCAN_API || 'https://api.adrianturbinski.pl').replace(/\/+$/, ''),
    token: env.SCANNER_TOKEN || '',
    proxy: env.SCAN_PROXY || '',
    maxPages: Number.isFinite(maxPages) && maxPages > 0 ? maxPages : 10,
    allowPrivate: env.SCAN_ALLOW_PRIVATE === '1',
    consentFile: env.CONSENT_FILE || '',
    taskLimitMs: TASK_LIMIT_MS,
    pageLimitMs: PAGE_LIMIT_MS,
    pollIntervalMs: POLL_INTERVAL_MS,
    resultRetryDelaysMs: RESULT_RETRY_DELAYS_MS,
  };
}
