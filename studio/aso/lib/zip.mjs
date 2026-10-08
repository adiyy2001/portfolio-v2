import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { zipSync } from 'fflate';
import { expectedFiles } from './convention.mjs';
import { bytesOf, writeFile } from './files.mjs';

export const buildZip = app => {
  const root = `${app.slug}-aso`;
  const entries = {};
  for (const item of expectedFiles(app)) {
    const compressed = ['png', 'jpg'].includes(item.type);
    entries[`${root}/${item.path}`] = [new Uint8Array(readFileSync(join(app.paths.exportDir, item.path))), { level: compressed ? 0 : 9, mtime: new Date(Date.UTC(2026, 9, 7)) }];
  }
  const data = zipSync(entries);
  const path = writeFile(join(app.paths.pub, `${app.slug}-aso.zip`), data);
  return { path, bytes: bytesOf(path), entries: Object.keys(entries).length };
};
