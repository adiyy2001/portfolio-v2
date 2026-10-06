import { join } from 'node:path';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { layoutText, lineToPath, loadFont, textBounds } from '../../lib/text-path.mjs';
import { geometry, markBody, markBox, primaryLockup, primaryVariant, wordGap } from '../../../../sites/src/identyfikacja/nosna/lib/field.ts';

export const kerning = { No: -6, oś: 4, śn: -2, na: -4 };
export const wordText = 'Nośna';

const display = () => loadFont(join(fontsSrcRoot(), 'syne', 'Syne[wght].ttf'), { wght: 800 });

export const wordmark = (size, origin = { x: 0, y: 0 }, kern = kerning) => {
  const layout = layoutText(display(), wordText, { size, kern, tracking: -0.01 });
  const probe = textBounds(layout);
  const d = lineToPath(layout, { x: origin.x - probe.minX, y: origin.y, digits: 1, fit: 0.3 });
  return { d, width: probe.width, top: probe.minY, bottom: probe.maxY, capHeight: layout.capHeight, xHeight: layout.xHeight, size };
};

export const primaryWord = () => {
  const probe = wordmark(100);
  const size = (geometry.width / probe.width) * 100;
  const word = wordmark(size);
  return { d: word.d, width: word.width, top: word.top, bottom: word.bottom, size: word.size };
};

export const lockups = (colors, variant = primaryVariant) => {
  const word = primaryWord();
  const primary = primaryLockup(variant, colors, word);
  const symbol = { viewBox: [...markBox], body: markBody(variant, colors) };

  const hScale = 0.5;
  const hMarkW = geometry.width * hScale;
  const hMarkH = geometry.height * hScale;
  const hWord = wordmark(78, { x: 0, y: 0 });
  const hGap = 44;
  const hHeight = Math.max(hMarkH, hWord.bottom - hWord.top);
  const hWordX = hMarkW + hGap;
  const hCarrierY = (geometry.centerY * hScale);
  const hBaseline = hCarrierY + (hWord.capHeight / 2);
  const hWordPlaced = wordmark(78, { x: hWordX, y: hBaseline });
  const horizontal = {
    viewBox: [0, 0, Math.ceil(hWordX + hWordPlaced.width + 2), Math.ceil(hHeight)],
    body: `<g transform="scale(${hScale})">${markBody(variant, colors)}</g><path fill="${colors.ink}" d="${hWordPlaced.d}"/>`,
  };

  const [, , pw, ph] = primary.viewBox;
  const vertical = {
    viewBox: [0, 0, ph, pw],
    body: `<g transform="translate(0 ${pw}) rotate(-90)">${primary.body}</g>`,
  };
  return { primary, symbol, horizontal, vertical, word, wordGap };
};
