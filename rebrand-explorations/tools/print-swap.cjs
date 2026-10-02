const { chromium } = require('playwright');
(async () => {
  const B = 'http://localhost:8090/rebrand-explorations/b-na-miare/';
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(B + '#/dla-rekrutera', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.emulateMedia({ media: 'print' });
  require('fs').mkdirSync('out', { recursive: true });
  await p.pdf({ path: 'out/rec-print.pdf', format: 'A4', printBackground: true });
  await p.emulateMedia({ media: 'screen' });
  await p.goto(B, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.click('a.label[href="#/dla-klienta"]');
  for (const t of [250, 450, 900]) {
    await p.waitForTimeout(t === 250 ? 250 : t === 450 ? 200 : 450);
    await p.screenshot({ path: `out/swap-${t}.png` });
  }
  await p.waitForTimeout(1200);
  const st = await p.evaluate(() => ({ v: document.documentElement.dataset.v, hash: location.hash, focus: document.activeElement && document.activeElement.id, y: scrollY }));
  console.log(JSON.stringify(st), JSON.stringify(errs));
  await b.close();
})();
