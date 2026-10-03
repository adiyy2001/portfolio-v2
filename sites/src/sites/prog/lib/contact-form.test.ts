import { describe, expect, it } from 'vitest';
import { emptyContact, topicLabel, validateContact, type ContactValues } from './contact-form';

const valid: ContactValues = {
  topic: 'kupno',
  name: 'Anna Kowal',
  phone: '600 100 200',
  email: 'anna@poczta.pl',
  message: 'Szukam dwóch pokoi na Nadodrzu.',
  consent: true,
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('flags every required field on an empty form', () => {
    expect(Object.keys(validateContact(emptyContact)).sort()).toEqual([
      'consent',
      'message',
      'name',
      'phone',
      'topic',
    ]);
  });

  it('allows an empty e-mail but not a broken one', () => {
    expect(validateContact({ ...valid, email: '' }).email).toBeUndefined();
    expect(validateContact({ ...valid, email: 'anna' }).email).toBeDefined();
  });

  it('asks for a longer message', () => {
    expect(validateContact({ ...valid, message: 'Dzień' }).message).toBeDefined();
  });
});

describe('topicLabel', () => {
  it('returns the label of a topic and empty text for none', () => {
    expect(topicLabel('sprzedaz')).toBe('Chcę sprzedać');
    expect(topicLabel('')).toBe('');
  });
});
