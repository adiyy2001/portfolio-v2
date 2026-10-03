import { describe, expect, it } from 'vitest';
import {
  dateParts,
  describeRecurrence,
  menuWeekLabel,
  menuWeekOf,
  nextLabel,
  nextOccurrence,
  nextShowing,
  parseRecurrence,
  serializeRecurrence,
  type Recurrence,
  toIso,
  warsawToday,
  weekdayOf,
} from './schedule';

const on = (year: number, month: number, day: number) => ({ year, month, day });

describe('weekdayOf', () => {
  it('knows the weekday of a date', () => {
    expect(weekdayOf(on(2026, 10, 3))).toBe(6);
    expect(weekdayOf(on(2026, 11, 11))).toBe(3);
  });
});

describe('warsawToday', () => {
  it('uses the calendar date in Warsaw, not in UTC', () => {
    expect(warsawToday(new Date('2026-10-03T23:30:00Z'))).toEqual(on(2026, 10, 4));
    expect(warsawToday(new Date('2026-12-31T23:30:00Z'))).toEqual(on(2027, 1, 1));
  });
});

describe('nextOccurrence', () => {
  it('finds the next weekly date and includes today', () => {
    const sunday = { kind: 'weekly', weekday: 0 } as const;
    expect(nextOccurrence(sunday, on(2026, 10, 3))).toEqual(on(2026, 10, 4));
    expect(nextOccurrence(sunday, on(2026, 10, 4))).toEqual(on(2026, 10, 4));
    expect(nextOccurrence(sunday, on(2026, 10, 5))).toEqual(on(2026, 10, 11));
  });

  it('rolls weekly dates over a year end', () => {
    expect(nextOccurrence({ kind: 'weekly', weekday: 4 }, on(2026, 12, 31))).toEqual(
      on(2026, 12, 31),
    );
    expect(nextOccurrence({ kind: 'weekly', weekday: 4 }, on(2027, 1, 1))).toEqual(on(2027, 1, 7));
  });

  it('finds the first Saturday of the month', () => {
    const rule = { kind: 'monthly', weekday: 6, nth: 1 } as const;
    expect(nextOccurrence(rule, on(2026, 10, 3))).toEqual(on(2026, 10, 3));
    expect(nextOccurrence(rule, on(2026, 10, 4))).toEqual(on(2026, 11, 7));
    expect(nextOccurrence(rule, on(2026, 12, 20))).toEqual(on(2027, 1, 2));
  });

  it('finds the last Thursday of the month', () => {
    const rule = { kind: 'monthly', weekday: 4, nth: 'last' } as const;
    expect(nextOccurrence(rule, on(2026, 10, 3))).toEqual(on(2026, 10, 29));
    expect(nextOccurrence(rule, on(2026, 10, 30))).toEqual(on(2026, 11, 26));
    expect(nextOccurrence(rule, on(2026, 2, 1))).toEqual(on(2026, 2, 26));
    expect(nextOccurrence(rule, on(2026, 12, 31))).toEqual(on(2026, 12, 31));
  });

  it('handles the fifth weekday of a month for the last rule', () => {
    const rule = { kind: 'monthly', weekday: 3, nth: 'last' } as const;
    expect(nextOccurrence(rule, on(2026, 12, 1))).toEqual(on(2026, 12, 30));
    expect(nextOccurrence(rule, on(2026, 9, 1))).toEqual(on(2026, 9, 30));
  });

  it('repeats yearly dates', () => {
    const marcin = { kind: 'yearly', month: 11, day: 11 } as const;
    expect(nextOccurrence(marcin, on(2026, 10, 3))).toEqual(on(2026, 11, 11));
    expect(nextOccurrence(marcin, on(2026, 11, 11))).toEqual(on(2026, 11, 11));
    expect(nextOccurrence(marcin, on(2026, 11, 12))).toEqual(on(2027, 11, 11));
  });
});

