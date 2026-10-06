import { join } from 'node:path';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { layoutText, lineToPath, loadFont, textBounds } from '../../lib/text-path.mjs';

export const kerning = { Kl: -8, la: 0, am: 2, mr: 4, ra: -6 };

const display = () => loadFont(join(fontsSrcRoot(), 'epilogue', 'Epilogue[wght].ttf'), { wght: 900 });

const fixed = n => Number(n.toFixed(1));

export const wordmark = (size = 100, origin = { x: 0, y: 0 }, { tracking = -0.01, kern = kerning } = {}) => {
  const layout = layoutText(display(), 'Klamra', { size, kern, tracking });
  return { d: lineToPath(layout, { x: origin.x, y: origin.y, digits: 1, fit: 0.35 }), layout, bounds: textBounds(layout), width: layout.width, size };
};

export const wordmarkPlain = (size = 100) => {
  const layout = layoutText(display(), 'Klamra', { size, tracking: 0 });
  return { d: lineToPath(layout, { x: 0, y: 0, digits: 1, fit: 0.35 }), layout, bounds: textBounds(layout), width: layout.width };
};

export const lettersAt = (size = 100, origin = { x: 0, y: 0 }) => {
  const layout = layoutText(display(), 'Klamra', { size, kern: kerning, tracking: -0.01 });
  return layout.glyphs.map(({ glyph, x, advance, char }, index) => {
    const single = { glyphs: [{ glyph, x: 0, y: 0, advance, char }], scale: layout.scale };
    return { char, x: x + origin.x, advance, d: lineToPath(single, { x: origin.x + x, y: origin.y, digits: 1, fit: 0.35 }), index };
  });
};

export const braceGeometry = ({ x, y, h, depth, arm, stroke, side }) => {
  const sgn = side === 'right' ? 1 : -1;
  const notch = depth * 0.6;
  const tip = x + sgn * depth;
  const end = x - sgn * arm;
  const pts = [
    [end, y - h / 2],
    [x, y - h / 2],
    [x, y - notch],
    [tip, y],
    [x, y + notch],
    [x, y + h / 2],
    [end, y + h / 2],
  ];
  const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${fixed(px)} ${fixed(py)}`).join('');
  const extra = (stroke / 2) / Math.sin(Math.atan(notch / depth));
  const outer = sgn === 1 ? tip + extra : tip - extra;
  const left = Math.min(outer, end);
  const right = Math.max(outer, end);
  return { d, left, right, top: y - h / 2 - stroke / 2, bottom: y + h / 2 + stroke / 2, stroke };
};

export const frameParts = ({ x = 0, y = 0, w, h, border, shadow }) => {
  const outer = `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  const inner = `M${x + border} ${y + border}V${y + h - border}H${x + w - border}V${y + border}Z`;
  const l = `M${x + w} ${y + shadow}H${x + w + shadow}V${y + h + shadow}H${x + shadow}V${y + h}H${x + w}Z`;
  return { frame: outer + inner, shadow: l, face: { x: x + border, y: y + border, w: w - 2 * border, h: h - 2 * border } };
};

const shell = ({ colors, parts, braces, cursor, content = '' }) => {
  const { frame, shadow } = parts;
  const faceFill = colors.face === null ? '' : `<rect fill="${colors.face}" x="${parts.face.x}" y="${parts.face.y}" width="${parts.face.w}" height="${parts.face.h}"/>`;
  const braceMarkup = braces.map(b => `<path fill="none" stroke="${colors.brace}" stroke-width="${b.stroke}" stroke-miterlimit="4" d="${b.d}"/>`).join('');
  const cursorMarkup = cursor
    ? colors.cursorOutline
      ? `<rect fill="${colors.cursor}" stroke="${colors.cursorOutline}" stroke-width="${cursor.stroke}" x="${cursor.x}" y="${cursor.y}" width="${cursor.w}" height="${cursor.h}"/>`
      : `<rect fill="${colors.cursor}" x="${cursor.x}" y="${cursor.y}" width="${cursor.w}" height="${cursor.h}"/>`
    : '';
  return `<path fill="${colors.shadow}" d="${shadow}"/><path fill="${colors.frame}" fill-rule="evenodd" d="${frame}"/>${faceFill}${braceMarkup}${cursorMarkup}${content}`;
};

export const symbolParts = (colors, { size = 150, border = 10, shadow = 14 } = {}) => {
  const parts = frameParts({ w: size, h: size, border, shadow });
  const c = size / 2;
  const stroke = 12;
  const h = 70;
  const depth = 14;
  const arm = 12;
  const gap = 22;
  const left = braceGeometry({ x: c - gap - 14, y: c, h, depth, arm, stroke, side: 'left' });
  const right = braceGeometry({ x: c + gap + 14, y: c, h, depth, arm, stroke, side: 'right' });
  const cursor = { x: c - 14, y: c - 18, w: 28, h: 36, stroke: 5 };
  const body = shell({ colors, parts, braces: [left, right], cursor });
  return { viewBox: [0, 0, size + shadow, size + shadow], body, size, shadow };
};

