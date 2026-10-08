import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const studio = join(here, '..', '..', '..', '..', '..');
const require = createRequire(join(studio, 'package.json'));
const fontkit = require('fontkit');
const fontsSrc = process.env.WZ_FONTS_SRC ?? join(studio, 'out', 'fonts-src');

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const chars = `${ascii}ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”’…·×→←°`;

const fonts = [
  { id: 'pixel', name: 'Poziomka Pixel', from: 'Jersey 10', file: 'jersey10/Jersey10-Regular.ttf', grid: 75 },
  { id: 'mini', name: 'Poziomka Mini', from: 'Tiny5', file: 'tiny5/Tiny5-Regular.ttf', grid: 128 },
];

const contoursOf = commands => {
  const contours = [];
  let current = null;
  for (const c of commands) {
    if (c.command === 'moveTo') {
      current = [[c.args[0], c.args[1]]];
      contours.push(current);
    } else if (c.command === 'lineTo') current.push([c.args[0], c.args[1]]);
    else if (c.command === 'closePath') current = null;
    else throw new Error(`curve command ${c.command}`);
  }
  return contours;
};

const winding = (contours, x, y) => {
  let w = 0;
  for (const pts of contours) {
    for (let i = 0; i < pts.length; i += 1) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % pts.length];
      if (y0 <= y) {
        if (y1 > y && (x1 - x0) * (y - y0) - (x - x0) * (y1 - y0) > 0) w += 1;
      } else if (y1 <= y && (x1 - x0) * (y - y0) - (x - x0) * (y1 - y0) < 0) w -= 1;
    }
  }
  return w !== 0;
};

const out = {};
const report = [];
for (const spec of fonts) {
  const font = fontkit.openSync(join(fontsSrc, spec.file));
  const g = spec.grid;
  const glyphs = {};
  const missing = [];
  const offGrid = [];
  for (const ch of chars) {
    const cp = ch.codePointAt(0);
    if (!font.hasGlyphForCodePoint(cp)) {
      missing.push(ch);
      continue;
    }
    const glyph = font.glyphForCodePoint(cp);
    const advance = glyph.advanceWidth / g;
    if (!Number.isInteger(advance)) offGrid.push(`${ch} advance`);
    const contours = contoursOf(glyph.path.commands);
    if (!contours.length) {
      glyphs[ch] = { a: Math.round(advance), x: 0, y: 0, w: 0, h: 0, b: '' };
      continue;
    }
    const all = contours.flat();
    if (all.some(([x, y]) => x % g !== 0 || y % g !== 0)) offGrid.push(ch);
    const minX = Math.floor(Math.min(...all.map(p => p[0])) / g);
    const maxX = Math.ceil(Math.max(...all.map(p => p[0])) / g);
    const minY = Math.floor(Math.min(...all.map(p => p[1])) / g);
    const maxY = Math.ceil(Math.max(...all.map(p => p[1])) / g);
    const w = maxX - minX;
    const h = maxY - minY;
    let bits = '';
    for (let row = 0; row < h; row += 1) {
      for (let col = 0; col < w; col += 1) {
        const fx = (minX + col + 0.5) * g;
        const fy = (maxY - row - 0.5) * g;
        bits += winding(contours, fx, fy) ? '1' : '0';
      }
    }
    glyphs[ch] = { a: Math.round(advance), x: minX, y: maxY, w, h, b: bits };
  }
  out[spec.id] = {
    name: spec.name,
    from: spec.from,
    ascent: Math.round(font.ascent / g),
    descent: Math.round(-font.descent / g),
    cap: glyphs.H.h,
    glyphs,
  };
  report.push(`${spec.name} from ${spec.from}: ${Object.keys(glyphs).length} glyphs, missing ${missing.join('') || 'none'}, off grid ${offGrid.join(' ') || 'none'}`);
}

const lines = [
  'export interface Glyph { a: number; x: number; y: number; w: number; h: number; b: string }',
  'export interface BitmapFont { name: string; from: string; ascent: number; descent: number; cap: number; glyphs: Record<string, Glyph> }',
  ...Object.entries(out).map(([id, data]) => `export const ${id}: BitmapFont = ${JSON.stringify(data)};`),
  '',
];
writeFileSync(join(here, '..', 'pixel', 'font-data.ts'), lines.join('\n'));
console.log(report.join('\n'));
