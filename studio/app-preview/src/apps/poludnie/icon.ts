import { color } from './tokens';

const C = Math.cos(Math.PI / 6);
const L = 290;
const ox = 512;
const oy = 540;
const P = (x: number, y: number, z: number) => [ox + (x - y) * C * 1, oy + (x + y) / 2 - z] as const;
const poly = (list: (readonly [number, number])[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const cells = () => {
  const out: string[] = [];
  const n = 3;
  const m = 26;
  const gap = 14;
  const size = (L - 2 * m - (n - 1) * gap) / n;
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const y0 = m + c * (size + gap);
      const z1 = L - m - r * (size + gap);
      const y1 = y0 + size;
      const z0 = z1 - size;
      out.push(`<polygon points="${poly([P(L, y0, z0), P(L, y1, z0), P(L, y1, z1), P(L, y0, z1)])}" fill="${color.panel}"/>`);
    }
  }
  return out.join('');
};

export const iconSvg = ({ rounded = false, id = 'p', sun = 1, lift = 0 }: { rounded?: boolean; id?: string; sun?: number; lift?: number } = {}) => {
  const r = 0.3 * L * sun;
  const [cx, cy] = P(L / 2, L / 2, L);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%" data-id="${id}">`,
    `<rect width="1024" height="1024" rx="${rounded ? 228 : 0}" fill="${color.ground}"/>`,
    `<g transform="translate(0 ${(-lift).toFixed(2)})">`,
    `<polygon points="${poly([P(0, L, 0), P(L, L, 0), P(L, L, L), P(0, L, L)])}" fill="${color.left}"/>`,
    `<polygon points="${poly([P(L, 0, 0), P(L, L, 0), P(L, L, L), P(L, 0, L)])}" fill="${color.right}"/>`,
    cells(),
    `<polygon points="${poly([P(0, 0, L), P(L, 0, L), P(L, L, L), P(0, L, L)])}" fill="${color.card}"/>`,
    r > 0.5 ? `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(r * 1.2247).toFixed(1)}" ry="${(r * 0.7071).toFixed(1)}" fill="${color.sun}"/>` : '',
    `</g>`,
    `</svg>`,
  ].join('');
};
