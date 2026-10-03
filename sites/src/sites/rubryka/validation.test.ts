import { describe, expect, it } from 'vitest';
import {
  type ContactValues,
  firstInvalidField,
  isValidEmail,
  isValidNip,
  normalizePhone,
  validateContact,
} from './validation';

const valid: ContactValues = {
  name: 'Anna Nowak',
  email: 'anna@firma.example',
  phone: '',
  contactMethod: 'email',
  nip: '',
  consent: true,
};

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isValidEmail('biuro@rubryka.example')).toBe(true);
    expect(isValidEmail('  jan.kowalski+faktury@mala-firma.com.pl ')).toBe(true);
  });

  it('rejects broken addresses', () => {
    for (const value of [
      '',
      'anna',
      'anna@',
      '@firma.pl',
      'anna@firma',
      'a nna@firma.pl',
      'a@b..pl',
    ]) {
      expect(isValidEmail(value)).toBe(false);
    }
  });
});

describe('normalizePhone', () => {
  it('returns nine digits for common spellings', () => {
    expect(normalizePhone('600 100 200')).toBe('600100200');
    expect(normalizePhone('+48 71 000 00 02')).toBe('710000002');
    expect(normalizePhone('0048-600-100-200')).toBe('600100200');
    expect(normalizePhone('(71) 000-00-02')).toBe('710000002');
  });

  it('rejects wrong lengths and letters', () => {
    expect(normalizePhone('60010020')).toBeNull();
    expect(normalizePhone('6001002000')).toBeNull();
    expect(normalizePhone('abc123456')).toBeNull();
    expect(normalizePhone('000 000 000')).toBeNull();
  });
});

describe('isValidNip', () => {
  it('accepts a number with a correct checksum, with or without separators', () => {
    expect(isValidNip('1234563218')).toBe(true);
    expect(isValidNip('123-456-32-18')).toBe(true);
    expect(isValidNip('123 456 32 18')).toBe(true);
  });

  it('rejects a wrong checksum, wrong length and zeros', () => {
    expect(isValidNip('1234563219')).toBe(false);
    expect(isValidNip('123456321')).toBe(false);
    expect(isValidNip('12345632180')).toBe(false);
    expect(isValidNip('0000000000')).toBe(false);
    expect(isValidNip('abcdefghij')).toBe(false);
  });

  it('rejects a checksum remainder of 10', () => {
    expect(isValidNip('9000000000')).toBe(false);
  });
});

describe('validateContact', () => {
  it('passes with only the required fields', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('asks for a name, e-mail and consent', () => {
    const errors = validateContact({ ...valid, name: ' ', email: 'x', consent: false });
    expect(Object.keys(errors)).toEqual(['name', 'email', 'consent']);
  });

  it('requires a phone number only when the contact method is phone', () => {
    expect(validateContact({ ...valid, contactMethod: 'phone' }).phone).toContain('telefonu');
    expect(validateContact({ ...valid, contactMethod: 'phone', phone: '600 100 200' })).toEqual({});
  });

  it('checks a phone number that was given anyway', () => {
    expect(validateContact({ ...valid, phone: '123' }).phone).toContain('9 cyfr');
  });

  it('checks the NIP only when it is filled in', () => {
    expect(validateContact({ ...valid, nip: '1234563218' })).toEqual({});
    expect(validateContact({ ...valid, nip: '1234563219' }).nip).toContain('sumy kontrolnej');
  });
});

describe('firstInvalidField', () => {
  it('returns the first field in page order', () => {
    expect(firstInvalidField({ consent: 'x', email: 'y' })).toBe('email');
    expect(firstInvalidField({})).toBeNull();
  });
});
