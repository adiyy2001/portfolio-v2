import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from '../lib/args.mjs';
import { launch } from '../lib/browser.mjs';
import { names } from '../lib/convention.mjs';
import { ensureDir } from '../lib/files.mjs';
import { brandPaths, slugs, studioRoot } from '../lib/paths.mjs';
import { serveDist } from '../lib/serve.mjs';

const { flags } = parseArgs();
const port = Number(flags.port ?? 4317);
const pagesWanted = String(flags.pages ?? '1,6,12').split(',').map(Number);
const out = ensureDir(join(studioRoot, 'out', 'distinct'));
const tiles = ensureDir(join(out, 'tiles'));
const server = await serveDist({ port });
const browser = await launch();
const data = [];

try {
  for (const slug of slugs) {
    const paths = brandPaths(slug);
    const entry = { slug, hero: null, book: [] };
    if (existsSync(join(paths.distBrand, 'index.html'))) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${server.url}/identyfikacja/${slug}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      const file = join(tiles, `${slug}-hero.png`);
      await page.screenshot({ path: file });
      entry.hero = file;
      await context.close();
    }
    const pdf = join(paths.pub, names(slug).brandbook);
    if (existsSync(pdf)) {
      for (const number of pagesWanted) {
        const stem = join(tiles, `${slug}-book-${number}`);
        try {
          execFileSync('pdftoppm', ['-r', '56', '-f', String(number), '-l', String(number), '-png', '-singlefile', pdf, stem]);
          entry.book.push(`${stem}.png`);
        } catch {
          entry.book.push(null);
        }
      }
    }
    data.push(entry);
  }
  const img = path => (path ? `<img src="data:image/png;base64,${readFileSync(path).toString('base64')}">` : '<div class="gap">brak</div>');
  const row = (label, cells) => `<section><h2>${label}</h2><div class="r">${cells.join('')}</div></section>`;
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#777;font:12px monospace;color:#fff;padding:12px;width:1900px}section{margin-bottom:10px}h2{margin:2px 0;font-size:12px}.r{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}img{width:100%;display:block}.gap{aspect-ratio:16/10;background:#555;display:grid;place-items:center}</style>${row('hero 1440x900', data.map(d => `<div>${img(d.hero)}<p>${d.slug}</p></div>`))}${pagesWanted.map((n, i) => row(`brand book page ${n}`, data.map(d => `<div>${img(d.book[i] ?? null)}</div>`))).join('')}`;
  const context = await browser.newContext({ viewport: { width: 1924, height: 1000 } });
  const page = await context.newPage();
  await page.setContent(html);
  await page.screenshot({ path: join(out, 'board.png'), fullPage: true });
  await context.close();
  console.log(join(out, 'board.png'));
} finally {
  await browser.close();
  await server.close();
}
