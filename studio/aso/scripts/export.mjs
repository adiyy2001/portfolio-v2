import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { frameName, loadCompose } from '../lib/compose.mjs';
import { expectedFiles, iconPaths, textPaths } from '../lib/convention.mjs';
import { flattenImage, opaqueSquare, rasterSvg, transparentLayer } from '../lib/export.mjs';
import { cleanDir, writeFile } from '../lib/files.mjs';
import { textsCsv } from '../lib/texts.mjs';

export const runExport = async app => {
  const compose = await loadCompose(app);
  const dir = cleanDir(app.paths.exportDir);
  const frames = join(app.paths.render, 'frames');
  let count = 0;
  for (const item of expectedFiles(app)) {
    if (!['appstore', 'play', 'variantB', 'feature', 'ipad'].includes(item.group)) continue;
    const name = frameName({ store: item.store, lang: item.lang }, { slot: item.slot, variant: item.variant });
    const source = readFileSync(join(frames, `${name}.png`));
    const buffer = await flattenImage(source, { format: app.format, background: app.background, width: item.width, height: item.height });
    writeFile(join(dir, item.path), buffer);
    count += 1;
  }
  const icons = iconPaths(app.slug);
  const full = await rasterSvg(compose.iconSvg('full', 1024), 1024);
  writeFile(join(dir, icons.appstore), await opaqueSquare(full, { background: app.background, alpha: false }));
  writeFile(join(dir, icons.play), await opaqueSquare(full, { size: 512, background: app.background, alpha: true }));
  writeFile(join(dir, icons.svg), compose.iconSvg('full', 1024));
  writeFile(join(dir, icons.background), await transparentLayer(await rasterSvg(compose.iconSvg('background', 1024), 1024), 1024));
  writeFile(join(dir, icons.foreground), await transparentLayer(await rasterSvg(compose.iconSvg('foreground', 1024), 1024), 1024));
  const texts = textPaths(app.slug);
  writeFile(join(dir, texts.csv), textsCsv(app, { ipad: app.ipad }));
  writeFile(join(dir, texts.pl), readFileSync(join(app.paths.copyDir, 'pl.json')));
  writeFile(join(dir, texts.en), readFileSync(join(app.paths.copyDir, 'en.json')));
  console.log(`export: ${count} store images, 5 icon files, 3 text files in ${dir}`);
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runExport(loadApp(slug));
}
