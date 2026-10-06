export type Rng = () => number;
export type Point = [number, number];

export const hashSeed = (input: string | number): number => {
  const text = String(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const mulberry32 = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const stamp = {
  size: 400,
  center: 200,
  bandOuter: 188,
  bandInner: 175,
  thinOuter: 129,
  thinInner: 124.5,
  textRadius: 142,
  textSize: 30,
  loaf: { cx: 200, cy: 202, rx: 86, ry: 54, tilt: -14 },
} as const;

const fmt = (value: number) => {
  const text = value.toFixed(1);
  return text.endsWith('.0') ? text.slice(0, -2) : text;
};

export const smoothClosed = (points: Point[]): string => {
  const n = points.length;
  const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  let d = `M${fmt(start[0])} ${fmt(start[1])}`;
  for (let i = 0; i < n; i += 1) {
    const control = points[i];
    const end = mid(points[i], points[(i + 1) % n]);
    d += `Q${fmt(control[0])} ${fmt(control[1])} ${fmt(end[0])} ${fmt(end[1])}`;
  }
  return `${d}Z`;
};

interface RingOptions {
  radius: number;
  points: number;
  amplitude: number;
  fine: number;
  phases: number[];
  rng: Rng;
  cx?: number;
  cy?: number;
}

const ringPoints = ({
  radius,
  points,
  amplitude,
  fine,
  phases,
  rng,
  cx = stamp.center,
  cy = stamp.center,
}: RingOptions): Point[] =>
  Array.from({ length: points }, (_, i) => {
    const theta = (i / points) * Math.PI * 2;
    const low =
      amplitude * Math.sin(2 * theta + phases[0]) +
      amplitude * 0.6 * Math.sin(3 * theta + phases[1]) +
      amplitude * 0.35 * Math.sin(5 * theta + phases[2]);
    const r = radius + low + (rng() - 0.5) * 2 * fine;
    return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)];
  });

const band = (rng: Rng, outer: number, inner: number, phases: number[], pointsOuter = 36) => {
  const a = ringPoints({
    radius: outer,
    points: pointsOuter,
    amplitude: 2.3,
    fine: 0.8,
    phases,
    rng,
  });
  const b = ringPoints({
    radius: inner,
    points: Math.round(pointsOuter * 0.75),
    amplitude: 2.0,
    fine: 0.8,
    phases,
    rng,
  });
  return `${smoothClosed(a)}${smoothClosed(b)}`;
};

const specksPath = (rng: Rng, count: number, rMin: number, rMax: number) => {
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const angle = rng() * Math.PI * 2;
    const radius = rMin + rng() * (rMax - rMin);
    const cx = stamp.center + radius * Math.cos(angle);
    const cy = stamp.center + radius * Math.sin(angle);
    const size = 0.9 + rng() * 2.3;
    const rotation = rng() * Math.PI;
    const sides = 4;
    const pts: Point[] = Array.from({ length: sides }, (_, k) => {
      const a = rotation + (k / sides) * Math.PI * 2;
      const s = size * (0.7 + rng() * 0.6);
      return [cx + s * Math.cos(a), cy + s * Math.sin(a)];
    });
    d += `M${pts.map(p => `${fmt(p[0])} ${fmt(p[1])}`).join('L')}Z`;
  }
  return d;
};

export interface StampArt {
  band: string;
  thin: string;
  specks: string;
}

export const stampArt = (seed: number): StampArt => {
  const rng = mulberry32(seed);
  const phases = [rng() * 6.28, rng() * 6.28, rng() * 6.28];
  const bandPath = band(rng, stamp.bandOuter, stamp.bandInner, phases);
  const thinPoints = (radius: number) =>
    ringPoints({ radius, points: 22, amplitude: 0.9, fine: 0.35, phases, rng });
  const thin = `${smoothClosed(thinPoints(stamp.thinOuter))}${smoothClosed(thinPoints(stamp.thinInner))}`;
  const specks = `${specksPath(rng, 7, stamp.bandInner + 1, stamp.bandOuter - 1)}${specksPath(rng, 3, stamp.thinInner - 0.5, stamp.thinOuter)}`;
  return { band: bandPath, thin, specks };
};

