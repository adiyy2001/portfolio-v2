import { describe, expect, it } from 'vitest';
import { buildVoucher, isAllowedAmount, makeVoucherCode, validUntil } from './voucher';

describe('voucher', () => {
  it('makes codes', () => {
    expect(makeVoucherCode(() => 0)).toBe('BON-10000');
  });

  it('is valid for twelve months', () => {
    expect(validUntil('2026-11-15')).toBe('2027-11-15');
  });

  it('builds a trimmed voucher', () => {
    const voucher = buildVoucher(
      { amount: 500, recipient: ' Ewa ', sender: ' Jan ', message: ' Dla Ciebie ' },
      '2026-11-15',
      () => 0.5,
    );
    expect(voucher).toMatchObject({
      code: 'BON-55000',
      recipient: 'Ewa',
      sender: 'Jan',
      message: 'Dla Ciebie',
      validUntil: '2027-11-15',
    });
  });

  it('allows only listed amounts', () => {
    expect(isAllowedAmount(300)).toBe(true);
    expect(isAllowedAmount(301)).toBe(false);
  });
});
