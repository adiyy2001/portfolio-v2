import { describe, expect, it } from 'vitest';
import { accessories, coffees } from '../data/catalog';
import { weights } from '../data/facets';
import {
  lowestPriceGr,
  productPriceGr,
  unitPricePerKgGr,
  weightPriceGr,
  weightPriceZl,
} from './pricing';

describe('weightPriceZl', () => {
  it('keeps the 250 g price and discounts larger bags', () => {
    expect(weightPriceZl(49, 250)).toBe(49);
    expect(weightPriceZl(49, 500)).toBe(94);
    expect(weightPriceZl(49, 1000)).toBe(180);
  });

  it('returns grosze', () => {
    expect(weightPriceGr(49, 500)).toBe(9400);
  });
});

describe('unitPricePerKgGr', () => {
  it('converts a bag price to a price per kilogram', () => {
    expect(unitPricePerKgGr(4900, 250)).toBe(19600);
    expect(unitPricePerKgGr(9400, 500)).toBe(18800);
    expect(unitPricePerKgGr(18000, 1000)).toBe(18000);
  });

  it('makes every coffee cheaper per kilogram in a larger bag', () => {
    for (const coffee of coffees) {
      const perKg = weights.map(grams =>
        unitPricePerKgGr(weightPriceGr(coffee.base250, grams), grams),
      );
      expect(perKg[0]).toBeGreaterThan(perKg[1]);
      expect(perKg[1]).toBeGreaterThan(perKg[2]);
    }
  });
});

describe('productPriceGr', () => {
  it('prices accessories without a weight', () => {
    const dripper = accessories.find(item => item.id === 'dripper-02');
    expect(dripper && productPriceGr(dripper, null)).toBe(7900);
  });

  it('defaults a coffee to 250 g', () => {
    const [coffee] = coffees;
    expect(productPriceGr(coffee, null)).toBe(coffee.base250 * 100);
    expect(lowestPriceGr(coffee)).toBe(coffee.base250 * 100);
  });
});
