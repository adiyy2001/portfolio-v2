import { join } from 'node:path';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { layoutText, lineToPath, loadFont, textBounds } from '../../lib/text-path.mjs';
import { arcStripe, cogPath, discPath, holesPath } from '../../../../sites/src/identyfikacja/wolnobieg/lib/stripes.ts';

export const kerning = { Wo: -22, ol: 6, ln: 10, nb: 4, bi: 6, ie: -2, eg: -10 };
export const slope = -4;
export const descriptorText = 'SERWIS I SKLEP ROWEROWY · GDAŃSK';

const display = () => loadFont(join(fontsSrcRoot(), 'rammettoone', 'RammettoOne-Regular.ttf'));
const text = () => loadFont(join(fontsSrcRoot(), 'baloo2', 'Baloo2[wght].ttf'), { wght: 800 });

export const wordmark = (size = 100, tracking = 0, origin = { x: 0, y: 0 }, fit = 0.4) => {
  const layout = layoutText(display(), 'Wolnobieg', { size, kern: kerning, tracking });
  const d = lineToPath(layout, { x: origin.x, y: origin.y, digits: 1, fit });
  return { d, layout, bounds: textBounds(layout), width: layout.width, capHeight: layout.capHeight, size };
};

export const wordmarkPlain = (size = 100) => {
  const layout = layoutText(display(), 'Wolnobieg', { size });
  return { d: lineToPath(layout, { x: 0, y: 0, digits: 1 }), layout, bounds: textBounds(layout), width: layout.width };
};

export const descriptor = (size = 30, tracking = 0.16) => {
  const layout = layoutText(text(), descriptorText, { size, tracking });
  return { d: lineToPath(layout, { x: 0, y: 0, digits: 1, fit: 0.3 }), layout, bounds: textBounds(layout), width: layout.width };
};

export const badge = (colors, { simple = false } = {}) => {
  const rim = simple ? cogPath(200, 200, 12, 198, 170, 8) + discPath(200, 200, 136) : cogPath(200, 200, 16, 198, 178, 11) + discPath(200, 200, 152);
  const parts = [`<path fill="${colors.rim}" fill-rule="evenodd" d="${rim}"/>`];
  if (simple) {
    parts.push(`<path fill="${colors.ring1}" d="${arcStripe(200, 200, 104, 46, 40, 320, true)}"/>`);
    parts.push(`<path fill="${colors.ring2}" d="${discPath(200, 200, 52)}"/>`);
  } else {
    parts.push(`<path fill="${colors.ring1}" d="${arcStripe(200, 200, 128, 36, 28, 330, true)}"/>`);
    parts.push(`<path fill="${colors.ring2}" d="${arcStripe(200, 200, 86, 36, 208, 510, true)}"/>`);
    parts.push(`<path fill="${colors.hub}" fill-rule="evenodd" d="${discPath(200, 200, 52)}${holesPath(200, 200, 5, 30, 9.5, -90)}${discPath(200, 200, 8)}"/>`);
  }
  return parts.join('');
};

export const stripeBand = (colors, { left, right, endTop, count = 3, width = 24, gap = 8, radius = 2000, lowest = 0.55 }) => {
  const span = right - left;
  const centerX = left + span * lowest;
  const farthest = Math.max(centerX - left, right - centerX);
  const riseRight = radius - Math.sqrt(radius * radius - (right - centerX) ** 2);
  const riseLeft = radius - Math.sqrt(radius * radius - (centerX - left) ** 2);
  const top = endTop + riseRight;
  const centerY = top - radius;
  const pitch = width + gap;
  const shapes = [];
  for (let i = 0; i < count; i += 1) {
    const r = radius + i * pitch;
    const from = (Math.acos(Math.min(1, (right - centerX + 14) / r)) * 180) / Math.PI;
    const to = 180 - (Math.acos(Math.min(1, (centerX - left + 14) / r)) * 180) / Math.PI;
    shapes.push(`<path fill="${colors[i % colors.length]}" d="${arcStripe(centerX, centerY, r, width, from, to, true)}"/>`);
  }
  const bottom = centerY + radius + (count - 1) * pitch + width / 2;
  return { body: shapes.join(''), bottom, leftTop: top - riseLeft, farthest };
};

