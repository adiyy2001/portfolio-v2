import { describe, expect, it } from 'vitest';
import {
  emptyCheckout,
  firstErrorField,
  checkoutFieldOrder,
  isEmail,
  isLockerCode,
  isPhone,
  isPostcode,
  normalizePhone,
  validateCheckout,
  validateContact,
  validateSubscriptionContact,
} from './validation';
import type { CheckoutValues } from './validation';

const filled: CheckoutValues = {
  firstName: 'Anna',
  lastName: 'Nowak',
  email: 'anna@poczta.example',
  phone: '600 700 800',
  delivery: 'kurier',
  locker: '',
  street: 'Ulica Testowa 5',
  postcode: '50-123',
  city: 'Wrocław',
  payment: 'blik',
};

describe('field checks', () => {
  it('validates email addresses', () => {
    expect(isEmail('anna@poczta.example')).toBe(true);
    expect(isEmail(' anna@poczta.example ')).toBe(true);
    expect(isEmail('anna@poczta')).toBe(false);
    expect(isEmail('anna poczta.pl')).toBe(false);
  });

  it('validates Polish phone numbers with or without a prefix', () => {
    expect(normalizePhone('+48 600-700-800')).toBe('600700800');
    expect(normalizePhone('0048600700800')).toBe('600700800');
    expect(isPhone('600 700 800')).toBe(true);
    expect(isPhone('+48 600 700 800')).toBe(true);
    expect(isPhone('60070080')).toBe(false);
    expect(isPhone('abc')).toBe(false);
  });

  it('validates postcodes and locker codes', () => {
    expect(isPostcode('50-123')).toBe(true);
    expect(isPostcode('50123')).toBe(false);
    expect(isLockerCode('WRO12M')).toBe(true);
    expect(isLockerCode('wro123aa')).toBe(true);
    expect(isLockerCode('WRO1M')).toBe(false);
    expect(isLockerCode('12WRO')).toBe(false);
  });
});

describe('validateCheckout', () => {
  it('accepts a complete courier order', () => {
    expect(validateCheckout(filled)).toEqual({});
  });

  it('flags every empty field of an empty form', () => {
    const errors = validateCheckout(emptyCheckout);
    expect(Object.keys(errors).sort()).toEqual([
      'delivery',
      'email',
      'firstName',
      'lastName',
      'payment',
      'phone',
    ]);
  });

  it('asks for the address only when the courier is chosen', () => {
    const noAddress = { ...filled, street: '', postcode: '', city: '' };
    expect(Object.keys(validateCheckout(noAddress)).sort()).toEqual(['city', 'postcode', 'street']);
    expect(validateCheckout({ ...noAddress, delivery: 'odbior' })).toEqual({});
  });

  it('asks for the locker code when a parcel locker is chosen', () => {
    const locker = {
      ...filled,
      delivery: 'paczkomat' as const,
      street: '',
      postcode: '',
      city: '',
    };
    expect(Object.keys(validateCheckout(locker))).toEqual(['locker']);
    expect(validateCheckout({ ...locker, locker: 'WRO12M' })).toEqual({});
    expect(validateCheckout({ ...locker, locker: 'WRO1' }).locker).toContain('WRO12M');
  });

  it('allows payment in the roastery only with pickup', () => {
    expect(validateCheckout({ ...filled, payment: 'gotowka' }).payment).toBeDefined();
    expect(validateCheckout({ ...filled, delivery: 'odbior', payment: 'gotowka' })).toEqual({});
  });

  it('finds the first invalid field in form order', () => {
    const errors = validateCheckout({ ...filled, email: 'x', city: '' });
    expect(firstErrorField(errors, checkoutFieldOrder)).toBe('email');
    expect(firstErrorField({}, checkoutFieldOrder)).toBeNull();
  });
});

describe('validateContact', () => {
  it('requires a name, an email and a message of at least ten characters', () => {
    expect(
      validateContact({ name: '', email: '', topic: 'zamowienie', message: 'krótka' }),
    ).toEqual({
      name: 'Podaj imię.',
      email: 'Podaj adres e-mail, na który odpiszemy.',
      message: 'Napisz kilka słów więcej, co najmniej 10 znaków.',
    });
    expect(
      validateContact({
        name: 'Anna',
        email: 'anna@poczta.example',
        topic: 'zamowienie',
        message: 'Czy kawa przyjedzie w piątek?',
      }),
    ).toEqual({});
  });
});

describe('validateSubscriptionContact', () => {
  it('requires a name and an email', () => {
    expect(Object.keys(validateSubscriptionContact({ name: '', email: 'x' })).sort()).toEqual([
      'email',
      'name',
    ]);
    expect(validateSubscriptionContact({ name: 'Anna', email: 'anna@poczta.example' })).toEqual({});
  });
});
