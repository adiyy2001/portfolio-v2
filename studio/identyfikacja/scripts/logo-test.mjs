import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { logoVariants, names } from '../lib/convention.mjs';
import { htmlToImage, withBrowser } from '../lib/browser.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const file = names(slug);
const sizes = [16, 24, 48, 512];
const light = brand.colors[brand.testBackground?.light] ?? '#ffffff';
const dark = brand.colors[brand.testBackground?.dark] ?? '#111111';
const inline = (path, height) => {
  const svg = readFileSync(join(brand.paths.pub, path), 'utf8');
  return svg.replace('<svg ', `<svg style="height:${height}px;width:auto;display:block" `);
};

const row = (title, path, bg, fg) => `<section style="background:${bg};color:${fg};padding:18px 24px;display:flex;align-items:flex-end;gap:32px;flex-wrap:wrap"><h2 style="font:12px/1.2 monospace;width:150px;margin:0;color:${fg}">${title}</h2>${sizes.map(size => `<figure style="margin:0"><div>${inline(path, size)}</div><figcaption style="font:10px monospace;margin-top:6px">${size}px</figcaption></figure>`).join('')}</section>`;

const rows = [
  row('symbol light', file.logoSvg('symbol'), light, '#333'),
  row('favicon', file.favicon, light, '#333'),
  ...logoVariants.filter(v => v !== 'symbol').map(v => row(v, file.logoSvg(v), v === 'negative' ? dark : light, v === 'negative' ? '#ddd' : '#333')),
];
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#888">${rows.join('')}</body>`;
const out = join(brand.paths.out, 'logo-sizes.png');
await withBrowser(browser => htmlToImage(browser, { outDir: brand.paths.out, name: 'logo-sizes', html, out, width: 1400, height: 1200, fullPage: true }));
console.log(out);
