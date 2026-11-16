import { describe, expect, it } from 'vitest';
import {
  errorFields,
  isPolishPhone,
  makeReference,
  messageLimit,
  normalizePhone,
  referencePattern,
  validateContact,
  type ContactValues,
} from './validation';

const valid: ContactValues = {
  name: 'Ewa Zawada',
  phone: '601 555 014',
  email: '',
  message: '',
  consent: true,
};

describe('validateContact', () => {
  it('accepts name and phone alone for the quick form', () => {
    expect(validateContact({ ...valid, consent: false }, { requireConsent: false })).toEqual({});
  });

  it('requires a name of at least two characters', () => {
    expect(validateContact({ ...valid, name: ' ' }, { requireConsent: true }).name).toBeDefined();
    expect(validateContact({ ...valid, name: 'E' }, { requireConsent: true }).name).toBeDefined();
    expect(
      validateContact({ ...valid, name: 'Ed' }, { requireConsent: true }).name,
    ).toBeUndefined();
  });

  it('requires a nine digit phone number', () => {
    expect(validateContact({ ...valid, phone: '' }, { requireConsent: true }).phone).toBeDefined();
    expect(
      validateContact({ ...valid, phone: '12345' }, { requireConsent: true }).phone,
    ).toBeDefined();
    expect(
      validateContact({ ...valid, phone: '+48 601 555 014' }, { requireConsent: true }).phone,
    ).toBeUndefined();
  });

  it('checks the e-mail only when it is given', () => {
    expect(
      validateContact({ ...valid, email: 'ewa@' }, { requireConsent: true }).email,
    ).toBeDefined();
    expect(
      validateContact({ ...valid, email: 'ewa@example.com' }, { requireConsent: true }).email,
    ).toBeUndefined();
  });

  it('limits the message length', () => {
    const long = 'a'.repeat(messageLimit + 3);
    expect(
      validateContact({ ...valid, message: long }, { requireConsent: true }).message,
    ).toContain('3');
  });

  it('requires consent only when asked', () => {
    expect(
      validateContact({ ...valid, consent: false }, { requireConsent: true }).consent,
    ).toBeDefined();
  });

  it('lists failing fields in form order', () => {
    const errors = validateContact(
      { name: '', phone: '', email: 'x', message: '', consent: false },
      { requireConsent: true },
    );
    expect(errorFields(errors)).toEqual(['name', 'phone', 'email', 'consent']);
  });
});

describe('phone helpers', () => {
  it('normalizes separators', () => {
    expect(normalizePhone('(71) 555-01.33')).toBe('715550133');
    expect(isPolishPhone('0048715550133')).toBe(true);
    expect(isPolishPhone('71555013')).toBe(false);
  });
});

describe('makeReference', () => {
  it('uses the CG prefix and six digits', () => {
    expect(makeReference(() => 0)).toBe('CG-100000');
    expect(makeReference(() => 0.999999)).toMatch(referencePattern);
  });
});
