import { createRequire } from 'node:module';
const require = createRequire(process.env.HOME + '/.claude/skills/design-website/scripts/package.json');
const { chromium } = require('playwright');
const [base, route, out] = process.argv.slice(2);
const browser = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const reduced of [false, true]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.addInitScript(() => localStorage.setItem('consent', 'denied'));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const tag = `${out}/${w}${reduced ? '-reduced' : ''}`;
    await page.screenshot({ path: `${tag}-hero.png` });
    if (!reduced) {
      const needle = page.locator('[role=slider]');
      await needle.focus();
      for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${tag}-moved.png` });
      for (let y = 0; y < 12000; y += 600) { await page.mouse.wheel(0, 600); await page.waitForTimeout(150); }
      await page.waitForTimeout(1200);
    }
    await page.screenshot({ path: `${tag}-full.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