describe('toIso', () => {
  it('pads month and day', () => {
    expect(toIso(on(2026, 3, 7))).toBe('2026-03-07');
  });
});

describe('dateParts', () => {
  it('formats a date in Polish', () => {
    expect(dateParts(on(2026, 10, 8), 'pl')).toEqual({
      weekday: 'czwartek',
      day: '8',
      monthShort: 'paź',
      full: 'czwartek, 8 października',
      fullWithYear: 'czwartek, 8 października 2026',
    });
  });

  it('formats a date in English', () => {
    const parts = dateParts(on(2026, 10, 8), 'en');
    expect(parts.weekday).toBe('Thursday');
    expect(parts.monthShort).toBe('Oct');
    expect(parts.full).toBe('Thursday 8 October');
  });
});

describe('describeRecurrence', () => {
  it('describes weekly rules with the right gender in Polish', () => {
    expect(describeRecurrence({ kind: 'weekly', weekday: 0 }, 'pl')).toBe('w każdą niedzielę');
    expect(describeRecurrence({ kind: 'weekly', weekday: 4 }, 'pl')).toBe('w każdy czwartek');
    expect(describeRecurrence({ kind: 'weekly', weekday: 3 }, 'pl')).toBe('w każdą środę');
  });

  it('describes monthly rules with ordinals that agree with the weekday', () => {
    expect(describeRecurrence({ kind: 'monthly', weekday: 6, nth: 1 }, 'pl')).toBe(
      'w pierwszą sobotę miesiąca',
    );
    expect(describeRecurrence({ kind: 'monthly', weekday: 3, nth: 'last' }, 'pl')).toBe(
      'w ostatnią środę miesiąca',
    );
    expect(describeRecurrence({ kind: 'monthly', weekday: 4, nth: 2 }, 'pl')).toBe(
      'w drugi czwartek miesiąca',
    );
  });

  it('describes yearly rules with the month in the genitive', () => {
    expect(describeRecurrence({ kind: 'yearly', month: 11, day: 11 }, 'pl')).toBe(
      'co roku 11 listopada',
    );
    expect(describeRecurrence({ kind: 'yearly', month: 11, day: 11 }, 'en')).toBe(
      'every year on 11 November',
    );
  });

  it('describes rules in English', () => {
    expect(describeRecurrence({ kind: 'weekly', weekday: 0 }, 'en')).toBe('every Sunday');
    expect(describeRecurrence({ kind: 'monthly', weekday: 6, nth: 1 }, 'en')).toBe(
      'the first Saturday of the month',
    );
    expect(describeRecurrence({ kind: 'monthly', weekday: 3, nth: 'last' }, 'en')).toBe(
      'the last Wednesday of the month',
    );
  });
});

describe('serializeRecurrence and parseRecurrence', () => {
  const rules: Recurrence[] = [
    { kind: 'weekly', weekday: 0 },
    { kind: 'weekly', weekday: 4 },
    { kind: 'monthly', weekday: 6, nth: 1 },
    { kind: 'monthly', weekday: 3, nth: 'last' },
    { kind: 'yearly', month: 11, day: 11 },
  ];

  it('round trips every kind of rule', () => {
    for (const rule of rules) {
      expect(parseRecurrence(serializeRecurrence(rule))).toEqual(rule);
    }
  });

  it('rejects text that is not a rule', () => {
    for (const text of [
      '',
      'weekly',
      'weekly:7',
      'weekly:x',
      'monthly:3:5',
      'monthly:3',
      'yearly:13:1',
      'yearly:2:40',
      'daily:1',
    ]) {
      expect(parseRecurrence(text)).toBeNull();
    }
  });
});

describe('nextLabel', () => {
  it('marks an event that is today', () => {
    expect(nextLabel(on(2026, 10, 4), on(2026, 10, 4), 'pl')).toBe(
      'niedziela, 4 października\u00a0(dziś)',
    );
    expect(nextLabel(on(2026, 10, 4), on(2026, 10, 4), 'en')).toBe('Sunday 4 October\u00a0(today)');
  });

  it('shows only the date for later days', () => {
    expect(nextLabel(on(2026, 10, 8), on(2026, 10, 4), 'pl')).toBe('czwartek, 8 października');
  });
});

