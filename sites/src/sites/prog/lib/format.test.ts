import { describe, expect, it } from 'vitest';
import {
  floorLabel,
  formatArea,
  formatDate,
  formatDecimal,
  formatMonthlyPrice,
  formatPrice,
  groupThousands,
  offersLabel,
  pluralize,
  roomsLabel,
} from './format';

const nbsp = '\u00a0';

describe('format', () => {
  it('groups thousands with a non breaking space', () => {
    expect(groupThousands(689000)).toBe(`689${nbsp}000`);
    expect(groupThousands(999)).toBe('999');
    expect(groupThousands(-1234567)).toBe(`-1${nbsp}234${nbsp}567`);
  });

  it('formats money and area', () => {
    expect(formatPrice(689000)).toBe(`689${nbsp}000${nbsp}zł`);
    expect(formatMonthlyPrice(3200)).toBe(`3${nbsp}200${nbsp}zł/mies.`);
    expect(formatArea(62.4)).toBe(`62,4${nbsp}m²`);
    expect(formatArea(50)).toBe(`50${nbsp}m²`);
    expect(formatDecimal(0.5)).toBe('0,5');
  });

  it('chooses Polish plural forms', () => {
    expect(pluralize(1, 'oferta', 'oferty', 'ofert')).toBe('oferta');
    expect(pluralize(2, 'oferta', 'oferty', 'ofert')).toBe('oferty');
    expect(pluralize(5, 'oferta', 'oferty', 'ofert')).toBe('ofert');
    expect(pluralize(12, 'oferta', 'oferty', 'ofert')).toBe('ofert');
    expect(pluralize(22, 'oferta', 'oferty', 'ofert')).toBe('oferty');
    expect(roomsLabel(4)).toBe(`4${nbsp}pokoje`);
    expect(offersLabel(0)).toBe(`0${nbsp}ofert`);
  });

  it('labels floors and dates', () => {
    expect(floorLabel(0)).toBe('parter');
    expect(floorLabel(3)).toBe('3. piętro');
    expect(floorLabel(null)).toBe('dom');
    expect(formatDate('2026-09-29')).toBe(`29${nbsp}września${nbsp}2026`);
  });
});
