const { chromium } = require('playwright');
const fs = require('fs');

const base = process.argv[2] || 'http://127.0.0.1:9000';
const out = process.argv[3] || 'out/site';
fs.mkdirSync(out, { recursive: true });

const routes = ['/', '/en/', '/dla-rekrutera/', '/en/for-recruiters/', '/dla-klienta/', '/en/for-clients/', '/archive/', '/nie-ma/'];
const widths = [1440, 768, 375];
const report = { errors: [], overflow: [], checks: [] };
const wait = ms => new Promise(r => setTimeout(r, ms));

function watch(page, tag) {
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') report.errors.push(`${tag} console.${m.type()}: ${m.text()}`);
  });
  page.on('response', r => { if (r.status() >= 400) report.errors.push(`${tag} ${r.status()} ${r.url()}`); });
  page.on('pageerror', e => report.errors.push(`${tag} pageerror: ${e.message}`));
}

async function state(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    const swap = document.querySelector('.swap');
    return {
      path: location.pathname,
      active: a ? a.tagName + (a.id ? '#' + a.id : '') + (a.className ? '.' + String(a.className).split(' ')[0] : '') : null,
      swapVisibility: swap && getComputedStyle(swap).visibility,
      swapDisplay: swap && getComputedStyle(swap).display,
      scrollY: Math.round(scrollY),
      lang: document.documentElement.lang,
      title: document.title,
    };
  });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });

  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 375 ? 812 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    watch(page, `w${w}`);
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await wait(1600);
      const info = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: innerWidth,
        fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight),
        h1: document.querySelector('h1')?.textContent,
      }));
      if (info.sw > info.iw) report.overflow.push(`${w} ${r} scrollWidth ${info.sw} > ${info.iw}`);
      if (w === 1440 && r === '/') report.checks.push({ fonts: info.fonts });
      const name = `${w}${r.replace(/\//g, '_') || '_'}`;
      await page.screenshot({ path: `${out}/${name}.png` });
    }
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    watch(page, 'nav');
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await wait(1200);
    await page.click('a[href$="/dla-rekrutera/"] >> nth=0');
    await wait(300);
    report.checks.push({ step: 'mid-cover', ...(await state(page)) });
    await page.screenshot({ path: `${out}/t-mid-cover.png` });
    await wait(1800);
    report.checks.push({ step: 'after home->rec', ...(await state(page)) });
    await page.screenshot({ path: `${out}/t-rec.png` });
    await page.click('nav.lang a[hreflang="en"]');
    await wait(2100);
    report.checks.push({ step: 'after pl->en', ...(await state(page)) });
    await page.click('nav.ed a[href$="/for-clients/"]');
    await wait(2100);
    report.checks.push({ step: 'after rec->cli en', ...(await state(page)) });
    await page.mouse.wheel(0, 600);
    await wait(800);
    await page.click('a.mark');
    await wait(2100);
    report.checks.push({ step: 'mark->home en', ...(await state(page)) });
    await page.goBack();
    await wait(2100);
    report.checks.push({ step: 'back', ...(await state(page)) });
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    watch(page, 'skip');
    await page.goto(base + '/dla-klienta/', { waitUntil: 'networkidle' });
    await wait(800);
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => {
      const a = document.activeElement;
      const b = a.getBoundingClientRect();
      return { cls: a.className, text: a.textContent, top: Math.round(b.top), h: Math.round(b.height) };
    });
    await page.screenshot({ path: `${out}/skip.png` });
    await page.keyboard.press('Enter');
    await wait(300);
    report.checks.push({ step: 'skip', skip, after: await state(page) });
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    watch(page, 'reduced');
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await wait(300);
    await page.screenshot({ path: `${out}/reduced-home.png` });
    await page.click('a[href$="/dla-klienta/"] >> nth=0');
    await wait(400);
    report.checks.push({ step: 'reduced home->cli', ...(await state(page)) });
    await page.screenshot({ path: `${out}/reduced-cli.png` });
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
