import { C, hex } from './tokens';
import { CLEAR, FB } from './pixel/fb';

const half = (y: number) => {
  if (y < 11) return 0;
  if (y <= 18) return 12;
  return Math.max(2, 12 - Math.round((y - 18) * 1.05));
};

const corner = [7, 5, 3, 2, 1, 1, 0];

export const iconFb = (rounded: boolean) => {
  const fb = new FB(32, 32, C.sky);
  fb.rect(0, 0, 32, 7, C.skyMid);
  fb.dither(0, 7, 32, 5, C.skyMid, C.sky, 8);
  fb.rect(0, 27, 32, 5, C.leaf);
  fb.dither(0, 27, 32, 2, C.sprout, C.leaf, 8);
  const cx = 16;
  const inside = (x: number, y: number) => {
    const h = half(y);
    return h > 0 && x >= cx - h && x < cx + h && y <= 29;
  };
  for (let y = 10; y <= 30; y += 1)
    for (let x = 0; x < 32; x += 1) {
      if (!inside(x, y)) continue;
      const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
      if (edge) fb.set(x, y, C.ink);
      else if (x - cx > 5 - (y - 18) * 0.4 || y >= 27) fb.set(x, y, C.berryDeep);
      else if (x < cx - 7 && y < 18) fb.set(x, y, C.berryLight);
      else fb.set(x, y, C.berry);
    }
  for (const [x, y] of [
    [9, 15],
    [22, 15],
    [12, 23],
    [19, 23],
    [16, 27],
    [7, 19],
    [24, 20],
  ])
    fb.set(x, y, C.gold);
  fb.rect(11, 16, 2, 3, C.ink);
  fb.rect(19, 16, 2, 3, C.ink);
  fb.set(11, 16, C.white);
  fb.set(19, 16, C.white);
  fb.rect(14, 21, 1, 1, C.ink);
  fb.rect(17, 21, 1, 1, C.ink);
  fb.rect(15, 22, 2, 1, C.ink);
  const leaves = [
    '.......kk.kk.kk.......',
    '......kssksskssk......',
    '...kkkseeseeseeskkk...',
    '..kssseeeeffeeeesssk..',
    '...kkeeeffffffeeekk...',
    '.....kkkkkffkkkkk.....',
  ];
  leaves.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx += 1) {
      const ch = row[rx];
      const c = ch === 'k' ? C.ink : ch === 's' ? C.sprout : ch === 'e' ? C.leaf : ch === 'f' ? C.forest : CLEAR;
      fb.set(5 + rx, 6 + ry, c);
    }
  });
  fb.rect(15, 2, 2, 5, C.ink);
  fb.rect(16, 3, 1, 3, C.forest);
  if (rounded)
    corner.forEach((n, y) => {
      for (let x = 0; x < n; x += 1) {
        fb.set(x, y, CLEAR);
        fb.set(31 - x, y, CLEAR);
        fb.set(x, 31 - y, CLEAR);
        fb.set(31 - x, 31 - y, CLEAR);
      }
    });
  return fb;
};

export const iconSvg = ({ rounded = false }: { rounded?: boolean; id?: string } = {}) => {
  const fb = iconFb(rounded);
  const rects: string[] = [];
  for (let y = 0; y < 32; y += 1) {
    let x = 0;
    while (x < 32) {
      const c = fb.get(x, y);
      let run = 1;
      while (x + run < 32 && fb.get(x + run, y) === c) run += 1;
      if (c !== CLEAR) rects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${hex[c]}"/>`);
      x += run;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%" shape-rendering="crispEdges">${rects.join('')}</svg>`;
};
