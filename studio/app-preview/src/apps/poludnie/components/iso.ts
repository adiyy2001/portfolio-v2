export const C = Math.cos(Math.PI / 6);
export const S = 0.5;

export type V3 = [number, number, number];

export const P = (x: number, y: number, z = 0): [number, number] => [(x - y) * C, (x + y) * S - z];

export const pts = (list: V3[]) => list.map(([x, y, z]) => P(x, y, z).map(n => n.toFixed(2)).join(',')).join(' ');

export const pathOf = (list: V3[]) =>
  list
    .map(([x, y, z], i) => {
      const [a, b] = P(x, y, z);
      return `${i ? 'L' : 'M'}${a.toFixed(2)} ${b.toFixed(2)}`;
    })
    .join(' ');

export const lengthOf = (list: V3[]) =>
  list.slice(1).reduce((sum, p, i) => {
    const [a, b] = P(...list[i]);
    const [c, d] = P(...p);
    return sum + Math.hypot(c - a, d - b);
  }, 0);

export interface Box {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

export const faces = ({ x, y, z, dx, dy, dz }: Box) => {
  const x1 = x + dx;
  const y1 = y + dy;
  const z1 = z + dz;
  return {
    top: pts([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]]),
    right: pts([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]]),
    left: pts([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]]),
  };
};

export const rect = (list: V3[]) => pts(list);
