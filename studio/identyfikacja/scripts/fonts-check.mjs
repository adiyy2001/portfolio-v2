import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';

const here = dirname(fileURLToPath(import.meta.url));
const studio = resolve(here, '..', '..');
const srcRoot = process.env.WZ_FONTS_SRC ?? join(studio, 'out', 'fonts-src');

export const polish = 'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ';
export const typographic = '„”’…·×→°€';

const gh = args => execFileSync('gh', ['api', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

export const fetchFamily = async dir => {
  const target = join(srcRoot, dir);
  mkdirSync(target, { recursive: true });
  const listing = JSON.parse(gh([`repos/google/fonts/contents/ofl/${dir}`]));
  const wanted = listing.filter(f => f.type === 'file' && /\.(ttf|otf)$|^OFL\.txt$/.test(f.name));
  for (const file of wanted) {
    const path = join(target, file.name);
    if (existsSync(path)) continue;
    const res = await fetch(file.download_url);
    if (!res.ok) throw new Error(`${file.name}: ${res.status}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  }
  return wanted.filter(f => f.name.endsWith('.ttf') || f.name.endsWith('.otf')).map(f => join(target, f.name));
};

export const inspect = path => {
  const font = fontkit.openSync(path);
  const missing = [...new Set([...polish, ...typographic].filter(ch => ch !== ' '))].filter(ch => !font.hasGlyphForCodePoint(ch.codePointAt(0)));
  const axes = font.variationAxes ? Object.entries(font.variationAxes).map(([tag, a]) => `${tag} ${a.min}..${a.max}`) : [];
  const features = ['kern', 'tnum', 'lnum', 'onum', 'smcp', 'c2sc', 'liga', 'ss01'].filter(f => font.availableFeatures.includes(f));
  return {
    file: path.split('/').pop(),
    family: font.familyName,
    subfamily: font.subfamilyName,
    axes,
    features,
    missingPolish: missing.filter(ch => polish.includes(ch)).join(''),
    missingTypographic: missing.filter(ch => typographic.includes(ch)).join(''),
    glyphs: font.numGlyphs,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirs = process.argv.slice(2);
  for (const dir of dirs) {
    try {
      const files = await fetchFamily(dir);
      for (const path of files) {
        const r = inspect(path);
        const verdict = r.missingPolish ? `FAIL polish: ${r.missingPolish}` : 'polish ok';
        console.log(`${dir} | ${r.file} | ${r.subfamily} | ${verdict} | typo missing: ${r.missingTypographic || 'none'} | axes: ${r.axes.join(', ') || 'static'} | feat: ${r.features.join(',')}`);
      }
    } catch (error) {
      console.log(`${dir} | ERROR ${error.message.split('\n')[0]}`);
    }
  }
}
