const { chromium } = require('playwright');
(async () => {
  const [url, out, sels, w = '1440', dpr = '1', lang] = process.argv.slice(2);
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: Number(w), height: 900 }, deviceScaleFactor: Number(dpr), isMobile: Number(w) < 600, hasTouch: Number(w) < 600 });
  if (lang) await ctx.addInitScript(l => { try { localStorage.setItem('lang', l) } catch (e) {} }, lang);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  for (const [i, sel] of sels.split('|').entries()) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(400);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600);
    await el.screenshot({ path: `${out}-${i}.png` });
  }
  console.log('sw', await page.evaluate(() => document.documentElement.scrollWidth), 'errors', JSON.stringify(errs));
  await browser.close();
})();
