import { describe, expect, it } from 'vitest';
import {
  emptyGuest,
  emptyInvoice,
  hasErrors,
  isArrivalWindow,
  isValidEmail,
  isValidPhone,
  validateGuest,
  validateInvoice,
} from './guest';
import type { GuestDetails, InvoiceDetails } from './guest';

const guest: GuestDetails = {
  name: 'Anna Wiśniewska',
  email: 'anna@example.com',
  phone: '+48 600 100 200',
  arrivalWindow: 'evening',
  notes: '',
};

const invoice: InvoiceDetails = {
  company: 'Studio Wzór sp. z o.o.',
  nip: '123-456-32-18',
  street: 'ul. Kuźnicza 10/2',
  postalCode: '50-138',
  city: 'Wrocław',
};

describe('guest details', () => {
  it('accepts a complete guest', () => {
    expect(validateGuest(guest)).toEqual({});
  });

  it('asks for every required field', () => {
    expect(validateGuest(emptyGuest)).toEqual({
      name: 'required',
      email: 'required',
      phone: 'required',
    });
  });

  it('rejects names without letters and names that are too long', () => {
    expect(validateGuest({ ...guest, name: '12' }).name).toBe('invalidName');
    expect(validateGuest({ ...guest, name: 'A' }).name).toBe('invalidName');
    expect(validateGuest({ ...guest, name: 'Zoe Ng' }).name).toBeUndefined();
    expect(validateGuest({ ...guest, name: 'x'.repeat(81) }).name).toBe('tooLong');
  });

  it('checks the e-mail shape', () => {
    expect(isValidEmail('a@b.pl')).toBe(true);
    expect(isValidEmail(' a.b+c@sub.example.com ')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a b@c.pl')).toBe(false);
    expect(isValidEmail('@c.pl')).toBe(false);
    expect(validateGuest({ ...guest, email: 'anna@' }).email).toBe('invalidEmail');
  });

  it('checks phone numbers with and without the country code', () => {
    expect(isValidPhone('600100200')).toBe(true);
    expect(isValidPhone('600 100 200')).toBe(true);
    expect(isValidPhone('+48 71 000 00 09')).toBe(true);
    expect(isValidPhone('(71) 000-00-09')).toBe(true);
    expect(isValidPhone('71 000')).toBe(false);
    expect(isValidPhone('+44 20 7946 0958')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
    expect(validateGuest({ ...guest, phone: '123' }).phone).toBe('invalidPhone');
  });

  it('limits the notes', () => {
    expect(validateGuest({ ...guest, notes: 'x'.repeat(300) }).notes).toBeUndefined();
    expect(validateGuest({ ...guest, notes: 'x'.repeat(301) }).notes).toBe('tooLong');
  });

  it('knows the arrival windows', () => {
    expect(isArrivalWindow('')).toBe(true);
    expect(isArrivalWindow('late')).toBe(true);
    expect(isArrivalWindow('noon')).toBe(false);
    expect(isArrivalWindow(3)).toBe(false);
  });
});

describe('invoice details', () => {
  it('accepts a complete invoice', () => {
    expect(validateInvoice(invoice)).toEqual({});
  });

  it('asks for every field', () => {
    expect(validateInvoice(emptyInvoice)).toEqual({
      company: 'required',
      nip: 'required',
      street: 'required',
      postalCode: 'required',
      city: 'required',
    });
  });

  it('validates the NIP checksum', () => {
    expect(validateInvoice({ ...invoice, nip: '123-456-32-19' }).nip).toBe('invalidNip');
    expect(validateInvoice({ ...invoice, nip: '1234567890' }).nip).toBe('invalidNip');
    expect(validateInvoice({ ...invoice, nip: '1234563218' }).nip).toBeUndefined();
  });

  it('validates the postal code shape', () => {
    expect(validateInvoice({ ...invoice, postalCode: '50138' }).postalCode).toBe(
      'invalidPostalCode',
    );
    expect(validateInvoice({ ...invoice, postalCode: '5-0138' }).postalCode).toBe(
      'invalidPostalCode',
    );
    expect(validateInvoice({ ...invoice, postalCode: '50-138' }).postalCode).toBeUndefined();
  });

  it('reports whether there are errors', () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ nip: 'invalidNip' })).toBe(true);
  });
});
