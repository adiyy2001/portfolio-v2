import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const tile = 240;
const rows = 12;
const gap = tile / rows;
const points = 24;

const fmt = n => Number(n.toFixed(1));

const threadPath = (y0, phase, amp, cycles) => {
  const pts = [];
  for (let i = -1; i <= points + 1; i += 1) {
    const x = (tile * i) / points;
    pts.push([x, y0 + amp * Math.sin((2 * Math.PI * cycles * x) / tile + phase)]);
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(pts[0], pts[1]);
  let d = `M${fmt(start[0])} ${fmt(start[1])}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const end = mid(pts[i], pts[i + 1]);
    d += `Q${fmt(pts[i][0])} ${fmt(pts[i][1])} ${fmt(end[0])} ${fmt(end[1])}`;
  }
  return d;
};

export const patternParts = () => {
  const ink = [];
  const accent = [];
  for (let j = -1; j <= rows; j += 1) {
    const d = threadPath(gap * j + gap / 2, (Math.PI * 2 * j) / rows * 1.5, gap * 0.78, 2);
    (((j % rows) + rows) % rows) % 4 === 0 ? accent.push(d) : ink.push(d);
  }
  return { ink: ink.join(''), accent: accent.join('') };
};

export const patternSvg = ({ thread = c.atrament, accent = c.piatek, width = 2.4 } = {}) => {
  const parts = patternParts();
  return optimizeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}"><g fill="none" stroke-width="${width}"><path stroke="${thread}" d="${parts.ink}"/><path stroke="${accent}" stroke-width="${width * 1.6}" d="${parts.accent}"/></g></svg>`,
    { precision: 1 },
  );
};

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
