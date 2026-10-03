import { describe, expect, it } from 'vitest';
import { commissionFor } from './commission';

describe('commissionFor', () => {
  it('takes two percent plus VAT', () => {
    expect(commissionFor(600000)).toEqual({ net: 12000, vat: 2760, gross: 14760 });
  });

  it('applies the minimum for low prices', () => {
    expect(commissionFor(200000)).toEqual({ net: 6000, vat: 1380, gross: 7380 });
  });

  it('is zero for no price', () => {
    expect(commissionFor(0)).toEqual({ net: 0, vat: 0, gross: 0 });
  });

  it('keeps gross as net plus VAT', () => {
    const value = commissionFor(1234567);
    expect(value.gross).toBe(value.net + value.vat);
  });
});
