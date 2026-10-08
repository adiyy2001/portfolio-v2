import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import { Resvg } from '@resvg/resvg-js';
import { fetchFamily, polish, typographic } from '../../identyfikacja/scripts/fonts-check.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const studio = resolve(here, '..', '..');
const srcRoot = process.env.WZ_FONTS_SRC ?? join(studio, 'out', 'fonts-src');
const outDir = join(studio, 'out', 'app-preview', 'fonts');

export const families = {
  kasownik: [
    {
      dir: 'onest',
      file: 'Onest[wght].ttf',
      instances: [{ wght: 400 }, { wght: 500 }, { wght: 600 }, { wght: 700 }, { wght: 800 }],
    },
  ],
  sztanga: [
    {
      dir: 'anybody',
      file: 'Anybody[wdth,wght].ttf',
      instances: [
        { wght: 900, wdth: 50 },
        { wght: 900, wdth: 100 },
        { wght: 900, wdth: 150 },
        { wght: 700, wdth: 75 },
        { wght: 600, wdth: 100 },
        { wght: 500, wdth: 100 },
      ],
    },
  ],
  rygiel: [
    {
      dir: 'azeretmono',
      file: 'AzeretMono[wght].ttf',
      instances: [{ wght: 400 }, { wght: 500 }, { wght: 700 }],
    },
    { dir: 'oxanium', file: 'Oxanium[wght].ttf', instances: [{ wght: 600 }, { wght: 800 }] },
  ],
  kielek: [
    { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-Medium.ttf', instances: [{}] },
    { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-ExtraBold.ttf', instances: [{}] },
    { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-Black.ttf', instances: [{}] },
  ],
  poziomka: [
    { dir: 'jersey10', file: 'Jersey10-Regular.ttf', instances: [{}], pixel: true },
    { dir: 'tiny5', file: 'Tiny5-Regular.ttf', instances: [{}], pixel: true },
  ],
  poludnie: [
    {
      dir: 'archivo',
      file: 'Archivo[wdth,wght].ttf',
      instances: [
        { wght: 400, wdth: 100 },
        { wght: 500, wdth: 100 },
        { wght: 700, wdth: 100 },
        { wght: 600, wdth: 87.5 },
        { wght: 800, wdth: 75 },
      ],
    },
  ],
  pixelCandidates: [
    { dir: 'pressstart2p', file: 'PressStart2P-Regular.ttf', instances: [{}], pixel: true },
    { dir: 'tiny5', file: 'Tiny5-Regular.ttf', instances: [{}], pixel: true },
    { dir: 'jersey10', file: 'Jersey10-Regular.ttf', instances: [{}], pixel: true },
    { dir: 'micro5', file: 'Micro5-Regular.ttf', instances: [{}], pixel: true },
    {
      dir: 'pixelifysans',
      file: 'PixelifySans[wght].ttf',
      instances: [{ wght: 400 }, { wght: 700 }],
      pixel: true,
    },
    { dir: 'vt323', file: 'VT323-Regular.ttf', instances: [{}], pixel: true },
    { dir: 'bytesized', file: 'Bytesized-Regular.ttf', instances: [{}], pixel: true },
  ],
};

const sample = [
  'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ',
  'Zażółć gęślą jaźń 0123456789',
  '„Łódź” · 25,5 kWh · 14:32 · 120 kg × 5',
];

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

const outline = (font, ch) => {
  const glyph = font.glyphForCodePoint(ch.codePointAt(0));
  return glyph.id !== 0 && glyph.path.commands.length > 0 ? glyph : null;
};

const pixelGrid = (font, chars) => {
  let unit = 0;
  let curves = 0;
  for (const ch of chars) {
    const glyph = outline(font, ch);
    if (!glyph) continue;
    for (const cmd of glyph.path.commands) {
      if (cmd.command === 'quadraticCurveTo' || cmd.command === 'bezierCurveTo') curves += 1;
      for (const v of cmd.args) unit = gcd(unit, Math.round(v));
    }
  }
  return { unit, perEm: unit ? font.unitsPerEm / unit : 0, curves };
};

const specimen = (font, size, lines) => {
  const scale = size / font.unitsPerEm;
  const lineHeight = Math.ceil(size * 1.4);
  let width = 0;
  const paths = lines.map((text, row) => {
    const run = font.layout(text);
    let x = 0;
    const parts = run.glyphs.map((glyph, i) => {
      const d = glyph.path
        .scale(scale, -scale)
        .translate(16 + x, 16 + size + row * lineHeight)
        .toSVG();
      x += run.positions[i].xAdvance * scale;
      return `<path d="${d}"/>`;
    });
    width = Math.max(width, x);
    return parts.join('');
  });
  const w = Math.ceil(width + 32);
  const h = Math.ceil(32 + size + lineHeight * lines.length);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#fff"/><g fill="#111" shape-rendering="crispEdges">${paths.join('')}</g></svg>`,
    w,
    h,
  };
};

export const verify = async group => {
  const rows = [];
  mkdirSync(outDir, { recursive: true });
  for (const { dir, file, instances, pixel } of families[group]) {
    await fetchFamily(dir);
    const base = fontkit.openSync(join(srcRoot, dir, file));
    for (const coords of instances) {
      const font = Object.keys(coords).length ? base.getVariation(coords) : base;
      const chars = [...new Set([...polish, ...typographic])].filter(ch => ch !== ' ');
      const missingPolish = [...polish].filter(ch => ch !== ' ' && !outline(font, ch)).join('');
      const missingTypo = [...typographic].filter(ch => !outline(font, ch)).join('');
      const row = {
        group,
        family: base.familyName,
        file,
        coords: JSON.stringify(coords),
        missingPolish,
        missingTypo,
      };
      if (pixel) row.grid = pixelGrid(font, [...chars, ...'AaBbGgQqRr0123456789']);
      const tag = `${group}-${file.replace(/\W+/g, '')}-${Object.values(coords).join('-') || 'static'}`;
      const onGrid = pixel && row.grid.perEm >= 5 && row.grid.perEm <= 32;
      const size = onGrid ? row.grid.perEm * 4 : 48;
      const { svg } = specimen(font, size, sample);
      writeFileSync(join(outDir, `${tag}.png`), new Resvg(svg).render().asPng());
      rows.push(row);
    }
  }
  return rows;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const wanted = process.argv.slice(2);
  let failed = 0;
  for (const group of wanted.length
    ? wanted
    : Object.keys(families).filter(g => g !== 'pixelCandidates')) {
    for (const r of await verify(group)) {
      if (r.missingPolish) failed += 1;
      const grid = r.grid
        ? ` | grid ${r.grid.unit} units, ${r.grid.perEm} px per em, curves ${r.grid.curves}`
        : '';
      console.log(
        `${r.group} | ${r.family} | ${r.coords} | ${r.missingPolish ? `MISSING ${r.missingPolish}` : 'polish ok'} | typo missing: ${r.missingTypo || 'none'}${grid}`,
      );
    }
  }
  console.log(`specimens: ${outDir}`);
  process.exit(failed ? 1 : 0);
}
