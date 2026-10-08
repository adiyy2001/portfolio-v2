import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadApp } from '../lib/app.mjs';
import { rowByWidth, stack } from '../lib/boards.mjs';
import { expectedFiles } from '../lib/convention.mjs';
import { writeFile } from '../lib/files.mjs';
import { slugs, studioRoot } from '../lib/paths.mjs';

const rows = [];
const included = [];
for (const slug of slugs) {
  let app;
  try {
    app = loadApp(slug);
  } catch {
    continue;
  }
  const first = expectedFiles(app)
    .filter(item => item.group === 'appstore' && item.lang === 'pl' && ['01', '02', '03'].includes(item.slot))
    .map(item => join(app.paths.exportDir, item.path));
  if (!first.every(existsSync)) continue;
  rows.push(await rowByWidth(first, { width: 300, gap: 12, pad: 20, background: '#222222' }));
  included.push(slug);
}
if (rows.length === 0) {
  console.error('distinct: no app has exports yet');
  process.exit(1);
}
const path = writeFile(join(studioRoot, 'out', 'aso', 'distinct.png'), await stack(rows, { gap: 4 }));
console.log(`distinct: ${included.join(', ')} in ${path}`);
