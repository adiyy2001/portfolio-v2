import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { loadCompose } from '../lib/compose.mjs';
import { expectedFiles, iconPaths, webPath } from '../lib/convention.mjs';
import { toWebp } from '../lib/export.mjs';
import { ensureDir, writeFile } from '../lib/files.mjs';

export const webWidths = { appstore: 480, play: 400, feature: 1024, ipad: 640 };

export const ogImage = async (app, files) => {
  const height = 560;
  const gap = 18;
  const tiles = await Promise.all(files.map(file => sharp(file).resize({ height }).png().toBuffer()));
  const widths = await Promise.all(tiles.map(async tile => (await sharp(tile).metadata()).width));
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * (tiles.length - 1);
  let left = Math.round((1200 - total) / 2);
  const composite = tiles.map((input, i) => {
    const item = { input, left, top: 35 };
    left += widths[i] + gap;
    return item;
  });
  return sharp({ create: { width: 1200, height: 630, channels: 3, background: app.ogBackground ?? app.themeColor } })
    .composite(composite)
    .png({ compressionLevel: 9 })
    .toBuffer();
};

export const runWeb = async app => {
  const compose = await loadCompose(app);
  const web = join(app.paths.pub, 'web');
  rmSync(web, { recursive: true, force: true });
  ensureDir(web);
  let count = 0;
  for (const item of expectedFiles(app)) {
    if (!['appstore', 'play', 'variantB', 'feature', 'ipad'].includes(item.group)) continue;
    const source = readFileSync(join(app.paths.exportDir, item.path));
    writeFile(join(app.paths.pub, webPath(item)), await toWebp(source, webWidths[item.store], item.store === 'feature' ? 86 : 84));
    count += 1;
  }
  const icons = ensureDir(join(app.paths.pub, 'icons'));
  const appIcon = readFileSync(join(app.paths.exportDir, iconPaths(app.slug).appstore));
  writeFile(join(icons, 'icon-256.png'), await sharp(appIcon).resize(256, 256, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer());
  const og = compose.ogSource ? compose.ogSource() : { store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] };
  const ogFiles = expectedFiles(app)
    .filter(item => item.group === og.store && item.lang === og.lang && og.slots.includes(item.slot))
    .map(item => join(app.paths.exportDir, item.path));
  writeFile(join(app.paths.pub, 'og.png'), await ogImage(app, ogFiles));
  const svg = compose.iconSvg('full', 1024).replace(/^<svg([^>]*)>/, '<svg$1><defs><clipPath id="r"><rect width="1024" height="1024" rx="230"/></clipPath></defs><g clip-path="url(#r)">').replace(/<\/svg>$/, '</g></svg>');
  writeFile(join(app.paths.pub, 'favicon.svg'), svg.replace(/width="1024" height="1024" viewBox/, 'width="64" height="64" viewBox'));
  console.log(`web: ${count} previews, icon, og.png and favicon.svg`);
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runWeb(loadApp(slug));
}
