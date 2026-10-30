import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import { createViewContext, launchBrowser } from '../src/browser.js';
import { createUrlValidator } from '../src/ssrf.js';
import { startFixtureServer } from './fixture-server.js';

let browser;
let server;

before(async () => {
  browser = await launchBrowser({ proxy: '' });
  server = await startFixtureServer();
});

after(async () => {
  await browser.close();
  await server.close();
});

test('requests to hosts that fail validation are aborted', async () => {
  const validator = createUrlValidator({
    lookup: async host =>
      host === 'internal.test'
        ? [{ address: '10.0.0.5', family: 4 }]
        : [{ address: '93.184.216.34', family: 4 }],
  });
  const context = await createViewContext(browser, 'desktop', validator);
  const page = await context.newPage();
  await assert.rejects(
    page.goto('http://internal.test/', { timeout: 5000 }),
    /ERR_BLOCKED_BY_CLIENT/,
  );
  assert.ok(context.blockedRequests.some(item => item.url.startsWith('http://internal.test')));
  await context.close();
});

test('navigation to a loopback server is blocked before any request reaches it', async () => {
  const validator = createUrlValidator({
    lookup: async () => [{ address: '93.184.216.34', family: 4 }],
  });
  const context = await createViewContext(browser, 'desktop', validator);
  const page = await context.newPage();
  await assert.rejects(page.goto(`${server.origin}/`, { timeout: 5000 }));
  assert.equal(server.requests.length, 0);
  assert.ok(context.blockedRequests.length >= 1);
  await context.close();
});

test('contexts use the scanner user agent, polish locale and the two views', async () => {
  const validator = createUrlValidator({ allowPrivate: true });
  const desktop = await createViewContext(browser, 'desktop', validator);
  const mobile = await createViewContext(browser, 'mobile', validator);
  const desktopPage = await desktop.newPage();
  const mobilePage = await mobile.newPage();
  await desktopPage.goto(`${server.origin}/o-nas`);
  await mobilePage.goto(`${server.origin}/o-nas`);
  const read = page =>
    page.evaluate(() => ({
      ua: navigator.userAgent,
      language: navigator.language,
      width: window.innerWidth,
      touch: navigator.maxTouchPoints > 0,
    }));
  const desktopInfo = await read(desktopPage);
  const mobileInfo = await read(mobilePage);
  assert.match(
    desktopInfo.ua,
    /AdrianTurbinskiA11yScanner \(\+https:\/\/adrianturbinski\.pl\/skaner\/\)$/,
  );
  assert.match(mobileInfo.ua, /iPhone.*AdrianTurbinskiA11yScanner/);
  assert.equal(desktopInfo.language, 'pl-PL');
  assert.equal(desktopInfo.width, 1280);
  assert.equal(mobileInfo.touch, true);
  assert.ok(mobileInfo.width < 500);
  await desktop.close();
  await mobile.close();
});
