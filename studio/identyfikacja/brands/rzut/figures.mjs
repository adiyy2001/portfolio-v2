import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, viewBoxOf } from '../../lib/svg.mjs';
import { brand, c, logoColors } from './theme.mjs';
import { cap, symbolPath, textPath, unit, wordmark } from './logo-parts.mjs';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg, { precision: 1 })}\n`);
const svgWrap = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const gridLines = (w, h, step, color = c.mgla) => {
  let d = '';
  for (let x = 0; x <= w; x += step) d += `M${x} 0V${h}`;
  for (let y = 0; y <= h; y += step) d += `M0 ${y}H${w}`;
  return `<path fill="none" stroke="${color}" stroke-width="1" d="${d}"/>`;
};

const label = (text, x, y, { size = 11, anchor = 'start', fill = c.grafit } = {}) =>
  `<path fill="${fill}" d="${textPath(text, { size, x, y, width: 75, tracking: 0.06, anchor, fit: 0.1 }).d}"/>`;

const dimH = (x1, x2, y, text) =>
  `<path fill="none" stroke="${c.czern}" stroke-width="1" d="M${x1} ${y}H${x2}M${x1} ${y - 4}v8M${x2} ${y - 4}v8"/>${label(text, (x1 + x2) / 2, y - 7, { anchor: 'middle' })}`;

const dimV = (x, y1, y2, text) =>
  `<path fill="none" stroke="${c.czern}" stroke-width="1" d="M${x} ${y1}V${y2}M${x - 4} ${y1}h8M${x - 4} ${y2}h8"/>${label(text, x + 8, (y1 + y2) / 2 + 4)}`;

export const buildFigures = () => {
  const small = 0.3;
  const placed = (x, y, scale, w) => `<g transform="translate(${x} ${y}) scale(${scale})"><path fill="${c.czern}" d="${w.d}"/></g>`;
  const word = wordmark({ x: 0, baseline: cap });

  const numeral = textPath('01', { size: 50, x: 24 + word.width * small + 8, y: 84 + cap * small, weight: 700, width: 75, fit: 0.1 });
  figure(
    'direction-indeks.svg',
    svgWrap(200, 200, `${gridLines(200, 200, 20)}${placed(24, 84, small, word)}<path fill="${c.kobalt}" d="${numeral.d}"/>${label('RZUT 01', 24, 150, { size: 10 })}`),
  );

  const zx = 24 + word.centers[1] * small;
  figure(
    'direction-os.svg',
    svgWrap(
      200,
      200,
      `${gridLines(200, 200, 20)}${placed(24, 84, small, word)}<path fill="none" stroke="${c.kobalt}" stroke-width="1.5" d="M${zx.toFixed(1)} 48V${(84 + cap * small + 36).toFixed(1)}"/><rect x="${(zx - 3.5).toFixed(1)}" y="44.5" width="7" height="7" fill="${c.kobalt}"/>${label('OŚ', 24, 150, { size: 10 })}`,
    ),
  );

  const horizontal = logoColors('horizontal');
  const [, , hw, hh] = viewBoxOf(horizontal);
  const inner = horizontal.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '');
  figure(
    'direction-modul.svg',
    svgWrap(200, 200, `${gridLines(200, 200, 20)}<g transform="translate(14 ${(100 - (hh * 0.35) / 2).toFixed(1)}) scale(0.35)">${inner}</g>${label('MODUŁ', 24, 150, { size: 10 })}`),
  );

  const plain = wordmark({ x: 12, baseline: 150, kern: {}, track: 0 });
  const kerned = wordmark({ x: 12, baseline: 150 });
  const width = Math.ceil(Math.max(plain.maxX, kerned.maxX) + 16);
  const xHeight = 150 - 0.51 * (cap / 0.72);
  const lines = `<path fill="none" stroke="${c.kobalt}" stroke-width="1" stroke-dasharray="4 4" d="M0 150H${width}M0 ${150 - cap}H${width}M0 ${xHeight.toFixed(1)}H${width}"/>`;
  figure('wordmark-default.svg', svgWrap(width, 190, `${lines}<path fill="${c.grafit}" d="${plain.d}"/>`));
  figure('wordmark-kerned.svg', svgWrap(width, 190, `${lines}<path fill="${c.czern}" d="${kerned.d}"/>`));

  const margin = unit * 3;
  const total = [hw + margin * 2, hh + margin * 2];
  const frame = `M0 0H${total[0]}V${total[1]}H0ZM${margin} ${margin}V${total[1] - margin}H${total[0] - margin}V${margin}Z`;
  figure(
    'clearspace.svg',
    svgWrap(
      total[0],
      total[1] + 36,
      `<path fill="${c.mgla}" fill-rule="evenodd" d="${frame}"/><rect x="${margin}" y="${margin}" width="${hw}" height="${hh}" fill="none" stroke="${c.kobalt}" stroke-width="1" stroke-dasharray="5 4"/><g transform="translate(${margin} ${margin})">${inner}</g>${dimH(0, margin, margin / 2, 'M/2')}${dimH(total[0] - margin, total[0], margin / 2, 'M/2')}${dimV(total[0] / 2, total[1] - margin, total[1], 'M/2')}${label('M = BOK KWADRATU = 6U', margin, total[1] + 26, { size: 13 })}`,
    ),
  );

  const k = 20;
  const ox = 60;
  const oy = 44;
  figure(
    'construction.svg',
    svgWrap(
      250,
      230,
      `<g transform="translate(${ox} ${oy})">${gridLines(120, 120, k, c.szary)}<path fill="${c.kobalt}" d="${symbolPath(120)}"/><path fill="none" stroke="${c.czern}" stroke-width="1" stroke-dasharray="3 3" d="M60 60H100V120"/></g>${dimH(ox, ox + 120, 30, 'M = 6U')}${dimV(ox + 120 + 16, oy + 60, oy + 120, '3U')}${dimH(ox + 60, ox + 100, oy + 120 + 22, '2U')}${label('U = M / 6', ox, 216, { size: 13 })}`,
    ),
  );
  return { unit };
};
