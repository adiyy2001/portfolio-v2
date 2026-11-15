import { describe, expect, it } from 'vitest';
import { formatMoney, guestsLabel, nightsLabel, numberList, numberWord } from './format';

describe('format', () => {
  it('formats money', () => {
    expect(formatMoney(2220, 'pl')).toBe('2\u00a0220\u00a0zł');
    expect(formatMoney(2220, 'en')).toBe('PLN\u00a02,220');
  });

  it('declines nights in Polish', () => {
    expect(nightsLabel(1, 'pl')).toBe('1 doba');
    expect(nightsLabel(3, 'pl')).toBe('3 doby');
    expect(nightsLabel(5, 'pl')).toBe('5 dób');
    expect(nightsLabel(1, 'en')).toBe('1 night');
    expect(nightsLabel(4, 'en')).toBe('4 nights');
  });

  it('declines guests', () => {
    expect(guestsLabel(1, 'pl')).toBe('1 osoba');
    expect(guestsLabel(3, 'pl')).toBe('3 osoby');
    expect(guestsLabel(2, 'en')).toBe('2 guests');
  });

  it('lists room numbers', () => {
    expect(numberList([10, 11, 12, 14], 'pl')).toBe('10, 11, 12 i 14');
    expect(numberList([10, 11, 12, 14], 'en')).toBe('10, 11, 12 and 14');
    expect(numberList([15], 'pl')).toBe('15');
  });

  it('spells the numbers the copy needs', () => {
    expect(numberWord(14, 'pl')).toBe('czternaście');
    expect(numberWord(13, 'en')).toBe('thirteen');
  });
});
