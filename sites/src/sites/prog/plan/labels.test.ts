import { describe, expect, it } from 'vitest';
import {
  boxesOverlap,
  doorBox,
  doorObstacles,
  fitsRoom,
  labelSize,
  labelTiers,
  overlapArea,
  placeLabel,
} from './labels';
import type { Box, DoorMark, PlacedRoom } from './layout';

const room: PlacedRoom = {
  name: 'Kuchnia',
  kind: 'kitchen',
  area: 8.6,
  x: 0,
  y: 0,
  w: 200,
  h: 160,
};

const largeTier = labelTiers[0];
const smallTier = labelTiers[labelTiers.length - 1];

describe('labelSize', () => {
  it('is wider and taller when the name is shown', () => {
    if (!largeTier) throw new Error('no label tiers');
    const named = labelSize('Kuchnia', '8,6 m²', largeTier, true);
    const plain = labelSize('Kuchnia', '8,6 m²', largeTier, false);
    expect(named.width).toBeGreaterThan(plain.width);
    expect(named.height).toBeGreaterThan(plain.height);
  });

  it('shrinks with the tier', () => {
    if (!largeTier || !smallTier) throw new Error('no label tiers');
    const large = labelSize('Spiżarnia', '2,8 m²', largeTier, true);
    const small = labelSize('Spiżarnia', '2,8 m²', smallTier, true);
    expect(small.width).toBeLessThan(large.width);
    expect(small.height).toBeLessThan(large.height);
  });
});

describe('fitsRoom', () => {
  it('needs a margin around the label', () => {
    expect(fitsRoom(room, { width: 200, height: 100 })).toBe(false);
    expect(fitsRoom(room, { width: 100, height: 60 })).toBe(true);
  });
});

describe('boxesOverlap', () => {
  it('detects overlap and separation', () => {
    expect(boxesOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
    expect(boxesOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
  });
});

describe('doorBox', () => {
  it('covers the opening and the leaf with a margin', () => {
    const door: DoorMark = {
      gap: { x1: 50, y1: 100, x2: 80, y2: 100 },
      leaf: { x1: 50, y1: 100, x2: 50, y2: 70 },
      arc: '',
    };
    const box = doorBox(door);
    expect(box.x).toBeLessThan(50);
    expect(box.y).toBeLessThan(70);
    expect(box.x + box.w).toBeGreaterThan(80);
    expect(box.y + box.h).toBeGreaterThan(100);
  });
});

describe('doorObstacles', () => {
  const door: DoorMark = {
    gap: { x1: 100, y1: 200, x2: 150, y2: 200 },
    leaf: { x1: 100, y1: 200, x2: 100, y2: 150 },
    arc: '',
  };

  it('covers the opening and follows the swing instead of its whole square', () => {
    const boxes = doorObstacles(door);
    expect(boxes.length).toBeGreaterThan(4);
    const insideSwing: Box = { x: 118, y: 168, w: 12, h: 12 };
    expect(boxes.some(box => boxesOverlap(box, insideSwing))).toBe(false);
    const onSwing: Box = {
      x: 100 + 50 * Math.sin(Math.PI / 4) - 4,
      y: 200 - 50 * Math.cos(Math.PI / 4) - 4,
      w: 8,
      h: 8,
    };
    expect(boxes.some(box => boxesOverlap(box, onSwing))).toBe(true);
  });
});

describe('placeLabel', () => {
  const size = { width: 90, height: 50 };

  it('keeps the centre when nothing is in the way', () => {
    expect(placeLabel(room, size, [])).toEqual({ x: 100, y: 80 });
  });

  it('moves away from an obstacle at the centre', () => {
    const spot = placeLabel(room, size, [{ x: 70, y: 60, w: 60, h: 40 }]);
    expect(spot).not.toEqual({ x: 100, y: 80 });
    const box = {
      x: spot.x - size.width / 2,
      y: spot.y - size.height / 2,
      w: size.width,
      h: size.height,
    };
    expect(boxesOverlap(box, { x: 70, y: 60, w: 60, h: 40 })).toBe(false);
  });

  it('stays inside the room', () => {
    const spot = placeLabel(room, size, [{ x: 70, y: 60, w: 60, h: 40 }]);
    expect(spot.x - size.width / 2).toBeGreaterThanOrEqual(room.x);
    expect(spot.x + size.width / 2).toBeLessThanOrEqual(room.x + room.w);
    expect(spot.y - size.height / 2).toBeGreaterThanOrEqual(room.y);
    expect(spot.y + size.height / 2).toBeLessThanOrEqual(room.y + room.h);
  });

  it('falls back to the centre when every spot is blocked', () => {
    expect(placeLabel(room, size, [{ x: -10, y: -10, w: 400, h: 400 }])).toEqual({ x: 100, y: 80 });
  });
});

describe('placeLabel fallback', () => {
  it('takes the spot that overlaps the least when nothing is free', () => {
    const size = { width: 80, height: 40 };
    const everything: Box = { x: 0, y: 0, w: 200, h: 100 };
    const spot = placeLabel(room, size, [everything]);
    expect(spot.y).toBeGreaterThan(100);
  });
});

describe('overlapArea', () => {
  it('measures the shared area and returns zero for apart boxes', () => {
    expect(overlapArea({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 })).toBe(25);
    expect(overlapArea({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 5, h: 5 })).toBe(0);
  });
});
