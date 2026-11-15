import { describe, expect, it } from 'vitest';
import { dayHours, dayKeys, formatTime, livingSun, zoneArea } from './sun';
import { types } from './data';

const expected = {
  '37': [8.8, 8.3, 6.0],
  '52': [9.3, 8.8, 6.5],
  '64': [9.5, 9.0, 6.5],
  '112': [9.8, 9.5, 6.8],
} as const;

describe('sun model', () => {
  it('gives the published hours of direct sun in the living room', () => {
    for (const type of types) {
      const hours = dayKeys.map(day => Number(dayHours(type.key, day).toFixed(1)));
      expect(hours).toEqual([...expected[type.key]]);
    }
  });

  it('never lights more than the living zone', () => {
    for (const type of types) {
      for (let t = 8; t <= 18; t += 0.25) {
        expect(livingSun(type.key, 'jun', t)).toBeLessThanOrEqual(zoneArea(type.key) + 1e-9);
      }
    }
  });

  it('formats clock times', () => {
    expect(formatTime(8)).toBe('8:00');
    expect(formatTime(13.25)).toBe('13:15');
  });
});
