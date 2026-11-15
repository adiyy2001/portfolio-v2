import { describe, expect, it } from 'vitest';
import { findPrice, formatPrice, priceGroups } from './prices';
import { findMember } from './team';
import { findTreatment, homeCards, treatments } from './treatments';

describe('treatments', () => {
  it('has unique slugs', () => {
    const slugs = treatments.map(treatment => treatment.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has a price group for every treatment', () => {
    treatments.forEach(treatment => {
      expect(priceGroups.some(group => group.treatment === treatment.slug)).toBe(true);
    });
  });

  it('points at prices and doctors that exist', () => {
    treatments.forEach(treatment => {
      expect(() => findPrice(treatment.priceId)).not.toThrow();
      expect(treatment.doctors.length).toBeGreaterThan(0);
      treatment.doctors.forEach(id => expect(() => findMember(id)).not.toThrow());
    });
  });

  it('has content on every detail page', () => {
    treatments.forEach(treatment => {
      expect(treatment.intro.length).toBeGreaterThan(0);
      expect(treatment.steps.length).toBeGreaterThanOrEqual(3);
      expect(treatment.after.length).toBeGreaterThan(0);
      expect(treatment.faq.length).toBeGreaterThanOrEqual(3);
      expect(treatment.description.length).toBeLessThanOrEqual(200);
    });
  });

  it('keeps the home card price in the price list', () => {
    expect(homeCards.map(card => card.card?.number)).toEqual(['01', '02', '03', '04']);
    const prices = homeCards.map(card => formatPrice(findPrice(card.priceId)));
    expect(prices).toEqual([
      'od\u00a0150\u00a0zł',
      'od\u00a0280\u00a0zł',
      'od\u00a0900\u00a0zł',
      'od\u00a0650\u00a0zł',
    ]);
  });

  it('quotes in the description the same price as the price list', () => {
    treatments.forEach(treatment => {
      const price = findPrice(treatment.priceId).price;
      if (treatment.description.includes(' zł')) {
        expect(treatment.description).toContain(`${price} zł`);
      }
    });
  });

  it('throws on an unknown slug', () => {
    expect(() => findTreatment('nie-ma')).toThrow('Unknown treatment: nie-ma');
  });
});
