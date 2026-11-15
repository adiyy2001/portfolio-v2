import { describe, expect, it } from 'vitest';
import {
  emptyCheckout,
  firstErrorField,
  isEmail,
  isPhone,
  normalizePhone,
  validateCheckout,
  validateContact,
  validateSubscription,
} from './validation';
import type { CheckoutValues, SubscriptionValues } from './validation';

const days = ['2026-11-16', '2026-11-21'];
const windowsFor = (iso: string) => (iso === '2026-11-21' ? ['9:00 do 12:00'] : ['8:00 do 11:00']);

const valid: CheckoutValues = {
  name: 'Anna Nowak',
  phone: '600 700 800',
  email: 'anna@poczta.example',
  pickupDay: '2026-11-16',
  pickupWindow: '8:00 do 11:00',
  note: '',
};

describe('field helpers', () => {
  it('validates e-mail and phone formats', () => {
    expect(isEmail('anna@poczta.example')).toBe(true);
    expect(isEmail('anna@poczta')).toBe(false);
    expect(normalizePhone('+48 600-700-800')).toBe('600700800');
    expect(isPhone('0048 600 700 800')).toBe(true);
    expect(isPhone('12345')).toBe(false);
  });
});

describe('validateCheckout', () => {
  it('accepts a complete order', () => {
    expect(validateCheckout(valid, days, windowsFor)).toEqual({});
  });

  it('reports every missing field', () => {
    const errors = validateCheckout(emptyCheckout, days, windowsFor);
    expect(Object.keys(errors).sort()).toEqual([
      'email',
      'name',
      'phone',
      'pickupDay',
      'pickupWindow',
    ]);
  });

  it('rejects an outdated day and a window from another day', () => {
    expect(
      validateCheckout({ ...valid, pickupDay: '2026-11-10' }, days, windowsFor).pickupDay,
    ).toBeTruthy();
    expect(
      validateCheckout({ ...valid, pickupDay: '2026-11-21' }, days, windowsFor).pickupWindow,
    ).toBeTruthy();
  });

  it('limits the note length', () => {
    expect(
      validateCheckout({ ...valid, note: 'a'.repeat(241) }, days, windowsFor).note,
    ).toBeTruthy();
  });

  it('finds the first error in form order', () => {
    const errors = validateCheckout({ ...valid, email: 'x', name: '' }, days, windowsFor);
    expect(firstErrorField(errors, ['name', 'phone', 'email'])).toBe('name');
    expect(firstErrorField({}, ['name'])).toBeNull();
  });
});

describe('validateContact', () => {
  it('needs a name, an address and a real message', () => {
    expect(
      Object.keys(validateContact({ name: '', email: '', topic: '', message: 'krótko' })).sort(),
    ).toEqual(['email', 'message', 'name']);
    expect(
      validateContact({
        name: 'Anna',
        email: 'anna@poczta.example',
        topic: 'zamowienie',
        message: 'Czy macie Kenię na espresso?',
      }),
    ).toEqual({});
  });
});

describe('validateSubscription', () => {
  const subscription: SubscriptionValues = {
    coffee: 'dobor',
    grind: 'przelew',
    bags: 2,
    pickupDay: '4',
    name: 'Anna Nowak',
    phone: '600700800',
    email: 'anna@poczta.example',
  };

  it('accepts a complete subscription', () => {
    expect(validateSubscription(subscription, ['1', '2', '3', '4', '5', '6'], 3)).toEqual({});
  });

  it('rejects a bad bag count and a closed day', () => {
    const errors = validateSubscription(
      { ...subscription, bags: 4, pickupDay: '0' },
      ['1', '2'],
      3,
    );
    expect(errors.bags).toBeTruthy();
    expect(errors.pickupDay).toBeTruthy();
  });
});
