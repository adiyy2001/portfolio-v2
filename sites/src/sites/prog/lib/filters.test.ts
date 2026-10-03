import { describe, expect, it } from 'vitest';
import { cards } from '../data/listings';
import type { ListingCard } from '../data/types';
import {
  countActiveFilters,
  countByDistrict,
  defaultFilters,
  filterCards,
  floorBandOf,
  parseAmount,
  priceBounds,
  sortCards,
  toggleInOrder,
  type Filters,
} from './filters';

const withFilters = (changes: Partial<Filters>): Filters => ({ ...defaultFilters, ...changes });

describe('filter cards', () => {
  it('returns everything for the default filters', () => {
    expect(filterCards(cards, defaultFilters)).toHaveLength(cards.length);
  });

  it('filters by transaction and type', () => {
    const rent = filterCards(cards, withFilters({ transaction: 'wynajem' }));
    expect(rent.length).toBeGreaterThan(0);
    expect(rent.every(card => card.transaction === 'wynajem')).toBe(true);
    const houses = filterCards(cards, withFilters({ type: 'dom' }));
    expect(houses.every(card => card.type === 'dom')).toBe(true);
  });

  it('filters by price within a transaction', () => {
    const result = filterCards(
      cards,
      withFilters({ transaction: 'sprzedaz', priceMin: 600000, priceMax: 800000 }),
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(card => card.price >= 600000 && card.price <= 800000)).toBe(true);
  });

  it('ignores a price range when no transaction is chosen', () => {
    const result = filterCards(cards, withFilters({ priceMax: 5000 }));
    expect(result).toHaveLength(cards.length);
  });

  it('filters by area and rooms, treating five rooms as five or more', () => {
    const result = filterCards(cards, withFilters({ areaMin: 40, areaMax: 60, rooms: [2] }));
    expect(result.every(card => card.area >= 40 && card.area <= 60 && card.rooms === 2)).toBe(true);
    const large = filterCards(cards, withFilters({ rooms: [5] }));
    expect(large.every(card => card.rooms >= 5)).toBe(true);
  });

  it('requires every chosen extra', () => {
    const result = filterCards(cards, withFilters({ extras: ['balkon', 'winda'] }));
    expect(
      result.every(card => card.extras.includes('balkon') && card.extras.includes('winda')),
    ).toBe(true);
  });

  it('matches districts as a set and floors by band, dropping houses from floor filters', () => {
    const result = filterCards(cards, withFilters({ districts: ['nadodrze', 'biskupin'] }));
    expect(result.every(card => ['nadodrze', 'biskupin'].includes(card.district))).toBe(true);
    const low = filterCards(cards, withFilters({ floors: ['parter', 'niskie'] }));
    expect(low.every(card => card.floor !== null && card.floor <= 2)).toBe(true);
  });

  it('returns nothing when filters exclude every card', () => {
    expect(filterCards(cards, withFilters({ transaction: 'wynajem', areaMin: 900 }))).toEqual([]);
  });
});

describe('floor bands', () => {
  it('maps floors to bands', () => {
    expect(floorBandOf(0)).toBe('parter');
    expect(floorBandOf(2)).toBe('niskie');
    expect(floorBandOf(5)).toBe('srednie');
    expect(floorBandOf(6)).toBe('wysokie');
  });
});

describe('sorting', () => {
  it('sorts by price within each transaction, sales first', () => {
    const sorted = sortCards(cards, 'cena-rosnaco');
    const sales = sorted.filter(card => card.transaction === 'sprzedaz');
    expect(sorted.slice(0, sales.length)).toEqual(sales);
    const prices = sales.map(card => card.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by newest publication date first', () => {
    const sorted = sortCards(cards, 'najnowsze');
    const dates = sorted.map(card => card.published);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('sorts by area, largest first, without mutating the input', () => {
    const copy = [...cards];
    const sorted = sortCards(cards, 'powierzchnia');
    expect(cards).toEqual(copy);
    const areas = sorted.map((card: ListingCard) => card.area);
    expect(areas).toEqual([...areas].sort((a, b) => b - a));
  });
});

describe('counts', () => {
  it('counts offers per district ignoring the district filter itself', () => {
    const counts = countByDistrict(
      cards,
      withFilters({ districts: ['nadodrze'], transaction: 'sprzedaz' }),
    );
    const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
    expect(total).toBe(cards.filter(card => card.transaction === 'sprzedaz').length);
  });

  it('counts active filter groups', () => {
    expect(countActiveFilters(defaultFilters)).toBe(0);
    expect(
      countActiveFilters(
        withFilters({ transaction: 'sprzedaz', priceMin: 1, priceMax: 2, rooms: [2, 3] }),
      ),
    ).toBe(3);
  });

  it('reports price bounds for a transaction', () => {
    const { min, max } = priceBounds(cards, 'wynajem');
    expect(min).toBeLessThan(max);
    expect(min).toBeLessThan(10000);
  });
});

describe('helpers', () => {
  it('toggles an item and keeps the canonical order', () => {
    const order = ['a', 'b', 'c', 'd'];
    expect(toggleInOrder(['b'], 'a', order)).toEqual(['a', 'b']);
    expect(toggleInOrder(['a', 'b'], 'a', order)).toEqual(['b']);
    expect(toggleInOrder([], 'd', order)).toEqual(['d']);
  });

  it('parses an amount typed with spaces and rejects text', () => {
    expect(parseAmount('650 000')).toBe(650000);
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('12a')).toBeNull();
    expect(parseAmount('-4')).toBeNull();
  });
});
