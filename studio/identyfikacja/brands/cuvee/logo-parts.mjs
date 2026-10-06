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

const archPath = (inset, { x0 = 12.5, x1 = 147.5, top = 12.5, bottom = 187.5, cy = 80 } = {}) => {
  const left = x0 + inset;
  const right = x1 - inset;
  const r = (x1 - x0) / 2 - inset;
  const base = bottom - inset;
  return `M${left} ${base}V${cy}A${r} ${r} 0 0 1 ${right} ${cy}V${base}Z`;
};
const arch = (inset, thickness) => `${archPath(inset)}${archPath(inset + thickness)}`;

export const symbolSize = { width: 160, height: 200 };

export const monogram = ({ double = true, weight = 300, thickness = 2.6, glyphSize = 128, sillWidth = 34, sillHeight = 1.6, sillY = 160, glyphLift = 6 } = {}) => {
  const font = display(weight);
  const layout = layoutText(font, 'C', { size: glyphSize });
  const bounds = textBounds(layout);
  const cx = 80;
  const cy = 100 - glyphLift;
  const ox = cx - (bounds.minX + bounds.maxX) / 2 - glyphSize * 0.03;
  const oy = cy - (bounds.minY + bounds.maxY) / 2;
  const d = lineToPath(layout, { x: ox, y: oy, digits: 1, fit: 0.12 });
  const frame = double ? `${arch(0, thickness)}${arch(8, thickness * 0.45)}` : arch(0, thickness);
  return { frame, d, sill: { x: cx - sillWidth / 2, y: sillY, width: sillWidth, height: sillHeight }, bounds };
};

export const symbolMarkup = (colors, options = {}) => {
  const m = monogram(options);
  return `<path fill="${colors.ink}" fill-rule="evenodd" d="${m.frame}"/><path fill="${colors.ink}" d="${m.d}"/><rect fill="${colors.accent}" x="${m.sill.x}" y="${m.sill.y}" width="${m.sill.width}" height="${m.sill.height}"/>`;
};

export const faviconMarkup = colors => symbolMarkup(colors, { double: false, weight: 500, thickness: 11, glyphSize: 120, sillWidth: 44, sillHeight: 8, sillY: 150, glyphLift: 10 });

const buildStack = (size, left, top, { ruleGap, descriptorSize, descriptorGap, weight = 400, descriptorWeight = 400 }) => {
  const word = wordmark(size, { weight });
  const baseline = top - word.bounds.minY;
  const wordPlaced = wordmark(size, { weight, origin: { x: left, y: baseline } });
  const ruleY = baseline + ruleGap;
  const desc = descriptor(wordPlaced.width, { size: descriptorSize, weight: descriptorWeight, origin: { x: left, y: ruleY + descriptorGap + descriptorSize * 0.5 } });
  return { wordPlaced, ruleY, desc, left, baseline };
};

export const logoPadding = 10;

export const primaryLayout = () => {
  const descriptorSize = 24;
  const descriptorGap = 24;
  const p = buildStack(120, logoPadding, logoPadding, { ruleGap: 30, descriptorSize, descriptorGap, descriptorWeight: 500 });
  const descBaseline = p.ruleY + descriptorGap + descriptorSize * 0.5;
  return { ...p, width: Math.ceil(p.wordPlaced.width + logoPadding * 2), height: Math.ceil(descBaseline + p.desc.bounds.maxY + logoPadding) };
};

export const lockups = colors => {
  const { ink, accent, small } = colors;
  const p = primaryLayout();
  const ruleSvg = (x, y, w) => `<rect fill="${accent}" x="${x}" y="${y}" width="${w}" height="1.6"/>`;
  const primaryBody = `<path fill="${ink}" d="${p.wordPlaced.d}"/>${ruleSvg(p.left, p.ruleY, p.wordPlaced.width)}<path fill="${small}" d="${p.desc.d}"/>`;
  const primary = { viewBox: [0, 0, p.width, p.height], body: primaryBody };

  const hMarkHeight = 160;
  const hMarkScale = hMarkHeight / symbolSize.height;
  const hMarkWidth = symbolSize.width * hMarkScale;
  const hWordSize = 70;
  const hLeft = hMarkWidth + 30;
  const hWord = wordmark(hWordSize, { origin: { x: hLeft, y: 0 } });
  const hBaseline = hMarkHeight / 2 - 8 + hWord.capHeight / 2;
  const hWordPlaced = wordmark(hWordSize, { origin: { x: hLeft, y: hBaseline } });
  const hRuleY = hBaseline + 18;
  const hDesc = descriptor(hWordPlaced.width, { size: 14, weight: 500, origin: { x: hLeft, y: hRuleY + 17 + 7 } });
  const horizontal = {
    viewBox: [0, 0, Math.ceil(hLeft + hWordPlaced.width + logoPadding), hMarkHeight],
    body: `<g transform="scale(${hMarkScale})">${symbolMarkup({ ink, accent })}</g><path fill="${ink}" d="${hWordPlaced.d}"/>${ruleSvg(hLeft, hRuleY, hWordPlaced.width)}<path fill="${small}" d="${hDesc.d}"/>`,
  };

  const vMarkHeight = 180;
  const vMarkScale = vMarkHeight / symbolSize.height;
  const vMarkWidth = symbolSize.width * vMarkScale;
  const vWordSize = 66;
  const vProbe = wordmark(vWordSize);
  const vWidth = Math.ceil(Math.max(vProbe.width, vMarkWidth) + logoPadding * 2);
  const vLeft = (vWidth - vProbe.width) / 2;
  const vBaseline = vMarkHeight + 28 - vProbe.bounds.minY * 0.45 + vProbe.capHeight * 0.55;
  const vWordPlaced = wordmark(vWordSize, { origin: { x: vLeft, y: vBaseline } });
  const vRuleY = vBaseline + 16;
  const vDescSize = 13;
  const vDescBaseline = vRuleY + 15 + vDescSize * 0.5;
  const vDesc = descriptor(vWordPlaced.width, { size: vDescSize, weight: 500, origin: { x: vLeft, y: vDescBaseline } });
  const vertical = {
    viewBox: [0, 0, vWidth, Math.ceil(vDescBaseline + vDesc.bounds.maxY + logoPadding)],
    body: `<g transform="translate(${(vWidth - vMarkWidth) / 2} 0) scale(${vMarkScale})">${symbolMarkup({ ink, accent })}</g><path fill="${ink}" d="${vWordPlaced.d}"/>${ruleSvg(vLeft, vRuleY, vWordPlaced.width)}<path fill="${small}" d="${vDesc.d}"/>`,
  };

  return { primary, horizontal, vertical, symbol: { viewBox: [0, 0, symbolSize.width, symbolSize.height], body: symbolMarkup({ ink, accent }) } };
};

export { brand, fontPathFor };
