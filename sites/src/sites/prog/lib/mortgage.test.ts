import { describe, expect, it } from 'vitest';
import { annuityInstalment, clamp, decreasingInstalment, summarizeLoan } from './mortgage';

describe('annuity instalment', () => {
  it('matches the standard formula for a 500 000 loan at 7 percent over 25 years', () => {
    expect(annuityInstalment(500000, 7, 25)).toBeCloseTo(3533.9, 1);
  });

  it('divides evenly at zero interest', () => {
    expect(annuityInstalment(120000, 0, 10)).toBe(1000);
  });

  it('returns zero for an empty loan', () => {
    expect(annuityInstalment(0, 7, 25)).toBe(0);
  });
});

describe('decreasing instalment', () => {
  it('starts with capital plus interest on the whole loan', () => {
    expect(decreasingInstalment(120000, 6, 10, 0)).toBeCloseTo(1000 + 120000 * 0.005, 6);
  });

  it('ends with capital plus interest on the last capital part', () => {
    expect(decreasingInstalment(120000, 6, 10, 119)).toBeCloseTo(1000 + 1000 * 0.005, 6);
  });

  it('returns zero outside the schedule', () => {
    expect(decreasingInstalment(120000, 6, 10, 120)).toBe(0);
  });
});

describe('loan summary', () => {
  const base = { price: 700000, downPaymentPercent: 20, years: 25, annualRatePercent: 7 };

  it('splits the price into down payment and loan', () => {
    const summary = summarizeLoan({ ...base, kind: 'rowne' });
    expect(summary.downPayment).toBe(140000);
    expect(summary.loan).toBe(560000);
    expect(summary.months).toBe(300);
  });

  it('keeps equal instalments and adds up to the total paid', () => {
    const summary = summarizeLoan({ ...base, kind: 'rowne' });
    expect(summary.firstInstalment).toBe(summary.lastInstalment);
    expect(summary.totalPaid).toBeCloseTo(
      summary.downPayment + summary.loan + summary.totalInterest,
      4,
    );
  });

  it('pays less interest with decreasing instalments', () => {
    const equal = summarizeLoan({ ...base, kind: 'rowne' });
    const decreasing = summarizeLoan({ ...base, kind: 'malejace' });
    expect(decreasing.totalInterest).toBeLessThan(equal.totalInterest);
    expect(decreasing.firstInstalment).toBeGreaterThan(equal.firstInstalment);
    expect(decreasing.lastInstalment).toBeLessThan(equal.firstInstalment);
  });

  it('handles a full cash payment', () => {
    const summary = summarizeLoan({ ...base, downPaymentPercent: 100, kind: 'rowne' });
    expect(summary.loan).toBe(0);
    expect(summary.firstInstalment).toBe(0);
    expect(summary.totalPaid).toBe(700000);
  });

  it('clamps values to a range', () => {
    expect(clamp(50, 0, 40)).toBe(40);
    expect(clamp(-5, 0, 40)).toBe(0);
  });
});
