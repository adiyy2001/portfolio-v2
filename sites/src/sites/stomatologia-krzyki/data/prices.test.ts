import { describe, expect, it } from 'vitest';
import {
  findPrice,
  formatPln,
  formatPrice,
  priceGroups,
  priceItems,
  pricesOfGroup,
} from './prices';

describe('price list', () => {
  it('has unique ids', () => {
    const ids = priceItems.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('puts every item in an existing group', () => {
    const groupIds = new Set(priceGroups.map(group => group.id));
    priceItems.forEach(item => expect(groupIds.has(item.group)).toBe(true));
  });

  it('has items in every group', () => {
    priceGroups.forEach(group => expect(pricesOfGroup(group.id).length).toBeGreaterThan(0));
  });

  it('uses whole positive prices with a unit', () => {
    priceItems.forEach(item => {
      expect(Number.isInteger(item.price)).toBe(true);
      expect(item.price).toBeGreaterThan(0);
      expect(item.unit.length).toBeGreaterThan(0);
    });
  });

  it('throws on an unknown id', () => {
    expect(() => findPrice('nie-ma')).toThrow('Unknown price: nie-ma');
  });

  it('formats prices with od unless the price is exact', () => {
    expect(formatPln(150)).toBe('150\u00a0zł');
    expect(formatPrice(findPrice('przeglad'))).toBe('od\u00a0150\u00a0zł');
    expect(formatPrice(findPrice('zdjecie-punktowe'))).toBe('55\u00a0zł');
  });
});
