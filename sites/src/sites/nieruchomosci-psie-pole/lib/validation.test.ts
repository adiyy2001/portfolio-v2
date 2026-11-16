import { describe, expect, it } from 'vitest';
import {
  firstErrorField,
  isEmail,
  isPhone,
  validateContact,
  validateEnquiry,
  validateValuation,
} from './validation';

describe('phone and email', () => {
  it('accepts nine digits with or without the country code', () => {
    expect(isPhone('600 100 200')).toBe(true);
    expect(isPhone('+48 600-100-200')).toBe(true);
    expect(isPhone('60010020')).toBe(false);
    expect(isPhone('abc')).toBe(false);
  });

  it('accepts a normal address and rejects a broken one', () => {
    expect(isEmail('ola@poczta.example')).toBe(true);
    expect(isEmail('ola@poczta')).toBe(false);
    expect(isEmail('ola poczta.example')).toBe(false);
  });
});

describe('validateValuation', () => {
  it('passes a complete request', () => {
    expect(
      validateValuation({
        name: 'Ola',
        phone: '600100200',
        address: 'ul. Długa 5, Wrocław',
        note: '',
      }),
    ).toEqual({});
  });

  it('reports each missing field', () => {
    const errors = validateValuation({ name: ' ', phone: '', address: '', note: '' });
    expect(Object.keys(errors)).toEqual(['name', 'phone', 'address']);
    expect(errors.phone).toBe('Wpisz numer telefonu.');
  });

  it('points to the first broken field in form order', () => {
    const errors = validateValuation({ name: 'Ola', phone: '12', address: '', note: '' });
    expect(firstErrorField(errors, ['name', 'phone', 'address', 'note'])).toBe('phone');
  });
});

describe('validateContact', () => {
  it('requires name, valid email and a message', () => {
    const errors = validateContact({ name: '', email: 'x', topic: 'inne', message: 'krótko' });
    expect(Object.keys(errors)).toEqual(['name', 'email', 'message']);
    expect(
      validateContact({
        name: 'Ola',
        email: 'ola@poczta.example',
        topic: 'inne',
        message: 'Proszę o kontakt w sprawie oferty.',
      }),
    ).toEqual({});
  });
});

describe('validateEnquiry', () => {
  it('requires name and phone only', () => {
    expect(validateEnquiry({ name: 'Ola', phone: '600100200', when: '' })).toEqual({});
    expect(Object.keys(validateEnquiry({ name: '', phone: '', when: '' }))).toEqual([
      'name',
      'phone',
    ]);
  });
});
