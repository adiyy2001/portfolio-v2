import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import zlib from 'node:zlib';
import test, { after, before } from 'node:test';
import { chromium } from 'playwright';
import {
  auditSnapshot,
  runAlfaAudits,
  snapshotForAlfa,
  snapshotWithin,
  summarizeAlfa,
} from '../src/alfa-run.js';
import { levelAaCriteria } from '../src/alfa-summary.js';
import { aggregate } from '../src/aggregate.js';
import { loadConfig } from '../src/config.js';
import { checkPdfs, parseVerapdfReport, selectPdfs } from '../src/pdf-check.js';
import { profilesSection, standardProfiles, withoutPdfLink } from '../src/report/depth.js';
import { buildReport } from '../src/report/index.js';
import { renderReportPdf } from '../src/report/render-pdf.js';
import { runScan } from '../src/scan.js';
import { createFetcher } from '../src/fetcher.js';
import { startFixtureServer } from './fixture-server.js';

const veraOutput = readFileSync(
  new URL('./fixtures/verapdf-ua1-failed.json', import.meta.url),
  'utf8',
);

const axeRule = (id, tags) => ({
  id,
  impact: 'serious',
  help: id,
  helpUrl: '',
  description: id,
  tags,
  nodeCount: 1,
  nodes: [
    { target: 'a', rawTarget: ['a'], html: '<a></a>', failureSummary: '', impact: 'serious' },
  ],
});

const records = rules => [
  {
    url: 'https://example.test/',
    view: 'desktop',
    passes: [{ phase: 'after-consent', violations: rules, incomplete: [] }],
  },
];

test('verapdf json from a real failed run is parsed', () => {
  const parsed = parseVerapdfReport(veraOutput);
  assert.equal(parsed.status, 'checked');
  assert.equal(parsed.passed, false);
  assert.ok(parsed.failedRules > 0);
  assert.ok(parsed.rules.length > 0 && parsed.rules.length <= 5);
  assert.match(parsed.rules[0].clause, /^\d/);
});

test('verapdf output without a validation result is unreadable', () => {
  const output = JSON.stringify({ report: { jobs: [{ taskException: { message: 'x' } }] } });
  assert.equal(parseVerapdfReport(output).status, 'unreadable');
});

test('only same site pdf links are chosen, without duplicates and up to the limit', () => {
  const picked = selectPdfs(
    [
      'https://example.test/a.pdf',
      'https://example.test/a.pdf#page=2',
      'https://other.test/x.pdf',
      'https://example.test/b.pdf',
      'https://example.test/c.pdf',
      'https://example.test/d.pdf',
    ],
    { isSameSite: url => new URL(url).hostname === 'example.test' },
  );
  assert.deepEqual(picked, [
    'https://example.test/a.pdf',
    'https://example.test/b.pdf',
    'https://example.test/c.pdf',
  ]);
});

test('pdf check reports statuses without failing the scan', async () => {
  const bodies = {
    'https://x.test/ok.pdf': { body: Buffer.from('%PDF-1.7 x') },
    'https://x.test/html.pdf': { body: Buffer.from('<html>') },
    'https://x.test/big.pdf': { reason: 'too-large' },
  };
  const results = await checkPdfs(Object.keys(bodies), {
    fetchBytes: async url => bodies[url],
    deadline: Date.now() + 5000,
    validate: async () => veraOutput,
  });
  assert.deepEqual(
    results.map(item => item.status),
    ['checked', 'not-pdf', 'too-large'],
  );
});

test('a missing verapdf binary is reported as unavailable', async () => {
  const results = await checkPdfs(['https://x.test/ok.pdf'], {
    fetchBytes: async () => ({ body: Buffer.from('%PDF-1.7 x') }),
    deadline: Date.now() + 5000,
    command: '/nonexistent/verapdf',
  });
  assert.equal(results[0].status, 'unavailable');
});

test('alfa requirements keep only level A and AA criteria', () => {
  const requirement = chapter => ({ toJSON: () => ({ chapter }) });
  assert.deepEqual(
    levelAaCriteria([
      requirement('2.5.5'),
      requirement('1.1.1'),
      requirement(''),
      requirement('2.5.8'),
    ]),
    ['1.1.1', '2.5.8'],
  );
});

