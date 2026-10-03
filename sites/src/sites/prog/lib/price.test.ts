import { describe, expect, it } from 'vitest';
import { depositFor, maxDeposit, monthlyTotal, pccTax, pricePerSquareMeter } from './price';

describe('price per square meter', () => {
  it('divides the price by the area and rounds to whole zloty', () => {
    expect(pricePerSquareMeter(689000, 62.4)).toBe(11042);
    expect(pricePerSquareMeter(799000, 44.8)).toBe(17835);
  });

  it('returns zero for a missing area', () => {
    expect(pricePerSquareMeter(500000, 0)).toBe(0);
  });
});

describe('costs', () => {
  it('takes two percent civil law transactions tax', () => {
    expect(pccTax(689000)).toBe(13780);
  });

  it('adds admin fee and utilities to the monthly total', () => {
    expect(monthlyTotal({ price: 3200, adminFee: 450, utilities: 300 })).toBe(3950);
    expect(monthlyTotal({ price: 3200, adminFee: 450 })).toBe(3650);
  });

  it('multiplies rent by deposit months and caps the deposit at twelve rents', () => {
    expect(depositFor({ price: 3200, depositMonths: 2 })).toBe(6400);
    expect(depositFor({ price: 3200 })).toBe(3200);
    expect(maxDeposit(3200)).toBe(38400);
  });
});
