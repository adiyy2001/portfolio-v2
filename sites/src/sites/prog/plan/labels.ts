import type { Box, DoorMark, PlacedRoom } from './layout';

export interface LabelSize {
  width: number;
  height: number;
}

export interface LabelSpot {
  x: number;
  y: number;
}

const roomMargin = 8;
const doorMargin = 5;

export interface LabelTier {
  className: string;
  nameChar: number;
  areaChar: number;
  nameBaseline: number;
  areaBaseline: number;
  fullHeight: number;
  areaOnlyBaseline: number;
  areaOnlyHeight: number;
}

export const labelTiers: readonly LabelTier[] = [
  {
    className: 'plan-tier-large',
    nameChar: 11.4,
    areaChar: 9.4,
    nameBaseline: -4,
    areaBaseline: 17,
    fullHeight: 50,
    areaOnlyBaseline: 6,
    areaOnlyHeight: 26,
  },
  {
    className: 'plan-tier-medium',
    nameChar: 8.6,
    areaChar: 7.2,
    nameBaseline: -3,
    areaBaseline: 13,
    fullHeight: 38,
    areaOnlyBaseline: 5,
    areaOnlyHeight: 22,
  },
  {
    className: 'plan-tier-small',
    nameChar: 6.9,
    areaChar: 6.1,
    nameBaseline: -2,
    areaBaseline: 11,
    fullHeight: 30,
    areaOnlyBaseline: 4,
    areaOnlyHeight: 18,
  },
];

const fractions: readonly number[] = Array.from({ length: 13 }, (_, index) => index / 12);
const fractionsAcross = fractions;
const fractionsDown = fractions;

const candidates: readonly (readonly [number, number])[] = fractionsDown
  .flatMap(fy => fractionsAcross.map((fx): [number, number] => [fx, fy]))
  .sort((p, q) => Math.hypot(p[0] - 0.5, p[1] - 0.5) - Math.hypot(q[0] - 0.5, q[1] - 0.5));

export const labelSize = (
  name: string,
  areaText: string,
  tier: LabelTier,
  showName: boolean,
): LabelSize => ({
  width: Math.max(showName ? name.length * tier.nameChar : 0, areaText.length * tier.areaChar),
  height: showName ? tier.fullHeight : tier.areaOnlyHeight,
});

export const fitsRoom = (room: PlacedRoom, size: LabelSize): boolean =>
  size.width <= room.w - roomMargin * 2 && size.height <= room.h - roomMargin * 2;

export const doorBox = (door: DoorMark): Box => {
  const xs = [door.gap.x1, door.gap.x2, door.leaf.x2];
  const ys = [door.gap.y1, door.gap.y2, door.leaf.y2];
  const x = Math.min(...xs) - doorMargin;
  const y = Math.min(...ys) - doorMargin;
  return {
    x,
    y,
    w: Math.max(...xs) + doorMargin - x,
    h: Math.max(...ys) + doorMargin - y,
  };
};

const arcSamples = 7;
const arcReach = 6;

export const doorObstacles = (door: DoorMark): Box[] => {
  const hingeX = door.gap.x1;
  const hingeY = door.gap.y1;
  const along = { x: door.gap.x2 - hingeX, y: door.gap.y2 - hingeY };
  const across = { x: door.leaf.x2 - hingeX, y: door.leaf.y2 - hingeY };
  const margin = doorMargin;
  const gapBox = {
    x: Math.min(door.gap.x1, door.gap.x2) - margin,
    y: Math.min(door.gap.y1, door.gap.y2) - margin,
    w: Math.abs(door.gap.x2 - door.gap.x1) + margin * 2,
    h: Math.abs(door.gap.y2 - door.gap.y1) + margin * 2,
  };
  const swing = Array.from({ length: arcSamples + 1 }, (_, index) => {
    const angle = (index / arcSamples) * (Math.PI / 2);
    const x = hingeX + across.x * Math.cos(angle) + along.x * Math.sin(angle);
    const y = hingeY + across.y * Math.cos(angle) + along.y * Math.sin(angle);
    return { x: x - arcReach, y: y - arcReach, w: arcReach * 2, h: arcReach * 2 };
  });
  return [gapBox, ...swing];
};

export const overlapArea = (a: Box, b: Box): number =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

export const boxesOverlap = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const clampWithin = (value: number, low: number, high: number): number =>
  low > high ? (low + high) / 2 : Math.min(Math.max(value, low), high);

export interface LabelPlacement {
  spot: LabelSpot;
  cost: number;
}

export const bestLabelSpot = (
  room: PlacedRoom,
  size: LabelSize,
  obstacles: readonly Box[],
): LabelPlacement => {
  const boxAt = (x: number, y: number): Box => ({
    x: x - size.width / 2,
    y: y - size.height / 2,
    w: size.width,
    h: size.height,
  });
  const spots = candidates.map(([fx, fy]): LabelSpot => ({
    x: clampWithin(
      room.x + room.w * fx,
      room.x + roomMargin + size.width / 2,
      room.x + room.w - roomMargin - size.width / 2,
    ),
    y: clampWithin(
      room.y + room.h * fy,
      room.y + roomMargin + size.height / 2,
      room.y + room.h - roomMargin - size.height / 2,
    ),
  }));
  const cost = (spot: LabelSpot): number =>
    obstacles.reduce((sum, obstacle) => sum + overlapArea(boxAt(spot.x, spot.y), obstacle), 0);
  let best: LabelSpot = { x: room.x + room.w / 2, y: room.y + room.h / 2 };
  let bestCost = Infinity;
  for (const spot of spots) {
    const spotCost = cost(spot);
    if (spotCost === 0) return { spot, cost: 0 };
    if (spotCost < bestCost) {
      best = spot;
      bestCost = spotCost;
    }
  }
  return { spot: best, cost: bestCost };
};

export const placeLabel = (
  room: PlacedRoom,
  size: LabelSize,
  obstacles: readonly Box[],
): LabelSpot => bestLabelSpot(room, size, obstacles).spot;
