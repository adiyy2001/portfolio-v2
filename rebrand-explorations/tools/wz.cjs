const { chromium } = require('playwright');
(async () => {
  const [w = '1440', dpr = '1', tag = 'd', lang] = process.argv.slice(2);
  const out = 'out/wz/';
  require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const mob = Number(w) < 600;
  const ctx = await browser.newContext({ viewport: { width: Number(w), height: mob ? 844 : 900 }, deviceScaleFactor: Number(dpr), isMobile: mob, hasTouch: mob });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  page.on('requestfailed', r => errs.push('failed ' + r.url()));
  await page.goto('http://127.0.0.1:8090/rebrand-explorations/b-na-miare/index.html#/dla-klienta', { waitUntil: 'networkidle' });
  if (lang) { await page.click('[data-lang="en"]'); }
  await page.waitForTimeout(2500);
  const sec = page.locator('#wzornik');
  await sec.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(2500);
  await sec.screenshot({ path: `${out}${tag}-sec.png` });
  const btns = page.locator('.sw__btn');
  const n = await btns.count();
  for (let i = 1; i < n; i++) { await btns.nth(i).click(); }
  await page.waitForTimeout(1200);
  const shots = page.locator('.sw__shot');
  for (let i = 0; i < n; i++) { await shots.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(150); await shots.nth(i).screenshot({ path: `${out}${tag}-mock${i + 1}.png` }); }
  await page.locator('.sw').nth(2).screenshot({ path: `${out}${tag}-sw3.png` });
  const st = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, exp: [...document.querySelectorAll('.sw__btn')].map(b => b.getAttribute('aria-expanded')).join(','), inert: [...document.querySelectorAll('.sw__panel')].map(p => p.inert).join(','), fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i).join('|') }));
  await btns.nth(0).click(); await page.waitForTimeout(900);
  const closed = await page.evaluate(() => { const p = document.querySelector('.sw__panel'); return [p.inert, p.getBoundingClientRect().height] });
  console.log(JSON.stringify({ ...st, closed, errs }));
  await browser.close();
})();
