#!/usr/bin/env node
// Fails the deploy when a public page lacks the tags a shared link or a search result needs.
// Run after the build, once sites/dist has been copied to public/wzornik:
//   node scripts/check-seo-tags.mjs [public]
import { readdirSync, readFileSync, existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.argv[2] ?? 'public';
const siteUrl = 'https://adrianturbinski.pl';

// HTML files that may skip the checks, each with the reason. Only .html files are scanned, so
// the Wzornik PDF and ZIP downloads need no entry. An entry with noindex: true only covers pages
// that really carry <meta name="robots" content="noindex">: once such a page becomes indexable
// it has to get the tags. An entry that matches no file fails the check too, so the list cannot
// quietly outgrow the site.
const exceptions = [
  { match: '404.html', reason: 'not found page', noindex: true },
  { match: '404/index.html', reason: 'not found page', noindex: true },
  { match: '_gatsby/slices/_gatsby-scripts-1.html', reason: 'Gatsby script slice, not a page' },
  { match: 'dla-klienta/index.html', reason: 'moved, redirects to the home page', noindex: true },
  { match: 'en/for-clients/index.html', reason: 'moved, redirects to /en/', noindex: true },
  { match: 'wycena/wyslano/index.html', reason: 'thank-you page after the form', noindex: true },
  { match: 'en/quote/sent/index.html', reason: 'thank-you page after the form', noindex: true },
  {
    match: /^wzornik\/identyfikacja\/[^/]+\/email\/[^/]+-email-signature\.html$/,
    reason: 'e-mail signature file from the identity downloads, not a page',
  },
  {
    match: /^wzornik\/.+\/index\.html$/,
    reason: 'Wzornik samples for made-up businesses, kept out of search; the hub is checked',
    noindex: true,
  },
];

const matches = (rule, file) =>
  typeof rule.match === 'string' ? rule.match === file : rule.match.test(file);

const isNoindex = html =>
  tags(html, 'meta').some(a => a.name === 'robots' && /\bnoindex\b/i.test(a.content ?? ''));

const required = [
  ['og:title', html => meta(html, 'og:title')],
  ['og:description', html => meta(html, 'og:description')],
  ['og:image', html => meta(html, 'og:image')],
  ['og:url', html => meta(html, 'og:url')],
  ['twitter:card', html => meta(html, 'twitter:card')],
  ['canonical', html => link(html, 'canonical')],
  ['JSON-LD', html => jsonLd(html)],
];

const attrs = tag => {
  const out = {};
  for (const [, name, , dq, sq, bare] of tag.matchAll(
    /([^\s=/>]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
  )) {
    out[name.toLowerCase()] = dq ?? sq ?? bare ?? '';
  }
  return out;
};

const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\s[^>]*>`, 'gi'))].map(m => attrs(m[0]));

const meta = (html, key) =>
  tags(html, 'meta')
    .find(a => a.property === key || a.name === key)
    ?.content?.trim() || null;

const link = (html, rel) =>
  tags(html, 'link')
    .find(a => a.rel?.split(/\s+/).includes(rel))
    ?.href?.trim() || null;

const jsonLd = html => {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  if (!blocks.length) return null;
  try {
    blocks.forEach(([, body]) => JSON.parse(body));
    return true;
  } catch {
    return null;
  }
};

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });

// Width and height from the PNG or JPEG header, enough to tell a real 1200x630 card from a stub.
const imageSize = file => {
  const fd = openSync(file, 'r');
  const buf = Buffer.alloc(256 * 1024);
  const len = readSync(fd, buf, 0, buf.length, 0);
  closeSync(fd);
  if (buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < len) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const size = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      }
      i += 2 + size;
    }
  }
  return null;
};

const checkImage = src => {
  if (!src.startsWith(`${siteUrl}/`)) return `og:image is not on ${siteUrl}: ${src}`;
  const file = join(root, decodeURI(src.slice(siteUrl.length).split(/[?#]/)[0]));
  if (!existsSync(file)) return `og:image file is missing: ${src}`;
  const size = imageSize(file);
  if (!size) return `og:image is not a PNG or JPEG: ${src}`;
  if (size[0] < 1200 || size[1] < 630)
    return `og:image is ${size.join('x')}, needs 1200x630: ${src}`;
  return null;
};

if (!existsSync(root)) {
  console.error(`check-seo-tags: ${root}/ not found, build the site first`);
  process.exit(2);
}

const files = walk(root)
  .map(file => relative(root, file).split(sep).join('/'))
  .sort();
const failures = [];
const used = new Set();
let checked = 0;
for (const file of files) {
  const html = readFileSync(join(root, file), 'utf8');
  const rule = exceptions.find(entry => matches(entry, file));
  if (rule) used.add(rule);
  if (rule && (!rule.noindex || isNoindex(html))) continue;
  checked += 1;
  const missing = required.filter(([, test]) => !test(html)).map(([key]) => key);
  const image = meta(html, 'og:image');
  const problems = image ? [checkImage(image)].filter(Boolean) : [];
  if (rule) problems.push(`listed as an exception (${rule.reason}) but has no noindex`);
  if (missing.length || problems.length) failures.push([file, missing, problems]);
}

const stale = exceptions.filter(rule => !used.has(rule));

// The site moved off GitHub Pages' project address on 2026-10-03. Scan the built HTML, sitemaps,
// feeds and llms.txt, and every file in static/og, so the old address cannot come back. Text
// painted into an image is invisible to this scan: redraw a card when its template changes.
const oldAddress = 'adiyy2001.github.io';
const ogDir = fileURLToPath(new URL('../static/og/', import.meta.url));
const listAll = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? listAll(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const textFile = /\.(html|xml|txt|json|webmanifest)$/;
const leaks = [
  ...listAll(root).filter(file => textFile.test(file)),
  ...(existsSync(ogDir) ? listAll(ogDir) : []),
].filter(file => readFileSync(file).includes(oldAddress));
leaks.forEach(file => console.error(`${file}\n  contains the old address ${oldAddress}`));

for (const [file, missing, problems] of failures) {
  console.error(file);
  if (missing.length) console.error(`  missing: ${missing.join(', ')}`);
  problems.forEach(problem => console.error(`  ${problem}`));
}
stale.forEach(rule => console.error(`exception ${rule.match} matches no file, remove it`));

if (failures.length || stale.length || leaks.length) {
  console.error(
    `\ncheck-seo-tags: ${failures.length} of ${checked} checked pages fail, ` +
      `${leaks.length} files carry the old address`,
  );
  process.exit(1);
}
console.log(
  `check-seo-tags: all ${checked} checked pages have og, twitter:card, canonical and JSON-LD` +
    ` (${files.length - checked} files skipped as listed exceptions), no ${oldAddress} left`,
);
