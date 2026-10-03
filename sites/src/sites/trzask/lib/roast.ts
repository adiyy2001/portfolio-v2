import type { RoastProfile } from '../data/types';

export interface Knot {
  x: number;
  y: number;
}

export interface SplineSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  m0: number;
  m1: number;
}

export type PhaseId = 'drying' | 'maillard' | 'development';

export type MarkerId = 'charge' | 'turning' | 'dry' | 'first' | 'second' | 'drop';

export interface Marker {
  id: MarkerId;
  label: string;
  at: number;
  temp: number;
}

export interface Phase {
  id: PhaseId;
  label: string;
  from: number;
  to: number;
}

export const roastDomain = { maxSeconds: 750, minTemp: 60, maxTemp: 240 } as const;

export const phaseLabels: Record<PhaseId, string> = {
  drying: 'Suszenie',
  maillard: 'Reakcje Maillarda',
  development: 'Rozwój',
};

const sign = (value: number): number => (value > 0 ? 1 : value < 0 ? -1 : 0);

const endSlope = (h0: number, h1: number, d0: number, d1: number): number => {
  const slope = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);
  if (sign(slope) !== sign(d0)) return 0;
  if (sign(d0) !== sign(d1) && Math.abs(slope) > 3 * Math.abs(d0)) return 3 * d0;
  return slope;
};

export const monotoneSlopes = (knots: Knot[]): number[] => {
  const count = knots.length;
  const spans: number[] = [];
  const deltas: number[] = [];
  for (let index = 0; index < count - 1; index += 1) {
    const span = knots[index + 1].x - knots[index].x;
    spans.push(span);
    deltas.push((knots[index + 1].y - knots[index].y) / span);
  }
  if (count === 2) return [deltas[0], deltas[0]];
  const slopes: number[] = new Array<number>(count).fill(0);
  for (let index = 1; index < count - 1; index += 1) {
    if (deltas[index - 1] * deltas[index] > 0) {
      const w1 = 2 * spans[index] + spans[index - 1];
      const w2 = spans[index] + 2 * spans[index - 1];
      slopes[index] = (w1 + w2) / (w1 / deltas[index - 1] + w2 / deltas[index]);
    }
  }
  slopes[0] = endSlope(spans[0], spans[1], deltas[0], deltas[1]);
  slopes[count - 1] = endSlope(
    spans[count - 2],
    spans[count - 3],
    deltas[count - 2],
    deltas[count - 3],
  );
  return slopes;
};

export const buildSegments = (knots: Knot[]): SplineSegment[] => {
  const slopes = monotoneSlopes(knots);
  return knots.slice(0, -1).map((knot, index) => ({
    x0: knot.x,
    y0: knot.y,
    x1: knots[index + 1].x,
    y1: knots[index + 1].y,
    m0: slopes[index],
    m1: slopes[index + 1],
  }));
};

export const profileKnots = (profile: RoastProfile): Knot[] => {
  const knots: Knot[] = [
    { x: 0, y: profile.charge },
    { x: profile.turningPoint.at, y: profile.turningPoint.temp },
    { x: profile.dryEnd.at, y: profile.dryEnd.temp },
    { x: profile.firstCrack.at, y: profile.firstCrack.temp },
  ];
  if (profile.secondCrack) {
    knots.push({ x: profile.secondCrack.at, y: profile.secondCrack.temp });
  }
  knots.push({ x: profile.drop.at, y: profile.drop.temp });
  return knots;
};

export const profileSegments = (profile: RoastProfile): SplineSegment[] =>
  buildSegments(profileKnots(profile));

const evaluateSegment = (segment: SplineSegment, x: number): number => {
  const span = segment.x1 - segment.x0;
  const t = (x - segment.x0) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * segment.y0 +
    (t3 - 2 * t2 + t) * span * segment.m0 +
    (-2 * t3 + 3 * t2) * segment.y1 +
    (t3 - t2) * span * segment.m1
  );
};

export const tempAt = (profile: RoastProfile, seconds: number): number => {
  const segments = profileSegments(profile);
  const clamped = Math.min(profile.drop.at, Math.max(0, seconds));
  const segment =
    segments.find(entry => clamped >= entry.x0 && clamped <= entry.x1) ??
    segments[segments.length - 1];
  return evaluateSegment(segment, clamped);
};

