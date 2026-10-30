import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { aggregate } from '../src/aggregate.js';
import { escapeHtml, markup, plural, raw, safeBase64 } from '../src/report/escape.js';
import { buildReport } from '../src/report/index.js';

const evil = {
  target: '"><script>alert(1)</script>',
  html: '<img src=x onerror=alert(2)>',
  title: '<svg onload=alert(3)>',
};

function maliciousRecords() {
  const rule = (id, impact, tags) => ({
    id,
    impact,
    help: `<b>${id}</b>`,
    helpUrl: 'javascript:alert(4)',
    description: '<i>opis</i>',
    tags,
    nodeCount: 1,
    nodes: [
      {
        target: evil.target,
        rawTarget: [evil.target],
        html: evil.html,
        failureSummary: '<u>x</u>',
        impact,
      },
    ],
  });
  return [
    {
      url: 'https://example.com/?q=<script>',
      view: 'desktop',
      title: evil.title,
      passes: [
        {
          phase: 'after-consent',
          violations: [
            rule('image-alt', 'critical', ['wcag2a', 'wcag111']),
            rule('unknown-evil-rule', 'serious', ['wcag2aa', 'wcag143']),
            rule('region', 'moderate', ['best-practice']),
          ],
          incomplete: [rule('color-contrast', 'serious', ['wcag2aa', 'wcag143'])],
        },
      ],
    },
  ];
}

function consentFile(disclaimer) {
  const directory = mkdtempSync(join(tmpdir(), 'consent-'));
  const path = join(directory, 'consent.json');
  writeFileSync(path, JSON.stringify({ version: 't', pl: { disclaimer } }));
  return path;
}

const flat = text => text.replace(/\s+/g, ' ');

async function renderEvil(disclaimer = 'Zastrzeżenie testowe <b>x</b>.') {
  const model = aggregate(maliciousRecords(), [
    {
      ruleId: 'image-alt',
      target: evil.target,
      pageUrl: 'https://example.com/',
      image: '"><script>alert(5)</script>',
    },
  ]);
  return buildReport({
    model,
    host: 'example.com<script>',
    siteUrl: 'https://example.com/',
    generatedAt: new Date('2026-10-30T10:00:00Z'),
    engineVersion: '4.14.0',
    pages: [
      {
        url: 'https://example.com/?q=<script>',
        title: evil.title,
        desktop: true,
        mobile: true,
        error: null,
        reflow: { overflow: true, scrollWidth: 400, clientWidth: 320, offenders: ['<x>'] },
      },
    ],
    extras: {
      consent: { accepted: true, method: 'autoconsent', cmp: '<cmp>' },
      keyboard: {
        tabsPressed: 3,
        skipLink: false,
        trap: true,
        focusChecked: 1,
        invisibleFocus: [{ tag: 'a', text: evil.html }],
      },
      declaration: { found: true, url: evil.target, missing: ['a11y-status'], checked: true },
    },
    notes: ['<script>note</script>'],
    consentFile: consentFile(disclaimer),
  });
}

test('escapeHtml neutralises markup characters', () => {
  assert.equal(
    escapeHtml(`<a href="x">'&'</a>`),
    '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
  );
  assert.equal(escapeHtml(null), '');
});

test('markup template escapes values, keeps raw and nested templates', () => {
  const value = '<b>';
  assert.equal(markup`<p>${value}</p>`.toString(), '<p>&lt;b&gt;</p>');
  assert.equal(markup`<p>${raw('<b>')}</p>`.toString(), '<p><b></p>');
  const nested = ['<1>', markup`<li>2</li>`];
  assert.equal(markup`<ul>${nested}</ul>`.toString(), '<ul>&lt;1&gt;<li>2</li></ul>');
  assert.equal(markup`${false}${null}${undefined}`.toString(), '');
});