const rotatePoint = (x, y, degrees) => {
  const a = (degrees * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

const boundsOf = (points, pad = 6) => {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.floor(Math.min(...xs) - pad);
  const minY = Math.floor(Math.min(...ys) - pad);
  return { minX, minY, width: Math.ceil(Math.max(...xs) + pad) - minX, height: Math.ceil(Math.max(...ys) + pad) - minY };
};

export const lockups = colors => {
  const c = colors;
  const stripes = [c.s1, c.s2, c.s3];
  const full = { rim: c.rim, ring1: c.ring1, ring2: c.ring2, hub: c.hub };
  const simple = { rim: c.rim, ring1: c.ring1, ring2: c.ring2 };

  const size = 150;
  const probe = wordmark(size);
  const left = -probe.bounds.minX;
  const word = wordmark(size, 0, { x: left, y: 0 });
  const wordRight = left + probe.bounds.maxX;
  const band = stripeBand(stripes, { left: 0, right: wordRight + 30, endTop: 66 });
  const pieces = [
    [0, probe.bounds.minY],
    [wordRight, probe.bounds.minY],
    [wordRight + 56, band.bottom],
    [-26, band.bottom],
    [wordRight + 56, 66],
    [-26, band.leftTop],
  ];
  const turned = pieces.map(([x, y]) => rotatePoint(x - wordRight / 2, y - 20, slope));
  const box = boundsOf(turned, 8);
  const pCx = wordRight / 2;
  const primaryBody = `<g transform="translate(${-box.minX} ${-box.minY}) rotate(${slope}) translate(${-pCx} -20)"><path fill="${c.word}" d="${word.d}"/>${band.body}</g>`;
  const primary = { viewBox: [0, 0, box.width, box.height], body: primaryBody };

  const hMark = 150;
  const hSize = 98;
  const hProbe = wordmark(hSize);
  const hWord = wordmark(hSize, 0, { x: -hProbe.bounds.minX, y: 0 });
  const hRight = hProbe.bounds.maxX - hProbe.bounds.minX;
  const hPoints = [[0, hProbe.bounds.minY], [hRight, hProbe.bounds.minY], [hRight, hProbe.bounds.maxY], [0, hProbe.bounds.maxY]].map(([x, y]) => rotatePoint(x - hRight / 2, y, slope));
  const hBox = boundsOf(hPoints, 3);
  const hGap = 26;
  const hWidth = Math.ceil(hMark + hGap + hBox.width);
  const hHeight = hMark;
    const horizontalBody = `<g transform="scale(${hMark / 400})">${badge(simple, { simple: true })}</g><g transform="translate(${hMark + hGap - hRight / 2 - hBox.minX} ${hMark / 2 - (hBox.minY + hBox.height / 2)}) rotate(${slope} ${hRight / 2} 0)"><path fill="${c.word}" d="${hWord.d}"/></g>`;
  const horizontal = { viewBox: [0, 0, hWidth, hHeight], body: horizontalBody };

  const vBadge = 280;
  const vSize = 112;
  const vProbe = wordmark(vSize);
  const vWord = wordmark(vSize, 0, { x: -vProbe.bounds.minX, y: 0 });
  const vRight = vProbe.bounds.maxX - vProbe.bounds.minX;
  const vPoints = [[0, vProbe.bounds.minY], [vRight, vProbe.bounds.minY], [vRight, vProbe.bounds.maxY], [0, vProbe.bounds.maxY]].map(([x, y]) => rotatePoint(x - vRight / 2, y, slope));
  const vBox = boundsOf(vPoints, 3);
  const vBand = stripeBand(stripes, { left: 0, right: vRight + 20, endTop: 0, width: 17, gap: 6, radius: 1800 });
  const note = descriptor(34, 0.14);
  const noteWidth = note.bounds.width;
  const vWidth = Math.ceil(Math.max(vBadge, vBox.width, vRight + 60, noteWidth) + 20);
  const wordY = vBadge + 20 - vBox.minY;
  const bandY = wordY + vBox.minY + vBox.height + 16;
  const noteY = bandY + vBand.bottom + 34;
  const verticalBody = `<g transform="translate(${(vWidth - vBadge) / 2} 0) scale(${vBadge / 400})">${badge(full)}</g><g transform="translate(${(vWidth - vRight) / 2} ${wordY}) rotate(${slope} ${vRight / 2} 0)"><path fill="${c.word}" d="${vWord.d}"/></g><g transform="translate(${(vWidth - vRight - 20) / 2} ${bandY})">${vBand.body}</g><g transform="translate(${(vWidth - noteWidth) / 2 - note.bounds.minX} ${noteY})"><path fill="${c.note}" d="${note.d}"/></g>`;
  const vertical = { viewBox: [0, 0, vWidth, Math.ceil(noteY + 14)], body: verticalBody };

  return { primary, horizontal, vertical, symbol: { viewBox: [0, 0, 400, 400], body: badge(full) } };
};

export const faviconMarkup = colors =>
  `<g transform="translate(200 200) scale(.9) translate(-200 -200)"><path fill="${colors.halo}" stroke="${colors.halo}" stroke-width="44" stroke-linejoin="round" d="${cogPath(200, 200, 12, 198, 170, 8)}"/>${badge({ rim: colors.rim, ring1: colors.ring1, ring2: colors.ring2 }, { simple: true })}</g>`;

export const colorSets = c => ({
  color: { halo: c['krem-jasny'], word: c.brazowy, rim: c.brazowy, ring1: c.pomarancz, ring2: c.musztarda, hub: c.brazowy, s1: c.pomarancz, s2: c.musztarda, s3: c.brazowy, note: c.kawa },
  mono: { word: '#000000', rim: '#000000', ring1: '#000000', ring2: '#000000', hub: '#000000', s1: '#000000', s2: '#000000', s3: '#000000', note: '#000000' },
  negative: { word: c.krem, rim: c.krem, ring1: c.pomarancz, ring2: c.musztarda, hub: c.krem, s1: c.pomarancz, s2: c.musztarda, s3: c.krem, note: c.krem },
});
