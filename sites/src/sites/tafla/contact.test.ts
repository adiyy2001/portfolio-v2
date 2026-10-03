import { describe, expect, it } from 'vitest';
import {
  errorMessages,
  errorSummary,
  pluralize,
  validateContact,
  type ContactValues,
} from './contact';

const valid: ContactValues = {
  name: 'Ola',
  email: 'ola@poczta.pl',
  message: 'Od kilku miesięcy trudno mi zasnąć.',
  consent: true,
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('asks for every field when the form is empty', () => {
    expect(
      Object.keys(validateContact({ name: '', email: '', message: '', consent: false })),
    ).toEqual(['name', 'email', 'message', 'consent']);
  });

  it('treats a name made of spaces as empty', () => {
    expect(validateContact({ ...valid, name: '   ' }).name).toBe(errorMessages.name.empty);
  });

  it('accepts a one letter nickname', () => {
    expect(validateContact({ ...valid, name: 'J' }).name).toBeUndefined();
  });

  it.each(['ola', 'ola@poczta', 'ola@poczta.p', 'o la@poczta.pl', '@poczta.pl', 'ola@@poczta.pl'])(
    'rejects the e-mail address %s',
    email => {
      expect(validateContact({ ...valid, email }).email).toBe(errorMessages.email.invalid);
    },
  );

  it.each(['ola@poczta.pl', ' ola@poczta.pl ', 'ola.kowalska+gabinet@mail.example.com'])(
    'accepts the e-mail address %s',
    email => {
      expect(validateContact({ ...valid, email }).email).toBeUndefined();
    },
  );

  it('uses the empty message for a missing e-mail address', () => {
    expect(validateContact({ ...valid, email: '  ' }).email).toBe(errorMessages.email.empty);
  });

  it('requires at least ten characters in the message', () => {
    expect(validateContact({ ...valid, message: '123456789' }).message).toBe(
      errorMessages.message.empty,
    );
    expect(validateContact({ ...valid, message: '1234567890' }).message).toBeUndefined();
    expect(validateContact({ ...valid, message: '  abc       ' }).message).toBe(
      errorMessages.message.empty,
    );
  });

  it('requires consent', () => {
    expect(validateContact({ ...valid, consent: false }).consent).toBe(errorMessages.consent.empty);
  });
});

describe('pluralize', () => {
  it.each([
    [1, 'błąd'],
    [2, 'błędy'],
    [4, 'błędy'],
    [5, 'błędów'],
    [12, 'błędów'],
    [22, 'błędy'],
    [112, 'błędów'],
  ])('uses the right form for %i', (count, expected) => {
    expect(pluralize(count, 'błąd', 'błędy', 'błędów')).toBe(expected);
  });
});

describe('errorSummary', () => {
  it('counts the errors in correct Polish', () => {
    expect(errorSummary(1)).toBe('Formularz zawiera 1 błąd. Popraw zaznaczone pola.');
    expect(errorSummary(3)).toBe('Formularz zawiera 3 błędy. Popraw zaznaczone pola.');
  });
});
