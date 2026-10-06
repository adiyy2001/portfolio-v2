import { join } from 'node:path';
import { chromium } from 'playwright';
import { ensureDir, writeFile } from './files.mjs';

export const launch = () =>
  chromium.launch({
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

const settle = async page => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => (img.complete ? null : new Promise(res => { img.onload = img.onerror = res; }))));
  });
};

const stage = (outDir, name, html) => {
  const dir = ensureDir(join(outDir, 'tmp'));
  const file = join(dir, `${name}.html`);
  writeFile(file, html);
  return file;
};

export const htmlToImage = async (browser, { outDir, name, html, file, out, width, height, scale = 1, type = 'png', quality = 90, transparent = false, fullPage = false }) => {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', error => errors.push(error.message));
  const target = file ?? stage(outDir, name, html);
  await page.goto(`file://${target}`);
  await settle(page);
  ensureDir(join(out, '..'));
  await page.screenshot({ path: out, type, quality: type === 'jpeg' ? quality : undefined, omitBackground: transparent, fullPage, clip: fullPage ? undefined : { x: 0, y: 0, width, height } });
  await context.close();
  return errors;
};

export const htmlToPdf = async (browser, { outDir, name, html, file, out, width, height, landscape = false }) => {
  const context = await browser.newContext({ viewport: { width: Math.round(width), height: Math.round(height) } });
  const page = await context.newPage();
  const target = file ?? stage(outDir, name, html);
  await page.goto(`file://${target}`);
  await settle(page);
  await page.emulateMedia({ media: 'print' });
  ensureDir(join(out, '..'));
  await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, landscape });
  await context.close();
};
