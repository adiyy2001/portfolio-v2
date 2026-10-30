import fs from 'node:fs';
import { chromium } from '/home/adrian/.claude/skills/design-website/scripts/node_modules/playwright/index.mjs';
import AxeBuilder from '/home/adrian/.claude/skills/design-website/scripts/node_modules/@axe-core/playwright/dist/index.mjs';

const base = 'http://localhost:9300';
const out = process.argv[2];
const pages = ['confirmed', 'confirmInvalid', 'unsubscribed', 'unsubscribeInvalid', 'reportExpired', 'reportUnknown'].map(n => `/pages/${n}.html`);
const mails = ['confirm', 'report', 'reportOne', 'failure'].map(n => `/mails/${n}.html`);
const mode = process.argv[3] || 'shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const rows = [];
const tag = route => route.replace(/^\//, '').replace(/\.html$/, '').replace('/', '-');

for (const scheme of ['light', 'dark']) {
  for (const route of [...pages, ...mails]) {
    const isMail = route.startsWith('/mails');
    if (mode === 'shots' && !isMail && scheme === 'dark') continue;
    for (const width of mode === 'axe' ? [1440] : [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: width > 600 ? 900 : 844 }, colorScheme: scheme });
      const page = await ctx.newPage();
      const requests = [];
      page.on('request', r => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) requests.push(r.url()); });
      await page.goto(base + route, { waitUntil: 'load' });
      await page.waitForTimeout(1400);
      if (mode === 'axe') {
        const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        const all = await new AxeBuilder({ page }).analyze();
        rows.push({ route, scheme, wcag: r.violations.map(v => v.id + ':' + v.nodes.length), all: all.violations.map(v => v.id + ':' + v.nodes.length), external: requests });
      } else {
        await page.screenshot({ path: `${out}/${tag(route)}-${scheme}-${width}.png`, fullPage: true });
        const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        rows.push({ route, scheme, width, hscroll: wide, external: requests });
      }
      await ctx.close();
    }
  }
}
await browser.close();
fs.writeFileSync(`${out}/${mode}.json`, JSON.stringify(rows, null, 2));
const bad = rows.filter(r => (r.wcag && r.wcag.length) || r.hscroll || r.external.length);
console.log(JSON.stringify({ total: rows.length, bad }, null, 1));
