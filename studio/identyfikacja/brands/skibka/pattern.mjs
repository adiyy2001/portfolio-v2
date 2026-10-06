import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { mulberry32 } from '../../../../sites/src/identyfikacja/skibka/lib/stamp.ts';
import { brand, c, file } from './theme.mjs';

const tile = 320;

const fmt = n => Number(n.toFixed(1));

const slash = (x, y, angle, length, width) => {
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a) * length / 2;
  const dy = Math.sin(a) * length / 2;
  const nx = -Math.sin(a) * width;
  const ny = Math.cos(a) * width;
  return `M${fmt(x - dx)} ${fmt(y - dy)}Q${fmt(x + nx)} ${fmt(y + ny)} ${fmt(x + dx)} ${fmt(y + dy)}Q${fmt(x - nx * 0.6)} ${fmt(y - ny * 0.6)} ${fmt(x - dx)} ${fmt(y - dy)}Z`;
};

const grain = (x, y, angle, size) => {
  const a = (angle * Math.PI) / 180;
  const pts = [
    [0, -size],
    [size * 0.55, 0],
    [0, size],
    [-size * 0.55, 0],
  ].map(([px, py]) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)]);
  return `M${fmt(pts[0][0])} ${fmt(pts[0][1])}Q${fmt(pts[1][0])} ${fmt(pts[1][1])} ${fmt(pts[2][0])} ${fmt(pts[2][1])}Q${fmt(pts[3][0])} ${fmt(pts[3][1])} ${fmt(pts[0][0])} ${fmt(pts[0][1])}Z`;
};

const wrapped = (x, y, margin, draw) => {
  let d = '';
  for (const ox of [-tile, 0, tile]) {
    for (const oy of [-tile, 0, tile]) {
      const px = x + ox;
      const py = y + oy;
      if (px > -margin && px < tile + margin && py > -margin && py < tile + margin) d += draw(px, py);
    }
  }
  return d;
};

export const patternParts = (seed = 21) => {
  const rng = mulberry32(seed);
  const cells = 6;
  const step = tile / cells;
  let slashes = '';
  let grains = '';
  let dots = '';
  for (let i = 0; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      const x = i * step + step * (0.25 + rng() * 0.5);
      const y = j * step + step * (0.25 + rng() * 0.5);
      const kind = rng();
      if (kind < 0.34) {
        const angle = 52 + (rng() - 0.5) * 24;
        const lengths = [22 + rng() * 5, 22 + rng() * 5, 22 + rng() * 5];
        for (let k = -1; k <= 1; k += 1) {
          const ox = x + k * 9;
          const oy = y + k * 1.5;
          slashes += wrapped(ox, oy, 30, (px, py) => slash(px, py, angle, lengths[k + 1], 2.2));
        }
      } else if (kind < 0.7) {
        const rotation = rng() * 180;
        const size = 6 + rng() * 2;
        grains += wrapped(x, y, 20, (px, py) => grain(px, py, rotation, size));
      } else {
        const rotation = rng() * 180;
        const size = 1.8 + rng();
        dots += wrapped(x, y, 10, (px, py) => grain(px, py, rotation, size));
      }
    }
  }
  return { slashes, grains, dots };
};

export const patternSvg = ({ ink = c['lan-jasny'], second = c.mioz, third = c.skorka } = {}) => {
  const { slashes, grains, dots } = patternParts();
  return optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}"><path fill="${ink}" d="${grains}"/><path fill="${second}" d="${slashes}"/><path fill="${third}" d="${dots}"/></svg>`, { precision: 1 });
};

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
