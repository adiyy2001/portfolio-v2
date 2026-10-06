import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { requireSlug } from '../lib/args.mjs';
import { loadBrand } from '../lib/brand.mjs';
import { logoVariants, names, pngSizes } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';
import { launch } from '../lib/browser.mjs';
import { checkLogoSvg, optimizeSvg, viewBoxOf } from '../lib/svg.mjs';

const { slug } = requireSlug(process.argv.slice(2));
const brand = loadBrand(slug);
const file = names(slug);
const problems = [];
const pdfJobs = [];

for (const variant of logoVariants) {
  const path = join(brand.paths.pub, file.logoSvg(variant));
  let svg;
  try {
    svg = readFileSync(path, 'utf8');
  } catch {
    problems.push(`missing ${file.logoSvg(variant)}`);
    continue;
  }
  const optimized = optimizeSvg(svg);
  writeFile(path, optimized);
  const check = checkLogoSvg(optimized);
  if (!check.ok) problems.push(`${file.logoSvg(variant)}: ${check.problems.join(', ')}`);
  const [, , vw, vh] = viewBoxOf(optimized) ?? [0, 0, 1, 1];
  for (const size of pngSizes) {
    const fitWidth = vw >= vh;
    const resvg = new Resvg(optimized, { fitTo: fitWidth ? { mode: 'width', value: size } : { mode: 'height', value: size }, background: undefined });
    writeFile(join(brand.paths.pub, file.logoPng(variant, size)), resvg.render().asPng());
  }
  pdfJobs.push({ variant, svg: optimized, vw, vh });
  console.log(`${variant}: ${check.bytes} B svg, png ${pngSizes.join('/')}`);
}

const browser = await launch();
try {
  for (const job of pdfJobs) {
    const widthMm = 100;
    const heightMm = (100 * job.vh) / job.vw;
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>@page{size:${widthMm}mm ${heightMm}mm;margin:0}html,body{margin:0;background:none;height:${heightMm}mm;overflow:hidden}svg{display:block;width:${widthMm}mm;height:${heightMm}mm}</style>${job.svg}`);
    const out = join(brand.paths.pub, file.logoPdf(job.variant));
    writeFile(out, await page.pdf({ preferCSSPageSize: true, printBackground: true }));
    await context.close();
  }
} finally {
  await browser.close();
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`FAIL ${problem}`);
  process.exit(1);
}
