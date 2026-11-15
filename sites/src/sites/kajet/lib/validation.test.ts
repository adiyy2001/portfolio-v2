import { describe, expect, it } from 'vitest';
import {
  firstInvalidField,
  isValidEmail,
  normalizePhone,
  parseInvoiceCount,
  parseQuoteParams,
  validateQuote,
  type QuoteValues,
} from './validation';

const valid: QuoteValues = {
  email: 'ewa@firma.example',
  forma: 'osoba fizyczna',
  faktur: '24',
  name: 'Ewa Rutkowska',
  phone: '600 100 200',
  consent: true,
};

describe('validateQuote', () => {
  it('accepts a complete form', () => {
    expect(validateQuote(valid, true)).toEqual({});
  });

  it('needs only an e-mail in the short form', () => {
    const short: QuoteValues = { ...valid, forma: '', faktur: '', name: '', phone: '', consent: false };
    expect(validateQuote(short, false)).toEqual({});
  });

  it('rejects a missing and a wrong e-mail', () => {
    expect(validateQuote({ ...valid, email: '' }, false).email).toBe('Wpisz adres e-mail.');
    expect(validateQuote({ ...valid, email: 'ewa@firma' }, false).email).toBe(
      'To nie wygląda na adres e-mail.',
    );
  });

  it('rejects an invoice count out of range', () => {
    expect(validateQuote({ ...valid, faktur: '-3' }, false).faktur).toBeDefined();
    expect(validateQuote({ ...valid, faktur: '1000' }, false).faktur).toBeDefined();
    expect(validateQuote({ ...valid, faktur: '12,5' }, false).faktur).toBeDefined();
    expect(validateQuote({ ...valid, faktur: '999' }, false).faktur).toBeUndefined();
  });

  it('checks name, phone and consent only in the full form', () => {
    const errors = validateQuote({ ...valid, name: ' ', phone: '12', consent: false }, true);
    expect(Object.keys(errors).sort()).toEqual(['consent', 'name', 'phone']);
  });

  it('points to the first invalid field in form order', () => {
    const errors = validateQuote({ ...valid, email: '', consent: false }, true);
    expect(firstInvalidField(errors)).toBe('email');
    expect(firstInvalidField({})).toBeNull();
  });
});

describe('helpers', () => {
  it('validates e-mail addresses', () => {
    expect(isValidEmail('a@b.pl')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a b@c.pl')).toBe(false);
  });

  it('normalizes Polish phone numbers', () => {
    expect(normalizePhone('+48 600 100 200')).toBe('600100200');
    expect(normalizePhone('071 555 01 65')).toBeNull();
    expect(normalizePhone('600-100-200')).toBe('600100200');
  });

  it('parses invoice counts', () => {
    expect(parseInvoiceCount(' 85 ')).toBe(85);
    expect(parseInvoiceCount('abc')).toBeNull();
  });
});

describe('parseQuoteParams', () => {
  it('reads valid params and drops the rest', () => {
    expect(parseQuoteParams('?forma=spolka&faktur=85&plan=sredni')).toEqual({
      forma: 'spolka',
      faktur: 85,
      plan: 'sredni',
    });
    expect(parseQuoteParams('?forma=x&faktur=-1&plan=huge')).toEqual({
      forma: null,
      faktur: null,
      plan: null,
    });
    expect(parseQuoteParams('')).toEqual({ forma: null, faktur: null, plan: null });
  });
});
