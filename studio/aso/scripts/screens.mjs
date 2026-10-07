import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { launch } from '../lib/browser.mjs';
import { cleanDir, writeFile } from '../lib/files.mjs';
import { appPaths, studioRoot } from '../lib/paths.mjs';
import { serveDist } from '../lib/serve.mjs';

const argv = process.argv.slice(2);
const index = argv.includes('--index');
const { slug, flags } = index ? { slug: null, flags: Object.fromEntries(argv.filter(a => a.startsWith('--')).map(a => a.slice(2).split('='))) } : requireSlug(argv);
const port = Number(flags.port ?? 4331);
const route = flags.route ?? (index ? '/aso/' : `/aso/${slug}/`);
const shots = cleanDir(index ? join(studioRoot, 'out', 'aso', 'index-shots') : appPaths(slug).shots);
const probeWidths = [320, 360, 390, 768, 1024, 1280, 1440];
const sliceHeight = { 390: 1600, 1440: 1100 };
const server = await serveDist({ port });
const browser = await launch();
const report = { route, widths: {}, probe: {} };
let failed = false;

const watch = page => {
  const problems = [];
  page.on('console', msg => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => problems.push(`request failed: ${request.url()}`));
  page.on('response', response => response.status() >= 400 && problems.push(`http ${response.status()}: ${response.url()}`));
  return problems;
};

const settle = async page => {
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
};

try {
  for (const width of probeWidths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const problems = watch(page);
    await page.goto(`${server.url}${route}`, { waitUntil: 'networkidle' });
    await settle(page);
    const metrics = await page.evaluate(() => {
      const wide = [...document.querySelectorAll('body *')]
        .filter(node => {
          const rect = node.getBoundingClientRect();
          if (rect.width === 0) return false;
          let parent = node.parentElement;
          while (parent && parent !== document.body) {
            const style = getComputedStyle(parent);
            if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)) return false;
            parent = parent.parentElement;
          }
          return rect.right > window.innerWidth + 1 || rect.left < -1;
        })
        .slice(0, 6)
        .map(node => `${node.tagName.toLowerCase()}.${[...node.classList].join('.')}`);
      return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, wide };
    });
    if (metrics.scrollWidth > metrics.innerWidth) problems.push(`horizontal overflow at ${width}: ${metrics.scrollWidth} (${metrics.wide.join(', ')})`);
    report.probe[width] = { ...metrics, problems };
    if (problems.length > 0) failed = true;
    await context.close();
  }
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const problems = watch(page);
    await page.goto(`${server.url}${route}`, { waitUntil: 'networkidle' });
    await settle(page);
    const metrics = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
      h1: document.querySelectorAll('h1').length,
      title: document.title,
    }));
    for (const src of metrics.broken) problems.push(`broken image: ${src}`);
    if (metrics.h1 !== 1) problems.push(`expected one h1, found ${metrics.h1}`);
    const step = sliceHeight[width];
    const slices = Math.ceil(metrics.height / step);
    for (let i = 0; i < slices; i += 1) {
      await page.screenshot({ path: join(shots, `page-${width}-${String(i + 1).padStart(2, '0')}.png`), fullPage: true, clip: { x: 0, y: i * step, width, height: Math.min(step, metrics.height - i * step) } });
    }
    if (flags.click) {
      const buttons = await page.$$(flags.click);
      for (const [i, button] of buttons.entries()) {
        await button.scrollIntoViewIfNeeded();
        await button.click();
        await page.waitForTimeout(250);
        await page.screenshot({ path: join(shots, `click-${width}-${i + 1}.png`) });
      }
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
for (const [width, data] of Object.entries(report.probe)) console.log(`probe ${width}px: scroll width ${data.scrollWidth}${data.problems.length ? `, ${data.problems.join('; ')}` : ''}`);
for (const [width, data] of Object.entries(report.widths)) {
  console.log(`${width}px: page height ${data.height}, ${data.slices} slices, ${data.problems.length} problems`);
  for (const problem of data.problems) console.log(`  ${problem}`);
}
console.log(`shots in ${shots}`);
process.exit(failed ? 1 : 0);
