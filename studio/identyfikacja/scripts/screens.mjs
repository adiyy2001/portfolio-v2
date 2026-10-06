import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { launch } from '../lib/browser.mjs';
import { ensureDir, writeFile } from '../lib/files.mjs';
import { brandPaths } from '../lib/paths.mjs';
import { serveDist } from '../lib/serve.mjs';

const { slug, flags } = requireSlug(process.argv.slice(2));
const paths = brandPaths(slug);
const port = Number(flags.port ?? 4311);
const reduced = Boolean(flags.reduced);
const route = flags.route ?? `/identyfikacja/${slug}/`;
const shots = ensureDir(join(paths.out, 'shots'));
const sliceHeight = { 390: 1500, 1440: 1200 };
const server = await serveDist({ port });
const browser = await launch();
const report = { route, reduced, widths: {} };
let failed = false;

try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    const problems = [];
    page.on('console', msg => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
    page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
    page.on('requestfailed', request => problems.push(`request failed: ${request.url()}`));
    page.on('response', response => response.status() >= 400 && problems.push(`http ${response.status()}: ${response.url()}`));
    await page.goto(`${server.url}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate(top => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      height: document.documentElement.scrollHeight,
      broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
      h1: document.querySelectorAll('h1').length,
      title: document.title,
    }));
    if (metrics.scrollWidth > metrics.innerWidth) problems.push(`horizontal overflow: ${metrics.scrollWidth} > ${metrics.innerWidth}`);
    for (const src of metrics.broken) problems.push(`broken image: ${src}`);
    if (metrics.h1 !== 1) problems.push(`expected one h1, found ${metrics.h1}`);
    await page.screenshot({ path: join(shots, `hero-${width}.png`), clip: { x: 0, y: 0, width, height: width === 390 ? 844 : 900 } });
    await page.screenshot({ path: join(shots, `page-${width}.png`), fullPage: true });
    const step = sliceHeight[width];
    const slices = Math.ceil(metrics.height / step);
    for (let i = 0; i < slices; i += 1) {
      await page.screenshot({ path: join(shots, `page-${width}-${String(i + 1).padStart(2, '0')}.png`), fullPage: true, clip: { x: 0, y: i * step, width, height: Math.min(step, metrics.height - i * step) } });
    }
    report.widths[width] = { ...metrics, slices, problems };
    if (problems.length > 0) failed = true;
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

writeFile(join(shots, 'report.json'), JSON.stringify(report, null, 2));
for (const [width, data] of Object.entries(report.widths)) {
  console.log(`${width}px: page height ${data.height}, ${data.slices} slices, ${data.problems.length} problems`);
  for (const problem of data.problems) console.log(`  ${problem}`);
}
console.log(`shots in ${shots}`);
process.exit(failed ? 1 : 0);
