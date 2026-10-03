import { describe, expect, it } from 'vitest';
import {
  buildLowerTeeth,
  buildUpperTeeth,
  centerX,
  gumPath,
  lowerLipEdge,
  openingPath,
  upperLipEdge,
} from './smile';

const byPosition = (position: number) => {
  const tooth = buildUpperTeeth().find(entry => entry.position === position);
  if (!tooth) throw new Error(`No tooth at ${position}`);
  return tooth;
};

describe('upper teeth', () => {
  it('builds ten teeth at positions minus five to five without zero', () => {
    const positions = buildUpperTeeth()
      .map(tooth => tooth.position)
      .sort((first, second) => first - second);
    expect(positions).toEqual([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
  });

  it('draws the outer teeth first so the central incisors end up in front', () => {
    const order = buildUpperTeeth().map(tooth => Math.abs(tooth.position));
    expect(order).toEqual([...order].sort((first, second) => second - first));
  });

  it('is symmetric around the centre line', () => {
    [1, 2, 3, 4, 5].forEach(distance => {
      const left = byPosition(-distance);
      const right = byPosition(distance);
      expect(left.x + right.x).toBeCloseTo(2 * centerX, 5);
      expect(left.width).toBe(right.width);
      expect(left.bottom).toBe(right.bottom);
    });
  });

  it('lets neighbouring teeth touch without a gap or an overlap', () => {
    [1, 2, 3, 4].forEach(distance => {
      const inner = byPosition(distance);
      const outer = byPosition(distance + 1);
      expect(inner.x + inner.width / 2).toBeCloseTo(outer.x - outer.width / 2, 5);
    });
    const leftCentral = byPosition(-1);
    const rightCentral = byPosition(1);
    expect(leftCentral.x + leftCentral.width / 2).toBeCloseTo(centerX, 5);
    expect(rightCentral.x - rightCentral.width / 2).toBeCloseTo(centerX, 5);
  });

  it('keeps every tooth inside the mouth opening', () => {
    buildUpperTeeth().forEach(tooth => {
      expect(tooth.x - tooth.width / 2).toBeGreaterThanOrEqual(148);
      expect(tooth.x + tooth.width / 2).toBeLessThanOrEqual(652);
    });
  });

  it('raises the biting edge towards the corners of the smile', () => {
    expect(byPosition(5).bottom).toBeLessThan(byPosition(1).bottom);
    expect(byPosition(3).bottom).toBeLessThan(byPosition(1).bottom);
  });

  it('assigns incisors, canines and premolars by distance from the centre', () => {
    expect([1, 2, 3, 4, 5].map(distance => byPosition(distance).kind)).toEqual([
      'incisor',
      'incisor',
      'canine',
      'premolar',
      'premolar',
    ]);
  });

  it('shades the back teeth more than the front ones', () => {
    expect(byPosition(1).depth).toBe(0);
    expect(byPosition(5).depth).toBeGreaterThan(byPosition(3).depth);
    expect(byPosition(5).depth).toBeLessThanOrEqual(1);
  });

  it('leaves out missing teeth', () => {
    const teeth = buildUpperTeeth({ missing: [-2] });
    expect(teeth).toHaveLength(9);
    expect(teeth.some(tooth => tooth.position === -2)).toBe(false);
  });

  it('moves and turns only the adjusted tooth', () => {
    const plain = buildUpperTeeth();
    const adjusted = buildUpperTeeth({ adjustments: { 2: { dx: 9, dy: 6, rotate: -14 } } });
    adjusted.forEach(tooth => {
      const original = plain.find(entry => entry.position === tooth.position);
      if (tooth.position === 2) {
        expect(tooth.x).toBe((original?.x ?? 0) + 9);
        expect(tooth.bottom).toBe((original?.bottom ?? 0) + 6);
        expect(tooth.rotate).toBe(-14);
      } else {
        expect(tooth.x).toBe(original?.x);
        expect(tooth.bottom).toBe(original?.bottom);
        expect(tooth.rotate).toBe(0);
      }
    });
  });

  it('writes closed paths without invalid numbers', () => {
    buildUpperTeeth().forEach(tooth => {
      expect(tooth.path.startsWith('M')).toBe(true);
      expect(tooth.path.endsWith('Z')).toBe(true);
      expect(tooth.path).not.toContain('NaN');
    });
  });
});

describe('lower teeth', () => {
  it('builds ten teeth whose biting edge is below the upper edge', () => {
    const lower = buildLowerTeeth();
    expect(lower).toHaveLength(10);
    const upperCentral = byPosition(1);
    const lowerCentral = lower.find(tooth => tooth.position === 1);
    expect(lowerCentral?.top).toBeGreaterThan(upperCentral.bottom);
  });
});

describe('mouth shape', () => {
  it('meets at the corners and opens widest in the middle', () => {
    expect(upperLipEdge(150)).toBeCloseTo(lowerLipEdge(150), 5);
    expect(upperLipEdge(650)).toBeCloseTo(lowerLipEdge(650), 5);
    expect(lowerLipEdge(centerX) - upperLipEdge(centerX)).toBeGreaterThan(80);
  });

  it('writes a closed opening path', () => {
    const path = openingPath();
    expect(path.startsWith('M150,235')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
  });

  it('writes a gum path that dips deeper where a tooth is missing', () => {
    const plain = gumPath();
    const withGap = gumPath([-2]);
    expect(plain).not.toBe(withGap);
    expect(plain).not.toContain('NaN');
    expect(withGap.endsWith('Z')).toBe(true);
  });
});
