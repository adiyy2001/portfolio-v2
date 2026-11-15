import { describe, expect, it } from 'vitest';
import {
  deadlineDate,
  dayMonthYear,
  easterSunday,
  inDaysLabel,
  isHoliday,
  isWorkday,
  monthRefs,
  nextWorkday,
} from './dates';

describe('Easter and holidays', () => {
  it('finds Easter for the years the site mentions', () => {
    expect(easterSunday(2026)).toEqual(new Date(2026, 3, 5));
    expect(easterSunday(2027)).toEqual(new Date(2027, 2, 28));
  });

  it('knows movable holidays', () => {
    expect(isHoliday(new Date(2026, 5, 4))).toBe(true);
    expect(isHoliday(new Date(2027, 2, 29))).toBe(true);
    expect(isHoliday(new Date(2027, 4, 27))).toBe(true);
    expect(isHoliday(new Date(2027, 4, 16))).toBe(true);
  });

  it('knows fixed holidays including Christmas Eve', () => {
    expect(isHoliday(new Date(2026, 11, 24))).toBe(true);
    expect(isHoliday(new Date(2026, 10, 11))).toBe(true);
    expect(isHoliday(new Date(2026, 10, 12))).toBe(false);
  });
});

describe('deadlines', () => {
  it('moves a Sunday deadline to Monday', () => {
    const date = deadlineDate(2026, 10, 15);
    expect(date.getDate()).toBe(16);
    expect(dayMonthYear(date)).toBe('pn 16.11.2026');
  });

  it('keeps a working day as it is', () => {
    expect(deadlineDate(2026, 10, 20).getDate()).toBe(20);
  });

  it('skips a holiday that follows a weekend', () => {
    const date = nextWorkday(new Date(2027, 2, 28));
    expect(date.getDate()).toBe(30);
  });

  it('treats Saturday as a day off', () => {
    expect(isWorkday(new Date(2026, 10, 14))).toBe(false);
    expect(isWorkday(new Date(2026, 10, 16))).toBe(true);
  });
});

describe('month refs', () => {
  it('lists the previous months newest first', () => {
    const refs = monthRefs(new Date(2026, 10, 15), 6);
    expect(refs[0]).toMatchObject({ y: 2026, m: 9, age: 0, days: 31 });
    expect(refs[5]).toMatchObject({ y: 2026, m: 4, age: 5, days: 31 });
  });

  it('crosses the year boundary', () => {
    const refs = monthRefs(new Date(2027, 0, 5), 2);
    expect(refs[0]).toMatchObject({ y: 2026, m: 11 });
    expect(refs[1]).toMatchObject({ y: 2026, m: 10 });
  });
});

describe('in days label', () => {
  it('counts whole days ahead', () => {
    const now = new Date(2026, 10, 15, 12, 0);
    expect(inDaysLabel(new Date(2026, 10, 20, 23, 59, 59), now)).toBe('za 5 dni');
    expect(inDaysLabel(new Date(2026, 10, 15, 23, 59, 59), now)).toBe('dziś');
    expect(inDaysLabel(new Date(2026, 10, 17, 0, 0, 0), now)).toBe('za 1 dzień');
  });
});
