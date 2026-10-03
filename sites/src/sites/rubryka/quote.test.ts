import { describe, expect, it } from 'vitest';
import {
  buildQuote,
  clampEmployees,
  describeQuote,
  packageFor,
  parseQuoteParams,
  toQuoteParams,
  type QuoteInput,
} from './quote';

const nbsp = ' ';

const input = (overrides: Partial<QuoteInput> = {}): QuoteInput => ({
  businessType: 'kpir',
  documents: 'upTo30',
  employees: 0,
  vat: 'exempt',
  ...overrides,
});

describe('packageFor', () => {
  it('maps the business type to a package', () => {
    expect(packageFor('ryczalt')).toBe('ryczalt');
    expect(packageFor('kpir')).toBe('kpir');
    expect(packageFor('spolka')).toBe('pelna');
    expect(packageFor('unknown')).toBe('kpir');
  });
});

describe('buildQuote', () => {
  it('prices the base package without VAT surcharge for an exempt business', () => {
    const quote = buildQuote(input());
    expect(quote).toMatchObject({ kind: 'priced', packageId: 'kpir', netGrosze: 37900 });
  });

  it('adds the VAT and JPK surcharge of the package', () => {
    expect(buildQuote(input({ vat: 'active' }))).toMatchObject({ netGrosze: 37900 + 8900 });
    expect(buildQuote(input({ businessType: 'ryczalt', vat: 'active' }))).toMatchObject({
      netGrosze: 29900 + 6900,
    });
    expect(buildQuote(input({ businessType: 'spolka', vat: 'active' }))).toMatchObject({
      netGrosze: 89000 + 14900,
    });
  });

  it('adds payroll per person', () => {
    const quote = buildQuote(input({ employees: 3 }));
    expect(quote).toMatchObject({ netGrosze: 37900 + 3 * 5900 });
    if (quote.kind === 'priced') {
      expect(quote.lines.map(line => line.label)).toEqual([
        'KPiR, 11 do 30 dokumentów',
        'Kadry i płace, 3 osoby',
      ]);
    }
  });

  it('computes gross as net plus 23 percent without rounding errors', () => {
    const quote = buildQuote(input({ vat: 'active', employees: 3 }));
    expect(quote).toMatchObject({
      netGrosze: 37900 + 8900 + 17700,
      vatGrosze: 64500 * 0.23,
      grossGrosze: 79335,
    });
  });

  it('notes the assumptions when the answers are unknown', () => {
    const quote = buildQuote(input({ businessType: 'unknown', vat: 'unknown' }));
    expect(quote).toMatchObject({ packageId: 'kpir', netGrosze: 37900 + 8900 });
    if (quote.kind === 'priced') expect(quote.assumptions).toHaveLength(2);
  });

  it('asks for an individual quote above 150 documents or 20 people', () => {
    expect(buildQuote(input({ documents: 'over150' })).kind).toBe('individual');
    expect(buildQuote(input({ employees: 21 })).kind).toBe('individual');
    expect(buildQuote(input({ employees: 20 })).kind).toBe('priced');
  });

  it('uses the right price for every bucket of full accounting', () => {
    const prices = (['upTo10', 'upTo30', 'upTo60', 'upTo100', 'upTo150'] as const).map(
      documents => {
        const quote = buildQuote(input({ businessType: 'spolka', documents }));
        return quote.kind === 'priced' ? quote.netGrosze / 100 : 0;
      },
    );
    expect(prices).toEqual([690, 890, 1290, 1790, 2290]);
  });
});

describe('describeQuote', () => {
  it('writes the package, net and gross price', () => {
    expect(describeQuote(buildQuote(input({ vat: 'active', employees: 3 })))).toBe(
      `Pakiet KPiR: 645${nbsp}zł netto miesięcznie, 793,35${nbsp}zł brutto.`,
    );
  });

  it('passes the reason of an individual quote', () => {
    expect(describeQuote(buildQuote(input({ documents: 'over150' })))).toContain('indywidualna');
  });
});

describe('parseQuoteParams', () => {
  it('reads every known parameter', () => {
    expect(parseQuoteParams('?typ=spolka&dokumenty=31-60&pracownicy=4&vat=tak')).toEqual({
      businessType: 'spolka',
      documents: 'upTo60',
      employees: 4,
      vat: 'active',
    });
  });

  it('ignores unknown and malformed values', () => {
    expect(parseQuoteParams('?typ=constructor&dokumenty=999&pracownicy=-2&vat=toString')).toEqual(
      {},
    );
    expect(parseQuoteParams('?pracownicy=abc')).toEqual({});
    expect(parseQuoteParams('')).toEqual({});
  });

  it('caps the number of employees', () => {
    expect(parseQuoteParams('?pracownicy=99')).toEqual({ employees: 20 });
  });

  it('accepts the do not know answers', () => {
    expect(parseQuoteParams('?typ=nie-wiem&vat=nie-wiem')).toEqual({
      businessType: 'unknown',
      vat: 'unknown',
    });
  });
});

describe('toQuoteParams', () => {
  it('writes the parameters the form reads', () => {
    const query = toQuoteParams(
      input({ businessType: 'spolka', documents: 'upTo60', employees: 4, vat: 'active' }),
    );
    expect(query).toBe('typ=spolka&dokumenty=31-60&pracownicy=4&vat=tak');
  });

  it('round trips through parseQuoteParams', () => {
    const original = input({
      businessType: 'unknown',
      documents: 'over150',
      employees: 7,
      vat: 'unknown',
    });
    expect(parseQuoteParams(toQuoteParams(original))).toEqual(original);
  });
});

describe('clampEmployees', () => {
  it('reads whole numbers', () => {
    expect(clampEmployees('3')).toBe(3);
    expect(clampEmployees(' 12 ')).toBe(12);
  });

  it('treats empty and broken input as zero', () => {
    expect(clampEmployees('')).toBe(0);
    expect(clampEmployees('abc')).toBe(0);
  });

  it('keeps the value inside the field limits', () => {
    expect(clampEmployees('-4')).toBe(0);
    expect(clampEmployees('400')).toBe(50);
  });
});
