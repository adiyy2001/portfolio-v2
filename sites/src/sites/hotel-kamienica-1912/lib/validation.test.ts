import { describe, expect, it } from 'vitest';
import {
  validateArrival,
  validateEmail,
  validateName,
  validatePhone,
  validateText,
} from './validation';

describe('validation', () => {
  it('validates names', () => {
    expect(validateName('')).toBe('required');
    expect(validateName('Al')).toBe('invalid');
    expect(validateName('Anna Nowak')).toBeNull();
  });

  it('validates phones', () => {
    expect(validatePhone('')).toBe('required');
    expect(validatePhone('12345')).toBe('invalid');
    expect(validatePhone('abc 123456789')).toBe('invalid');
    expect(validatePhone('+48 600 100 200')).toBeNull();
  });

  it('validates e-mail addresses', () => {
    expect(validateEmail('')).toBe('required');
    expect(validateEmail('anna@')).toBe('invalid');
    expect(validateEmail('anna@poczta.example')).toBeNull();
  });

  it('validates arrival dates', () => {
    expect(validateArrival('', '2026-11-15')).toBe('required');
    expect(validateArrival('2026-13-40', '2026-11-15')).toBe('invalid');
    expect(validateArrival('2026-11-14', '2026-11-15')).toBe('past');
    expect(validateArrival('2028-01-01', '2026-11-15')).toBe('far');
    expect(validateArrival('2026-11-20', '2026-11-15')).toBeNull();
  });

  it('validates free text', () => {
    expect(validateText('  ', 10)).toBe('required');
    expect(validateText('krótko', 10)).toBe('invalid');
    expect(validateText('wystarczająco długa wiadomość', 10)).toBeNull();
  });
});
