import { describe, expect, it } from 'vitest';
import { parseLoanForm, type LoanFormValues } from './loan-form';

const valid: LoanFormValues = {
  price: '689000',
  downPayment: '20',
  years: '25',
  rate: '6,2',
  kind: 'rowne',
};

describe('parseLoanForm', () => {
  it('turns valid text into a loan input', () => {
    const { errors, input } = parseLoanForm(valid);
    expect(errors).toEqual({});
    expect(input).toEqual({
      price: 689000,
      downPaymentPercent: 20,
      years: 25,
      annualRatePercent: 6.2,
      kind: 'rowne',
    });
  });

  it('accepts grouped thousands and a decimal comma', () => {
    const { input } = parseLoanForm({ ...valid, price: '689 000', rate: '5,75' });
    expect(input?.price).toBe(689000);
    expect(input?.annualRatePercent).toBe(5.75);
  });

  it('reports an empty field', () => {
    const { errors, input } = parseLoanForm({ ...valid, years: '' });
    expect(errors.years).toBe('Podaj okres kredytu.');
    expect(input).toBeNull();
  });

  it('reports text that is not a number', () => {
    const { errors } = parseLoanForm({ ...valid, rate: 'abc' });
    expect(errors.rate).toBe('Wpisz oprocentowanie jako liczbę.');
  });

  it('reports values outside the range', () => {
    const { errors } = parseLoanForm({ ...valid, years: '50', downPayment: '95' });
    expect(errors.years).toContain('od 1 do 35 lat');
    expect(errors.downPayment).toContain('od 0 do 90 %');
  });

  it('allows a zero rate and no down payment', () => {
    const { errors, input } = parseLoanForm({ ...valid, rate: '0', downPayment: '0' });
    expect(errors).toEqual({});
    expect(input?.downPaymentPercent).toBe(0);
  });
});