describe('nextShowing', () => {
  const sundayLunch: Recurrence = { kind: 'weekly', weekday: 0 };

  it('keeps today while the event has not ended', () => {
    const now = { date: on(2026, 10, 4), minutes: 15 * 60 };
    expect(nextShowing(sundayLunch, now, '16:00')).toEqual(on(2026, 10, 4));
  });

  it('moves to the next occurrence once the event has ended', () => {
    const now = { date: on(2026, 10, 4), minutes: 17 * 60 + 30 };
    expect(nextShowing(sundayLunch, now, '16:00')).toEqual(on(2026, 10, 11));
  });

  it('moves to the next month for a monthly event that ended today', () => {
    const workshop: Recurrence = { kind: 'monthly', weekday: 6, nth: 1 };
    const now = { date: on(2026, 10, 3), minutes: 18 * 60 };
    expect(nextShowing(workshop, now, '16:30')).toEqual(on(2026, 11, 7));
  });

  it('moves a yearly event to next year once it has ended', () => {
    const martin: Recurrence = { kind: 'yearly', month: 11, day: 11 };
    const now = { date: on(2026, 11, 11), minutes: 23 * 60 };
    expect(nextShowing(martin, now, '22:00')).toEqual(on(2027, 11, 11));
  });

  it('does not touch a future date', () => {
    const now = { date: on(2026, 10, 5), minutes: 23 * 60 };
    expect(nextShowing(sundayLunch, now, '16:00')).toEqual(on(2026, 10, 11));
  });
});

describe('nextLabel with a year', () => {
  it('adds the year when the date falls in another year', () => {
    expect(nextLabel(on(2027, 11, 11), on(2026, 11, 12), 'pl')).toBe('czwartek, 11 listopada 2027');
    expect(nextLabel(on(2027, 1, 7), on(2026, 12, 20), 'en')).toBe('Thursday, 7 January 2027');
  });

  it('adds the year when the date is far ahead in the same year', () => {
    expect(nextLabel(on(2026, 11, 11), on(2026, 6, 1), 'pl')).toBe('środa, 11 listopada 2026');
  });

  it('leaves the year out for dates within a few months', () => {
    expect(nextLabel(on(2026, 11, 11), on(2026, 10, 3), 'pl')).toBe('środa, 11 listopada');
  });
});

describe('menuWeekOf', () => {
  it('starts on the Tuesday before a day inside the week', () => {
    expect(menuWeekOf(on(2026, 10, 3))).toEqual({ start: on(2026, 9, 29), end: on(2026, 10, 4) });
    expect(menuWeekOf(on(2026, 9, 29))).toEqual({ start: on(2026, 9, 29), end: on(2026, 10, 4) });
    expect(menuWeekOf(on(2026, 10, 4))).toEqual({ start: on(2026, 9, 29), end: on(2026, 10, 4) });
  });

  it('shows the coming week on Monday, when the bistro is closed', () => {
    expect(menuWeekOf(on(2026, 10, 5))).toEqual({ start: on(2026, 10, 6), end: on(2026, 10, 11) });
  });
});

describe('menuWeekLabel', () => {
  const week = menuWeekOf(on(2026, 10, 3));

  it('labels the week in Polish', () => {
    expect(menuWeekLabel(week, 'pl')).toBe('wt 29 września - nd 4 października 2026');
  });

  it('labels the week in English', () => {
    expect(menuWeekLabel(week, 'en')).toBe('Tue 29 September - Sun 4 October 2026');
  });

  it('shows both years when the week crosses New Year', () => {
    expect(menuWeekLabel(menuWeekOf(on(2026, 12, 30)), 'en')).toBe(
      'Tue 29 December 2026 - Sun 3 January 2027',
    );
  });
});
