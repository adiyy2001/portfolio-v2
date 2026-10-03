import { describe, expect, it } from 'vitest';
import {
  addMonths,
  dayFromDate,
  dayFromParts,
  daysInMonth,
  firstOfMonth,
  monthIndex,
  parseIsoDate,
  partsFromDay,
  toIsoDate,
  weekdayOf,
} from './dates';

describe('dates', () => {
  it('round trips ISO dates', () => {
    const day = dayFromParts(2026, 10, 3);
    expect(toIsoDate(day)).toBe('2026-10-03');
    expect(parseIsoDate('2026-10-03')).toBe(day);
    expect(partsFromDay(day)).toEqual({ year: 2026, month: 10, date: 3 });
  });

  it('rejects malformed and impossible dates', () => {
    expect(parseIsoDate('2026-02-30')).toBeNull();
    expect(parseIsoDate('2026-13-01')).toBeNull();
    expect(parseIsoDate('03.10.2026')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
  });

  it('knows the weekday', () => {
    expect(weekdayOf(dayFromParts(2026, 10, 3))).toBe(6);
    expect(weekdayOf(dayFromParts(2026, 10, 4))).toBe(0);
    expect(weekdayOf(dayFromParts(1970, 1, 1))).toBe(4);
    expect(weekdayOf(dayFromParts(1969, 12, 31))).toBe(3);
  });

  it('uses the local calendar date of a Date', () => {
    expect(dayFromDate(new Date(2026, 11, 31, 23, 59))).toBe(dayFromParts(2026, 12, 31));
    expect(dayFromDate(new Date(2027, 0, 1, 0, 1))).toBe(dayFromParts(2027, 1, 1));
  });

  it('counts days in a month including leap years', () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 12)).toBe(31);
  });

  it('adds months and clamps the end of the month', () => {
    expect(toIsoDate(addMonths(dayFromParts(2026, 1, 31), 1))).toBe('2026-02-28');
    expect(toIsoDate(addMonths(dayFromParts(2026, 11, 15), 3))).toBe('2027-02-15');
    expect(toIsoDate(addMonths(dayFromParts(2026, 3, 15), -3))).toBe('2025-12-15');
  });

  it('finds the first of the month and a comparable month index', () => {
    expect(toIsoDate(firstOfMonth(dayFromParts(2026, 10, 17)))).toBe('2026-10-01');
    expect(monthIndex(dayFromParts(2027, 1, 5)) - monthIndex(dayFromParts(2026, 10, 5))).toBe(3);
  });
});
