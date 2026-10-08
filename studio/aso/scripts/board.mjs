import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { row } from '../lib/boards.mjs';
import { expectedFiles } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';

export const runBoard = async app => {
  const files = expectedFiles(app);
  const full = item => join(app.paths.exportDir, item.path);
  const written = [];
  for (const store of ['appstore', 'play', ...(app.ipad ? ['ipad'] : [])]) {
    for (const lang of ['pl', 'en']) {
      const set = files.filter(item => item.group === store && item.lang === lang).map(full);
      const path = writeFile(join(app.paths.boards, `${store}-${lang}.png`), await row(set, { height: store === 'play' ? 960 : 1100 }));
      written.push(path);
    }
  }
  for (const lang of ['pl', 'en']) {
    for (const store of ['appstore', 'play']) {
      const a = files.find(item => item.group === store && item.lang === lang && item.slot === '01');
      const b = files.find(item => item.group === 'variantB' && item.store === store && item.lang === lang);
      written.push(writeFile(join(app.paths.boards, `ab-${store}-${lang}.png`), await row([full(a), full(b)], { height: 1100 })));
    }
    const feature = files.find(item => item.group === 'feature' && item.lang === lang);
    written.push(writeFile(join(app.paths.boards, `feature-${lang}.png`), await row([full(feature)], { height: 500 })));
  }
  const icons = files.filter(item => item.group === 'icons' && item.type === 'png').map(full);
  written.push(writeFile(join(app.paths.boards, 'icons.png'), await row(icons, { height: 300, background: '#8a8a8a' })));
  console.log(`board: ${written.length} boards in ${app.paths.boards}`);
  return written;
};

if (import.meta.main) {
  const { slug } = requireSlug();
  await runBoard(loadApp(slug));
}
