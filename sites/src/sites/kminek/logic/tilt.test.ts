import { describe, expect, it } from 'vitest';
import {
  MAX_TILT,
  REST_TILT,
  approach,
  isSettled,
  maxTiltFor,
  pivotOffset,
  pivotShift,
  pointerTilt,
  reachOf,
  restTiltFor,
  scrollSpeed,
  staticRestTilt,
  swingTilt,
  transformFor,
} from './tilt';

describe('maxTiltFor', () => {
  it('never exceeds four degrees however much room there is', () => {
    expect(maxTiltFor(500, 280)).toBe(MAX_TILT);
  });

  it('shrinks when the card has little room to swing', () => {
    expect(maxTiltFor(16, 900)).toBeCloseTo(1.019, 2);
    expect(maxTiltFor(28, 400)).toBeCloseTo(4, 0);
  });

  it('keeps the swing of the visible part inside the room', () => {
    const reach = 400;
    const slack = 28;
    const angle = maxTiltFor(slack, reach);
    expect(reach * Math.sin((angle * Math.PI) / 180)).toBeLessThanOrEqual(slack + 0.001);
  });

  it('allows no tilt without room and handles an empty card', () => {
    expect(maxTiltFor(0, 500)).toBe(0);
    expect(maxTiltFor(10, 0)).toBe(MAX_TILT);
  });
});

describe('reachOf and restTiltFor', () => {
  it('uses the visible half of a tall card and the whole of a short one', () => {
    expect(reachOf({ top: 0, height: 3000, viewportHeight: 800 })).toBe(400);
    expect(reachOf({ top: 0, height: 560, viewportHeight: 800 })).toBe(280);
  });

  it('rests at two degrees unless the room allows less', () => {
    expect(restTiltFor(4)).toBe(REST_TILT);
    expect(restTiltFor(1.1)).toBe(1.1);
  });
});

describe('pointerTilt', () => {
  const base = { viewportWidth: 1000, max: 4, rest: 2, overCard: false };

  it('leans towards the side the pointer is on', () => {
    expect(pointerTilt({ ...base, pointerX: 1000 })).toBe(4);
    expect(pointerTilt({ ...base, pointerX: 0 })).toBe(-4);
    expect(pointerTilt({ ...base, pointerX: 500 })).toBe(0);
  });

  it('stays within the maximum when the pointer is outside the viewport', () => {
    expect(pointerTilt({ ...base, pointerX: 5000 })).toBe(4);
    expect(pointerTilt({ ...base, pointerX: -5000 })).toBe(-4);
  });

  it('calms down while the pointer is over the card', () => {
    const over = pointerTilt({ ...base, pointerX: 1000, overCard: true });
    expect(over).toBeGreaterThan(2);
    expect(over).toBeLessThan(4);
  });

  it('copes with an empty viewport', () => {
    expect(pointerTilt({ ...base, viewportWidth: 0, pointerX: 10 })).toBe(0);
  });
});

describe('swingTilt and scrollSpeed', () => {
  it('rests at the rest angle when the page is still', () => {
    expect(swingTilt(0, 4, 2)).toBe(2);
  });

  it('swings away from rest as the page scrolls faster, in either direction', () => {
    expect(swingTilt(1, 4, 2)).toBeCloseTo(0.4);
    expect(swingTilt(-1, 4, 2)).toBeCloseTo(0.4);
  });

  it('never leaves the maximum', () => {
    expect(swingTilt(50, 4, 2)).toBe(-4);
    expect(swingTilt(50, 1.5, 1.5)).toBe(-1.5);
    expect(swingTilt(0, 0, 0)).toBe(0);
  });

  it('measures speed in pixels per millisecond and ignores direction', () => {
    expect(scrollSpeed(100, 50)).toBe(2);
    expect(scrollSpeed(-100, 50)).toBe(2);
  });

  it('treats very short intervals as eight milliseconds', () => {
    expect(scrollSpeed(80, 0)).toBe(10);
  });
});

describe('approach', () => {
  it('stays put without time and arrives after a long time', () => {
    expect(approach(2, 4, 0, 120)).toBe(2);
    expect(approach(2, 4, 5000, 120)).toBeCloseTo(4, 5);
  });

  it('covers about two thirds of the distance after one time constant', () => {
    expect(approach(0, 1, 120, 120)).toBeCloseTo(0.632, 3);
  });

  it('ignores negative time', () => {
    expect(approach(1, 3, -50, 120)).toBe(1);
  });
});

describe('pivotOffset and pivotShift', () => {
  it('pivots on the card centre when the whole card is visible', () => {
    expect(pivotOffset({ top: 100, height: 560, viewportHeight: 800 })).toBe(0);
  });

  it('pivots on the middle of the visible part of a tall card', () => {
    expect(pivotOffset({ top: -1000, height: 3000, viewportHeight: 800 })).toBe(-100);
    expect(pivotOffset({ top: 600, height: 3000, viewportHeight: 800 })).toBe(-1400);
  });

  it('does nothing when the card is off screen', () => {
    expect(pivotOffset({ top: 2000, height: 500, viewportHeight: 800 })).toBe(0);
  });

  it('shifts sideways so the pivot stays in place', () => {
    expect(pivotShift(0, 4)).toEqual({ x: 0, y: 0 });
    const shift = pivotShift(1000, 4);
    expect(shift.x).toBeCloseTo(69.76, 1);
    expect(shift.y).toBeCloseTo(2.44, 1);
    expect(pivotShift(-1000, 4).x).toBeCloseTo(-69.76, 1);
  });
});

describe('transformFor and isSettled', () => {
  it('writes a transform with a shift and a rotation', () => {
    expect(transformFor(2, 0)).toBe('translate(0.00px, 0.00px) rotate(2.000deg)');
  });

  it('knows when the angle has stopped moving', () => {
    expect(isSettled(2, 2.005)).toBe(true);
    expect(isSettled(2, 2.5)).toBe(false);
  });
});

describe('staticRestTilt', () => {
  it('keeps the rest angle when the slack covers half the card height', () => {
    expect(staticRestTilt(36, 900)).toBe(REST_TILT);
  });

  it('flattens a tall card on a narrow screen so no row leaves the slack', () => {
    const angle = staticRestTilt(14, 3600);
    expect(angle).toBeLessThan(REST_TILT);
    expect((3600 / 2) * Math.sin((angle * Math.PI) / 180)).toBeLessThanOrEqual(14.001);
  });

  it('is flat when there is no slack', () => {
    expect(staticRestTilt(0, 1000)).toBe(0);
  });
});