export const faviconArt = (seed: number) => {
  const rng = mulberry32(seed);
  const phases = [rng() * 6.28, rng() * 6.28, rng() * 6.28];
  return band(rng, 190, 160, phases, 36);
};

export interface LoafParts {
  body: string;
  cuts: string;
  dots: string;
}

const rotate = (point: Point, angleDeg: number, cx: number, cy: number): Point => {
  const a = (angleDeg * Math.PI) / 180;
  const dx = point[0] - cx;
  const dy = point[1] - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
};

export const loafParts = (seed: number, scale = 1): LoafParts => {
  const rng = mulberry32(seed);
  const { cx, cy, tilt } = stamp.loaf;
  const rx = stamp.loaf.rx * scale;
  const ry = stamp.loaf.ry * scale;
  const phases = [rng() * 6.28, rng() * 6.28, rng() * 6.28];
  const bodyPoints: Point[] = Array.from({ length: 32 }, (_, i) => {
    const theta = (i / 32) * Math.PI * 2;
    const wobble =
      1 +
      0.018 * Math.sin(2 * theta + phases[0]) +
      0.012 * Math.sin(3 * theta + phases[1]) +
      (rng() - 0.5) * 0.012;
    const flat = 1 - 0.07 * Math.max(0, Math.sin(theta)) ** 2;
    return rotate(
      [cx + rx * wobble * Math.cos(theta), cy + ry * wobble * flat * Math.sin(theta)],
      tilt,
      cx,
      cy,
    );
  });
  const lens = (center: Point, length: number, width: number, angle: number) => {
    const half = length / 2;
    const p0: Point = [center[0] - half, center[1]];
    const p1: Point = [center[0] + half, center[1]];
    const top: Point = [center[0], center[1] - width];
    const bottom: Point = [center[0], center[1] + width * 0.7];
    return [p0, top, p1, bottom].map(p => rotate(p, angle, center[0], center[1]));
  };
  let cuts = '';
  [-1, 0, 1].forEach((k, index) => {
    const offset: Point = [cx + k * rx * 0.46 + (rng() - 0.5) * 2, cy + (rng() - 0.5) * 2 - 1];
    const [p0, top, p1, bottom] = lens(
      offset,
      ry * 1.12,
      5.2 + index * 0.4,
      62 + (rng() - 0.5) * 6,
    );
    const r0 = rotate(p0, tilt, cx, cy);
    const r1 = rotate(p1, tilt, cx, cy);
    const rt = rotate(top, tilt, cx, cy);
    const rb = rotate(bottom, tilt, cx, cy);
    cuts += `M${fmt(r0[0])} ${fmt(r0[1])}Q${fmt(rt[0])} ${fmt(rt[1])} ${fmt(r1[0])} ${fmt(r1[1])}Q${fmt(rb[0])} ${fmt(rb[1])} ${fmt(r0[0])} ${fmt(r0[1])}Z`;
  });
  let dots = '';
  for (let i = 0; i < 7; i += 1) {
    const theta = rng() * Math.PI * 2;
    const k = 0.68 + rng() * 0.2;
    const base: Point = [cx + rx * k * Math.cos(theta), cy + ry * k * Math.sin(theta)];
    const p = rotate(base, tilt, cx, cy);
    const s = 1 + rng() * 1.1;
    dots += `M${fmt(p[0] - s)} ${fmt(p[1])}L${fmt(p[0])} ${fmt(p[1] - s)}L${fmt(p[0] + s)} ${fmt(p[1])}L${fmt(p[0])} ${fmt(p[1] + s)}Z`;
  }
  return { body: smoothClosed(bodyPoints), cuts, dots };
};

export const imprint = (n: number) => {
  const rng = mulberry32(hashSeed(`odbitka-${n}`));
  return {
    art: stampArt(hashSeed(`rim-${n}`)),
    rotation: Number(((rng() - 0.5) * 22).toFixed(1)),
    opacity: Number((0.78 + rng() * 0.18).toFixed(2)),
    offsetX: Number(((rng() - 0.5) * 6).toFixed(1)),
    offsetY: Number(((rng() - 0.5) * 6).toFixed(1)),
  };
};
