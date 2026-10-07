import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { requireSlug } from '../lib/args.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths, ensureDir, fontsSrc, remotionPublic, studioRoot } from '../lib/paths.mjs';

const require = createRequire(join(studioRoot, 'package.json'));
const subsetFont = require('subset-font');

const latin = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
export const webCharacters = `${latin}ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”’‘“…·×→←°€§−•©®™ÉéÜüÖöÄäß`;

const raw = (dir, file) =>
  `https://raw.githubusercontent.com/google/fonts/main/ofl/${dir}/${encodeURIComponent(file)}`;

const download = async (dir, file) => {
  const target = join(ensureDir(join(fontsSrc, dir)), file);
  if (existsSync(target)) return target;
  const res = await fetch(raw(dir, file));
  if (!res.ok) throw new Error(`${dir}/${file}: HTTP ${res.status}`);
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  return target;
};

export const prepareFonts = async slug => {
  const meta = await loadMeta(slug);
  const paths = appPaths(slug);
  const fontsOut = ensureDir(join(paths.pub, 'fonts'));
  const rows = [];
  for (const font of meta.fontFiles) {
    const src = await download(font.source.dir, font.source.file);
    const ofl = await download(font.source.dir, 'OFL.txt');
    const remotionTarget = join(remotionPublic, font.remotion);
    ensureDir(join(remotionTarget, '..'));
    copyFileSync(src, remotionTarget);
    const woff2 = await subsetFont(readFileSync(src), webCharacters, { targetFormat: 'woff2' });
    writeFileSync(join(fontsOut, font.web), woff2);
    copyFileSync(ofl, join(fontsOut, `OFL-${font.source.dir}.txt`));
    rows.push({ family: font.family, remotion: remotionTarget, web: font.web, bytes: woff2.length });
  }
  return rows;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug } = requireSlug();
  for (const row of await prepareFonts(slug)) console.log(`${row.family}: ${row.web} ${row.bytes} B, remotion ${row.remotion}`);
}
