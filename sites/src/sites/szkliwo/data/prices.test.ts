import { describe, expect, it } from 'vitest';
import { formatZloty } from '../lib/format';
import { findMember } from './team';
import { findPrice, priceCategories, priceItems } from './prices';
import { treatments } from './treatments';

describe('price list', () => {
  it('has unique ids and names', () => {
    const ids = priceItems.map(item => item.id);
    const names = priceItems.map(item => item.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('puts every item in an existing category', () => {
    const categoryIds = new Set(priceCategories.map(category => category.id));
    priceItems.forEach(item => expect(categoryIds.has(item.category)).toBe(true));
  });

  it('has items in every category', () => {
    priceCategories.forEach(category => {
      expect(priceItems.some(item => item.category === category.id)).toBe(true);
    });
  });

  it('uses whole positive prices', () => {
    priceItems.forEach(item => {
      expect(Number.isInteger(item.price)).toBe(true);
      expect(item.price).toBeGreaterThan(0);
    });
  });

  it('throws on an unknown id', () => {
    expect(() => findPrice('nie-ma')).toThrow('Unknown price: nie-ma');
  });

  it('states the bundle saving that the prices add up to', () => {
    const separate = findPrice('higienizacja').price + findPrice('wybielanie-gabinetowe').price;
    const saving = separate - findPrice('higienizacja-i-wybielanie').price;
    const note = findPrice('higienizacja-i-wybielanie').note ?? '';
    expect(note).toContain(`O ${saving} zł taniej`);
  });
});

describe('treatments', () => {
  it('has unique slugs', () => {
    const slugs = treatments.map(treatment => treatment.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('lists only prices that exist', () => {
    treatments.forEach(treatment => {
      treatment.priceIds.forEach(id => expect(() => findPrice(id)).not.toThrow());
    });
  });

  it('lists at least four prices per treatment', () => {
    treatments.forEach(treatment => expect(treatment.priceIds.length).toBeGreaterThanOrEqual(4));
  });

  it('is done by people who are on the team', () => {
    treatments.forEach(treatment => {
      expect(treatment.doctorIds.length).toBeGreaterThan(0);
      treatment.doctorIds.forEach(id => expect(() => findMember(id)).not.toThrow());
    });
  });

  it('answers the three questions with text', () => {
    treatments.forEach(({ pain, duration, cost }) => {
      [pain, duration, cost].forEach(({ answer, detail }) => {
        expect(answer.length).toBeGreaterThan(0);
        expect(detail.length).toBeGreaterThan(0);
      });
    });
  });

  it('is linked from the price categories that name a treatment', () => {
    const slugs = new Set(treatments.map(treatment => treatment.slug));
    priceCategories.forEach(category => {
      if (category.treatment) expect(slugs.has(category.treatment)).toBe(true);
    });
  });

  it('quotes prices that match the price list', () => {
    const fillings = treatments.find(treatment => treatment.slug === 'wypelnienia');
    expect(fillings?.cost.answer).toBe(`od ${formatZloty(findPrice('wypelnienie-maly').price)}`);
  });
});
