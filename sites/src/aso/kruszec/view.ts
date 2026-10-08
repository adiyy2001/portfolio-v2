const months = 61;

const bump = (i: number, c: number, w: number) => Math.exp(-(((i - c) / w) ** 2));

const raw = (i: number) =>
  0.47 +
  0.53 * (i / 60) ** 1.08 -
  0.04 * bump(i, 11, 4.5) -
  0.022 * bump(i, 41, 2.6) -
  0.012 * bump(i, 52, 1.8) +
  0.006 * Math.sin(i * 1.7) +
  0.004 * Math.sin(i * 0.63 + 1);

export const shape = Array.from({ length: months }, (_, i) => raw(i) / raw(months - 1));

const round = (value: number) => Math.round(value * 10) / 10;

export const linePoints = (
  values: number[],
  {
    width,
    height,
    top = 0,
    bottom = 0,
  }: { width: number; height: number; top?: number; bottom?: number },
) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value, i) => [
    round((width * i) / (values.length - 1)),
    round(height - bottom - ((height - top - bottom) * (value - min)) / (max - min)),
  ]);
};

export const linePath = (points: number[][]) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

export const areaPath = (points: number[][], height: number) => {
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath(points)} L${last[0]} ${height} L${first[0]} ${height} Z`;
};

export const heroLine = () => {
  const points = linePoints(shape, { width: 1200, height: 360, top: 40, bottom: 60 });
  return { line: linePath(points), area: areaPath(points, 360), end: points[points.length - 1] };
};

export const tileLine = () => {
  const points = linePoints(shape, { width: 400, height: 80, top: 10, bottom: 10 });
  return { line: linePath(points), end: points[points.length - 1] };
};
