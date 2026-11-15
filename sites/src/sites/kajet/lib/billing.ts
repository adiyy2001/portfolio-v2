import { buyers, type Client } from '../data/clients';
import { deadlineDate, type MonthRef } from './dates';
import { pad } from './format';
import { createRng } from './rng';

export interface MonthResult {
  sales: number;
  costs: number;
  out: number;
  vatBase: number;
  inn: number;
  vat: number;
  base: number;
  tax: number;
  zus: number;
  total: number;
}

export type DeadlineKey = 'zus' | 'tax' | 'vat';

export interface ClientDeadline {
  key: DeadlineKey;
  name: string;
  amount: number;
  date: Date;
}

export type InvoiceStatus = 'paid' | 'pending' | 'late';

export interface Invoice {
  no: string;
  who: string;
  net: number;
  gross: number;
  due: Date;
  status: InvoiceStatus;
}

export const calcMonth = (client: Client, month: MonthRef): MonthResult => {
  const rng = createRng(client.seed * 7919 + month.id);
  const sales = Math.round(client.sales * (0.88 + 0.24 * rng()));
  const costs = Math.round(sales * client.cost * (0.92 + 0.16 * rng()));
  const out = Math.round(sales * client.vatOut);
  const vatBase = Math.round(costs * client.vatShare);
  const inn = Math.round(vatBase * 0.23);
  const vat = Math.max(0, out - inn);
  const base = Math.max(0, sales - costs - (client.form === 'jdg' ? client.zusDed : 0));
  const tax = Math.round(base * client.taxRate);
  const zus = client.zus + Math.round((rng() - 0.5) * client.zusVar);
  return { sales, costs, out, vatBase, inn, vat, base, tax, zus, total: vat + tax + zus };
};

export const zusDayFor = (client: Client): number => (client.form === 'spolka' ? 15 : 20);

export const clientDeadlines = (
  client: Client,
  month: MonthRef,
  result: MonthResult,
): ClientDeadline[] => {
  const nextMonth = month.m + 1;
  return [
    { key: 'zus', name: 'ZUS', amount: result.zus, date: deadlineDate(month.y, nextMonth, zusDayFor(client)) },
    { key: 'tax', name: client.taxName, amount: result.tax, date: deadlineDate(month.y, nextMonth, 20) },
    { key: 'vat', name: 'VAT i JPK_V7', amount: result.vat, date: deadlineDate(month.y, nextMonth, 25) },
  ];
};

export const generateInvoices = (
  client: Client,
  month: MonthRef,
  result: MonthResult,
  now: Date,
): Invoice[] => {
  const rng = createRng(client.seed * 104729 + month.id * 13);
  const count = client.invoices;
  const weights: number[] = [];
  let weightSum = 0;
  for (let i = 0; i < count; i++) {
    const weight = 0.25 + rng() * rng() * 3.5;
    weights.push(weight);
    weightSum += weight;
  }
  let left = result.sales;
  const days: number[] = [];
  for (let i = 0; i < count; i++) days.push(1 + Math.floor(rng() * month.days));
  days.sort((a, b) => a - b);
  const unpaidChance = month.age === 0 ? 0.38 : month.age === 1 ? 0.07 : 0.015;
  const list: Invoice[] = [];
  for (let i = 0; i < count; i++) {
    const net = i === count - 1 ? left : Math.round((result.sales * weights[i]!) / weightSum);
    left -= net;
    const term = rng() < 0.55 ? 14 : 30;
    const due = new Date(month.y, month.m, days[i]! + term, 23, 59, 59);
    const unpaid = rng() < unpaidChance;
    let status: InvoiceStatus = 'paid';
    if (unpaid) status = due < now ? 'late' : 'pending';
    list.push({
      no: `FV/${pad(month.m + 1)}/${month.y}/${String(i + 1).padStart(4, '0')}`,
      who: buyers[Math.floor(rng() * buyers.length)]!,
      net,
      gross: Math.round(net * 1.23),
      due,
      status,
    });
  }
  return list.reverse();
};
