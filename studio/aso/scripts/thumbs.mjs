import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { rowByWidth } from '../lib/boards.mjs';
import { expectedFiles } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';

export const runThumbs = async app => {
  const files = expectedFiles(app);
  const written = [];
  for (const store of ['appstore', 'play']) {
    for (const lang of ['pl', 'en']) {
      const first = files.filter(item => item.group === store && item.lang === lang && ['01', '02', '03'].includes(item.slot)).map(item => join(app.paths.exportDir, item.path));
      written.push(writeFile(join(app.paths.thumbs, `${store}-${lang}.png`), await rowByWidth(first, { width: 200, gap: 10, pad: 16, background: '#ffffff' })));
      const b = files.find(item => item.group === 'variantB' && item.store === store && item.lang === lang);
      const rest = first.slice(1);
      written.push(writeFile(join(app.paths.thumbs, `${store}-${lang}-b.png`), await rowByWidth([join(app.paths.exportDir, b.path), ...rest], { width: 200, gap: 10, pad: 16, background: '#ffffff' })));
    }
  }
  console.log(`thumbs: ${written.length} files in ${app.paths.thumbs}`);
  return written;
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runThumbs(loadApp(slug));
}
