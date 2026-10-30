import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonicalPage,
  isBinaryPath,
  isSameSite,
  pathTemplate,
  priorityRank,
  selectPages,
} from '../src/pages.js';
import { collectSitemapUrls, parseSitemap } from '../src/sitemap.js';

const HOME = 'https://example.com/';

test('path templates collapse numeric and digit slugs', () => {
  assert.equal(pathTemplate('/'), '/');
  assert.equal(pathTemplate('/produkt/123'), '/produkt/*');
  assert.equal(pathTemplate('/produkt/456'), '/produkt/*');
  assert.equal(pathTemplate('/blog/post-2024-10'), '/blog/*');
  assert.equal(pathTemplate('/blog/moj-wpis'), '/blog/moj-wpis');
  assert.equal(pathTemplate('/Kontakt'), '/kontakt');
});

test('same site accepts www and bare domain only', () => {
  assert.equal(isSameSite('https://www.example.com/a', HOME), true);
  assert.equal(isSameSite('https://example.com/a', 'https://www.example.com/'), true);
  assert.equal(isSameSite('https://blog.example.com/a', HOME), false);
  assert.equal(isSameSite('https://other.com/', HOME), false);
});

test('binary files, anchors and foreign schemes are dropped', () => {
  assert.equal(isBinaryPath('/a/katalog.PDF'), true);
  assert.equal(isBinaryPath('/a/foto.jpg'), true);
  assert.equal(isBinaryPath('/a/strona'), false);
  assert.equal(canonicalPage('/a/plik.zip', HOME), null);
  assert.equal(canonicalPage('mailto:a@b.pl', HOME), null);
  assert.equal(canonicalPage('tel:123', HOME), null);
  assert.equal(canonicalPage('/a/b/#sekcja', HOME), 'https://example.com/a/b');
  assert.equal(canonicalPage('/a?x=1', HOME), 'https://example.com/a');
});

test('priority words rank contact before terms before declaration before cart', () => {
  assert.equal(priorityRank('https://example.com/kontakt'), 0);
  assert.equal(priorityRank('https://example.com/contact-us'), 0);
  assert.equal(priorityRank('https://example.com/regulamin'), 1);
  assert.equal(priorityRank('https://example.com/deklaracja-dostepnosci'), 2);
  assert.equal(priorityRank('https://example.com/a11y', 'Deklaracja dostępności'), 2);
  assert.equal(priorityRank('https://example.com/accessibility'), 2);
  assert.equal(priorityRank('https://example.com/koszyk'), 3);
  assert.equal(priorityRank('https://example.com/checkout'), 3);
  assert.equal(priorityRank('https://example.com/o-nas'), null);
});

const navLinks = [
  { url: 'https://example.com/o-nas', text: 'O nas' },
  { url: 'https://example.com/regulamin', text: 'Regulamin' },
  { url: 'https://example.com/produkt/1', text: 'Produkt 1' },
  { url: 'https://example.com/produkt/2', text: 'Produkt 2' },
  { url: 'https://www.example.com/kontakt', text: 'Kontakt' },
  { url: 'https://other.com/x', text: 'Zewnetrzny' },
  { url: 'https://example.com/plik.pdf', text: 'PDF' },
  { url: 'https://example.com/#top', text: 'Góra' },
];
const letters = index =>
  String.fromCharCode(97 + (index % 26)) + String.fromCharCode(97 + Math.floor(index / 26));
const sitemapUrls = Array.from(
  { length: 70 },
  (_, i) => `https://example.com/sekcja-${letters(i)}`,
);

test('selection puts home first, priorities next, one per template', () => {
  const pages = selectPages({ home: HOME, navLinks, sitemapUrls, seed: 'job-1', maxPages: 10 });
  assert.equal(pages[0], 'https://example.com/');
  assert.equal(pages[1], 'https://www.example.com/kontakt');
  assert.equal(pages[2], 'https://example.com/regulamin');
  assert.equal(pages.filter(url => url.includes('/produkt/')).length, 1);
  assert.equal(
    pages.some(url => url.includes('other.com')),
    false,
  );
  assert.equal(
    pages.some(url => url.endsWith('.pdf')),
    false,
  );
  assert.equal(new Set(pages).size, pages.length);
  assert.ok(pages.length <= 10);
  assert.ok(pages.length > 5);
});

