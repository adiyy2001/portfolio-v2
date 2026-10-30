import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import test, { after, before } from 'node:test';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { loadConfig } from '../src/config.js';
import { runScan, ScanFailure } from '../src/scan.js';
import { startFixtureServer } from './fixture-server.js';

let server;
let config;
let fullScan;
let scanMs;
let trapScan;

const flat = text => text.replace(/\s+/g, ' ');

before(async () => {
  server = await startFixtureServer();
  config = loadConfig({ SCAN_ALLOW_PRIVATE: '1', SCAN_MAX_PAGES: '10' });
  const started = Date.now();
  fullScan = await runScan({ id: 'job-fixture', url: `${server.origin}/`, lang: 'pl' }, config);
  scanMs = Date.now() - started;
  trapScan = await runScan(
    { id: 'job-trap', url: `${server.origin}/trap/`, lang: 'pl' },
    loadConfig({ SCAN_ALLOW_PRIVATE: '1', SCAN_MAX_PAGES: '2' }),
  );
  if (process.env.SAMPLE_REPORT) writeFileSync(process.env.SAMPLE_REPORT, fullScan.html);
});

after(async () => {
  await server.close();
});

test('full scan of the fixture finishes within the task limit', () => {
  assert.equal(fullScan.status, 'done');
  assert.ok(scanMs < config.taskLimitMs, `scan took ${scanMs} ms`);
  console.log(`fixture scan took ${scanMs} ms`, JSON.stringify(fullScan.summary));
});

test('summary matches the worker contract', () => {
  const keys = Object.keys(fullScan.summary).sort();
  assert.deepEqual(keys, [
    'critical',
    'engine',
    'incomplete',
    'minor',
    'moderate',
    'pages',
    'serious',
    'violations',
  ]);
  assert.match(fullScan.summary.engine, /^axe-core 4\.14\./);
  assert.ok(fullScan.summary.pages >= 5 && fullScan.summary.pages <= 10);
  assert.ok(fullScan.summary.violations >= 4);
  assert.ok(fullScan.summary.critical >= 1);
});

test('report lists the expected criteria and EN 301 549 clauses', () => {
  const output = flat(fullScan.html);
  for (const expected of [
    '1.4.3 Kontrast (minimum)',
    '1.1.1 Treść nietekstowa',
    '4.1.2 Nazwa, rola, wartość',
    '2.5.8 Rozmiar celu (minimum)',
    '9.1.4.3',
    '9.1.1.1',
    'WCAG 2.2, EN 301 549 V4.1.1',
    'Za niski kontrast tekstu',
    'Obraz bez tekstu alternatywnego',
    'Pole formularza bez etykiety',
  ]) {
    assert.ok(output.includes(expected), expected);
  }
  assert.match(output, /Znaleziono \d+ potwierdzon\S+ \S+ na \d+ podstron\S+, w tym \d+ krytyczn/);
});

