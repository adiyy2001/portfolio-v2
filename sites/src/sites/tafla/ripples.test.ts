import { describe, expect, it } from 'vitest';
import {
  DROP_LIFE,
  POND_HEIGHT,
  POND_SEED,
  POND_WIDTH,
  STILL_TIME,
  createPond,
  createUserDrop,
  isAlive,
} from './ripples';

describe('createPond', () => {
  it('gives the same ripples for the same seed and time', () => {
    expect(createPond(POND_SEED).ripplesAt(37.5)).toEqual(createPond(POND_SEED).ripplesAt(37.5));
  });

  it('gives the same ripples when asked in a different order', () => {
    const forward = createPond(POND_SEED);
    const early = forward.ripplesAt(2);
    forward.ripplesAt(500);
    expect(forward.ripplesAt(2)).toEqual(early);
  });

  it('gives different ripples for a different seed', () => {
    expect(createPond(1).ripplesAt(STILL_TIME)).not.toEqual(createPond(2).ripplesAt(STILL_TIME));
  });

  it('is never empty, so the still image and the first frame have a composition', () => {
    const pond = createPond(POND_SEED);
    expect(pond.ripplesAt(0).length).toBeGreaterThanOrEqual(8);
    expect(pond.ripplesAt(STILL_TIME).length).toBeGreaterThanOrEqual(8);
  });

  it('keeps the number of rings bounded for a long session', () => {
    const pond = createPond(POND_SEED);
    for (let time = 0; time < 600; time += 7.3) {
      const count = pond.ripplesAt(time).length;
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(40);
    }
  });

  it('returns valid ellipses with a visible opacity', () => {
    const pond = createPond(POND_SEED);
    for (let time = 0; time < 120; time += 1.7) {
      for (const ripple of pond.ripplesAt(time)) {
        expect(ripple.rx).toBeGreaterThan(0);
        expect(ripple.ry).toBeGreaterThan(0);
        expect(ripple.ry).toBeLessThan(ripple.rx);
        expect(ripple.alpha).toBeGreaterThan(0);
        expect(ripple.alpha).toBeLessThanOrEqual(1);
      }
    }
  });

  it('drops water inside the pond and not too close to the previous drops', () => {
    const pond = createPond(POND_SEED);
    for (let index = 0; index < 60; index += 1) {
      const drop = pond.dropAt(index);
      expect(drop.x).toBeGreaterThan(0);
      expect(drop.x).toBeLessThan(POND_WIDTH);
      expect(drop.y).toBeGreaterThan(0);
      expect(drop.y).toBeLessThan(POND_HEIGHT);
      const previous = pond.dropAt(index - 1);
      expect(Math.hypot(drop.x - previous.x, drop.y - previous.y)).toBeGreaterThan(40);
    }
  });

  it('spaces the drops in time', () => {
    const pond = createPond(POND_SEED);
    for (let index = 0; index < 60; index += 1) {
      const gap = pond.dropAt(index + 1).startedAt - pond.dropAt(index).startedAt;
      expect(gap).toBeGreaterThan(1);
      expect(gap).toBeLessThan(6);
    }
  });
});

describe('a single drop', () => {
  const drop = createUserDrop(10, 500, 300);
  const pond = createPond(POND_SEED);

  it('has no rings before it falls', () => {
    expect(pond.ripplesAt(9, [drop]).length).toBe(pond.ripplesAt(9).length);
  });

  it('spreads its rings wider as time passes', () => {
    const own = (time: number) =>
      pond.ripplesAt(time, [drop]).filter(ripple => ripple.x === 500 && ripple.y === 300);
    const early = own(12);
    const later = own(16);
    expect(early.length).toBeGreaterThan(0);
    expect(Math.max(...later.map(ripple => ripple.rx))).toBeGreaterThan(
      Math.max(...early.map(ripple => ripple.rx)),
    );
  });

  it('sends the outer ring first and makes the inner rings weaker', () => {
    const rings = pond.ripplesAt(18, [drop]).filter(ripple => ripple.x === 500 && ripple.y === 300);
    const byRadius = [...rings].sort((a, b) => b.rx - a.rx);
    expect(byRadius.length).toBeGreaterThan(2);
    expect(byRadius[0]?.alpha).toBeGreaterThan(byRadius[byRadius.length - 1]?.alpha ?? 1);
  });

  it('disappears after its life', () => {
    const afterLife = 10 + DROP_LIFE + 0.1;
    expect(isAlive(drop, afterLife - 1)).toBe(true);
    expect(isAlive(drop, afterLife)).toBe(false);
    const own = pond
      .ripplesAt(afterLife, [drop])
      .filter(ripple => ripple.x === 500 && ripple.y === 300);
    expect(own).toEqual([]);
  });

  it('is flatter and smaller far from the viewer than near', () => {
    const far = createUserDrop(0, 500, 60);
    const near = createUserDrop(0, 500, 560);
    const ratioOf = (target: typeof far) => {
      const ring = createPond(POND_SEED)
        .ripplesAt(8, [target])
        .filter(ripple => ripple.x === 500 && ripple.y === target.y)[0];
      return ring ? { ratio: ring.ry / ring.rx, radius: ring.rx } : { ratio: 0, radius: 0 };
    };
    expect(ratioOf(far).ratio).toBeLessThan(ratioOf(near).ratio);
    expect(ratioOf(far).radius).toBeLessThan(ratioOf(near).radius);
  });

  it('keeps a click outside the pond inside it', () => {
    const drop = createUserDrop(0, -50, 9999);
    expect(drop.x).toBe(0);
    expect(drop.y).toBe(POND_HEIGHT);
  });
});
