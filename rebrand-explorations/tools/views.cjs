const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v === undefined ? true : v]; }));
const [base, outDir] = args.filter(a => !a.startsWith('--'));
const widths = String(flags.widths || '1440,768,375').split(',').map(Number);
const views = String(flags.views || 'home,rec,cli').split(',');
const hash = { home: '#/', rec: '#/dla-rekrutera', cli: '#/dla-klienta' };
const lang = flags.lang || null;
const reduced = Boolean(flags.reduced);
const full = !flags.nofull;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const report = [];
  for (const w of widths) {
    for (const v of views) {
      const h = w < 600 ? 812 : w < 1000 ? 1024 : 900;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(base + hash[v], { waitUntil: 'networkidle', timeout: 45000 });
      await sleep(2800);
      if (lang) { await page.click(`[data-lang="${lang}"]`); await sleep(900); }
      const tag = `${v}-${w}${lang ? '-' + lang : ''}${reduced ? '-reduced' : ''}`;
      await page.screenshot({ path: path.join(outDir, `${tag}-hero.png`) });
      const info = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight, title: document.title }));
      if (full) {
        const H = info.sh;
        for (let y = 0; y < H; y += 500) { await page.evaluate(t => window.scrollTo(0, t), y); await sleep(160); }
        await sleep(1200);
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(600);
        await page.screenshot({ path: path.join(outDir, `${tag}-full.png`), fullPage: true });
      }
      report.push({ tag, ...info, hscroll: info.sw > info.cw, errors });
      await ctx.close();
    }
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
