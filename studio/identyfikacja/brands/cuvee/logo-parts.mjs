import { fontPathFor } from '../../lib/fonts.mjs';
import { loadBrand } from '../../lib/brand.mjs';
import { layoutText, lineToPath, loadFont, textBounds } from '../../lib/text-path.mjs';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { join } from 'node:path';

const brand = loadBrand('cuvee');

export const name = 'CUVÉE';
export const kerning = { CU: -6, UV: -18, VÉ: -22, ÉE: 4 };
export const wordTracking = 0.2;
export const descriptorText = 'Hotel · Winnica';
export const smallCaps = { smcp: true, c2sc: true };

const displaySource = join(fontsSrcRoot(), 'notoserifdisplay', 'NotoSerifDisplay[wdth,wght].ttf');
const display = (wght = 400) => loadFont(displaySource, { wght, wdth: 100 });

export const wordmark = (size = 100, { weight = 400, origin = { x: 0, y: 0 }, fit = 0.12 } = {}) => {
  const font = display(weight);
  const layout = layoutText(font, name, { size, kern: kerning, tracking: wordTracking });
  const bounds = textBounds(layout);
  const d = lineToPath(layout, { x: origin.x - bounds.minX, y: origin.y, digits: 1, fit });
  return { d, layout, bounds, width: bounds.width, capHeight: layout.capHeight, size };
};

export const letters = (size = 100, { weight = 400 } = {}) => {
  const font = display(weight);
  const layout = layoutText(font, name, { size, kern: kerning, tracking: wordTracking });
  const bounds = textBounds(layout);
  return layout.glyphs.map((entry, index) => {
    const single = { ...layout, glyphs: [{ ...entry, x: 0 }] };
    return { char: [...name][index], x: entry.x - bounds.minX, advance: entry.advance, d: lineToPath(single, { x: 0, y: 0, digits: 1, fit: 0.12 }) };
  });
};

export const descriptor = (targetWidth, { size = 22, weight = 400, origin = { x: 0, y: 0 } } = {}) => {
  const font = display(weight);
  const probe = layoutText(font, descriptorText, { size, tracking: 0, features: smallCaps });
  const count = [...descriptorText].length - 1;
  const base = textBounds(probe).width;
  const tracking = (targetWidth - base) / count / size;
  const layout = layoutText(font, descriptorText, { size, tracking, features: smallCaps });
  const bounds = textBounds(layout);
  const d = lineToPath(layout, { x: origin.x - bounds.minX, y: origin.y, digits: 1, fit: 0.12 });
  return { d, bounds, layout, tracking };
};

const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ring = (cx, cy, outer, thickness) => `${circle(cx, cy, outer)}${circle(cx, cy, outer - thickness)}`;

export const monogram = ({ double = true, weight = 300, thickness = 2.6, glyphSize = 136, dot = true, heavy = false } = {}) => {
  const font = display(weight);
  const layout = layoutText(font, 'C', { size: glyphSize });
  const bounds = textBounds(layout);
  const cx = 100;
  const cy = 100;
  const ox = cx - (bounds.minX + bounds.maxX) / 2 - glyphSize * 0.05;
  const oy = cy - (bounds.minY + bounds.maxY) / 2;
  const d = lineToPath(layout, { x: ox, y: oy, digits: 1, fit: 0.12 });
  const rings = double ? `${ring(cx, cy, 98, thickness)}${ring(cx, cy, 90, thickness * 0.45)}` : ring(cx, cy, 96, thickness);
  const dotX = ox + bounds.maxX - glyphSize * 0.09;
  const dotY = cy + glyphSize * 0.02;
  return { rings, d, dot: dot ? { x: Number(dotX.toFixed(1)), y: Number(dotY.toFixed(1)), r: heavy ? 10 : 4.6 } : null, bounds };
};

export const symbolMarkup = (colors, options = {}) => {
  const m = monogram(options);
  const dot = m.dot ? `<circle cx="${m.dot.x}" cy="${m.dot.y}" r="${m.dot.r}" fill="${colors.accent}"/>` : '';
  return `<path fill="${colors.ink}" fill-rule="evenodd" d="${m.rings}"/><path fill="${colors.ink}" d="${m.d}"/>${dot}`;
};

