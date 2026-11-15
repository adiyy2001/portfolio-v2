import { describe, expect, it } from 'vitest';
import { dayMonthYear } from '../lib/dates';
import { annualDate, annualDeadlines, monthlyRows, statutoryRules } from './calendar';
import { startFor, startOptions } from './ksef';

describe('annual deadlines', () => {
  const byId = (id: string): string => {
    const item = annualDeadlines.find(entry => entry.id === id);
    if (!item) throw new Error(id);
    return dayMonthYear(annualDate(item));
  };

  it('moves weekend dates to the next workday', () => {
    expect(byId('pit-11-urzad')).toBe('pn 01.02.2027');
    expect(byId('forma-opodatkowania')).toBe('pn 22.02.2027');
    expect(byId('pit-11-podatnik')).toBe('pn 01.03.2027');
  });

  it('keeps weekday dates', () => {
    expect(byId('cit-8')).toBe('śr 31.03.2027');
    expect(byId('pit-roczny')).toBe('pt 30.04.2027');
    expect(byId('skladka-zdrowotna')).toBe('cz 20.05.2027');
  });
});

describe('monthly rows', () => {
  it('marks exactly the statutory days as legal', () => {
    const legal = monthlyRows.filter(row => row.legal).map(row => row.day);
    expect(legal).toEqual([15, 20, 25]);
  });

  it('agrees with the statutory rules', () => {
    const days = new Set(statutoryRules.map(rule => rule.day));
    for (const row of monthlyRows.filter(entry => entry.legal)) expect(days.has(row.day)).toBe(true);
  });
});

describe('ksef start', () => {
  it('finds each option', () => {
    for (const option of startOptions) expect(startFor(option.id)).toBe(option);
    expect(startFor('x')).toBeNull();
  });
});
