import { describe, expect, it } from 'vitest';
import { formatGrosze, formatPrice, formatZloty, invoicesLabel, plural } from './format';

describe('formatting', () => {
  it('groups thousands with a non breaking space and keeps two decimals', () => {
    expect(formatGrosze(1250958)).toBe('12 509,58');
    expect(formatGrosze(5)).toBe('0,05');
    expect(formatGrosze(-12345)).toBe('-123,45');
  });

  it('adds the currency', () => {
    expect(formatZloty(39000)).toBe('390,00 zł');
  });

  it('formats a price given in whole zloty', () => {
    expect(formatPrice(1090)).toBe('1 090,00');
  });

  it('picks Polish plural forms', () => {
    expect(plural(1, 'dzień', 'dni', 'dni')).toBe('dzień');
    expect(plural(3, 'faktura', 'faktury', 'faktur')).toBe('faktury');
    expect(plural(12, 'faktura', 'faktury', 'faktur')).toBe('faktur');
    expect(plural(22, 'faktura', 'faktury', 'faktur')).toBe('faktury');
    expect(invoicesLabel(85)).toBe('85 faktur');
    expect(invoicesLabel(1)).toBe('1 faktura');
  });
});