test('selection is deterministic for a seed and varies across seeds', () => {
  const run = seed => selectPages({ home: HOME, navLinks, sitemapUrls, seed, maxPages: 10 });
  assert.deepEqual(run('abc'), run('abc'));
  const variants = new Set(['a', 'b', 'c', 'd', 'e', 'f'].map(seed => run(seed).join('|')));
  assert.ok(variants.size > 1);
});

test('selection respects max pages and robots filter', () => {
  const small = selectPages({ home: HOME, navLinks, sitemapUrls, seed: 's', maxPages: 3 });
  assert.equal(small.length, 3);
  const filtered = selectPages({
    home: HOME,
    navLinks,
    sitemapUrls,
    seed: 's',
    maxPages: 10,
    isAllowed: url => !url.includes('regulamin'),
  });
  assert.equal(
    filtered.some(url => url.includes('regulamin')),
    false,
  );
  assert.deepEqual(selectPages({ home: HOME, seed: 'x', maxPages: 1, navLinks }), [HOME]);
});

test('random sample reserves a tenth of the budget and fills gaps', () => {
  const withNav = selectPages({ home: HOME, navLinks, sitemapUrls, seed: 'q', maxPages: 10 });
  assert.equal(withNav.length, 10);
  assert.equal(withNav.filter(url => url.includes('/sekcja-')).length, 5);
  const tight = selectPages({ home: HOME, navLinks, sitemapUrls, seed: 'q', maxPages: 5 });
  assert.equal(tight.filter(url => url.includes('/sekcja-')).length, 1);
  const noNav = selectPages({ home: HOME, navLinks: [], sitemapUrls, seed: 'q', maxPages: 10 });
  assert.equal(noNav.length, 10);
});

test('sitemap parser handles urlset, index, cdata and entities', () => {
  const urlset = parseSitemap(
    '<urlset><url><loc>https://example.com/a?x=1&amp;y=2</loc></url><url><loc><![CDATA[https://example.com/b]]></loc></url></urlset>',
  );
  assert.equal(urlset.isIndex, false);
  assert.deepEqual(urlset.locs, ['https://example.com/a?x=1&y=2', 'https://example.com/b']);
  const index = parseSitemap(
    '<sitemapindex><sitemap><loc>https://example.com/s1.xml</loc></sitemap></sitemapindex>',
  );
  assert.equal(index.isIndex, true);
});

test('sitemap collection follows indexes, filters hosts and caps at 2000', async () => {
  const files = {
    'https://example.com/index.xml':
      '<sitemapindex><sitemap><loc>https://example.com/s1.xml</loc></sitemap><sitemap><loc>https://example.com/s2.xml</loc></sitemap></sitemapindex>',
    'https://example.com/s1.xml': `<urlset>${Array.from({ length: 1500 }, (_, i) => `<url><loc>https://example.com/a${i}</loc></url>`).join('')}</urlset>`,
    'https://example.com/s2.xml': `<urlset>${Array.from({ length: 1500 }, (_, i) => `<url><loc>https://example.com/b${i}</loc></url>`).join('')}<url><loc>https://evil.com/x</loc></url></urlset>`,
  };
  const urls = await collectSitemapUrls(['https://example.com/index.xml'], {
    fetchText: async url =>
      files[url] ? { status: 200, text: files[url] } : { status: 404, text: '' },
    isSameSite: loc => isSameSite(loc, HOME),
  });
  assert.equal(urls.length, 2000);
  assert.equal(
    urls.some(url => url.includes('evil.com')),
    false,
  );
});

test('sitemap collection survives failures', async () => {
  const urls = await collectSitemapUrls(['https://example.com/missing.xml'], {
    fetchText: async () => null,
    isSameSite: () => true,
  });
  assert.deepEqual(urls, []);
});
