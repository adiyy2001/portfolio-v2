import { describe, expect, it } from 'vitest';
import { formatNip, isValidNip, normaliseNip } from './nip';

describe('NIP checksum', () => {
  it('accepts numbers with a correct check digit', () => {
    for (const nip of ['1234563218', '9876543210', '5213456784', '7123456706', '5551234564']) {
      expect(isValidNip(nip)).toBe(true);
    }
  });

  it('accepts the usual separators and the PL prefix', () => {
    expect(isValidNip('123-456-32-18')).toBe(true);
    expect(isValidNip('123 456 32 18')).toBe(true);
    expect(isValidNip('PL1234563218')).toBe(true);
    expect(isValidNip(' pl 123-456-32-18 ')).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(isValidNip('1234563219')).toBe(false);
    expect(isValidNip('1234563210')).toBe(false);
    expect(isValidNip('9876543211')).toBe(false);
  });

  it('rejects numbers whose remainder is ten, whatever the last digit is', () => {
    for (let last = 0; last <= 9; last += 1) {
      expect(isValidNip(`123456789${last}`)).toBe(false);
    }
  });

  it('rejects wrong lengths and characters', () => {
    expect(isValidNip('')).toBe(false);
    expect(isValidNip('123456321')).toBe(false);
    expect(isValidNip('12345632180')).toBe(false);
    expect(isValidNip('12345632a8')).toBe(false);
    expect(isValidNip('0000000000')).toBe(false);
  });

  it('normalises and formats', () => {
    expect(normaliseNip('PL 123-456-32-18')).toBe('1234563218');
    expect(formatNip('1234563218')).toBe('123-456-32-18');
    expect(formatNip('12345')).toBe('12345');
  });
});
