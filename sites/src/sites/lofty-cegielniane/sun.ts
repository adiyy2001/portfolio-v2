import type { TypeKey } from './data';

export type DayKey = 'mar' | 'jun' | 'dec';
type Point = [number, number];

interface WindowSpan {
  wall: 'S' | 'W';
  a: number;
  b: number;
}

interface SunLoft {
  w: number;
  d: number;
  zone: { x: number; y: number; w: number; h: number };
  windows: WindowSpan[];
}

const LAT = (51.11 * Math.PI) / 180;
const SILL = 0.4;
const HEAD = 3.0;
const MIN_PATCH = 0.4;

export const days: Record<DayKey, { dec: number; noon: number; label: string }> = {
  mar: { dec: 0, noon: 12.0, label: '21 marca' },
  jun: { dec: (23.44 * Math.PI) / 180, noon: 12.9, label: '21 czerwca' },
  dec: { dec: (-23.44 * Math.PI) / 180, noon: 11.85, label: '21 grudnia' },
};

export const dayKeys: DayKey[] = ['mar', 'jun', 'dec'];

export const sunLofts: Record<TypeKey, SunLoft> = {
  '37': {
    w: 5.2,
    d: 7.115,
    zone: { x: 0, y: 3.0, w: 5.2, h: 4.115 },
    windows: [{ wall: 'S', a: 1.7, b: 3.5 }],
  },
  '52': {
    w: 6.4,
    d: 8.125,
    zone: { x: 0, y: 4.0625, w: 6.4, h: 4.0625 },
    windows: [
      { wall: 'S', a: 1.2, b: 2.8 },
      { wall: 'S', a: 3.6, b: 5.2 },
    ],
  },
  '64': {
    w: 7.2,
    d: 8.889,
    zone: { x: 0, y: 4.722, w: 7.2, h: 4.167 },
    windows: [
      { wall: 'S', a: 0.9, b: 2.5 },
      { wall: 'S', a: 3.1, b: 4.7 },
      { wall: 'S', a: 5.3, b: 6.9 },
    ],
  },
  '112': {
    w: 9.6,
    d: 11.667,
    zone: { x: 0, y: 6.667, w: 9.6, h: 5.0 },
    windows: [
      { wall: 'S', a: 0.8, b: 2.2 },
      { wall: 'S', a: 2.9, b: 4.3 },
      { wall: 'S', a: 5.0, b: 6.4 },
      { wall: 'S', a: 7.1, b: 8.5 },
      { wall: 'W', a: 7.6, b: 10.4 },
    ],
  },
};

export const sunAt = (day: DayKey, t: number) => {
  const { dec, noon } = days[day];
  const hour = ((t - noon) * 15 * Math.PI) / 180;
  const sinE = Math.sin(LAT) * Math.sin(dec) + Math.cos(LAT) * Math.cos(dec) * Math.cos(hour);
  const e = Math.asin(sinE);
  const a = Math.atan2(
    Math.sin(hour),
    Math.cos(hour) * Math.sin(LAT) - Math.tan(dec) * Math.cos(LAT),
  );
  return { e, a };
};

const clipAgainst = (
  points: Point[],
  inside: (p: Point) => boolean,
  cross: (a: Point, b: Point) => Point,
) => {
  const out: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const cur = points[i];
    const prev = points[(i + points.length - 1) % points.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn) {
      if (!prevIn) out.push(cross(prev, cur));
      out.push(cur);
    } else if (prevIn) {
      out.push(cross(prev, cur));
    }
  }
  return out;
};

export const clipPoly = (poly: Point[], x0: number, y0: number, x1: number, y1: number) => {
  let p = clipAgainst(
    poly,
    q => q[0] >= x0,
    (a, b) => [x0, a[1] + ((x0 - a[0]) / (b[0] - a[0])) * (b[1] - a[1])],
  );
  if (!p.length) return p;
  p = clipAgainst(
    p,
    q => q[0] <= x1,
    (a, b) => [x1, a[1] + ((x1 - a[0]) / (b[0] - a[0])) * (b[1] - a[1])],
  );
  if (!p.length) return p;
  p = clipAgainst(
    p,
    q => q[1] >= y0,
    (a, b) => [a[0] + ((y0 - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), y0],
  );
  if (!p.length) return p;
  return clipAgainst(
    p,
    q => q[1] <= y1,
    (a, b) => [a[0] + ((y1 - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), y1],
  );
};

export const polyArea = (p: Point[]) => {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[(i + 1) % p.length];
    s += p[i][0] * q[1] - q[0] * p[i][1];
  }
  return Math.abs(s) / 2;
};

export const patches = (loft: SunLoft, day: DayKey, t: number) => {
  const s = sunAt(day, t);
  if (s.e <= 0.02) return [];
  const cot = Math.min(40, 1 / Math.tan(s.e));
  const rx = Math.sin(s.a);
  const ry = -Math.cos(s.a);
  const sx = -Math.sin(s.a);
  const sy = Math.cos(s.a);
  const out: Point[][] = [];
  for (const w of loft.windows) {
    const nx = w.wall === 'S' ? 0 : -1;
    const ny = w.wall === 'S' ? 1 : 0;
    if (sx * nx + sy * ny <= 0.02) continue;
    const p0: Point = w.wall === 'S' ? [w.a, loft.d] : [0, w.a];
    const p1: Point = w.wall === 'S' ? [w.b, loft.d] : [0, w.b];
    const l0 = SILL * cot;
    const l1 = HEAD * cot;
    const poly: Point[] = [
      [p0[0] + rx * l0, p0[1] + ry * l0],
      [p1[0] + rx * l0, p1[1] + ry * l0],
      [p1[0] + rx * l1, p1[1] + ry * l1],
      [p0[0] + rx * l1, p0[1] + ry * l1],
    ];
    const clipped = clipPoly(poly, 0, 0, loft.w, loft.d);
    if (clipped.length >= 3) out.push(clipped);
  }
  return out;
};

export const livingPatches = (loft: SunLoft, day: DayKey, t: number) => {
  const z = loft.zone;
  const list: Point[][] = [];
  for (const poly of patches(loft, day, t)) {
    const c = clipPoly(poly, z.x, z.y, z.x + z.w, z.y + z.h);
    if (c.length >= 3) list.push(c);
  }
  return list;
};

export const livingSun = (key: TypeKey, day: DayKey, t: number) => {
  const loft = sunLofts[key];
  let total = 0;
  for (const c of livingPatches(loft, day, t)) total += polyArea(c);
  return Math.min(total, loft.zone.w * loft.zone.h);
};

export const zoneArea = (key: TypeKey) => sunLofts[key].zone.w * sunLofts[key].zone.h;

export const dayHours = (key: TypeKey, day: DayKey) => {
  let count = 0;
  for (let t = 8; t < 18; t += 0.25) {
    if (livingSun(key, day, t) > MIN_PATCH) count++;
  }
  return count * 0.25;
};

export const isLit = (key: TypeKey, day: DayKey, t: number) => livingSun(key, day, t) > MIN_PATCH;

export const formatTime = (t: number) => {
  const h = Math.floor(t + 1e-6);
  const m = Math.round((t - h) * 60);
  return `${h}:${m < 10 ? '0' : ''}${m}`;
};
