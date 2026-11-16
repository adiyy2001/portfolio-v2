import { describe, expect, it } from 'vitest';
import { offers } from '../data/offers';
import { applyFilters, emptyFilters } from './filters';

const numbers = (list: ReturnType<typeof applyFilters>) => list.map(offer => offer.number);

describe('applyFilters', () => {
  it('returns every offer by default, in catalog order', () => {
    expect(numbers(applyFilters(offers, emptyFilters))).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
    ]);
  });

  it('filters by rooms', () => {
    expect(numbers(applyFilters(offers, { ...emptyFilters, rooms: 2 }))).toEqual([
      '02',
      '03',
      '04',
    ]);
    expect(numbers(applyFilters(offers, { ...emptyFilters, rooms: 1 }))).toEqual(['06']);
  });

  it('filters by district', () => {
    expect(numbers(applyFilters(offers, { ...emptyFilters, district: 'Psie Pole' }))).toEqual([
      '02',
      '05',
    ]);
  });

  it('filters by budget including the limit itself', () => {
    expect(numbers(applyFilters(offers, { ...emptyFilters, budget: 439000 }))).toEqual([
      '02',
      '04',
      '06',
    ]);
  });

  it('combines filters and can return nothing', () => {
    expect(
      numbers(applyFilters(offers, { rooms: 4, district: 'Karłowice', budget: 450000 })),
    ).toEqual([]);
    expect(
      numbers(applyFilters(offers, { rooms: 2, district: 'Leśnica', budget: 450000 })),
    ).toEqual(['04']);
  });

  it('sorts by price, area and price per square metre', () => {
    expect(numbers(applyFilters(offers, emptyFilters, 'price-asc'))).toEqual([
      '06',
      '04',
      '02',
      '05',
      '03',
      '01',
    ]);
    expect(numbers(applyFilters(offers, emptyFilters, 'price-desc'))[0]).toBe('01');
    expect(numbers(applyFilters(offers, emptyFilters, 'area-desc'))).toEqual([
      '01',
      '05',
      '03',
      '04',
      '02',
      '06',
    ]);
    expect(numbers(applyFilters(offers, emptyFilters, 'm2-asc'))[0]).toBe('05');
  });

  it('does not mutate the source list', () => {
    const before = offers.map(offer => offer.number);
    applyFilters(offers, emptyFilters, 'price-desc');
    expect(offers.map(offer => offer.number)).toEqual(before);
  });
});
