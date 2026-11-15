import { describe, expect, it } from 'vitest';
import { types } from './data';
import { floorInline } from './format';

describe('floorInline', () => {
  it('lowers only the word for the ground floor', () => {
    expect(floorInline('Parter')).toBe('parter');
  });

  it('keeps roman numerals uppercase', () => {
    expect(floorInline('I piętro')).toBe('I piętro');
    expect(floorInline('II piętro')).toBe('II piętro');
    expect(floorInline('III piętro')).toBe('III piętro');
  });

  it('never yields a lowercase roman numeral for any loft type', () => {
    for (const type of types) {
      expect(floorInline(type.floor)).not.toMatch(/^(i|ii|iii) /);
    }
  });
});
