import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { ensureDir, writeFile } from './files.mjs';

const fallbackChromium = '/opt/pw-browsers/chromium';

export const executablePath = () => {
  if (process.env.WZ_CHROMIUM) return process.env.WZ_CHROMIUM;
  const bundled = chromium.executablePath();
  if (existsSync(bundled)) return undefined;
  return existsSync(fallbackChromium) ? fallbackChromium : undefined;
};

export const launch = () =>
  chromium.launch({
    executablePath: executablePath(),
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-gpu', '--hide-scrollbars'],
  });

export const withBrowser = async fn => {
  const browser = await launch();
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
};

export const settle = async (page, fontChecks = []) => {
  const result = await page.evaluate(async checks => {
    await Promise.all(checks.map(spec => document.fonts.load(spec)));
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(img =>
        img.complete
          ? null
          : new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }),
      ),
    );
    const faces = [...document.fonts];
    return {
      failed: faces.filter(face => face.status === 'error').map(face => `${face.family} ${face.weight}`),
      missing: checks.filter(spec => !faces.some(face => face.status === 'loaded' && spec.includes(face.family.replace(/"/g, '')))),
    };
  }, fontChecks);
  if (result.failed.length > 0) throw new Error(`fonts failed to load: ${result.failed.join(', ')}`);
  if (result.missing.length > 0) throw new Error(`fonts not loaded: ${result.missing.join(', ')}`);
};

export const collectBoxes = page =>
  page.evaluate(() => {
    const analyse = node => {
      const tops = [];
      let broken = false;
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode;
        const pattern = /\S+/g;
        let match = pattern.exec(text.data);
        while (match) {
          const range = document.createRange();
          range.setStart(text, match.index);
          range.setEnd(text, match.index + match[0].length);
          const rects = [...range.getClientRects()].filter(rect => rect.width > 0);
          if (rects.length > 1) broken = true;
          if (rects.length > 0) tops.push(Math.round(rects[0].top));
          match = pattern.exec(text.data);
        }
      }
      const lines = [];
      for (const top of tops) {
        const line = lines.find(item => Math.abs(item.top - top) <= 3);
        if (line) line.count += 1;
        else lines.push({ top, count: 1 });
      }
      lines.sort((a, b) => a.top - b.top);
      return {
        words: tops.length,
        lines: lines.length,
        lastLineWords: lines.length > 0 ? lines[lines.length - 1].count : 0,
        broken,
        overflow: node.scrollWidth > node.clientWidth + 1 || (node.hasAttribute('data-fixed') && node.scrollHeight > node.clientHeight + 1),
      };
    };
    return [...document.querySelectorAll('[data-box]')].map(node => {
      const rect = node.getBoundingClientRect();
      const kind = node.getAttribute('data-box');
      return {
        kind,
        name: node.getAttribute('data-name') ?? '',
        x: Math.round(rect.left * 100) / 100,
        y: Math.round(rect.top * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        ...(kind === 'headline' ? analyse(node) : {}),
      };
    });
  });

export const stage = (dir, name, html) => {
  ensureDir(dir);
  const file = join(dir, `${name}.html`);
  writeFile(file, html);
  return file;
};

export const renderHtml = async (browser, { dir, name, html, width, height, scale = 1, clip, fontChecks = [] }) => {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', error => errors.push(error.message));
  const file = stage(dir, name, html);
  try {
    await page.goto(`file://${file}`);
    await settle(page, fontChecks);
    const boxes = await collectBoxes(page);
    const buffer = await page.screenshot({ type: 'png', clip: clip ?? { x: 0, y: 0, width, height } });
    if (errors.length > 0) throw new Error(`console errors in ${name}: ${errors.join('; ')}`);
    return { buffer, boxes };
  } finally {
    await context.close();
  }
};
