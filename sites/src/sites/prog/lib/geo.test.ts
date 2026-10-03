import { describe, expect, it } from 'vitest';
import { distanceMeters, formatDistance, roundDistance } from './geo';

describe('geo', () => {
  it('converts map units to meters', () => {
    expect(distanceMeters({ x: 0, y: 0 }, { x: 30, y: 40 })).toBe(600);
  });

  it('rounds short distances to fifty meters and long ones to a hundred', () => {
    expect(roundDistance(620)).toBe(600);
    expect(roundDistance(1260)).toBe(1300);
  });

  it('formats meters and kilometers', () => {
    expect(formatDistance(480)).toBe('500 m');
    expect(formatDistance(2340)).toBe('2,3 km');
  });
});
