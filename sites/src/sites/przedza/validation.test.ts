import { describe, expect, it } from 'vitest';
import {
  errorFields,
  isPolishPhone,
  messageLimit,
  normalizePhone,
  validateEnquiry,
  type EnquiryValues,
} from './validation';

const valid: EnquiryValues = {
  name: 'Ewa Zawada',
  email: 'ewa@example.com',
  phone: '',
  message: '',
  consent: true,
};

describe('validateEnquiry', () => {
  it('accepts a form with only the required fields', () => {
    expect(validateEnquiry(valid)).toEqual({});
  });

  it('requires a name of at least two characters', () => {
    expect(validateEnquiry({ ...valid, name: '  ' }).name).toBeDefined();
    expect(validateEnquiry({ ...valid, name: 'E' }).name).toBeDefined();
    expect(validateEnquiry({ ...valid, name: 'Ed' }).name).toBeUndefined();
  });

  it('requires an e-mail address that looks complete', () => {
    expect(validateEnquiry({ ...valid, email: '' }).email).toBeDefined();
    expect(validateEnquiry({ ...valid, email: 'ewa@' }).email).toBeDefined();
    expect(validateEnquiry({ ...valid, email: 'ewa@example' }).email).toBeDefined();
    expect(validateEnquiry({ ...valid, email: 'ewa example@x.pl' }).email).toBeDefined();
    expect(validateEnquiry({ ...valid, email: ' ewa@przedza.example ' }).email).toBeUndefined();
  });

  it('treats the phone as optional but checks it when given', () => {
    expect(validateEnquiry({ ...valid, phone: '' }).phone).toBeUndefined();
    expect(validateEnquiry({ ...valid, phone: '600 100 200' }).phone).toBeUndefined();
    expect(validateEnquiry({ ...valid, phone: '12345' }).phone).toBeDefined();
  });

  it('limits the length of the message', () => {
    expect(
      validateEnquiry({ ...valid, message: 'a'.repeat(messageLimit) }).message,
    ).toBeUndefined();
    expect(validateEnquiry({ ...valid, message: 'a'.repeat(messageLimit + 5) }).message).toContain(
      '5',
    );
  });

  it('requires the consent', () => {
    expect(validateEnquiry({ ...valid, consent: false }).consent).toBeDefined();
  });

  it('lists the failing fields in form order', () => {
    const errors = validateEnquiry({
      name: '',
      email: 'x',
      phone: '1',
      message: '',
      consent: false,
    });
    expect(errorFields(errors)).toEqual(['name', 'email', 'phone', 'consent']);
  });
});

describe('phone numbers', () => {
  it('strips separators', () => {
    expect(normalizePhone('+48 (71) 000-00-05')).toBe('+48710000005');
  });

  it('accepts nine digits with or without the country code', () => {
    expect(isPolishPhone('600100200')).toBe(true);
    expect(isPolishPhone('+48 600 100 200')).toBe(true);
    expect(isPolishPhone('0048 600 100 200')).toBe(true);
    expect(isPolishPhone('+49 600 100 200')).toBe(false);
    expect(isPolishPhone('60010020')).toBe(false);
  });
});
