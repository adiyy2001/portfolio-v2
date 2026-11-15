import { describe, expect, it } from 'vitest';
import {
  addDays,
  farthestArrival,
  formatDate,
  formatDateWithWeekday,
  nearestFriday,
  parseIso,
  todayIso,
} from './dates';

describe('dates', () => {
  it('parses only real dates', () => {
    expect(parseIso('2026-11-15')).not.toBeNull();
    expect(parseIso('2026-02-30')).toBeNull();
    expect(parseIso('15.11.2026')).toBeNull();
  });

  it('adds days across months', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-04', 5)).toBe('2026-12-09');
  });

  it('finds the nearest Friday on or after a day', () => {
    expect(nearestFriday('2026-11-15')).toBe('2026-11-20');
    expect(nearestFriday('2026-11-20')).toBe('2026-11-20');
  });

  it('formats dates in both languages', () => {
    expect(formatDate('2026-11-20', 'pl')).toBe('20 listopada 2026');
    expect(formatDate('2026-11-20', 'en')).toBe('20 November 2026');
    expect(formatDateWithWeekday('2026-11-20', 'pl')).toBe('piątek, 20 listopada 2026');
  });

  it('formats today from local parts', () => {
    expect(todayIso(new Date(2026, 10, 5))).toBe('2026-11-05');
    expect(farthestArrival('2026-11-15')).toBe('2027-11-15');
  });
});