test('a criterion counts as confirmed only when both engines flag the same page', () => {
  const model = aggregate(records([axeRule('image-alt', ['wcag2a', 'wcag111'])]));
  const summary = summarizeAlfa(
    [
      {
        url: 'https://example.test/',
        status: 'ok',
        findings: [{ rule: 'sia-r2', criteria: ['1.1.1'], count: 4 }],
      },
      {
        url: 'https://example.test/kontakt',
        status: 'ok',
        findings: [{ rule: 'sia-r62', criteria: ['1.4.3'], count: 2 }],
      },
      { url: 'https://example.test/big', status: 'too-large', findings: [] },
    ],
    model,
  );
  assert.equal(summary.checked, 2);
  assert.equal(summary.skipped, 1);
  assert.deepEqual([...summary.confirmedIds], ['1.1.1']);
  assert.equal(summary.rows.find(row => row.criterion.id === '1.4.3').confirmed, false);
});

test('a criterion on another page is not confirmed', () => {
  const model = aggregate(records([axeRule('image-alt', ['wcag2a', 'wcag111'])]));
  const summary = summarizeAlfa(
    [
      {
        url: 'https://example.test/kontakt',
        status: 'ok',
        findings: [{ rule: 'sia-r2', criteria: ['1.1.1'], count: 1 }],
      },
    ],
    model,
  );
  assert.equal(summary.confirmedIds.size, 0);
});

test('a slow or failing snapshot gives up without failing the page', async () => {
  const never = () => new Promise(() => {});
  assert.equal(await snapshotWithin({}, 5, never), null);
  assert.equal(await snapshotWithin({}, 1000, async () => Promise.reject(new Error('x'))), null);
  assert.equal(await snapshotWithin({}, 1000, async () => 'ok'), 'ok');
});

test('an audit failure skips the page and keeps the others', async () => {
  const pages = await runAlfaAudits(
    [
      { url: 'a', snapshot: 'bad' },
      { url: 'b', snapshot: null },
      { url: 'c', snapshot: 'good' },
    ],
    {
      deadline: Date.now() + 1000,
      audit: async snapshot => {
        if (snapshot === 'bad') throw new Error('boom');
        return [];
      },
    },
  );
  assert.deepEqual(
    pages.map(page => page.status),
    ['failed', 'too-large', 'ok'],
  );
});

test('standard profiles separate WCAG 2.2 additions and the void parsing clause', () => {
  const model = aggregate(
    records([
      axeRule('image-alt', ['wcag2a', 'wcag111']),
      axeRule('target-size', ['wcag22aa', 'wcag258']),
      axeRule('old-parsing', ['wcag2a', 'wcag411']),
    ]),
  );
  assert.deepEqual(standardProfiles(model), { v3: 2, v4: 2, onlyV4: 1 });
  assert.match(String(profilesSection(model)), /nie ma jej jeszcze\s+w\s+Dzienniku Urzędowym UE/);
});

let browser;
before(async () => {
  browser = await chromium.launch();
});
after(async () => {
  await browser.close();
});

test('alfa runs in a worker on a real page and finds a missing alt', async () => {
  const page = await browser.newPage();
  await page.setContent(
    '<!doctype html><html lang="pl"><title>t</title><img src="data:,x"></html>',
  );
  const findings = await auditSnapshot(await snapshotForAlfa(page));
  await page.close();
  assert.ok(findings.some(finding => finding.criteria.includes('1.1.1')));
});

test('an alfa audit past its time limit is rejected', async () => {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html lang="pl"><title>t</title><p>x</p></html>');
  const snapshot = await snapshotForAlfa(page);
  await page.close();
  await assert.rejects(auditSnapshot(snapshot, { timeoutMs: 1 }), /alfa-timeout/);
});

test('the report renders to a tagged pdf without the web only links', async () => {
  const model = aggregate(records([axeRule('image-alt', ['wcag2a', 'wcag111'])]));
  const html = await buildReport({
    model,
    host: 'example.test',
    siteUrl: 'https://example.test/',
    generatedAt: new Date(),
    engineVersion: '4.14.0',
    pages: [{ url: 'https://example.test/', title: 't', desktop: true, mobile: true }],
    extras: { consent: null, keyboard: null, declaration: null },
    notes: [],
    blocked: 0,
    bookingUrl: 'https://api.example.test/scan/book?src=report',
    fullScanAvailable: true,
    pdfAvailable: true,
  });
  assert.match(html, /href="\?format=pdf"/);
  assert.match(html, /href="\?pelny=1"/);
  const pdf = await renderReportPdf(browser, html);
  assert.equal(pdf.subarray(0, 5).toString('latin1'), '%PDF-');
  assert.match(pdf.toString('latin1'), /StructTreeRoot/);
  assert.doesNotMatch(pdf.toString('latin1'), /format=pdf/);
  assert.match(pdf.toString('latin1'), /scan\/book/);
});

