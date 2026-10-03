export type Point = readonly [number, number];

export const num = (value: number): string => String(Math.round(value * 10) / 10);

export const rect = (x: number, y: number, w: number, h: number): string =>
  `M${num(x)} ${num(y)}h${num(w)}v${num(h)}h${num(-w)}z`;

export const polygon = (points: readonly Point[]): string =>
  `M${points.map(([x, y]) => `${num(x)} ${num(y)}`).join('L')}z`;

export const arch = (x: number, y: number, w: number, h: number): string => {
  const r = w / 2;
  return `M${num(x)} ${num(y + h)}V${num(y + r)}A${num(r)} ${num(r)} 0 0 1 ${num(x + w)} ${num(y + r)}V${num(y + h)}z`;
};

export const line = (x1: number, y1: number, x2: number, y2: number): string =>
  `M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}`;

export const circle = (cx: number, cy: number, r: number): string =>
  `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`;
