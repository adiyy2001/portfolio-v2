import { describe, expect, it } from 'vitest';
import { firstErrorField, validateBooking } from './booking';

const valid = { name: 'Anna Kowal', phone: '600 100 200', email: '', consent: true };

describe('validateBooking', () => {
  it('accepts a complete form without e-mail', () => {
    expect(validateBooking(valid)).toEqual({});
  });

  it('flags every missing required field', () => {
    const errors = validateBooking({ name: '', phone: '', email: '', consent: false });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'name', 'phone']);
  });

  it('flags a malformed e-mail but not an empty one', () => {
    expect(validateBooking({ ...valid, email: 'anna@' }).email).toBeDefined();
    expect(validateBooking({ ...valid, email: 'anna@poczta.pl' }).email).toBeUndefined();
  });

  it('flags a phone number with the wrong length', () => {
    expect(validateBooking({ ...valid, phone: '60010020' }).phone).toBeDefined();
    expect(validateBooking({ ...valid, phone: '+48 600 100 200' }).phone).toBeUndefined();
  });
});

describe('firstErrorField', () => {
  it('returns the first failing field in form order', () => {
    expect(firstErrorField({ phone: 'x', consent: 'y' })).toBe('phone');
  });

  it('returns null without errors', () => {
    expect(firstErrorField({})).toBeNull();
  });
});