test('a scan with pdf checks fetches the pdf link and a bigger job scans more pages', async () => {
  const server = await startFixtureServer();
  try {
    const config = {
      ...loadConfig({ SCAN_ALLOW_PRIVATE: '1', SCAN_MAX_PAGES: '2' }),
      pdfCheck: true,
      verapdfCommand: new URL('./fixtures/fake-verapdf.sh', import.meta.url).pathname,
    };
    const result = await runScan(
      { id: 'job-pdf', url: `${server.origin}/`, lang: 'pl', maxPages: 4 },
      config,
    );
    assert.ok(server.requests.some(request => request.url.endsWith('.pdf')));
    assert.equal(result.summary.pages, 4);
    assert.match(result.summary.engine, /\+ Alfa$/);
    assert.ok(result.pdf.length > 1000);
    assert.match(result.html, /id="alfa"/);
    assert.match(result.html, /id="normy"/);
  } finally {
    await server.close();
  }
});

test('a job cannot ask for more pages than the full scan limit', async () => {
  const server = await startFixtureServer();
  try {
    const config = { ...loadConfig({ SCAN_ALLOW_PRIVATE: '1' }), pdfCheck: false };
    const result = await runScan(
      { id: 'job-cap', url: `${server.origin}/`, lang: 'pl', maxPages: 500 },
      config,
    );
    assert.doesNotMatch(result.html, /pelny=1/);
  } finally {
    await server.close();
  }
});

test('production compose turns the pdf check on', () => {
  const compose = readFileSync(new URL('../docker-compose.yml', import.meta.url), 'utf8');
  assert.match(compose, /SCAN_PDF_CHECK: '1'/);
});

function bytesServer(routes) {
  return new Promise(resolve => {
    const server = http.createServer((request, response) => {
      const route = routes[request.url];
      if (!route) {
        response.writeHead(404);
        response.end();
        return;
      }
      response.writeHead(route.status ?? 200, route.headers ?? {});
      response.end(route.body);
    });
    server.listen(0, '127.0.0.1', () =>
      resolve({
        origin: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise(done => server.close(done)),
      }),
    );
  });
}

test('fetchBytes stops a compression bomb without buffering it and honours the guard on redirects', async () => {
  const bomb = zlib.gzipSync(Buffer.alloc(400 * 1024 * 1024));
  const server = await bytesServer({
    '/bomb.pdf': { headers: { 'content-encoding': 'gzip' }, body: bomb },
    '/ok.pdf': { body: Buffer.from('%PDF-1.7 ok') },
    '/moved.pdf': { status: 302, headers: { location: '/ok.pdf' } },
    '/forbidden.pdf': { status: 302, headers: { location: '/secret.pdf' } },
    '/secret.pdf': { body: Buffer.from('%PDF-1.7 secret') },
    '/big.pdf': { headers: { 'content-length': '99' }, body: Buffer.alloc(99) },
  });
  const fetcher = await createFetcher({ validator: { check: async () => ({ ok: true }) } });
  try {
    const stopped = await fetcher.fetchBytes(`${server.origin}/bomb.pdf`, {
      maxBytes: 1024 * 1024,
    });
    assert.equal(stopped.reason, 'too-large');
    const moved = await fetcher.fetchBytes(`${server.origin}/moved.pdf`, { maxBytes: 1024 });
    assert.equal(moved.body.toString(), '%PDF-1.7 ok');
    const guard = async url => (url.endsWith('/secret.pdf') ? { kind: 'robots' } : null);
    const blocked = await fetcher.fetchBytes(`${server.origin}/forbidden.pdf`, {
      maxBytes: 1024,
      guard,
    });
    assert.equal(blocked.reason, 'unreachable');
    const big = await fetcher.fetchBytes(`${server.origin}/big.pdf`, { maxBytes: 10 });
    assert.equal(big.reason, 'too-large');
  } finally {
    await fetcher.dispose();
    await server.close();
  }
});

test('a page with too many elements skips alfa before the snapshot', async () => {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><title>t</title>${'<i></i>'.repeat(20_100)}`);
  assert.equal(await snapshotForAlfa(page), null);
  await page.close();
});

test('removing the pdf link leaves the rest of the next steps intact', () => {
  const html =
    '<ul><li class="web-only" data-pdf-link><a href="?format=pdf">PDF</a></li><li class="web-only"><a href="?pelny=1">Pełny</a></li></ul>';
  const stripped = withoutPdfLink(html);
  assert.doesNotMatch(stripped, /format=pdf/);
  assert.match(stripped, /pelny=1/);
});
