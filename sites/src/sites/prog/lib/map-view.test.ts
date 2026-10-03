import { describe, expect, it } from 'vitest';
import {
  cityWindow,
  isInside,
  pinBox,
  placeLabels,
  placeLandmarks,
  spreadPins,
  toPercent,
  unitsPerPixel,
  windowAround,
  type Box,
} from './map-view';

describe('map view', () => {
  it('converts a point to percentages of the window', () => {
    expect(toPercent({ x: 480, y: 530 }, cityWindow)).toEqual({ left: 50, top: 50 });
    expect(toPercent({ x: 40, y: 90 }, cityWindow)).toEqual({ left: 0, top: 0 });
  });

  it('builds a window centered on a point', () => {
    const view = windowAround({ x: 600, y: 367 }, 200);
    expect(view).toEqual({ x: 500, y: 267, size: 200 });
    expect(toPercent({ x: 600, y: 367 }, view)).toEqual({ left: 50, top: 50 });
  });

  it('tells whether a point is inside', () => {
    expect(isInside({ x: 100, y: 100 }, cityWindow)).toBe(true);
    expect(isInside({ x: 10, y: 100 }, cityWindow)).toBe(false);
  });
});

describe('label placement', () => {
  const view = cityWindow;
  const unit = unitsPerPixel(view);

  it('keeps a label that has nothing near it', () => {
    const placed = placeLabels([{ name: 'Gaj', x: 400, y: 600 }], view, []);
    expect(placed).toEqual([{ name: 'Gaj', x: 400, y: 600 }]);
  });

  it('moves a label away from a pin', () => {
    const pin = pinBox({ x: 400, y: 620 }, view);
    const [label] = placeLabels([{ name: 'Gaj', x: 400, y: 600 }], view, [pin]);
    expect(label?.name).toBe('Gaj');
    expect(label && (label.x !== 400 || label.y !== 600)).toBe(true);
  });

  it('drops a label that cannot be placed anywhere', () => {
    const wall: Box = { left: 0, right: 1000, top: 0, bottom: 1000 };
    expect(placeLabels([{ name: 'Gaj', x: 400, y: 600 }], view, [wall])).toEqual([]);
  });

  it('keeps two labels from overlapping each other', () => {
    const placed = placeLabels(
      [
        { name: 'Gaj', x: 400, y: 600 },
        { name: 'Huby', x: 405, y: 602 },
      ],
      view,
      [],
    );
    expect(placed).toHaveLength(2);
    const [a, b] = placed;
    const gapX = Math.abs((a?.x ?? 0) - (b?.x ?? 0));
    const gapY = Math.abs((a?.y ?? 0) - (b?.y ?? 0));
    expect(gapX > 30 * unit || gapY > 16 * unit).toBe(true);
  });

  it('shifts a label that would stick out of the frame back inside', () => {
    const [label] = placeLabels([{ name: 'Gaj', x: 41, y: 300 }], view, []);
    expect(label).toBeDefined();
    expect((label?.x ?? 0) - 15 * unit).toBeGreaterThanOrEqual(view.x);
  });
});

describe('landmark placement', () => {
  const view = cityWindow;

  it('puts the name below the dot when there is room', () => {
    const [placed] = placeLandmarks([{ id: 'a', name: 'Rynek', x: 400, y: 400 }], view, []);
    expect(placed?.labelShiftX).toBe(0);
    expect(placed?.labelShiftY).toBeGreaterThan(0);
  });

  it('moves the name off a pin that covers the first spot', () => {
    const pin = pinBox({ x: 400, y: 480 }, view);
    const [placed] = placeLandmarks([{ id: 'a', name: 'Rynek', x: 400, y: 400 }], view, [pin]);
    expect(placed).toBeDefined();
    expect(placed && boxesTouch(placed.labelBox, pin)).toBe(false);
    expect(placed?.labelShiftY).toBeLessThan(0);
  });

  it('puts the name beside the dot when below and above would be clipped by the frame', () => {
    const [placed] = placeLandmarks([{ id: 'a', name: 'Ostrów Tumski', x: 70, y: 300 }], view, []);
    expect(placed?.labelShiftX).toBeGreaterThan(0);
  });

  it('leaves out a landmark outside the frame', () => {
    expect(placeLandmarks([{ id: 'a', name: 'Rynek', x: 10, y: 300 }], view, [])).toEqual([]);
  });

  it('keeps the names of two close landmarks apart', () => {
    const placed = placeLandmarks(
      [
        { id: 'a', name: 'Rynek', x: 400, y: 400 },
        { id: 'b', name: 'Ratusz', x: 410, y: 404 },
      ],
      view,
      [],
    );
    expect(placed).toHaveLength(2);
    const [a, b] = placed;
    expect(a && b && boxesTouch(a.labelBox, b.labelBox)).toBe(false);
  });
});

const boxesTouch = (a: Box, b: Box): boolean =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

describe('spreadPins', () => {
  it('leaves pins that do not overlap where they are', () => {
    const result = spreadPins(
      [
        { id: 'a', x: 100, y: 100 },
        { id: 'b', x: 300, y: 300 },
      ],
      70,
      84,
    );
    expect(result.get('a')).toEqual({ x: 100, y: 100 });
    expect(result.get('b')).toEqual({ x: 300, y: 300 });
  });

  it('moves overlapping pins apart along the shorter way', () => {
    const result = spreadPins(
      [
        { id: 'a', x: 100, y: 100 },
        { id: 'b', x: 148, y: 135 },
      ],
      70,
      84,
    );
    const a = result.get('a');
    const b = result.get('b');
    expect(Math.abs((a?.x ?? 0) - (b?.x ?? 0))).toBeGreaterThanOrEqual(70 - 0.001);
    expect(a?.y).toBe(100);
    expect(b?.y).toBe(135);
  });

  it('resolves a cluster of three and keeps every pin close to its place', () => {
    const spots = [
      { id: 'a', x: 100, y: 100 },
      { id: 'b', x: 110, y: 104 },
      { id: 'c', x: 120, y: 98 },
    ];
    const result = spreadPins(spots, 70, 84);
    for (const spot of spots) {
      const placed = result.get(spot.id);
      expect(Math.hypot((placed?.x ?? 0) - spot.x, (placed?.y ?? 0) - spot.y)).toBeLessThan(140);
    }
    const xs = spots.map(spot => result.get(spot.id)?.x ?? 0).sort((p, q) => p - q);
    expect((xs[1] ?? 0) - (xs[0] ?? 0)).toBeGreaterThanOrEqual(69.9);
    expect((xs[2] ?? 0) - (xs[1] ?? 0)).toBeGreaterThanOrEqual(69.9);
  });
});
