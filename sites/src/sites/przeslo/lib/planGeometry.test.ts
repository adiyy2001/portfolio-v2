import { describe, expect, it } from 'vitest';
import { doorShape, gapOf, windowLines } from './planGeometry';

describe('plan geometry', () => {
  it('spans a vertical wall opening along y', () => {
    expect(gapOf({ kind: 'door', x: 400, y: 60, length: 90, axis: 'y' })).toEqual({
      x1: 400,
      y1: 60,
      x2: 400,
      y2: 150,
    });
  });

  it('spans a horizontal wall opening along x', () => {
    expect(gapOf({ kind: 'window', x: 140, y: 425, length: 160, axis: 'x' })).toEqual({
      x1: 140,
      y1: 425,
      x2: 300,
      y2: 425,
    });
  });

  it('opens a door on a vertical wall toward the chosen side', () => {
    const inward = doorShape({ kind: 'door', x: 400, y: 60, length: 90, axis: 'y', swing: -1 });
    expect(inward.leaf).toEqual({ x1: 400, y1: 60, x2: 310, y2: 60 });
    expect(inward.arc).toBe('M 310 60 A 90 90 0 0 0 400 150');
    const outward = doorShape({ kind: 'door', x: 170, y: 110, length: 70, axis: 'y', swing: 1 });
    expect(outward.leaf).toEqual({ x1: 170, y1: 110, x2: 240, y2: 110 });
    expect(outward.arc).toBe('M 240 110 A 70 70 0 0 1 170 180');
  });

  it('opens a door on a horizontal wall toward the chosen side', () => {
    const down = doorShape({ kind: 'door', x: 200, y: 200, length: 90, axis: 'x', swing: 1 });
    expect(down.leaf).toEqual({ x1: 200, y1: 200, x2: 200, y2: 290 });
    expect(down.arc).toBe('M 200 290 A 90 90 0 0 0 290 200');
    const up = doorShape({ kind: 'door', x: 200, y: 200, length: 90, axis: 'x', swing: -1 });
    expect(up.arc).toBe('M 200 110 A 90 90 0 0 1 290 200');
  });

  it('draws a window as three parallel lines', () => {
    const lines = windowLines({ kind: 'window', x: 60, y: 500, length: 100, axis: 'x' }, 4);
    expect(lines.map(line => line.y1)).toEqual([496, 500, 504]);
    expect(lines.every(line => line.x1 === 60 && line.x2 === 160)).toBe(true);
  });
});