export const faviconParts = colors => {
  const size = 58;
  const border = 6;
  const shadow = 6;
  const parts = frameParts({ x: 0, y: 0, w: size, h: size, border, shadow });
  const c = size / 2;
  const stroke = 7;
  const left = braceGeometry({ x: c - 13, y: c, h: 28, depth: 6, arm: 6, stroke, side: 'left' });
  const right = braceGeometry({ x: c + 13, y: c, h: 28, depth: 6, arm: 6, stroke, side: 'right' });
  const body = shell({ colors, parts, braces: [left, right], cursor: { x: c - 4, y: c - 6, w: 8, h: 12, stroke: 0 } });
  return { viewBox: [0, 0, size + shadow, size + shadow], body };
};

export const badgeParts = (colors, { height = 150, border = 10, shadow = 14, wordSize = 100 } = {}) => {
  const wm = wordmark(wordSize);
  const ink = wm.bounds;
  const cy = height / 2;
  const stroke = 12;
  const bh = 66;
  const depth = 14;
  const arm = 12;
  const padOuter = 24;
  const gap = 20;
  const cursorGap = 12;
  const cursorW = 40;
  const probeLeft = braceGeometry({ x: 0, y: cy, h: bh, depth, arm, stroke, side: 'left' });
  const braceWidth = probeLeft.right - probeLeft.left;
  const leftEdge = border + padOuter;
  const leftX = leftEdge - probeLeft.left;
  const leftGeo = braceGeometry({ x: leftX, y: cy, h: bh, depth, arm, stroke, side: 'left' });
  const wordLeft = leftGeo.right + gap;
  const wordInk = ink.maxX - ink.minX;
  const wmPlaced = wordmark(wordSize, { x: wordLeft - ink.minX, y: cy - (ink.minY + ink.maxY) / 2 });
  const cursorX = wordLeft + wordInk + cursorGap;
  const rightEdgeLeft = cursorX + cursorW + gap;
  const rightProbe = braceGeometry({ x: 0, y: cy, h: bh, depth, arm, stroke, side: 'right' });
  const rightX = rightEdgeLeft - rightProbe.left;
  const rightGeo = braceGeometry({ x: rightX, y: cy, h: bh, depth, arm, stroke, side: 'right' });
  const width = Math.ceil(rightGeo.right + padOuter + border);
  const parts = frameParts({ w: width, h: height, border, shadow });
  const capH = (ink.maxY - ink.minY) * 0.8;
  const cursor = { x: cursorX, y: cy - capH / 2, w: cursorW, h: capH, stroke: 5 };
  const content = `<path fill="${colors.word}" d="${wmPlaced.d}"/>`;
  const body = shell({ colors, parts, braces: [leftGeo, rightGeo], cursor, content });
  const wordOrigin = { x: wordLeft - ink.minX, y: cy - (ink.minY + ink.maxY) / 2 };
  return { viewBox: [0, 0, width + shadow, height + shadow], body, width, height, shadow, border, braceWidth, wordLeft, wordInk, wordOrigin, wordSize, cursor, leftGeo, rightGeo, cy, parts };
};

export const colorSets = c => ({
  color: { shadow: c.atrament, frame: c.atrament, face: c.cytryna, brace: c.atrament, cursor: c.roz, cursorOutline: null, word: c.atrament },
  mono: { shadow: '#000000', frame: '#000000', face: null, brace: '#000000', cursor: '#000000', cursorOutline: null, word: '#000000' },
  negative: { shadow: c.biel, frame: c.biel, face: c.cytryna, brace: c.atrament, cursor: c.roz, cursorOutline: null, word: c.atrament },
});

export const lockups = (colors, wordInk) => {
  const symbol = symbolParts(colors);
  const primary = badgeParts(colors);
  const wm = wordmark(100);
  const bounds = wm.bounds;
  const inkWidth = bounds.maxX - bounds.minX;
  const inkMid = (bounds.minY + bounds.maxY) / 2;

  const horizontal = (() => {
    const markHeight = symbol.viewBox[3];
    const gap = 34;
    const faceMid = symbol.size / 2;
    const placed = wordmark(100, { x: symbol.viewBox[2] + gap - bounds.minX, y: faceMid - inkMid });
    const width = Math.ceil(symbol.viewBox[2] + gap + inkWidth + 2);
    return { viewBox: [0, 0, width, markHeight], body: `${symbol.body}<path fill="${wordInk}" d="${placed.d}"/>` };
  })();

  const vertical = (() => {
    const gap = 30;
    const width = Math.ceil(Math.max(symbol.viewBox[2], inkWidth) + 4);
    const markX = (width - symbol.viewBox[2]) / 2;
    const baseline = symbol.viewBox[3] + gap - bounds.minY;
    const placed = wordmark(100, { x: (width - inkWidth) / 2 - bounds.minX, y: baseline });
    const height = Math.ceil(symbol.viewBox[3] + gap + (bounds.maxY - bounds.minY) + 2);
    return { viewBox: [0, 0, width, height], body: `<g transform="translate(${fixed(markX)} 0)">${symbol.body}</g><path fill="${wordInk}" d="${placed.d}"/>` };
  })();

  return { primary: { viewBox: primary.viewBox, body: primary.body }, symbol: { viewBox: symbol.viewBox, body: symbol.body }, horizontal, vertical, meta: { primary, symbol } };
};
