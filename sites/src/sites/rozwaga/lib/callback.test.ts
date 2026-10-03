import { describe, expect, it } from 'vitest';
import { callbackDays, callbackSummary, windowsOn, type CallbackWindow } from './callback';
import type { Shift } from './hours';

const shifts: Shift[] = [
  { weekdays: [1, 2, 3, 4], from: 9 * 60, to: 17 * 60 },
  { weekdays: [5], from: 9 * 60, to: 15 * 60 },
];

const at = (year: number, month: number, day: number, hour: number, minute = 0) => ({
  date: { year, month, day },
  minutes: hour * 60 + minute,
});

const ids = (windows: CallbackWindow[]) => windows.map(window => window.id);

describe('windowsOn', () => {
  it('offers three windows on a long day', () => {
    expect(ids(windowsOn({ year: 2026, month: 10, day: 5 }, shifts))).toEqual([
      'morning',
      'noon',
      'afternoon',
    ]);
  });

  it('drops the afternoon on Friday', () => {
    expect(ids(windowsOn({ year: 2026, month: 10, day: 2 }, shifts))).toEqual(['morning', 'noon']);
  });

  it('offers nothing on a weekend or a holiday', () => {
    expect(windowsOn({ year: 2026, month: 10, day: 3 }, shifts)).toEqual([]);
    expect(windowsOn({ year: 2026, month: 11, day: 11 }, shifts)).toEqual([]);
  });
});

describe('callbackDays', () => {
  it('starts with today when there is still enough time', () => {
    const [first] = callbackDays(at(2026, 10, 5, 10), shifts);
    expect(first?.iso).toBe('2026-10-05');
    expect(first?.label).toBe('dziś, poniedziałek 5 października');
    expect(first?.phrase).toBe('dziś');
    expect(ids(first?.windows ?? [])).toEqual(['morning', 'noon', 'afternoon']);
  });

  it('removes today windows that are too close', () => {
    const [first] = callbackDays(at(2026, 10, 5, 11, 30), shifts);
    expect(ids(first?.windows ?? [])).toEqual(['noon', 'afternoon']);
  });

  it('moves to tomorrow late in the day', () => {
    const [first] = callbackDays(at(2026, 10, 5, 16, 30), shifts);
    expect(first?.iso).toBe('2026-10-06');
    expect(first?.label).toBe('jutro, wtorek 6 października');
    expect(first?.phrase).toBe('jutro');
  });

  it('skips the weekend and uses a weekday phrase for later days', () => {
    const days = callbackDays(at(2026, 10, 2, 8), shifts, 2);
    expect(days.map(day => day.iso)).toEqual(['2026-10-02', '2026-10-05']);
    expect(days[1]?.label).toBe('poniedziałek 5 października');
    expect(days[1]?.phrase).toBe('w poniedziałek, 5 października');
  });

  it('skips public holidays', () => {
    const days = callbackDays(at(2026, 11, 9, 18), shifts, 4);
    expect(days.map(day => day.iso)).toEqual([
      '2026-11-10',
      '2026-11-12',
      '2026-11-13',
      '2026-11-16',
    ]);
  });

  it('returns the requested number of days', () => {
    expect(callbackDays(at(2026, 10, 5, 8), shifts)).toHaveLength(5);
    expect(callbackDays(at(2026, 10, 5, 8), shifts, 2)).toHaveLength(2);
  });
});

describe('callbackSummary', () => {
  const [today, , , , later] = callbackDays(at(2026, 10, 5, 8), shifts);
  const noon = today?.windows[1];

  it('promises a call within a business day when nothing is chosen', () => {
    expect(callbackSummary(undefined, undefined)).toBe(
      'Oddzwonimy w ciągu jednego dnia roboczego.',
    );
  });

  it('mentions only the window when no day is chosen', () => {
    expect(callbackSummary(undefined, noon)).toBe(
      'Oddzwonimy w najbliższym dniu roboczym, w godzinach 12:00-15:00.',
    );
  });

  it('mentions the day and the window', () => {
    expect(callbackSummary(today, noon)).toBe('Oddzwonimy dziś, w godzinach 12:00-15:00.');
    expect(callbackSummary(later, noon)).toContain('Oddzwonimy w ');
  });

  it('mentions only the day when no window is chosen', () => {
    expect(callbackSummary(today, undefined)).toBe(
      'Oddzwonimy dziś, w godzinach pracy kancelarii.',
    );
  });
});
