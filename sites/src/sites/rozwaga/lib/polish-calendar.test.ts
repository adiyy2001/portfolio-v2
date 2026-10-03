import { describe, expect, it } from 'vitest';
import {
  addDays,
  easterSunday,
  isBusinessDay,
  isPublicHoliday,
  isoDate,
  publicHolidays,
  weekdayOf,
} from './polish-calendar';

const date = (year: number, month: number, day: number) => ({ year, month, day });

describe('weekdayOf', () => {
  it('returns 0 for Sunday and 6 for Saturday', () => {
    expect(weekdayOf(date(2026, 10, 4))).toBe(0);
    expect(weekdayOf(date(2026, 10, 3))).toBe(6);
    expect(weekdayOf(date(2026, 10, 5))).toBe(1);
  });
});

describe('addDays', () => {
  it('moves across month and year boundaries', () => {
    expect(addDays(date(2026, 10, 30), 3)).toEqual(date(2026, 11, 2));
    expect(addDays(date(2026, 12, 31), 1)).toEqual(date(2027, 1, 1));
    expect(addDays(date(2026, 3, 1), -1)).toEqual(date(2026, 2, 28));
  });
});

describe('isoDate', () => {
  it('pads month and day', () => {
    expect(isoDate(date(2026, 3, 7))).toBe('2026-03-07');
  });
});

describe('easterSunday', () => {
  it('matches known dates', () => {
    expect(easterSunday(2025)).toEqual(date(2025, 4, 20));
    expect(easterSunday(2026)).toEqual(date(2026, 4, 5));
    expect(easterSunday(2027)).toEqual(date(2027, 3, 28));
    expect(easterSunday(2028)).toEqual(date(2028, 4, 16));
  });
});

describe('publicHolidays', () => {
  it('lists the movable holidays of 2026', () => {
    const holidays = publicHolidays(2026);
    expect(holidays).toContainEqual(date(2026, 4, 6));
    expect(holidays).toContainEqual(date(2026, 5, 24));
    expect(holidays).toContainEqual(date(2026, 6, 4));
  });

  it('adds Christmas Eve from 2025 only', () => {
    expect(isPublicHoliday(date(2025, 12, 24))).toBe(true);
    expect(isPublicHoliday(date(2024, 12, 24))).toBe(false);
  });
});

describe('isBusinessDay', () => {
  it('accepts an ordinary weekday', () => {
    expect(isBusinessDay(date(2026, 10, 2))).toBe(true);
  });

  it('rejects weekends', () => {
    expect(isBusinessDay(date(2026, 10, 3))).toBe(false);
    expect(isBusinessDay(date(2026, 10, 4))).toBe(false);
  });

  it('rejects weekday holidays', () => {
    expect(isBusinessDay(date(2026, 11, 11))).toBe(false);
    expect(isBusinessDay(date(2026, 4, 6))).toBe(false);
    expect(isBusinessDay(date(2026, 12, 24))).toBe(false);
  });
});
