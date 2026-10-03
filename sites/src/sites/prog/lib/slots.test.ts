import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateKey,
  easterSunday,
  holidaysOf,
  isHoliday,
  isTaken,
  isViewingDay,
  longDayLabel,
  slotTimesFor,
  upcomingViewingDays,
  weekdayOf,
} from './slots';

describe('calendar', () => {
  it('finds easter sunday', () => {
    expect(dateKey(easterSunday(2026))).toBe('2026-04-05');
    expect(dateKey(easterSunday(2027))).toBe('2027-03-28');
  });

  it('adds days across month and year borders', () => {
    expect(dateKey(addDays({ year: 2026, month: 12, day: 30 }, 3))).toBe('2027-01-02');
    expect(dateKey(addDays({ year: 2028, month: 2, day: 28 }, 1))).toBe('2028-02-29');
  });

  it('computes the weekday', () => {
    expect(weekdayOf({ year: 2026, month: 10, day: 3 })).toBe(6);
  });
});

describe('holidays', () => {
  it('lists fixed and movable Polish holidays', () => {
    const holidays = holidaysOf(2026);
    for (const key of [
      '2026-01-01',
      '2026-01-06',
      '2026-04-05',
      '2026-04-06',
      '2026-05-24',
      '2026-06-04',
      '2026-11-11',
      '2026-12-26',
    ]) {
      expect(holidays.has(key)).toBe(true);
    }
  });

  it('counts christmas eve as a holiday from 2025', () => {
    expect(isHoliday({ year: 2026, month: 12, day: 24 })).toBe(true);
    expect(isHoliday({ year: 2024, month: 12, day: 24 })).toBe(false);
  });

  it('does not offer viewings on sundays or holidays', () => {
    expect(isViewingDay({ year: 2026, month: 10, day: 4 })).toBe(false);
    expect(isViewingDay({ year: 2026, month: 11, day: 11 })).toBe(false);
    expect(isViewingDay({ year: 2026, month: 10, day: 5 })).toBe(true);
  });
});

describe('viewing days', () => {
  const today = { year: 2026, month: 10, day: 30 };

  it('starts tomorrow, skips Sunday and holidays and returns the requested count', () => {
    const days = upcomingViewingDays(today, 'x', 6);
    expect(days.map(day => day.key)).toEqual([
      '2026-10-31',
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
    ]);
  });

  it('ends Saturday earlier than weekdays', () => {
    expect(slotTimesFor(2)).toEqual([
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
    expect(slotTimesFor(6)).toEqual(['10:00', '11:00', '12:00', '13:00']);
  });

  it('marks the same slots as taken every time', () => {
    const first = upcomingViewingDays(today, 'oferta-a', 4);
    const second = upcomingViewingDays(today, 'oferta-a', 4);
    expect(first).toEqual(second);
    expect(isTaken('oferta-a', '2026-11-02', '10:00')).toBe(
      isTaken('oferta-a', '2026-11-02', '10:00'),
    );
  });

  it('leaves some slots free and some taken', () => {
    const slots = upcomingViewingDays(today, 'oferta-b', 10).flatMap(day => day.slots);
    expect(slots.some(slot => slot.taken)).toBe(true);
    expect(slots.some(slot => !slot.taken)).toBe(true);
  });

  it('labels days in Polish', () => {
    expect(longDayLabel({ year: 2026, month: 11, day: 2 })).toBe('poniedziałek 2 listopada');
  });
});
