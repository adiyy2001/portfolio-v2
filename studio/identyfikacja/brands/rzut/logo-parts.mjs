import { join } from 'node:path';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { fittedPath, layoutText, loadFont, textBounds } from '../../lib/text-path.mjs';

const fontFile = join(fontsSrcRoot(), 'instrumentsans', 'InstrumentSans[wdth,wght].ttf');
const wordFont = () => loadFont(fontFile, { wght: 700, wdth: 100 });
const labelFont = () => loadFont(fontFile, { wght: 700, wdth: 75 });

export const kerning = { Rz: 2, zu: 18, ut: -4 };
export const cap = 120;
export const unit = cap / 6;
export const gap = unit * 2;
export const tracking = -0.012;
export const descriptorText = 'PRACOWNIA ARCHITEKTONICZNA';
export const placeText = 'WROCŁAW 51.1° N 17.0° E';

export const symbolPath = (size = cap, x = 0, y = 0) => {
  const k = size / 6;
  const px = value => Number((value).toFixed(2));
  return `M${px(x)} ${px(y)}H${px(x + size)}V${px(y + size)}H${px(x + 5 * k)}V${px(y + 3 * k)}H${px(x + 3 * k)}V${px(y + size)}H${px(x)}Z`;
};

export const wordSize = () => cap / (wordFont().capHeight / wordFont().unitsPerEm);

export const wordmark = ({ x = 0, baseline = cap, kern = kerning, track = tracking } = {}) => {
  const font = wordFont();
  const size = wordSize();
  const layout = layoutText(font, 'Rzut', { size, kern, tracking: track });
  const probe = textBounds(layout);
  const ox = x - probe.minX;
  const parts = layout.glyphs.map(({ glyph, x: gx }) =>
    fittedPath(glyph.path.commands, (px, py) => [ox + gx + px * layout.scale, baseline - py * layout.scale], { digits: 1, error: 0.25 }),
  );
  const d = parts.join('');
  const centers = layout.glyphs.map(item => ox + item.x + item.advance / 2);
  return { d, parts, width: probe.width, minX: x, maxX: x + probe.width, layout, centers };
};

const labelRun = (text, { size, tracking: track, x, baseline, defs }) => {
  const font = labelFont();
  const layout = layoutText(font, text, { size, tracking: track, features: { tnum: true } });
  const uses = [];
  for (const { glyph, x: gx, char } of layout.glyphs) {
    if (char === ' ') continue;
    if (!defs.has(char)) {
      const d = fittedPath(glyph.path.commands, (px, py) => [px * layout.scale, -py * layout.scale], { digits: 1, error: 0.12 });
      defs.set(char, { id: `l${defs.size}`, d });
    }
    uses.push(`<use href="#${defs.get(char).id}" x="${Number((x + gx).toFixed(2))}" y="${Number(baseline.toFixed(2))}"/>`);
  }
  return { uses: uses.join(''), width: layout.width, capHeight: layout.capHeight };
};

export const caption = ({ x, top, width, lines = [descriptorText, placeText], defs, fill }) => {
  const font = labelFont();
  const track = 0.07;
  const probe = layoutText(font, lines[0], { size: 100, tracking: track });
  const size = (width / probe.width) * 100;
  const capH = (font.capHeight / font.unitsPerEm) * size;
  const lead = capH * 2.05;
  const perLine = lines.map((line, index) => labelRun(line, { size, tracking: track, x, baseline: top + capH + index * lead, defs }).uses);
  const height = capH + (lines.length - 1) * lead;
  return { body: `<g fill="${fill}">${perLine.join('')}</g>`, lines: perLine, height, size, capH };
};

export const defsMarkup = defs => [...defs.values()].map(def => `<path id="${def.id}" d="${def.d}"/>`).join('');

export const lockups = ({ square, word, label }) => {
  const defs = new Map();
  const squarePath = symbolPath(cap);
  const wordX = cap + gap;
  const w = wordmark({ x: wordX, baseline: cap });
  const squareEl = `<path fill="${square}" d="${squarePath}"/>`;
  const wordEl = `<path fill="${word}" d="${w.d}"/>`;
  const horizontal = { viewBox: [0, 0, Math.ceil(w.maxX + 1), cap], body: squareEl + wordEl, defs: '' };

  const cp = caption({ x: wordX, top: cap + unit * 1.6, width: w.width, defs, fill: label });
  const primary = { viewBox: [0, 0, Math.ceil(w.maxX + 1), Math.ceil(cap + unit * 1.6 + cp.height + 1)], body: squareEl + wordEl + cp.body, defs: defsMarkup(defs) };

  const vDefs = new Map();
  const vw = wordmark({ x: 0, baseline: cap + gap * 1.5 + cap });
  const vCap = caption({ x: 0, top: cap + gap * 1.5 + cap + unit * 1.6, width: vw.width, defs: vDefs, fill: label });
  const vertical = {
    viewBox: [0, 0, Math.ceil(vw.maxX + 1), Math.ceil(cap + gap * 1.5 + cap + unit * 1.6 + vCap.height + 1)],
    body: `<path fill="${square}" d="${symbolPath(cap)}"/><path fill="${word}" d="${vw.d}"/>${vCap.body}`,
    defs: defsMarkup(vDefs),
  };

  const symbol = { viewBox: [0, 0, cap, cap], body: squareEl, defs: '' };
  return { primary, horizontal, vertical, symbol, parts: { word: w, caption: cp, defs }, measures: { wordWidth: w.width, wordMaxX: w.maxX } };
};

export const textPath = (text, { size, x = 0, y = 0, weight = 700, width = 100, tracking: track = 0, anchor = 'start', fit = 0.2 } = {}) => {
  const font = loadFont(fontFile, { wght: weight, wdth: width });
  const layout = layoutText(font, text, { size, tracking: track, features: { tnum: true } });
  const ox = anchor === 'end' ? x - layout.width : anchor === 'middle' ? x - layout.width / 2 : x;
  const d = layout.glyphs
    .map(({ glyph, x: gx, y: gy }) => fittedPath(glyph.path.commands, (px, py) => [ox + gx + px * layout.scale, y + gy - py * layout.scale], { digits: 1, error: fit }))
    .join('');
  return { d, width: layout.width, capHeight: layout.capHeight };
};
