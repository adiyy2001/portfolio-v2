import { describe, expect, it } from 'vitest';
import { phoneDigits, validateVisit } from './validation';

const valid = { name: 'Ola', phone: '600 100 200', topic: 'Przegląd' };

describe('visit request validation', () => {
  it('accepts a complete request', () => {
    expect(validateVisit(valid)).toEqual({});
  });

  it('accepts a phone number with a country code and separators', () => {
    expect(validateVisit({ ...valid, phone: '+48 (71) 555-01-19' })).toEqual({});
  });

  it('rejects a short name', () => {
    expect(validateVisit({ ...valid, name: ' a ' }).name).toBeDefined();
  });

  it('rejects a phone number with too few digits', () => {
    expect(validateVisit({ ...valid, phone: '12345' }).phone).toBeDefined();
  });

  it('rejects letters in a phone number', () => {
    expect(validateVisit({ ...valid, phone: '600 abc 200 100' }).phone).toBeDefined();
  });

  it('rejects an unknown topic', () => {
    expect(validateVisit({ ...valid, topic: 'Coś innego' }).topic).toBeDefined();
  });

  it('strips everything but digits', () => {
    expect(phoneDigits('+48 71 555 01 19')).toBe('48715550119');
  });
});
