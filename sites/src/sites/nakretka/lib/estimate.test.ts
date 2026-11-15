import { describe, expect, it } from 'vitest';
import { services } from '../data/services';
import { business } from '../data/site';
import { sumFrom } from './estimate';

describe('sumFrom', () => {
  it('adds the from prices of the chosen services', () => {
    expect(sumFrom(['przeglad', 'opony'])).toBe(329);
    expect(sumFrom([])).toBe(0);
    expect(sumFrom(['nie-ma'])).toBe(0);
  });
});

describe('services data', () => {
  it('has unique slugs and a price on every service', () => {
    expect(new Set(services.map(service => service.slug)).size).toBe(services.length);
    expect(services.every(service => service.price > 0 && service.includes.length > 0)).toBe(true);
  });

  it('keeps the landing prices', () => {
    const prices = Object.fromEntries(services.map(service => [service.slug, service.price]));
    expect(prices).toMatchObject({ przeglad: 189, 'olej-i-filtry': 249, hamulce: 420, opony: 140 });
  });

  it('keeps the facts of the landing', () => {
    expect(business.stations).toBe(6);
    expect(business.torqueModels).toBe(84);
    expect(business.maxRepairHours).toBe(72);
    expect(business.inspectionPoints).toBe(40);
  });
});
