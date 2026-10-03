import { describe, expect, it } from 'vitest';
import { listings } from '../data/listings';
import { drawFacade, type FacadeSpec } from './draw';
import { fitToBox, layoutStreet } from './layout';

const spec: FacadeSpec = {
  seed: 'test',
  kind: 'kamienica',
  floors: 4,
  bays: 5,
  roof: 'kopertowy',
  tone: 1,
  mark: { floors: [2, 2], bays: [1, 1] },
};

describe('facade drawing', () => {
  it('is deterministic for the same data', () => {
    expect(drawFacade(spec)).toEqual(drawFacade({ ...spec }));
  });

  it('changes with the seed', () => {
    expect(drawFacade(spec)).not.toEqual(drawFacade({ ...spec, seed: 'other' }));
  });

  it('sizes the building from its floors and bays', () => {
    const small = drawFacade({ ...spec, floors: 2, bays: 3, mark: undefined });
    const large = drawFacade({ ...spec, floors: 6, bays: 7, mark: undefined });
    expect(large.width).toBeGreaterThan(small.width);
    expect(large.height).toBeGreaterThan(small.height);
  });

  it('marks the flat only when asked to', () => {
    const marked = drawFacade(spec);
    const plain = drawFacade({ ...spec, mark: undefined });
    expect(marked.marked).not.toBeNull();
    expect(plain.marked).toBeNull();
    expect(marked.layers.some(layer => layer.role === 'flat')).toBe(true);
    expect(plain.layers.some(layer => layer.role === 'flat')).toBe(false);
  });

  it('draws every listing with a marked flat inside the building', () => {
    for (const listing of listings) {
      const drawing = drawFacade(listing.facade);
      expect(drawing.layers.length).toBeGreaterThan(5);
      if (listing.facade.mark && drawing.marked) {
        expect(drawing.marked.x).toBeGreaterThanOrEqual(0);
        expect(drawing.marked.x + drawing.marked.w).toBeLessThanOrEqual(drawing.width + 0.01);
      }
    }
  });
});

describe('facade layout', () => {
  it('fits a building into a box without exceeding it', () => {
    const drawing = { width: 180, height: 220 };
    const placement = fitToBox(drawing, 400, 280, 36, 22);
    expect(drawing.width * placement.scale).toBeLessThanOrEqual(400 - 44 + 0.01);
    expect(drawing.height * placement.scale).toBeLessThanOrEqual(280 - 36 - 22 + 0.01);
    expect(placement.y).toBe(244);
  });

  it('places a street left to right inside the box', () => {
    const drawings = [
      { width: 100, height: 120 },
      { width: 160, height: 200 },
      { width: 120, height: 150 },
    ];
    const placements = layoutStreet(drawings, 1000, 300, 30, 12);
    expect(placements).toHaveLength(3);
    const [a, b, c] = placements;
    if (!a || !b || !c) return;
    expect(a.x).toBeGreaterThanOrEqual(0);
    expect(b.x).toBeGreaterThan(a.x);
    expect(c.x).toBeGreaterThan(b.x);
    expect(c.x + 120 * c.scale).toBeLessThanOrEqual(1000.01);
  });
});