export const riseAt = (profile: RoastProfile, seconds: number): number => {
  const before = tempAt(profile, seconds - 10);
  const after = tempAt(profile, seconds + 10);
  const span = Math.min(profile.drop.at, seconds + 10) - Math.max(0, seconds - 10);
  return span > 0 ? ((after - before) / span) * 60 : 0;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

export type PointMapper = (seconds: number, temp: number) => [number, number];

export const roastPath = (profile: RoastProfile, map: PointMapper): string => {
  const segments = profileSegments(profile);
  const first = segments[0];
  const [startX, startY] = map(first.x0, first.y0);
  const parts = [`M${round2(startX)} ${round2(startY)}`];
  for (const segment of segments) {
    const span = segment.x1 - segment.x0;
    const [c1x, c1y] = map(segment.x0 + span / 3, segment.y0 + (segment.m0 * span) / 3);
    const [c2x, c2y] = map(segment.x1 - span / 3, segment.y1 - (segment.m1 * span) / 3);
    const [endX, endY] = map(segment.x1, segment.y1);
    parts.push(
      `C${round2(c1x)} ${round2(c1y)} ${round2(c2x)} ${round2(c2y)} ${round2(endX)} ${round2(endY)}`,
    );
  }
  return parts.join('');
};

export const chartMapper: PointMapper = (seconds, temp) => [seconds, roastDomain.maxTemp - temp];

export const chartPath = (profile: RoastProfile): string => roastPath(profile, chartMapper);

export const markers = (profile: RoastProfile): Marker[] => {
  const list: Marker[] = [
    { id: 'charge', label: 'Załadunek', at: 0, temp: profile.charge },
    {
      id: 'turning',
      label: 'Punkt zwrotny',
      at: profile.turningPoint.at,
      temp: profile.turningPoint.temp,
    },
    { id: 'dry', label: 'Koniec suszenia', at: profile.dryEnd.at, temp: profile.dryEnd.temp },
    {
      id: 'first',
      label: 'Pierwszy trzask',
      at: profile.firstCrack.at,
      temp: profile.firstCrack.temp,
    },
  ];
  if (profile.secondCrack) {
    list.push({
      id: 'second',
      label: 'Drugi trzask',
      at: profile.secondCrack.at,
      temp: profile.secondCrack.temp,
    });
  }
  list.push({ id: 'drop', label: 'Wysypanie', at: profile.drop.at, temp: profile.drop.temp });
  return list;
};

export const phases = (profile: RoastProfile): Phase[] => [
  { id: 'drying', label: phaseLabels.drying, from: 0, to: profile.dryEnd.at },
  {
    id: 'maillard',
    label: phaseLabels.maillard,
    from: profile.dryEnd.at,
    to: profile.firstCrack.at,
  },
  {
    id: 'development',
    label: phaseLabels.development,
    from: profile.firstCrack.at,
    to: profile.drop.at,
  },
];

export const phaseAt = (profile: RoastProfile, seconds: number): PhaseId => {
  if (seconds < profile.dryEnd.at) return 'drying';
  if (seconds < profile.firstCrack.at) return 'maillard';
  return 'development';
};

export const developmentRatio = (profile: RoastProfile): number =>
  Math.round(((profile.drop.at - profile.firstCrack.at) / profile.drop.at) * 1000) / 10;

export const formatClock = (seconds: number): string => {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

const colorStops: Array<[number, [number, number, number]]> = [
  [100, [125, 154, 59]],
  [150, [196, 182, 64]],
  [170, [184, 146, 74]],
  [190, [148, 96, 58]],
  [205, [107, 58, 31]],
  [225, [61, 32, 16]],
  [235, [42, 23, 14]],
];

const toHex = (value: number): string => Math.round(value).toString(16).padStart(2, '0');

export const beanColor = (temp: number): string => {
  const first = colorStops[0];
  const last = colorStops[colorStops.length - 1];
  if (temp <= first[0]) return `#${first[1].map(toHex).join('')}`;
  if (temp >= last[0]) return `#${last[1].map(toHex).join('')}`;
  const upperIndex = colorStops.findIndex(stop => stop[0] >= temp);
  const lower = colorStops[upperIndex - 1];
  const upper = colorStops[upperIndex];
  const ratio = (temp - lower[0]) / (upper[0] - lower[0]);
  const mixed = lower[1].map((channel, index) => channel + (upper[1][index] - channel) * ratio);
  return `#${mixed.map(toHex).join('')}`;
};

export const timeTicks = (): number[] => {
  const ticks: number[] = [];
  for (let seconds = 0; seconds <= 720; seconds += 120) ticks.push(seconds);
  return ticks;
};

export const tempTicks = (): number[] => {
  const ticks: number[] = [];
  for (let temp = roastDomain.minTemp; temp <= roastDomain.maxTemp; temp += 30) ticks.push(temp);
  return ticks;
};
