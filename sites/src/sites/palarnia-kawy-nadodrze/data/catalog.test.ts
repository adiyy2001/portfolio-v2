import { describe, expect, it } from 'vitest';
import { coffeePriceZl, coffees, coffeesAtDegree, getCoffee, relatedCoffees } from './catalog';
import { brewOrder, countryOrder, degreeOrder } from './facets';
import { degreePriceZl, numbers } from './site';

describe('catalog', () => {
  it('has nine coffees with unique ids, one per plantation', () => {
    expect(coffees).toHaveLength(numbers.plantations);
    expect(new Set(coffees.map(coffee => coffee.id)).size).toBe(coffees.length);
    expect(new Set(coffees.map(coffee => coffee.producer)).size).toBe(coffees.length);
  });

  it('prices every coffee by its roast degree', () => {
    coffees.forEach(coffee => {
      expect(coffeePriceZl(coffee)).toBe(degreePriceZl[coffee.degree]);
    });
  });

  it('keeps every coffee inside the known facets and batch numbers', () => {
    coffees.forEach(coffee => {
      expect(degreeOrder).toContain(coffee.degree);
      expect(countryOrder).toContain(coffee.country);
      expect(coffee.brew.length).toBeGreaterThan(0);
      coffee.brew.forEach(method => expect(brewOrder).toContain(method));
      expect(coffee.batch).toBeGreaterThan(0);
      expect(coffee.batch).toBeLessThanOrEqual(numbers.batchesThisYear);
    });
  });

  it('matches the landing offers by degree and origin', () => {
    expect(coffeesAtDegree(3).map(coffee => coffee.country)).toEqual([
      'etiopia',
      'etiopia',
      'kenia',
    ]);
    expect(new Set(coffeesAtDegree(6).map(coffee => coffee.country))).toEqual(
      new Set(['kolumbia']),
    );
    expect(new Set(coffeesAtDegree(9).map(coffee => coffee.country))).toEqual(
      new Set(['brazylia', 'gwatemala']),
    );
    expect(getCoffee('etiopia-gedeb')?.batch).toBe(numbers.currentFiltrBatch);
  });

  it('suggests related coffees without the coffee itself', () => {
    const related = relatedCoffees('etiopia-gedeb', 3);
    expect(related).toHaveLength(3);
    expect(related.map(coffee => coffee.id)).not.toContain('etiopia-gedeb');
    expect(related[0].degree).toBe(3);
    expect(relatedCoffees('nie-ma', 3)).toEqual([]);
  });
});
