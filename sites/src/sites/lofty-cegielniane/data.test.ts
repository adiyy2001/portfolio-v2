import { describe, expect, it } from 'vitest';
import {
  availableOf,
  basePerM2,
  countByStatus,
  lowestPrice,
  roomsTotal,
  totalUnits,
  typeByKey,
  types,
  unitBySlug,
  units,
} from './data';

describe('loft data', () => {
  it('has 67 units in total', () => {
    expect(totalUnits).toBe(67);
    expect(types.reduce((sum, type) => sum + type.count, 0)).toBe(67);
  });

  it('keeps unique slugs and codes', () => {
    expect(new Set(units.map(unit => unit.slug)).size).toBe(67);
    expect(new Set(units.map(unit => unit.code)).size).toBe(67);
    expect(unitBySlug('ii-07')?.code).toBe('II-07');
  });

  it('sums rooms to the type area', () => {
    for (const type of types) expect(roomsTotal(type)).toBe(type.area);
  });

  it('prices the cheapest available unit at the published from price', () => {
    expect(lowestPrice('37')).toBe(489000);
    expect(lowestPrice('52')).toBe(649000);
    expect(lowestPrice('64')).toBe(799000);
    expect(lowestPrice('112')).toBe(1390000);
  });

  it('gives the published price per square metre', () => {
    expect(types.map(basePerM2)).toEqual([13216, 12481, 12484, 12411]);
  });

  it('keeps the first unit of each type available', () => {
    for (const type of types)
      expect(unitBySlug(`${type.prefix}-01`.toLowerCase())?.status).toBe('dostepny');
  });

  it('splits statuses without losing units', () => {
    const sold = countByStatus(units, 'sprzedany');
    const reserved = countByStatus(units, 'zarezerwowany');
    const available = countByStatus(units, 'dostepny');
    expect(sold + reserved + available).toBe(67);
    expect(types.reduce((sum, type) => sum + availableOf(type.key), 0)).toBe(available);
  });

  it('counts the chimney age from the data', () => {
    expect(typeByKey('52').headline).toBe('Komin liczy 132 lata.');
  });
});
