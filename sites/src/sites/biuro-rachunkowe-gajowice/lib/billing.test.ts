import { describe, expect, it } from 'vitest';
import { clients } from '../data/clients';
import { calcMonth, clientDeadlines, generateInvoices, zusDayFor } from './billing';
import { monthRefs } from './dates';

const now = new Date(2026, 10, 15, 12, 0, 0);
const months = monthRefs(now, 6);

describe('calcMonth', () => {
  it('is deterministic and adds up', () => {
    const client = clients[1]!;
    const a = calcMonth(client, months[0]!);
    const b = calcMonth(client, months[0]!);
    expect(a).toEqual(b);
    expect(a.total).toBe(a.vat + a.tax + a.zus);
    expect(a.vat).toBe(Math.max(0, a.out - a.inn));
  });

  it('never gives negative payments', () => {
    for (const client of clients) {
      for (const month of months) {
        const result = calcMonth(client, month);
        expect(result.vat).toBeGreaterThanOrEqual(0);
        expect(result.tax).toBeGreaterThanOrEqual(0);
        expect(result.zus).toBeGreaterThan(0);
      }
    }
  });
});

describe('ZUS day', () => {
  it('pays limited companies by the 15th and sole traders by the 20th', () => {
    expect(zusDayFor(clients.find(client => client.form === 'spolka')!)).toBe(15);
    expect(zusDayFor(clients.find(client => client.form === 'jdg')!)).toBe(20);
  });

  it('moves the October deadlines of a company to the next working day', () => {
    const company = clients.find(client => client.id === 'K-0131')!;
    const month = months[0]!;
    const deadlines = clientDeadlines(company, month, calcMonth(company, month));
    const zus = deadlines.find(item => item.key === 'zus')!;
    expect(zus.date.getMonth()).toBe(10);
    expect(zus.date.getDate()).toBe(16);
    expect(deadlines.find(item => item.key === 'tax')!.date.getDate()).toBe(20);
    expect(deadlines.find(item => item.key === 'vat')!.date.getDate()).toBe(25);
  });
});

describe('generateInvoices', () => {
  it('matches the invoice count and the monthly sales', () => {
    for (const client of clients) {
      const month = months[0]!;
      const result = calcMonth(client, month);
      const invoices = generateInvoices(client, month, result, now);
      expect(invoices).toHaveLength(client.invoices);
      expect(invoices.reduce((sum, invoice) => sum + invoice.net, 0)).toBe(result.sales);
    }
  });

  it('numbers invoices from the newest', () => {
    const client = clients[0]!;
    const month = months[1]!;
    const invoices = generateInvoices(client, month, calcMonth(client, month), now);
    expect(invoices[0]!.no).toBe('FV/09/2026/0014');
    expect(invoices[invoices.length - 1]!.no).toBe('FV/09/2026/0001');
  });
});