test('report shows element screenshots, at most eight', () => {
  const images = flat(fullScan.html).match(/<img src="data:image\/png;base64,/g) ?? [];
  assert.ok(images.length >= 1 && images.length <= 8, `images ${images.length}`);
});

test('cookie banner is handled in two passes on the home page', () => {
  assert.ok(flat(fullScan.html).includes('wykryto baner cookies'));
  assert.ok(flat(fullScan.html).includes('Widoczny tylko przed zaakceptowaniem banera cookies.'));
});

test('accessibility declaration is found and missing ids are reported', () => {
  const output = flat(fullScan.html);
  assert.ok(output.includes('Znaleziono link do deklaracji dostępności'));
  assert.ok(output.includes('brakuje elementów o identyfikatorach: a11y-data-aktualizacja'));
});

test('keyboard test sees the skip link and no trap on the home page', () => {
  assert.ok(flat(fullScan.html).includes('Pierwszy Tab trafia w link pomijania nawigacji.'));
  assert.ok(flat(fullScan.html).includes('Nie wykryto pułapki na klawiaturę'));
});

test('keyboard trap fixture is flagged', () => {
  assert.equal(trapScan.status, 'done');
  assert.ok(flat(trapScan.html).includes('To może być pułapka na klawiaturę'));
});

test('robots.txt and sitemap rules are respected and our user agent is sent', () => {
  const paths = server.requests.map(request => request.url);
  assert.equal(
    paths.some(path => path.startsWith('/private')),
    false,
  );
  assert.equal(
    paths.some(path => path.endsWith('.pdf')),
    false,
  );
  assert.ok(paths.includes('/robots.txt'));
  assert.ok(paths.includes('/sitemap.xml'));
  const pageRequests = server.requests.filter(request => request.url === '/kontakt');
  assert.ok(pageRequests.length >= 2);
  for (const request of pageRequests) {
    assert.match(
      request.userAgent,
      /AdrianTurbinskiA11yScanner \(\+https:\/\/adrianturbinski\.pl\/skaner\/\)/,
    );
  }
  assert.ok(server.requests.some(request => /iPhone/.test(request.userAgent)));
});

test('the report itself has no axe violations on desktop and mobile', async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 320, height: 568 },
    ]) {
      for (const [name, output] of [
        ['fixture', fullScan.html],
        ['trap', trapScan.html],
      ]) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        await page.setContent(output, { waitUntil: 'load' });
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .options({ rules: { 'target-size': { enabled: true } } })
          .analyze();
        const summary = results.violations.map(
          item => `${item.id}: ${item.nodes.map(node => node.target.join(' ')).join(', ')}`,
        );
        assert.deepEqual(summary, [], `${name} ${viewport.width}`);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        assert.ok(overflow <= 1, `${name} ${viewport.width} overflow ${overflow}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test('scan fails when robots.txt forbids our agent', async () => {
  const blocked = await startFixtureServer({
    robots: { body: 'User-agent: AdrianTurbinskiA11yScanner\nDisallow: /\n' },
  });
  try {
    await assert.rejects(
      runScan({ id: 'j', url: `${blocked.origin}/` }, config),
      error => error instanceof ScanFailure && /robots\.txt/.test(error.message),
    );
    assert.equal(
      blocked.requests.some(request => request.url === '/'),
      false,
    );
  } finally {
    await blocked.close();
  }
});

test('scan fails when robots.txt answers with a server error', async () => {
  const broken = await startFixtureServer({ robots: { status: 503 } });
  try {
    await assert.rejects(runScan({ id: 'j', url: `${broken.origin}/` }, config), ScanFailure);
  } finally {
    await broken.close();
  }
});

test('scan refuses loopback targets without the test flag', async () => {
  const strict = loadConfig({});
  await assert.rejects(
    runScan({ id: 'j', url: `${server.origin}/` }, strict),
    error => error instanceof ScanFailure && /private-address|port/.test(error.message),
  );
  await assert.rejects(runScan({ id: 'j', url: 'http://169.254.169.254/' }, strict), ScanFailure);
  await assert.rejects(runScan({ id: 'j', url: 'file:///etc/passwd' }, strict), ScanFailure);
});

test('max pages limit is applied', async () => {
  const limited = await runScan(
    { id: 'job-limit', url: `${server.origin}/` },
    loadConfig({ SCAN_ALLOW_PRIVATE: '1', SCAN_MAX_PAGES: '3' }),
  );
  assert.ok(limited.summary.pages <= 3);
});

const siteConfig = loadConfig({ SCAN_ALLOW_PRIVATE: '1', SCAN_MAX_PAGES: '10' });
const foreignHost = origin => new URL(origin).hostname;

test('home page redirecting to another domain fails the job without scanning it', async () => {
  const foreign = await startFixtureServer();
  const foreignOrigin = foreign.origin.replace('127.0.0.1', 'localhost');
  const redirecting = await startFixtureServer({ redirects: { '/': `${foreignOrigin}/` } });
  try {
    await assert.rejects(
      runScan({ id: 'j', url: `${redirecting.origin}/` }, siteConfig),
      error =>
        error instanceof ScanFailure &&
        error.message ===
          `Strona przekierowuje na inną domenę (${foreignHost(foreignOrigin)}). Zleć skan tej domeny.`,
    );
    assert.deepEqual(foreign.requests, []);
  } finally {
    await redirecting.close();
    await foreign.close();
  }
});

test('home page redirecting inside the same site is still scanned', async () => {
  const target = await startFixtureServer();
  const redirecting = await startFixtureServer({ redirects: { '/': `${target.origin}/` } });
  try {
    const result = await runScan({ id: 'j', url: `${redirecting.origin}/` }, siteConfig);
    assert.equal(result.status, 'done');
    assert.ok(target.requests.some(request => request.url === '/'));
    assert.ok(result.summary.pages >= 1);
  } finally {
    await redirecting.close();
    await target.close();
  }
});

test('home page redirecting to a path blocked by robots.txt fails the job', async () => {
  const redirecting = await startFixtureServer({ redirects: { '/': '/private/start' } });
  try {
    await assert.rejects(
      runScan({ id: 'j', url: `${redirecting.origin}/` }, siteConfig),
      error => error instanceof ScanFailure && /robots\.txt/.test(error.message),
    );
    assert.equal(
      redirecting.requests.some(request => request.url === '/private/start'),
      false,
    );
  } finally {
    await redirecting.close();
  }
});

test('subpage redirected to a forbidden path is skipped before it is requested', async () => {
  const redirecting = await startFixtureServer({ redirects: { '/o-nas': '/private/cel' } });
  try {
    const result = await runScan({ id: 'j', url: `${redirecting.origin}/` }, siteConfig);
    assert.equal(result.status, 'done');
    assert.equal(
      redirecting.requests.some(request => request.url.startsWith('/private')),
      false,
    );
    const output = flat(result.html);
    assert.ok(output.includes('pominięta: robots.txt'));
    assert.equal(output.includes('Tajna strona'), false);
    assert.equal(output.includes('/private/cel'), false);
  } finally {
    await redirecting.close();
  }
});

test('subpage redirected to another origin of the site uses that origin robots.txt', async () => {
  const other = await startFixtureServer({
    robots: { body: 'User-agent: *\nDisallow: /zakazane\n' },
  });
  const redirecting = await startFixtureServer({
    redirects: {
      '/o-nas': `${other.origin}/zakazane/x`,
      '/regulamin': `${other.origin}/regulamin`,
    },
  });
  try {
    const result = await runScan({ id: 'j', url: `${redirecting.origin}/` }, siteConfig);
    assert.equal(result.status, 'done');
    assert.ok(other.requests.some(request => request.url === '/robots.txt'));
    assert.equal(
      other.requests.some(request => request.url.startsWith('/zakazane')),
      false,
    );
    assert.ok(other.requests.some(request => request.url === '/regulamin'));
    const output = flat(result.html);
    assert.ok(output.includes('pominięta: robots.txt'));
    assert.equal(output.includes('Tajna strona'), false);
  } finally {
    await redirecting.close();
    await other.close();
  }
});
