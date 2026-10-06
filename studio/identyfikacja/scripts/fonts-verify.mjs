import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { polish } from './fonts-check.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = process.env.WZ_FONTS_SRC ?? join(resolve(here, '..', '..'), 'out', 'fonts-src');

export const families = {
  skibka: [
    { dir: 'youngserif', file: 'YoungSerif-Regular.ttf', instances: [{}] },
    { dir: 'karla', file: 'Karla[wght].ttf', instances: [{ wght: 400 }, { wght: 500 }, { wght: 700 }] },
    { dir: 'karla', file: 'Karla-Italic[wght].ttf', instances: [{ wght: 400 }] },
  ],
  nosna: [
    { dir: 'syne', file: 'Syne[wght].ttf', instances: [{ wght: 500 }, { wght: 700 }, { wght: 800 }] },
    { dir: 'martianmono', file: 'MartianMono[wdth,wght].ttf', instances: [{ wght: 400, wdth: 100 }, { wght: 500, wdth: 100 }, { wght: 700, wdth: 100 }] },
  ],
  rzut: [
    { dir: 'instrumentsans', file: 'InstrumentSans[wdth,wght].ttf', instances: [{ wght: 400, wdth: 100 }, { wght: 500, wdth: 100 }, { wght: 700, wdth: 100 }, { wght: 400, wdth: 75 }, { wght: 700, wdth: 75 }] },
  ],
  klamra: [
    { dir: 'epilogue', file: 'Epilogue[wght].ttf', instances: [{ wght: 700 }, { wght: 800 }, { wght: 900 }] },
    { dir: 'jetbrainsmono', file: 'JetBrainsMono[wght].ttf', instances: [{ wght: 400 }, { wght: 700 }, { wght: 800 }] },
  ],
  cuvee: [
    { dir: 'notoserifdisplay', file: 'NotoSerifDisplay[wdth,wght].ttf', instances: [{ wght: 200, wdth: 100 }, { wght: 300, wdth: 100 }, { wght: 400, wdth: 100 }, { wght: 500, wdth: 100 }] },
    { dir: 'notoserifdisplay', file: 'NotoSerifDisplay-Italic[wdth,wght].ttf', instances: [{ wght: 300, wdth: 100 }, { wght: 400, wdth: 100 }] },
    { dir: 'sourceserif4', file: 'SourceSerif4[opsz,wght].ttf', instances: [{ wght: 400, opsz: 16 }, { wght: 600, opsz: 16 }, { wght: 400, opsz: 60 }] },
    { dir: 'sourceserif4', file: 'SourceSerif4-Italic[opsz,wght].ttf', instances: [{ wght: 400, opsz: 16 }] },
  ],
  wolnobieg: [
    { dir: 'rammettoone', file: 'RammettoOne-Regular.ttf', instances: [{}] },
    { dir: 'baloo2', file: 'Baloo2[wght].ttf', instances: [{ wght: 400 }, { wght: 600 }, { wght: 800 }] },
  ],
};

const renders = (font, ch) => {
  const glyph = font.glyphForCodePoint(ch.codePointAt(0));
  return glyph.id !== 0 && glyph.path.commands.length > 0;
};

export const verifyBrand = brand => {
  const rows = [];
  for (const { dir, file, instances } of families[brand]) {
    const base = fontkit.openSync(join(srcRoot, dir, file));
    for (const coords of instances) {
      const font = Object.keys(coords).length ? base.getVariation(coords) : base;
      const bad = [...polish].filter(ch => ch !== ' ' && !renders(font, ch)).join('');
      rows.push({ brand, family: base.familyName, file, coords: JSON.stringify(coords), ok: bad === '', bad });
    }
  }
  return rows;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const wanted = process.argv.slice(2);
  let failed = 0;
  for (const brand of wanted.length ? wanted : Object.keys(families)) {
    for (const r of verifyBrand(brand)) {
      if (!r.ok) failed += 1;
      console.log(`${r.brand} | ${r.family} | ${r.coords} | ${r.ok ? 'ok' : `MISSING ${r.bad}`}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
