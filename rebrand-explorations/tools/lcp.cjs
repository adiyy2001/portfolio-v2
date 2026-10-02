const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75 });
  await p.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver(l => l.getEntries().forEach(e => window.__lcp.push({ t: Math.round(e.startTime), r: Math.round(e.renderTime), size: e.size, url: e.url.slice(0, 40), el: e.element ? e.element.tagName + '.' + e.element.className + (e.element.id ? '#' + e.element.id : '') : null, text: e.element ? e.element.textContent.slice(0, 30) : '' }))).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__paint = [];
    new PerformanceObserver(l => l.getEntries().forEach(e => window.__paint.push(e.name + '@' + Math.round(e.startTime)))).observe({ type: 'paint', buffered: true });
  });
  for (const r of process.argv.slice(2)) {
    await p.goto((process.env.BASE || 'http://127.0.0.1:9000') + r, { waitUntil: 'networkidle' });
    await new Promise(r => setTimeout(r, 1500));
    console.log(r, JSON.stringify(await p.evaluate(() => ({ paint: window.__paint, lcp: window.__lcp }))));
  }
  await b.close();
})();
