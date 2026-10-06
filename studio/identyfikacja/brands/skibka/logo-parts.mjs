import { join } from 'node:path';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { layoutText, lineToPath, loadFont, ringGlyphs, ringToPath, textBounds } from '../../lib/text-path.mjs';
import { faviconArt, loafParts, stamp, stampArt } from '../../../../sites/src/identyfikacja/skibka/lib/stamp.ts';

export const canonicalSeed = 11;
export const kerning = { Sk: -14, ki: 14, ib: 6, bk: 6, ka: -10 };
export const ringString = 'SKIBKA · PIEKARNIA NA ZAKWASIE · KRAKÓW ·';

const display = () => loadFont(join(fontsSrcRoot(), 'youngserif', 'YoungSerif-Regular.ttf'));
const text = () => loadFont(join(fontsSrcRoot(), 'karla', 'Karla[wght].ttf'), { wght: 700 });

export const ringText = () => {
  const font = text();
  const circumference = 2 * Math.PI * stamp.textRadius;
  const base = layoutText(font, `${ringString} `, { size: stamp.textSize, tracking: 0 });
  const count = [...`${ringString} `].length;
  const tracking = (circumference - base.width) / count / stamp.textSize;
  const layout = layoutText(font, ringString, { size: stamp.textSize, tracking });
  const first = layout.glyphs[0];
  const sixth = layout.glyphs[5];
  const skCenter = (first.x + sixth.x + sixth.advance) / 2;
  const startAngle = -90 - ((skCenter - layout.width / 2) / stamp.textRadius) * (180 / Math.PI);
  const d = ringToPath(layout, { cx: stamp.center, cy: stamp.center, radius: stamp.textRadius, startAngle, digits: 1, fit: 0.15 });
  const glyphs = ringGlyphs(layout, { cx: stamp.center, cy: stamp.center, radius: stamp.textRadius, startAngle, error: 0.3 });
  return { d, glyphs, tracking, startAngle };
};

export const wordmark = (size = 100, tracking = 0, origin = { x: 0, y: 0 }) => {
  const font = display();
  const layout = layoutText(font, 'Skibka', { size, kern: kerning, tracking });
  const d = lineToPath(layout, { x: origin.x, y: origin.y, digits: 1, fit: 0.4 });
  const bounds = textBounds(layout);
  return { d, layout, bounds, width: layout.width, capHeight: layout.capHeight, xHeight: layout.xHeight, size };
};

export const wordmarkPlain = (size = 100) => {
  const font = display();
  const layout = layoutText(font, 'Skibka', { size });
  return { d: lineToPath(layout, { x: 0, y: 0, digits: 1 }), layout, bounds: textBounds(layout), width: layout.width };
};

export const descriptor = (size = 18, tracking = 0.14) => {
  const font = text();
  const layout = layoutText(font, 'PIEKARNIA NA ZAKWASIE', { size, tracking });
  return { d: lineToPath(layout, { x: 0, y: 0, digits: 1 }), layout, bounds: textBounds(layout), width: layout.width };
};

export const stampParts = (seed = canonicalSeed) => {
  const art = stampArt(seed);
  const loaf = loafParts(7);
  const ring = ringText();
  return { art, loaf, ring };
};

export const stampMarkup = (parts, { ink, loafInk = ink, prefix = 'r', reuse = true } = {}) => {
  const ring = reuse
    ? `<g fill="${ink}"><defs>${parts.ring.glyphs.defs.map(def => `<path id="${prefix}${def.id}" d="${def.d}"/>`).join('')}</defs>${parts.ring.glyphs.uses
        .map(use => `<use href="#${prefix}${parts.ring.glyphs.defs.find(def => def.char === use.char).id}" transform="translate(${use.x} ${use.y}) rotate(${use.rotation})"/>`)
        .join('')}</g>`
    : `<path fill="${ink}" d="${parts.ring.d}"/>`;
  return `<g><path fill="${ink}" fill-rule="evenodd" d="${parts.art.band}${parts.art.specks}"/><path fill="${ink}" fill-rule="evenodd" d="${parts.art.thin}"/>${ring}<path fill="${loafInk}" fill-rule="evenodd" d="${parts.loaf.body}${parts.loaf.cuts}${parts.loaf.dots}"/></g>`;
};

export const faviconMarkup = (ink, loafInk = ink, seed = canonicalSeed) => {
  const loaf = loafParts(7, 1.12);
  return `<path fill="${ink}" fill-rule="evenodd" d="${faviconArt(seed)}"/><path fill="${loafInk}" fill-rule="evenodd" d="${loaf.body}${loaf.cuts}"/>`;
};

export const lockups = (colors, parts = stampParts()) => {
  const { ink, wordInk, loafInk } = colors;
  const stampSvg = (x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale})">${stampMarkup(parts, { ink, loafInk })}</g>`;
  const markSvg = (x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale})">${faviconMarkup(ink, loafInk)}</g>`;
  const measure = size => wordmark(size);
  const placed = (size, left, baseline) => {
    const probe = measure(size);
    const word = wordmark(size, 0, { x: left - probe.bounds.minX, y: baseline });
    return { ...word, path: `<path fill="${wordInk}" d="${word.d}"/>`, ink: probe.bounds.maxX - probe.bounds.minX, cap: probe.capHeight };
  };

  const pStamp = 168;
  const pSize = 134;
  const pX = pStamp + 30;
  const pCap = measure(pSize).capHeight;
  const pWord = placed(pSize, pX, pStamp / 2 + pCap / 2);
  const primary = { viewBox: [0, 0, Math.ceil(pX + pWord.ink + 4), pStamp], body: `${stampSvg(0, 0, pStamp / stamp.size)}${pWord.path}` };

  const hMark = 76;
  const hSize = 80;
  const hX = hMark + 16;
  const hCap = measure(hSize).capHeight;
  const hWord = placed(hSize, hX, hMark / 2 + hCap / 2);
  const horizontal = { viewBox: [0, 0, Math.ceil(hX + hWord.ink + 3), hMark], body: `${markSvg(0, 0, hMark / stamp.size)}${hWord.path}` };

  const vStamp = 200;
  const vSize = 118;
  const vProbe = measure(vSize);
  const vWidth = Math.ceil(Math.max(vStamp, vProbe.bounds.maxX - vProbe.bounds.minX) + 8);
  const vBase = vStamp + 30 + vProbe.capHeight;
  const vWord = placed(vSize, (vWidth - (vProbe.bounds.maxX - vProbe.bounds.minX)) / 2, vBase);
  const vertical = { viewBox: [0, 0, vWidth, Math.ceil(vBase + 20)], body: `${stampSvg((vWidth - vStamp) / 2, 0, vStamp / stamp.size)}${vWord.path}` };

  return { primary, horizontal, vertical, symbol: { viewBox: [0, 0, stamp.size, stamp.size], body: stampMarkup(parts, { ink, loafInk }) } };
};
