import { describe, expect, it } from 'vitest';
import { daysLeftPhrase, formatDayMonth, formatZloty, pluralPl } from './format';

const nbsp = ' ';

describe('formatZloty', () => {
  it('prints whole amounts without grosze', () => {
    expect(formatZloty(37900)).toBe(`379${nbsp}zł`);
  });

  it('prints grosze with a comma', () => {
    expect(formatZloty(46617)).toBe(`466,17${nbsp}zł`);
    expect(formatZloty(46605)).toBe(`466,05${nbsp}zł`);
  });

  it('groups thousands with a no break space', () => {
    expect(formatZloty(129000)).toBe(`1${nbsp}290${nbsp}zł`);
    expect(formatZloty(1234567)).toBe(`12${nbsp}345,67${nbsp}zł`);
  });
});

describe('formatDayMonth', () => {
  it('pads day and month to two digits', () => {
    expect(formatDayMonth(5, 3)).toBe('05.03');
    expect(formatDayMonth(26, 10)).toBe('26.10');
  });
});

describe('pluralPl', () => {
  const person = (n: number) => pluralPl(n, 'osoba', 'osoby', 'osób');

  it('uses the one form only for 1', () => {
    expect(person(1)).toBe('osoba');
  });

  it('uses the few form for 2 to 4 except 12 to 14', () => {
    expect([2, 3, 4, 22, 23, 24].map(person)).toEqual(Array(6).fill('osoby'));
    expect([12, 13, 14].map(person)).toEqual(Array(3).fill('osób'));
  });

  it('uses the many form otherwise', () => {
    expect([0, 5, 11, 15, 20, 21, 25].map(person)).toEqual(Array(7).fill('osób'));
  });
});

describe('daysLeftPhrase', () => {
  it('speaks plainly about today and tomorrow', () => {
    expect(daysLeftPhrase(0)).toBe('dziś');
    expect(daysLeftPhrase(1)).toBe('jutro');
    expect(daysLeftPhrase(12)).toBe('za 12 dni');
  });
});
