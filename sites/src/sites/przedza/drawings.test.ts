import { describe, expect, it } from 'vitest';
import {
  bayLength,
  bondPeriod,
  brick,
  brickCourse,
  buildingLength,
  buildingDepth,
  clearDepth,
  wallThickness,
  floorHeights,
  formatMetres,
  levelBottoms,
  shedPitchDegrees,
  slab,
} from './drawings';

describe('levelBottoms', () => {
  it('stacks floors with a slab above each one', () => {
    const { bottoms, top } = levelBottoms(floorHeights, slab);
    expect(bottoms[0]).toBe(0);
    expect(bottoms[1]).toBeCloseTo(floorHeights[0] + slab, 5);
    expect(top).toBeCloseTo(
      floorHeights.reduce((sum, height) => sum + height + slab, 0),
      5,
    );
    expect(bottoms.length).toBe(floorHeights.length);
  });

  it('keeps every floor above the previous one', () => {
    const { bottoms } = levelBottoms(floorHeights, slab);
    for (let index = 1; index < bottoms.length; index += 1) {
      expect(bottoms[index]).toBeGreaterThan(bottoms[index - 1]);
    }
  });
});

describe('formatMetres', () => {
  it('uses a decimal comma and one decimal place', () => {
    expect(formatMetres(3.9)).toBe('3,9 m');
    expect(formatMetres(41)).toBe('41,0 m');
  });
});

describe('shedPitchDegrees', () => {
  it('follows from the rise and the two bay span', () => {
    expect(shedPitchDegrees).toBeCloseTo(17.9, 1);
  });
});

describe('brickCourse', () => {
  const width = 800;

  it('never leaves the drawn width or overlaps a neighbour', () => {
    for (const index of [0, 1, 2, 3]) {
      const units = brickCourse(index, width);
      let previousEnd = -Infinity;
      for (const unit of units) {
        expect(unit.x).toBeGreaterThanOrEqual(0);
        expect(unit.x + unit.width).toBeLessThanOrEqual(width);
        expect(unit.x).toBeGreaterThanOrEqual(previousEnd + brick.joint - 1e-9);
        previousEnd = unit.x + unit.width;
      }
    }
  });

  it('alternates stretchers and headers inside a course', () => {
    const kinds = brickCourse(0, width).map(unit => unit.kind);
    kinds.forEach((kind, position) => {
      expect(kind).toBe(position % 2 === 0 ? 'stretcher' : 'header');
    });
  });

  it('centres a header over a stretcher of the course below', () => {
    const below = brickCourse(0, width).find(unit => unit.kind === 'stretcher' && unit.x > 0);
    const above = brickCourse(1, width).filter(unit => unit.kind === 'header');
    expect(below).toBeDefined();
    const centre = (below?.x ?? 0) + brick.stretcher / 2;
    const matching = above.some(unit => Math.abs(unit.x + unit.width / 2 - centre) < 1e-9);
    expect(matching).toBe(true);
  });

  it('repeats with the bond period', () => {
    const units = brickCourse(0, bondPeriod * 3);
    expect(units[2].x - units[0].x).toBe(bondPeriod);
  });
});

describe('building dimensions', () => {
  it('adds up ten bays to the building length', () => {
    expect(bayLength * 10).toBeCloseTo(buildingLength, 10);
    expect(formatMetres(bayLength * 10)).toBe(formatMetres(buildingLength));
  });

  it('prints the clear depth that remains between the two walls', () => {
    expect(clearDepth).toBeCloseTo(buildingDepth - 2 * wallThickness, 10);
    expect(formatMetres(clearDepth)).toBe('8,8 m');
  });
});
