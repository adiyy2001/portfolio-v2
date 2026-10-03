import { describe, expect, it } from 'vitest';
import { placeById, places, walkingRoutes } from './places';

describe('places', () => {
  it('has unique ids', () => {
    expect(new Set(places.map(place => place.id)).size).toBe(places.length);
  });

  it('keeps every point inside the map', () => {
    for (const place of places) {
      expect(place.position.x).toBeGreaterThan(0);
      expect(place.position.x).toBeLessThan(640);
      expect(place.position.y).toBeGreaterThan(0);
      expect(place.position.y).toBeLessThan(420);
    }
  });

  it('draws routes only between known places', () => {
    for (const [from, to] of walkingRoutes) {
      expect(() => placeById(from)).not.toThrow();
      expect(() => placeById(to)).not.toThrow();
    }
  });

  it('orders walking times by distance from the hotel', () => {
    const minutes = places.flatMap(place =>
      place.walkingMinutes === null ? [] : [place.walkingMinutes],
    );
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
  });
});
