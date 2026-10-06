import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const cell = 30;
const cells = 8;
const tile = cell * cells;

const filled = [
  [1, 1, 'kobalt'],
  [5, 5, 'kobalt'],
  [5, 1, 'mgla'],
  [1, 5, 'mgla'],
];
const notched = [
  [3, 3],
  [7, 7],
];

export const patternSvg = () => {
  const rects = filled.map(([x, y, id]) => `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${c[id]}"/>`).join('');
  const k = cell / 6;
  const doors = notched
    .map(([x, y]) => `<path fill="${c.czern}" d="M${x * cell} ${y * cell}h${cell}v${cell}h${-k}v${-3 * k}h${-2 * k}v${3 * k}h${-3 * k}Z"/>`)
    .join('');
  let lines = '';
  for (let i = 0; i <= cells; i += 1) {
    lines += `M${i * cell} 0V${tile}M0 ${i * cell}H${tile}`;
  }
  let crosses = '';
  for (let i = 0; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      const x = i * cell;
      const y = j * cell;
      crosses += `M${x - 3} ${y}h6M${x} ${y - 3}v6`;
    }
  }
  return optimizeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}">${rects}${doors}<path fill="none" stroke="${c.szary}" stroke-width="1" d="${lines}"/><path fill="none" stroke="${c.czern}" stroke-width="1.5" d="${crosses}"/></svg>`,
    { precision: 1 },
  );
};

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
