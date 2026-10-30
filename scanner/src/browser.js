import { chromium, devices } from 'playwright';
import { AGENT_SUFFIX } from './config.js';

export const VIEWS = {
  desktop: { label: 'Desktop', device: 'Desktop Chrome', viewport: { width: 1280, height: 800 } },
  mobile: { label: 'Mobile', device: 'iPhone 13' },
};

const LOCAL_SCHEMES = new Set(['data:', 'blob:', 'about:']);

export async function launchBrowser({ proxy }) {
  return chromium.launch({
    headless: true,
    proxy: proxy ? { server: proxy } : undefined,
    args: ['--disable-dev-shm-usage'],
  });
}

export async function createViewContext(browser, viewName, validator, navigationGuard = null) {
  const view = VIEWS[viewName];
  const descriptor = { ...devices[view.device] };
  delete descriptor.defaultBrowserType;
  const context = await browser.newContext({
    ...descriptor,
    ...(view.viewport ? { viewport: view.viewport } : {}),
    userAgent: `${descriptor.userAgent} ${AGENT_SUFFIX}`,
    locale: 'pl-PL',
    timezoneId: 'Europe/Warsaw',
    serviceWorkers: 'block',
    acceptDownloads: false,
  });
  const blocked = [];
  const navigationBlocks = new WeakMap();
  await context.route('**/*', async route => {
    const request = route.request();
    const url = request.url();
    let protocol = '';
    try {
      protocol = new URL(url).protocol;
    } catch {
      return route.abort('blockedbyclient');
    }
    if (LOCAL_SCHEMES.has(protocol)) return route.continue();
    if (request.resourceType() === 'media') return route.abort('blockedbyclient');
    const verdict = await validator.check(url);
    if (!verdict.ok) {
      blocked.push({ url, reason: verdict.reason });
      return route.abort('blockedbyclient');
    }
    if (navigationGuard && request.isNavigationRequest() && !request.frame().parentFrame()) {
      const decision = await navigationGuard(url).catch(() => ({ kind: 'guard-error' }));
      if (decision) {
        navigationBlocks.set(request.frame().page(), decision);
        return route.abort('blockedbyclient');
      }
    }
    return route.continue();
  });
  context.blockedRequests = blocked;
  context.navigationBlocks = navigationBlocks;
  return context;
}
