import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { faviconIcoSizes, names } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';
import { checkLogoSvg, optimizeSvg } from '../lib/svg.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const file = names(slug);
const faviconPath = join(brand.paths.pub, file.favicon);
const svg = optimizeSvg(readFileSync(faviconPath, 'utf8'));
writeFile(faviconPath, svg);
const check = checkLogoSvg(svg, { maxBytes: 4096 });
if (!check.ok) {
  console.error(`FAIL ${file.favicon}: ${check.problems.join(', ')}`);
  process.exit(1);
}

const renderPng = (source, size) => new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng();

const images = faviconIcoSizes.map(size => ({ size, data: renderPng(svg, size) }));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + images.length * 16;
const entries = images.map(({ size, data }) => {
  const entry = Buffer.alloc(16);
  entry[0] = size;
  entry[1] = size;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});
writeFile(join(brand.paths.pub, file.ico), Buffer.concat([header, ...entries, ...images.map(image => image.data)]));

const appSvg = brand.appIconSvg ? readFileSync(join(brand.paths.studio, brand.appIconSvg), 'utf8') : null;
const background = brand.appIconBackground ?? brand.themeColor;
const inner = Math.round(180 * 0.72);
const symbolPng = renderPng(appSvg ?? svg, inner).toString('base64');
const wrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="${background}"/><image x="${(180 - inner) / 2}" y="${(180 - inner) / 2}" width="${inner}" height="${inner}" href="data:image/png;base64,${symbolPng}"/></svg>`;
writeFile(join(brand.paths.pub, file.apple), new Resvg(wrapper, { fitTo: { mode: 'width', value: 180 } }).render().asPng());
console.log(`favicon.svg ${check.bytes} B, favicon.ico ${faviconIcoSizes.join('/')}, apple-touch-icon 180`);
