import { describe, expect, it } from 'vitest';
import { dayFromParts } from './dates';
import {
  formatDate,
  formatDateNoYear,
  formatDayLong,
  formatDayShort,
  formatExtraLine,
  formatGuests,
  formatMonthYear,
  formatNights,
  formatPln,
  formatRoomsFree,
  lowerFirst,
} from './format';

const nbsp = ' ';
const friday = dayFromParts(2026, 10, 9);

describe('money', () => {
  it('formats Polish amounts with a non-breaking space and a złoty sign', () => {
    expect(formatPln(340, 'pl')).toBe(`340${nbsp}zł`);
    expect(formatPln(1480, 'pl')).toBe(`1480${nbsp}zł`);
    expect(formatPln(12480, 'pl')).toBe(`12${nbsp}480${nbsp}zł`);
    expect(formatPln(0, 'pl')).toBe(`0${nbsp}zł`);
  });

  it('formats English amounts with a currency prefix and commas', () => {
    expect(formatPln(340, 'en')).toBe(`PLN${nbsp}340`);
    expect(formatPln(1480, 'en')).toBe(`PLN${nbsp}1,480`);
    expect(formatPln(1234567, 'en')).toBe(`PLN${nbsp}1,234,567`);
  });

  it('rounds to whole złoty and keeps the sign of discounts', () => {
    expect(formatPln(-170, 'pl')).toBe(`-170${nbsp}zł`);
    expect(formatPln(332.4, 'pl')).toBe(`332${nbsp}zł`);
    expect(formatPln(-153, 'en')).toBe(`-PLN${nbsp}153`);
  });
});

describe('dates', () => {
  it('formats short days with weekday and month', () => {
    expect(formatDayShort(friday, 'pl')).toBe('pt 9 paź');
    expect(formatDayShort(friday, 'en')).toBe('Fri 9 Oct');
  });

  it('formats long days with the genitive month in Polish', () => {
    expect(formatDayLong(friday, 'pl')).toBe('piątek, 9 października 2026');
    expect(formatDayLong(friday, 'en')).toBe('Friday, 9 October 2026');
    expect(formatDate(dayFromParts(2027, 3, 1), 'pl')).toBe('1 marca 2027');
    expect(formatDateNoYear(dayFromParts(2027, 5, 20), 'pl')).toBe('20 maja');
  });

  it('formats the month heading with the nominative month', () => {
    expect(formatMonthYear(2026, 10, 'pl')).toBe('październik 2026');
    expect(formatMonthYear(2027, 2, 'en')).toBe('February 2027');
  });
});

describe('plurals', () => {
  it('declines nights in Polish', () => {
    const forms = [1, 2, 4, 5, 11, 12, 14, 21, 22, 25, 30].map(count => formatNights(count, 'pl'));
    expect(forms).toEqual([
      `1${nbsp}noc`,
      `2${nbsp}noce`,
      `4${nbsp}noce`,
      `5${nbsp}nocy`,
      `11${nbsp}nocy`,
      `12${nbsp}nocy`,
      `14${nbsp}nocy`,
      `21${nbsp}nocy`,
      `22${nbsp}noce`,
      `25${nbsp}nocy`,
      `30${nbsp}nocy`,
    ]);
  });

  it('declines guests in both languages', () => {
    expect([1, 2, 4].map(count => formatGuests(count, 'pl'))).toEqual([
      `1${nbsp}osoba`,
      `2${nbsp}osoby`,
      `4${nbsp}osoby`,
    ]);
    expect([1, 2].map(count => formatGuests(count, 'en'))).toEqual([
      `1${nbsp}guest`,
      `2${nbsp}guests`,
    ]);
    expect(formatNights(1, 'en')).toBe(`1${nbsp}night`);
    expect(formatNights(3, 'en')).toBe(`3${nbsp}nights`);
  });

  it('writes the free room count', () => {
    expect(formatRoomsFree(5, 7, 'pl')).toBe('wolne 5 z 7');
    expect(formatRoomsFree(5, 7, 'en')).toBe('5 of 7 free');
  });
});

describe('formatExtraLine', () => {
  const units = { persons: 'os.', pieces: 'szt.' };
  const nbsp = '\u00a0';

  it('combines count and nights with a multiplication sign', () => {
    expect(formatExtraLine('Śniadanie', 2, 3, true, units, 'pl')).toBe(
      `Śniadanie, 2${nbsp}os.${nbsp}\u00d7${nbsp}3${nbsp}noce`,
    );
  });

  it('shows only the nights for a single item', () => {
    expect(formatExtraLine('Parking', 1, 3, false, units, 'pl')).toBe(`Parking, 3${nbsp}noce`);
  });

  it('shows only the count for a per stay item', () => {
    expect(formatExtraLine('Transfer', 2, 1, false, units, 'pl')).toBe(`Transfer, 2${nbsp}szt.`);
  });

  it('keeps the bare name for a single item per stay', () => {
    expect(formatExtraLine('Zestaw powitalny', 1, 1, false, units, 'en')).toBe('Zestaw powitalny');
  });
});

describe('lowerFirst', () => {
  it('lowers only the first letter', () => {
    expect(lowerFirst('Z widokiem na Odrę')).toBe('z widokiem na Odrę');
    expect(lowerFirst('')).toBe('');
  });
});
