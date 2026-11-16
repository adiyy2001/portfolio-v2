import { describe, expect, it } from 'vitest';
import { clampInvoices, recommendPlan, type PickerInput } from './picker';

const base: PickerInput = {
  form: 'osoba',
  invoices: 10,
  payroll: false,
  phone: false,
  office: false,
  partners: false,
};

describe('recommendPlan', () => {
  it('follows the invoice limits', () => {
    expect(recommendPlan({ ...base, invoices: 30 }).plan.name).toBe('Mały');
    expect(recommendPlan({ ...base, invoices: 31 }).plan.name).toBe('Średni');
    expect(recommendPlan({ ...base, invoices: 100 }).plan.name).toBe('Średni');
    expect(recommendPlan({ ...base, invoices: 101 }).plan.name).toBe('Duży');
  });

  it('raises the plan for payroll, phone, office and partners', () => {
    expect(recommendPlan({ ...base, payroll: true }).plan.name).toBe('Średni');
    expect(recommendPlan({ ...base, phone: true }).plan.name).toBe('Średni');
    expect(recommendPlan({ ...base, office: true }).plan.name).toBe('Duży');
    expect(recommendPlan({ ...base, partners: true }).plan.name).toBe('Duży');
  });

  it('prices by company form', () => {
    expect(recommendPlan({ ...base, form: 'osoba', invoices: 85 }).price).toBe(390);
    expect(recommendPlan({ ...base, form: 'spolka', invoices: 85 }).price).toBe(690);
    expect(recommendPlan({ ...base, form: 'spolka', invoices: 150 }).price).toBe(1090);
  });

  it('flags more than the largest limit', () => {
    const result = recommendPlan({ ...base, invoices: 240 });
    expect(result.plan.name).toBe('Duży');
    expect(result.overLimit).toBe(true);
    expect(result.reasons[0]).toContain('indywidualnie');
  });

  it('does not flag the limit itself', () => {
    expect(recommendPlan({ ...base, invoices: 200 }).overLimit).toBe(false);
  });

  it('computes the price per invoice', () => {
    expect(recommendPlan({ ...base, invoices: 20 }).perInvoice).toBeCloseTo(9.5);
    expect(recommendPlan({ ...base, invoices: 0 }).perInvoice).toBe(0);
  });
});

describe('clampInvoices', () => {
  it('keeps the value in range', () => {
    expect(clampInvoices(-4)).toBe(0);
    expect(clampInvoices(85.4)).toBe(85);
    expect(clampInvoices(900)).toBe(900);
    expect(clampInvoices(20000)).toBe(999);
    expect(clampInvoices(Number.NaN)).toBe(0);
  });
});
