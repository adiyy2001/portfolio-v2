import { describe, expect, it } from 'vitest';
import { formatGrams, formatPerKg, formatPln } from './money';
import { pluralPl } from './plural';
import { perKgGr } from './pricing';

const nbsp = ' ';

describe('formatPln', () => {
  it('uses a decimal comma and a non-breaking space before the currency', () => {
    expect(formatPln(5200)).toBe(`52,00${nbsp}zł`);
    expect(formatPln(5)).toBe(`0,05${nbsp}zł`);
    expect(formatPln(5200, true)).toBe(`52${nbsp}zł`);
    expect(formatPln(-4400)).toBe(`−44,00${nbsp}zł`);
  });

  it('groups thousands only from ten thousand', () => {
    expect(formatPln(123400)).toBe(`1234,00${nbsp}zł`);
    expect(formatPln(1234500)).toBe(`12${nbsp}345,00${nbsp}zł`);
  });
});

describe('unit helpers', () => {
  it('formats grams and per kilogram prices', () => {
    expect(formatGrams(250)).toBe(`250${nbsp}g`);
    expect(formatGrams(1000)).toBe('1 kg');
    expect(perKgGr(5200)).toBe(20800);
    expect(formatPerKg(perKgGr(4400))).toBe(`176${nbsp}zł/kg`);
  });
});

describe('pluralPl', () => {
  it('picks the Polish plural form', () => {
    expect(pluralPl(1, 'worek', 'worki', 'worków')).toBe('worek');
    expect(pluralPl(2, 'worek', 'worki', 'worków')).toBe('worki');
    expect(pluralPl(12, 'worek', 'worki', 'worków')).toBe('worków');
    expect(pluralPl(22, 'worek', 'worki', 'worków')).toBe('worki');
    expect(pluralPl(5, 'worek', 'worki', 'worków')).toBe('worków');
  });
});
