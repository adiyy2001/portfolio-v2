import { describe, expect, it } from 'vitest';
import { dayFromParts, partsFromDay } from './dates';
import {
  emptyVoucher,
  generateVoucherCode,
  isValidVoucherAmount,
  validateVoucher,
  voucherAmounts,
  voucherExpiry,
  voucherValue,
  weekendVoucherPrice,
} from './voucher';
import type { VoucherDraft } from './voucher';

const draft: VoucherDraft = {
  kind: 'amount',
  amount: 600,
  recipient: 'Marta i Paweł',
  sender: 'Ola',
  message: 'Na rocznicę.',
};

describe('voucher amounts', () => {
  it('accepts whole multiples of fifty between 100 and 3000', () => {
    for (const amount of [100, 150, 400, 2950, 3000]) {
      expect(isValidVoucherAmount(amount)).toBe(true);
    }
    for (const amount of [0, 50, 99, 125, 3050, 3001, 400.5, Number.NaN]) {
      expect(isValidVoucherAmount(amount)).toBe(false);
    }
  });

  it('offers only valid preset amounts', () => {
    for (const amount of voucherAmounts) expect(isValidVoucherAmount(amount)).toBe(true);
  });
});

describe('weekend package voucher', () => {
  it('costs a low season Friday and Saturday in a classic room with the package, rounded to ten', () => {
    expect(weekendVoucherPrice).toBe(1390);
  });

  it('uses that price instead of the amount', () => {
    expect(voucherValue({ ...draft, kind: 'package' })).toBe(1390);
    expect(voucherValue(draft)).toBe(600);
  });
});

describe('voucher validation', () => {
  it('accepts a complete voucher', () => {
    expect(validateVoucher(draft)).toEqual({});
  });

  it('asks for both names and keeps the message optional', () => {
    expect(validateVoucher({ ...emptyVoucher })).toEqual({
      recipient: 'required',
      sender: 'required',
    });
  });

  it('checks the amount only for amount vouchers', () => {
    expect(validateVoucher({ ...draft, amount: 125 }).amount).toBe('invalidAmount');
    expect(validateVoucher({ ...draft, kind: 'package', amount: 125 }).amount).toBeUndefined();
  });

  it('limits names and the message', () => {
    expect(validateVoucher({ ...draft, recipient: 'x'.repeat(61) }).recipient).toBe('tooLong');
    expect(validateVoucher({ ...draft, sender: 'x'.repeat(61) }).sender).toBe('tooLong');
    expect(validateVoucher({ ...draft, message: 'x'.repeat(240) }).message).toBeUndefined();
    expect(validateVoucher({ ...draft, message: 'x'.repeat(241) }).message).toBe('tooLong');
  });

  it('treats blank names as missing', () => {
    expect(validateVoucher({ ...draft, recipient: '   ' }).recipient).toBe('required');
  });
});

describe('voucher expiry and code', () => {
  it('is valid for twelve months', () => {
    expect(voucherExpiry(dayFromParts(2026, 10, 3))).toBe(dayFromParts(2027, 10, 3));
    const leap = partsFromDay(voucherExpiry(dayFromParts(2027, 2, 28)));
    expect(leap).toEqual({ year: 2028, month: 2, date: 28 });
  });

  it('clamps to the end of a shorter month', () => {
    expect(voucherExpiry(dayFromParts(2027, 2, 28))).toBe(dayFromParts(2028, 2, 28));
    expect(voucherExpiry(dayFromParts(2023, 2, 28))).toBe(dayFromParts(2024, 2, 28));
  });

  it('builds a code from the random source', () => {
    expect(generateVoucherCode(() => 0)).toBe('PRZ-BON-AAAA-AAAA');
    expect(generateVoucherCode(() => 0.999)).toMatch(
      /^PRZ-BON-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/,
    );
  });
});
