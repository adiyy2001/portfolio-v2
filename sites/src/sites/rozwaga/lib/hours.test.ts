import { describe, expect, it } from 'vitest';
import { formatMinutes, openStatus, shiftOn, statusMessage, type Shift } from './hours';

const shifts: Shift[] = [
  { weekdays: [1, 2, 3, 4], from: 9 * 60, to: 17 * 60 },
  { weekdays: [5], from: 9 * 60, to: 15 * 60 },
];

const at = (year: number, month: number, day: number, hour: number, minute = 0) => ({
  date: { year, month, day },
  minutes: hour * 60 + minute,
});

describe('shiftOn', () => {
  it('returns the shift of the weekday', () => {
    expect(shiftOn({ year: 2026, month: 10, day: 2 }, shifts)?.to).toBe(15 * 60);
    expect(shiftOn({ year: 2026, month: 10, day: 5 }, shifts)?.to).toBe(17 * 60);
  });

  it('returns nothing on weekends and holidays', () => {
    expect(shiftOn({ year: 2026, month: 10, day: 3 }, shifts)).toBeUndefined();
    expect(shiftOn({ year: 2026, month: 11, day: 11 }, shifts)).toBeUndefined();
  });
});

describe('openStatus', () => {
  it('is open during a shift', () => {
    expect(openStatus(at(2026, 10, 5, 10, 15), shifts)).toEqual({ open: true, closesAt: 17 * 60 });
  });

  it('is open exactly at the opening minute and closed exactly at closing', () => {
    expect(openStatus(at(2026, 10, 5, 9), shifts).open).toBe(true);
    expect(openStatus(at(2026, 10, 5, 17), shifts).open).toBe(false);
  });

  it('closes earlier on Friday', () => {
    expect(openStatus(at(2026, 10, 2, 14, 59), shifts)).toEqual({ open: true, closesAt: 15 * 60 });
    expect(openStatus(at(2026, 10, 2, 15), shifts).open).toBe(false);
  });

  it('reports the opening later the same day', () => {
    expect(openStatus(at(2026, 10, 5, 7, 30), shifts)).toEqual({
      open: false,
      opensAt: 9 * 60,
      date: { year: 2026, month: 10, day: 5 },
      daysAhead: 0,
    });
  });

  it('reports the next business day after closing', () => {
    expect(openStatus(at(2026, 10, 5, 18), shifts)).toEqual({
      open: false,
      opensAt: 9 * 60,
      date: { year: 2026, month: 10, day: 6 },
      daysAhead: 1,
    });
  });

  it('skips the weekend', () => {
    const status = openStatus(at(2026, 10, 2, 16), shifts);
    expect(status).toMatchObject({ open: false, daysAhead: 3, date: { day: 5 } });
  });

  it('skips a holiday', () => {
    const status = openStatus(at(2026, 11, 10, 18), shifts);
    expect(status).toMatchObject({ open: false, daysAhead: 2, date: { month: 11, day: 12 } });
  });
});

describe('formatMinutes', () => {
  it('formats hours and minutes without a leading zero on the hour', () => {
    expect(formatMinutes(9 * 60)).toBe('9:00');
    expect(formatMinutes(17 * 60 + 5)).toBe('17:05');
  });
});

describe('statusMessage', () => {
  it('describes an open office', () => {
    expect(statusMessage(openStatus(at(2026, 10, 5, 10), shifts))).toBe('Teraz czynne, do 17:00.');
  });

  it('describes opening today, tomorrow and later in the week', () => {
    expect(statusMessage(openStatus(at(2026, 10, 5, 7), shifts))).toBe(
      'Teraz zamknięte. Otwieramy dziś o 9:00.',
    );
    expect(statusMessage(openStatus(at(2026, 10, 5, 18), shifts))).toBe(
      'Teraz zamknięte. Otwieramy jutro o 9:00.',
    );
    expect(statusMessage(openStatus(at(2026, 10, 2, 16), shifts))).toBe(
      'Teraz zamknięte. Otwieramy w poniedziałek o 9:00.',
    );
  });

  it('uses the right form for Tuesday and Thursday', () => {
    expect(statusMessage(openStatus(at(2026, 4, 3, 16), shifts))).toBe(
      'Teraz zamknięte. Otwieramy we wtorek o 9:00.',
    );
    expect(statusMessage(openStatus(at(2026, 11, 10, 18), shifts))).toBe(
      'Teraz zamknięte. Otwieramy w czwartek o 9:00.',
    );
  });
});
