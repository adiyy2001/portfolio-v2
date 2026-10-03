import { describe, expect, it } from 'vitest';
import {
  collectErrors,
  isEmail,
  isPolishPhone,
  normalizePhone,
  parseDecimal,
  validateConsent,
  validateEmail,
  validateMessage,
  validateName,
  validateNumber,
  validatePhone,
} from './validation';

describe('phone', () => {
  it('strips separators and the country code', () => {
    expect(normalizePhone('+48 600 100 200')).toBe('600100200');
    expect(normalizePhone('0048-600-100-200')).toBe('600100200');
    expect(normalizePhone('(71) 000 00 08')).toBe('710000008');
  });

  it('accepts nine digit numbers and rejects the rest', () => {
    expect(isPolishPhone('600 100 200')).toBe(true);
    expect(isPolishPhone('60010020')).toBe(false);
    expect(isPolishPhone('060010020')).toBe(false);
    expect(isPolishPhone('abc')).toBe(false);
    expect(validatePhone('')).toMatch(/Podaj numer/);
    expect(validatePhone('12')).toMatch(/9 cyfr/);
    expect(validatePhone('600 100 200')).toBeNull();
  });
});

describe('email', () => {
  it('recognises plausible addresses', () => {
    expect(isEmail('anna@poczta.pl')).toBe(true);
    expect(isEmail(' anna@poczta.pl ')).toBe(true);
    expect(isEmail('anna@poczta')).toBe(false);
    expect(isEmail('anna poczta.pl')).toBe(false);
  });

  it('is optional unless required', () => {
    expect(validateEmail('')).toBeNull();
    expect(validateEmail('', true)).toMatch(/Podaj adres/);
    expect(validateEmail('anna@')).toMatch(/niepełny/);
  });
});

describe('text fields', () => {
  it('requires a name', () => {
    expect(validateName('  ')).toMatch(/Podaj imię/);
    expect(validateName('A')).toMatch(/zbyt krótkie/);
    expect(validateName('Anna')).toBeNull();
  });

  it('requires a message of a minimum length', () => {
    expect(validateMessage('')).toMatch(/Napisz kilka słów/);
    expect(validateMessage('krótko')).toMatch(/co najmniej 10/);
    expect(validateMessage('Dzień dobry, proszę o kontakt.')).toBeNull();
  });

  it('requires consent', () => {
    expect(validateConsent(false)).toMatch(/zgodę/);
    expect(validateConsent(true)).toBeNull();
  });
});

describe('numbers', () => {
  it('parses decimals with a comma and spaces', () => {
    expect(parseDecimal('54,5')).toBe(54.5);
    expect(parseDecimal(' 1 200 ')).toBe(1200);
    expect(parseDecimal('12a')).toBeNull();
    expect(parseDecimal('-3')).toBeNull();
  });

  it('checks the range and names the field', () => {
    expect(validateNumber('', 'powierzchnię', 10, 500)).toBe('Podaj powierzchnię.');
    expect(validateNumber('x', 'powierzchnię', 10, 500)).toMatch(/wpisz liczbę/);
    expect(validateNumber('5', 'powierzchnię', 10, 500)).toMatch(/od 10 do 500/);
    expect(validateNumber('54,5', 'powierzchnię', 10, 500)).toBeNull();
  });
});

describe('collecting errors', () => {
  it('keeps only fields with a message', () => {
    expect(
      collectErrors([
        ['name', null],
        ['phone', 'Brak numeru'],
        ['email', null],
      ]),
    ).toEqual({ phone: 'Brak numeru' });
  });
});
