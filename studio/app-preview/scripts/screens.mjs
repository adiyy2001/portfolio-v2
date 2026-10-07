import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { appPaths, chromiumPath, ensureDir, studioRoot } from '../lib/paths.mjs';
import { serveDist } from '../../identyfikacja/lib/serve.mjs';

const { chromium } = createRequire(join(studioRoot, 'package.json'))('playwright');

const { slug, flags } = requireSlug();
const paths = appPaths(slug);
const port = Number(flags.port ?? 4320);
const route = flags.route ?? `/app-preview/${slug}/`;
const shots = ensureDir(join(paths.shots, flags.tag ?? 'page'));
for (const name of readdirSync(shots)) if (name.endsWith('.png')) rmSync(join(shots, name));
const server = await serveDist({ port });
const browser = await chromium.launch({
  executablePath: chromiumPath,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});
const report = { route, widths: {} };
let failed = false;

const visit = async (width, { capture, reduced }) => {
  const height = width < 700 ? 844 : 900;
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  const problems = [];
  page.on('console', msg => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
  page.on('response', response => response.status() >= 400 && problems.push(`http ${response.status()}: ${response.url()}`));
  await page.goto(`${server.url}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const wide = [...document.querySelectorAll('body *')]
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
      })
      .filter(el => !el.closest('[role="region"]'))
      .slice(0, 5)
      .map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      height: document.documentElement.scrollHeight,
      wide,
      broken: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
      h1: document.querySelectorAll('h1').length,
      videos: [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc, paused: v.paused, autoplay: v.autoplay })),
    };
  });
  if (metrics.scrollWidth > metrics.innerWidth) problems.push(`horizontal overflow ${metrics.scrollWidth} > ${metrics.innerWidth}: ${metrics.wide.join(', ')}`);
  for (const src of metrics.broken) problems.push(`broken image ${src}`);
  if (metrics.h1 !== 1) problems.push(`expected one h1, found ${metrics.h1}`);
  if (reduced && metrics.videos.some(v => v.src)) problems.push('reduced motion still loads video');
  if (capture) {
    await page.screenshot({ path: join(shots, `hero-${width}.png`) });
    const step = width < 700 ? 1600 : 1300;
    for (let i = 0; i * step < metrics.height; i += 1) {
      await page.screenshot({
        path: join(shots, `page-${width}-${String(i + 1).padStart(2, '0')}.png`),
        fullPage: true,
        clip: { x: 0, y: i * step, width, height: Math.min(step, metrics.height - i * step) },
      });
    }
  }
  await context.close();
  return { ...metrics, problems };
};

try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const data = await visit(width, { capture: width === 390 || width === 1440, reduced: false });
    report.widths[width] = data;
    if (data.problems.length) failed = true;
  }
  const reduced = await visit(390, { capture: false, reduced: true });
  report.reduced = reduced;
  if (reduced.problems.length) failed = true;
} finally {
  await browser.close();
  await server.close();
}

writeFileSync(join(shots, 'report.json'), JSON.stringify(report, null, 2));
for (const [width, data] of Object.entries(report.widths)) {
  console.log(`${width}px: height ${data.height}, scrollWidth ${data.scrollWidth}, ${data.problems.length} problems`);
  for (const problem of data.problems) console.log(`  ${problem}`);
}
console.log(`reduced motion: ${report.reduced.problems.length} problems`);
for (const problem of report.reduced.problems) console.log(`  ${problem}`);
console.log(`shots in ${shots}`);
process.exit(failed ? 1 : 0);
