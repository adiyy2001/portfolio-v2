import { describe, expect, it } from 'vitest';
import { formatGrams, formatPerKg, formatPln, vatIncluded } from './money';
import { pluralPl } from './plural';

const nbsp = '\u00a0';

describe('formatPln', () => {
  it('uses a decimal comma and a non-breaking space before the currency', () => {
    expect(formatPln(4900)).toBe(`49,00${nbsp}zł`);
    expect(formatPln(1299)).toBe(`12,99${nbsp}zł`);
    expect(formatPln(5)).toBe(`0,05${nbsp}zł`);
    expect(formatPln(0)).toBe(`0,00${nbsp}zł`);
  });

  it('drops the zero grosze in compact mode only', () => {
    expect(formatPln(15000, true)).toBe(`150${nbsp}zł`);
    expect(formatPln(1299, true)).toBe(`12,99${nbsp}zł`);
  });

  it('groups digits only from five-digit zloty amounts', () => {
    expect(formatPln(123456)).toBe(`1234,56${nbsp}zł`);
    expect(formatPln(1234567)).toBe(`12${nbsp}345,67${nbsp}zł`);
  });

  it('writes negative amounts with the minus sign', () => {
    expect(formatPln(-1500)).toBe(`\u221215,00${nbsp}zł`);
  });

  it('formats a price per kilogram without trailing zeros', () => {
    expect(formatPerKg(19600)).toBe(`196${nbsp}zł/kg`);
  });
});

describe('vatIncluded', () => {
  it('extracts 23 percent VAT from a gross amount', () => {
    expect(vatIncluded(12300, 23)).toBe(2300);
    expect(vatIncluded(4900, 23)).toBe(916);
    expect(vatIncluded(0, 23)).toBe(0);
  });
});

describe('formatGrams', () => {
  it('shows kilograms for whole thousands', () => {
    expect(formatGrams(250)).toBe(`250${nbsp}g`);
    expect(formatGrams(1000)).toBe('1 kg');
  });
});

describe('pluralPl', () => {
  const forms = (count: number) => pluralPl(count, 'kawę', 'kawy', 'kaw');

  it('picks the Polish noun form', () => {
    expect(forms(1)).toBe('kawę');
    expect(forms(2)).toBe('kawy');
    expect(forms(4)).toBe('kawy');
    expect(forms(5)).toBe('kaw');
    expect(forms(12)).toBe('kaw');
    expect(forms(14)).toBe('kaw');
    expect(forms(22)).toBe('kawy');
    expect(forms(0)).toBe('kaw');
  });
});
