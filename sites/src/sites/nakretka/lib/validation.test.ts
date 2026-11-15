import { describe, expect, it } from 'vitest';
import {
  isEmail,
  isPolishPhone,
  normalizePhone,
  validateContact,
  validateContactDetails,
  validateRequest,
} from './validation';

describe('phone', () => {
  it('strips separators and the country prefix', () => {
    expect(normalizePhone('+48 600-100-200')).toBe('600100200');
    expect(normalizePhone('0048 71 555 01 96')).toBe('715550196');
  });

  it('wants nine digits', () => {
    expect(isPolishPhone('600 100 200')).toBe(true);
    expect(isPolishPhone('+48 71 555 01 96')).toBe(true);
    expect(isPolishPhone('60010020')).toBe(false);
    expect(isPolishPhone('0600100200')).toBe(false);
    expect(isPolishPhone('abc')).toBe(false);
  });
});

describe('isEmail', () => {
  it('accepts a plain address and rejects the rest', () => {
    expect(isEmail('ola@poczta.pl')).toBe(true);
    expect(isEmail(' ola@poczta.pl ')).toBe(true);
    expect(isEmail('ola@poczta')).toBe(false);
    expect(isEmail('ola poczta.pl')).toBe(false);
  });
});

describe('validateContactDetails', () => {
  it('reports every bad field', () => {
    expect(Object.keys(validateContactDetails({ name: '', phone: '1', car: '' }))).toEqual([
      'name',
      'phone',
      'car',
    ]);
  });

  it('passes good values', () => {
    expect(
      validateContactDetails({ name: 'Ola', phone: '600 100 200', car: 'Fiat Panda 2014' }),
    ).toEqual({});
  });
});

describe('validateRequest', () => {
  it('needs a service', () => {
    const errors = validateRequest({
      name: 'Ola',
      phone: '600100200',
      car: 'Fiat Panda 2014',
      service: '',
    });
    expect(Object.keys(errors)).toEqual(['service']);
  });
});

describe('validateContact', () => {
  it('asks for a message of ten characters', () => {
    const errors = validateContact({
      name: 'Ola',
      email: 'ola@poczta.pl',
      topic: 'wycena',
      message: 'krótko',
    });
    expect(Object.keys(errors)).toEqual(['message']);
  });

  it('passes a full message', () => {
    expect(
      validateContact({
        name: 'Ola',
        email: 'ola@poczta.pl',
        topic: 'wycena',
        message: 'Auto stuka na progach.',
      }),
    ).toEqual({});
  });
});