test('plural follows polish rules', () => {
  const forms = n => plural(n, 'błąd', 'błędy', 'błędów');
  assert.deepEqual([1, 2, 4, 5, 12, 14, 22, 25, 112].map(forms), [
    'błąd',
    'błędy',
    'błędy',
    'błędów',
    'błędów',
    'błędów',
    'błędy',
    'błędów',
    'błędów',
  ]);
});

test('base64 guard only accepts base64 text', () => {
  assert.equal(safeBase64('iVBORw0KGgo='), 'iVBORw0KGgo=');
  assert.equal(safeBase64('"><script>'), '');
});

test('report escapes everything that comes from scanned pages', async () => {
  const output = await renderEvil();
  assert.equal(output.includes('<script>'), false);
  assert.equal(/<script[\s>]/i.test(output), false);
  assert.equal(output.includes('<img src=x'), false);
  assert.equal(/<svg\s+onload/i.test(output), false);
  assert.equal(/onerror\s*=/i.test(output.replace(/&lt;[^]*?&gt;/g, '')), false);
  assert.ok(output.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(output.includes('&lt;img src=x onerror=alert(2)&gt;'));
  assert.equal(output.includes('javascript:'), false);
  assert.equal(/<img[^>]+data:image/.test(output), false);
});

test('report is a single self contained file without scripts', async () => {
  const output = await renderEvil();
  assert.match(output, /<html lang="pl">/);
  assert.equal(/<script/i.test(output), false);
  assert.equal(/<link[^>]+stylesheet/i.test(output), false);
  assert.equal(/src="https?:/i.test(output), false);
  assert.match(output, /@media print/);
  assert.match(output, /#f6f3ee/);
  assert.match(output, /#5a1424/);
  assert.match(output, /#e9eff6/);
});

test('report states counts, has no score and avoids compliance verdict words', async () => {
  const output = flat(await renderEvil('Zastrzeżenie testowe bez ocen.'));
  assert.match(output, /Znaleziono 2 potwierdzone błędy na 1 podstronie, w tym 1 krytyczny\./);
  assert.equal(/zgodn/i.test(output), false);
  assert.equal(/wynik punktowy|\d+\s*\/\s*100|punkt(ów|y)\b/i.test(output), false);
  assert.match(output, /contact@adrianturbinski\.pl/);
  assert.match(output, /Dz\.U\. 2024 poz\. 731/);
  assert.match(output, /art\. 4 pkt 1/);
  assert.match(output, /EN 301 549 V3\.2\.1/);
  assert.equal(/\d\s*(zł|PLN|EUR)|\bkar[aęy]\b|mandat/i.test(output), false);
});

test('report contains all required sections', async () => {
  const output = await renderEvil();
  for (const heading of [
    'Podsumowanie',
    'Trzy najważniejsze problemy',
    'Pełna lista błędów według kryteriów',
    'Do sprawdzenia ręcznie',
    'Zalecenia',
    'Deklaracja dostępności',
    'Czego ten skan nie sprawdził',
    'Kontekst prawny',
    'Zakres: sprawdzone podstrony',
  ]) {
    assert.ok(output.includes(`>${heading}</h2>`), heading);
  }
});

test('report embeds the disclaimer from the consent file at build time', async () => {
  const output = await renderEvil('Unikalne zastrzeżenie 7f3a.');
  assert.ok(output.includes('Unikalne zastrzeżenie 7f3a.'));
});

test('report with no findings still renders a calm summary', async () => {
  const model = aggregate([]);
  const output = await buildReport({
    model,
    host: 'example.com',
    siteUrl: 'https://example.com/',
    generatedAt: new Date(),
    engineVersion: '4.14.0',
    pages: [
      {
        url: 'https://example.com/',
        title: 'x',
        desktop: true,
        mobile: true,
        error: null,
        reflow: null,
      },
    ],
    extras: { consent: null, keyboard: null, declaration: null },
    consentFile: consentFile('x'),
  });
  assert.match(output, /nie znalazł potwierdzonych błędów/);
});
