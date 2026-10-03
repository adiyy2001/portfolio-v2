import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildMonth,
  daysBetween,
  daysInMonth,
  dayKind,
  easterSunday,
  isPublicHoliday,
  monthDays,
  nextWorkingDay,
  publicHolidays,
  soonestWaiting,
  summarize,
  weekdayOf,
} from './deadlines';

const date = (year: number, month: number, day: number) => ({ year, month, day });

describe('calendar helpers', () => {
  it('adds days across month and year borders', () => {
    expect(addDays(date(2026, 12, 30), 3)).toEqual(date(2027, 1, 2));
    expect(addDays(date(2026, 3, 1), -1)).toEqual(date(2026, 2, 28));
  });

  it('counts days between dates', () => {
    expect(daysBetween(date(2026, 10, 3), date(2026, 10, 15))).toBe(12);
    expect(daysBetween(date(2026, 10, 15), date(2026, 10, 3))).toBe(-12);
  });

  it('knows weekdays and month lengths', () => {
    expect(weekdayOf(date(2026, 10, 3))).toBe(6);
    expect(weekdayOf(date(2026, 10, 25))).toBe(0);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 10)).toBe(31);
  });
});

describe('holidays', () => {
  it('computes Easter Sunday', () => {
    expect(easterSunday(2025)).toEqual(date(2025, 4, 20));
    expect(easterSunday(2026)).toEqual(date(2026, 4, 5));
    expect(easterSunday(2027)).toEqual(date(2027, 3, 28));
  });

  it('lists the movable holidays of 2026', () => {
    const holidays = publicHolidays(2026);
    expect(holidays).toContainEqual(date(2026, 4, 6));
    expect(holidays).toContainEqual(date(2026, 5, 24));
    expect(holidays).toContainEqual(date(2026, 6, 4));
  });

  it('treats 24 December as a holiday from 2025 only', () => {
    expect(isPublicHoliday(date(2024, 12, 24))).toBe(false);
    expect(isPublicHoliday(date(2025, 12, 24))).toBe(true);
    expect(isPublicHoliday(date(2026, 12, 24))).toBe(true);
  });

  it('classifies days', () => {
    expect(dayKind(date(2026, 10, 3))).toBe('weekend');
    expect(dayKind(date(2026, 12, 25))).toBe('holiday');
    expect(dayKind(date(2026, 10, 15))).toBe('workday');
  });

  it('finds the next working day', () => {
    expect(nextWorkingDay(date(2026, 10, 25))).toEqual(date(2026, 10, 26));
    expect(nextWorkingDay(date(2026, 12, 25))).toEqual(date(2026, 12, 28));
    expect(nextWorkingDay(date(2026, 10, 15))).toEqual(date(2026, 10, 15));
  });
});

describe('buildMonth', () => {
  it('lists open rows with real deadlines on 3 October 2026', () => {
    const month = buildMonth(date(2026, 10, 3), 'sole');
    expect(month.monthName).toBe('październik');
    expect(month.rows.map(row => [row.id, row.due.day, row.status, row.daysLeft])).toEqual([
      ['ksef', 15, 'open', 12],
      ['zus', 20, 'open', 17],
      ['vat', 26, 'open', 23],
      ['jpk', 26, 'open', 23],
    ]);
  });

  it('explains a deadline moved from a Sunday', () => {
    const vat = buildMonth(date(2026, 10, 3), 'sole').rows.find(row => row.id === 'vat');
    expect(vat?.shiftNote).toBe('25. to niedziela, więc 26.10');
  });

  it('explains a deadline moved from a holiday', () => {
    const vat = buildMonth(date(2026, 12, 3), 'sole').rows.find(row => row.id === 'vat');
    expect(vat?.due).toEqual(date(2026, 12, 28));
    expect(vat?.shiftNote).toBe('25. to święto, więc 28.12');
  });

  it('uses the 15th for ZUS of companies and the 20th for sole traders', () => {
    const zus = (profile: 'sole' | 'company') =>
      buildMonth(date(2026, 10, 3), profile).rows.find(row => row.id === 'zus')?.due.day;
    expect(zus('sole')).toBe(20);
    expect(zus('company')).toBe(15);
  });

  it('moves the ZUS deadline of a sole trader off a Sunday', () => {
    const zus = buildMonth(date(2026, 12, 3), 'sole').rows.find(row => row.id === 'zus');
    expect(zus?.due).toEqual(date(2026, 12, 21));
  });

  it('never moves the invoice deadline', () => {
    const ksef = buildMonth(date(2026, 11, 3), 'sole').rows.find(row => row.id === 'ksef');
    expect(ksef?.due).toEqual(date(2026, 11, 15));
    expect(ksef?.shiftNote).toBeNull();
  });

  it('marks rows done, due today and open around a deadline', () => {
    const statuses = (day: number) =>
      buildMonth(date(2026, 10, day), 'sole').rows.map(row => row.status);
    expect(statuses(15)).toEqual(['today', 'open', 'open', 'open']);
    expect(statuses(16)).toEqual(['done', 'open', 'open', 'open']);
    expect(statuses(20)).toEqual(['done', 'today', 'open', 'open']);
    expect(statuses(26)).toEqual(['done', 'done', 'today', 'today']);
    expect(statuses(27)).toEqual(['done', 'done', 'done', 'done']);
  });
});

describe('soonestWaiting', () => {
  it('picks the first row that is not done yet', () => {
    expect(soonestWaiting(buildMonth(date(2026, 10, 3), 'sole').rows)?.id).toBe('ksef');
    expect(soonestWaiting(buildMonth(date(2026, 10, 16), 'sole').rows)?.id).toBe('zus');
  });

  it('keeps the earlier row when two deadlines fall on the same day', () => {
    expect(soonestWaiting(buildMonth(date(2026, 10, 21), 'sole').rows)?.id).toBe('vat');
  });

  it('counts a deadline that ends today as waiting', () => {
    expect(soonestWaiting(buildMonth(date(2026, 10, 15), 'sole').rows)?.id).toBe('ksef');
  });

  it('returns nothing when every row is done', () => {
    expect(soonestWaiting(buildMonth(date(2026, 10, 28), 'sole').rows)).toBeNull();
  });
});

describe('summarize', () => {
  it('names the nearest deadline', () => {
    expect(summarize(date(2026, 10, 3), 'sole')).toBe(
      'Najbliżej: Faktury z KSeF, za 12 dni (15.10).',
    );
    expect(summarize(date(2026, 10, 14), 'sole')).toBe('Najbliżej: Faktury z KSeF, jutro (15.10).');
  });

  it('names a deadline that ends today', () => {
    expect(summarize(date(2026, 10, 20), 'sole')).toBe('Dziś mija termin: ZUS, 20.10.');
  });

  it('looks at the next month when everything is closed', () => {
    expect(summarize(date(2026, 10, 28), 'sole')).toBe(
      'Październik zamknięty. Następny termin: Faktury z KSeF, za 18 dni (15.11).',
    );
  });

  it('rolls over the year', () => {
    expect(summarize(date(2026, 12, 29), 'company')).toBe(
      'Grudzień zamknięty. Następny termin: Faktury z KSeF, za 17 dni (15.01).',
    );
  });
});

describe('monthDays', () => {
  it('describes every day of October 2026', () => {
    const days = monthDays(2026, 10);
    expect(days).toHaveLength(31);
    expect(days[2]).toBe('weekend');
    expect(days[14]).toBe('workday');
    expect(monthDays(2026, 11)[0]).toBe('weekend');
    expect(monthDays(2026, 11)[10]).toBe('holiday');
  });
});