export const faviconMarkup = colors => symbolMarkup(colors, { double: false, weight: 500, thickness: 9, glyphSize: 140, heavy: true });

export const lockups = colors => {
  const { ink, accent, small } = colors;
  const stack = (word, rule, descriptorHeight) => ({ word, rule, descriptorHeight });
  const build = (size, left, top, { ruleGap, descriptorSize, descriptorGap, weight = 400, descriptorWeight = 400 }) => {
    const word = wordmark(size, { weight, origin: { x: left, y: top + 0 } });
    const baseline = top - word.bounds.minY;
    const wordPlaced = wordmark(size, { weight, origin: { x: left, y: baseline } });
    const ruleY = baseline + ruleGap;
    const desc = descriptor(wordPlaced.width, { size: descriptorSize, weight: descriptorWeight, origin: { x: left, y: ruleY + descriptorGap + descriptorSize * 0.5 } });
    return { wordPlaced, ruleY, desc, left, baseline };
  };

  const wordSize = 120;
  const p = build(wordSize, 20, 20, { ruleGap: 30, descriptorSize: 24, descriptorGap: 24, descriptorWeight: 500 });
  const pWidth = Math.ceil(p.wordPlaced.width + 40);
  const pHeight = Math.ceil(p.ruleY + 24 + 12 + 24 * 0.5 + 24);
  const ruleSvg = (x, y, w) => `<rect fill="${accent}" x="${x}" y="${y}" width="${w}" height="1.6"/>`;
  const primaryBody = `<path fill="${ink}" d="${p.wordPlaced.d}"/>${ruleSvg(p.left, p.ruleY, p.wordPlaced.width)}<path fill="${small}" d="${p.desc.d}"/>`;
  const primary = { viewBox: [0, 0, pWidth, pHeight], body: primaryBody };

  const markScale = 150 / 200;
  const hMarkSize = 150;
  const hWordSize = 70;
  const hLeft = hMarkSize + 34;
  const hWord = wordmark(hWordSize, { origin: { x: hLeft, y: 0 } });
  const hBaseline = hMarkSize / 2 - 6 + hWord.capHeight / 2 - 10;
  const hWordPlaced = wordmark(hWordSize, { origin: { x: hLeft, y: hBaseline } });
  const hRuleY = hBaseline + 18;
  const hDesc = descriptor(hWordPlaced.width, { size: 14, weight: 500, origin: { x: hLeft, y: hRuleY + 17 + 7 } });
  const horizontal = {
    viewBox: [0, 0, Math.ceil(hLeft + hWordPlaced.width + 2), hMarkSize],
    body: `<g transform="scale(${markScale})">${symbolMarkup({ ink, accent })}</g><path fill="${ink}" d="${hWordPlaced.d}"/>${ruleSvg(hLeft, hRuleY, hWordPlaced.width)}<path fill="${small}" d="${hDesc.d}"/>`,
  };

  const vMark = 170;
  const vWordSize = 66;
  const vProbe = wordmark(vWordSize);
  const vWidth = Math.ceil(vProbe.width + 24);
  const vLeft = (vWidth - vProbe.width) / 2;
  const vBaseline = vMark + 34 - vProbe.bounds.minY * 0.45 + vProbe.capHeight * 0.55;
  const vWordPlaced = wordmark(vWordSize, { origin: { x: vLeft, y: vBaseline } });
  const vRuleY = vBaseline + 16;
  const vDesc = descriptor(vWordPlaced.width, { size: 13, weight: 500, origin: { x: vLeft, y: vRuleY + 15 + 6.5 } });
  const vertical = {
    viewBox: [0, 0, vWidth, Math.ceil(vRuleY + 15 + 6.5 + 20)],
    body: `<g transform="translate(${(vWidth - vMark) / 2} 0) scale(${vMark / 200})">${symbolMarkup({ ink, accent })}</g><path fill="${ink}" d="${vWordPlaced.d}"/>${ruleSvg(vLeft, vRuleY, vWordPlaced.width)}<path fill="${small}" d="${vDesc.d}"/>`,
  };

  return { primary, horizontal, vertical, symbol: { viewBox: [0, 0, 200, 200], body: symbolMarkup({ ink, accent }) } };
};

export { brand, fontPathFor };
