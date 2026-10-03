import { describe, expect, it } from 'vitest';
import {
  isEmail,
  isPolishPhone,
  normalizePhone,
  validateContact,
  type ContactFields,
} from './validate';

const valid: ContactFields = {
  name: 'Anna',
  phone: '600 100 200',
  email: '',
  topic: 'przeglad',
  consent: true,
};

describe('normalizePhone', () => {
  it('drops spaces, dashes and the country prefix', () => {
    expect(normalizePhone('+48 600-100-200')).toBe('600100200');
    expect(normalizePhone('0048 (600) 100 200')).toBe('600100200');
  });
});

describe('isPolishPhone', () => {
  it('accepts nine digits in common notations', () => {
    expect(isPolishPhone('600100200')).toBe(true);
    expect(isPolishPhone('+48 71 000 00 03')).toBe(true);
    expect(isPolishPhone('71-000-00-03')).toBe(true);
  });

  it('rejects wrong lengths, letters and a leading zero', () => {
    expect(isPolishPhone('60010020')).toBe(false);
    expect(isPolishPhone('6001002000')).toBe(false);
    expect(isPolishPhone('600 abc 200')).toBe(false);
    expect(isPolishPhone('060010020')).toBe(false);
  });
});

describe('isEmail', () => {
  it('accepts a normal address', () => {
    expect(isEmail('anna@poczta.example')).toBe(true);
  });

  it('rejects a missing domain or at sign', () => {
    expect(isEmail('anna@')).toBe(false);
    expect(isEmail('anna.poczta.example')).toBe(false);
    expect(isEmail('anna@poczta')).toBe(false);
  });
});

describe('validateContact', () => {
  it('passes a complete form with no e-mail', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('requires name, phone, topic and consent', () => {
    const errors = validateContact({ ...valid, name: ' ', phone: '', topic: '', consent: false });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'name', 'phone', 'topic']);
  });

  it('checks the e-mail only when it is given', () => {
    expect(validateContact({ ...valid, email: 'anna@' }).email).toBeDefined();
    expect(validateContact({ ...valid, email: '' }).email).toBeUndefined();
  });

  it('explains a malformed phone number differently from a missing one', () => {
    const missing = validateContact({ ...valid, phone: '' }).phone;
    const malformed = validateContact({ ...valid, phone: '12' }).phone;
    expect(missing).not.toBe(malformed);
  });
});
