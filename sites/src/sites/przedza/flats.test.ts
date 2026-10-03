import { describe, expect, it } from 'vitest';
import { columnCount, gateColumns } from './building';
import { flats } from './data';
import {
  countByStatus,
  findFlat,
  flatCode,
  flatSlug,
  formatArea,
  formatNumber,
  formatPrice,
  formatPricePerM2,
  neighbours,
  pluralPl,
  pricePerM2,
  roomsLabel,
  similarFlats,
  summaryByRooms,
} from './flats';
import { reservationFee } from './building';

const nbsp = String.fromCharCode(0xa0);
const dashes = [String.fromCharCode(0x2013), String.fromCharCode(0x2014)];

describe('formatting', () => {
  it('groups thousands with a non-breaking space', () => {
    expect(formatNumber(1029000)).toBe(`1${nbsp}029${nbsp}000`);
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(16650)).toBe(`16${nbsp}650`);
  });

  it('formats price, area and price per square metre', () => {
    expect(formatPrice(595000)).toBe(`595${nbsp}000${nbsp}zł`);
    expect(formatArea(61.8)).toBe(`61,8${nbsp}m²`);
    expect(formatArea(40)).toBe(`40,0${nbsp}m²`);
    const sample = flats[0];
    expect(formatPricePerM2(sample)).toBe(`${formatNumber(pricePerM2(sample))}${nbsp}zł/m²`);
  });

  it('rounds price per square metre to whole zloty', () => {
    expect(pricePerM2({ ...flats[0], price: 1000000, area: 60 })).toBe(16667);
  });

  it('declines Polish nouns', () => {
    expect(pluralPl(1, 'pokój', 'pokoje', 'pokoi')).toBe('pokój');
    expect(pluralPl(2, 'pokój', 'pokoje', 'pokoi')).toBe('pokoje');
    expect(pluralPl(5, 'pokój', 'pokoje', 'pokoi')).toBe('pokoi');
    expect(pluralPl(12, 'pokój', 'pokoje', 'pokoi')).toBe('pokoi');
    expect(pluralPl(22, 'pokój', 'pokoje', 'pokoi')).toBe('pokoje');
    expect(roomsLabel(3)).toBe('3 pokoje');
    expect(roomsLabel(4)).toBe('4 pokoje');
  });
});

describe('flat identity', () => {
  it('builds the code and the slug from floor and column', () => {
    const flat = flats.find(item => item.floor === 2 && item.column === 7);
    expect(flat).toBeDefined();
    if (!flat) return;
    expect(flatCode(flat)).toBe('M 2.07');
    expect(flatSlug(flat)).toBe('2-07');
    expect(findFlat('2-07')).toBe(flat);
    expect(findFlat('9-99')).toBeUndefined();
  });

  it('gives every flat a unique slug', () => {
    expect(new Set(flats.map(flatSlug)).size).toBe(flats.length);
  });

  it('links neighbours in code order', () => {
    expect(neighbours(flats[0]).previous).toBeUndefined();
    expect(neighbours(flats[0]).next).toBe(flats[1]);
    expect(neighbours(flats[flats.length - 1]).next).toBeUndefined();
    expect(neighbours(flats[5]).previous).toBe(flats[4]);
  });
});

describe('data integrity', () => {
  it('has 48 flats on five floors with the gate columns empty on the ground floor', () => {
    expect(flats).toHaveLength(48);
    expect(flats.filter(flat => flat.floor === 0)).toHaveLength(8);
    for (const floor of [1, 2, 3, 4]) {
      expect(flats.filter(flat => flat.floor === floor)).toHaveLength(10);
    }
    const groundColumns = flats.filter(flat => flat.floor === 0).map(flat => flat.column);
    for (const gate of gateColumns) expect(groundColumns).not.toContain(gate);
    for (const flat of flats) {
      expect(flat.column).toBeGreaterThanOrEqual(1);
      expect(flat.column).toBeLessThanOrEqual(columnCount);
    }
  });

  it('keeps areas inside the range of the room count', () => {
    const ranges = { 2: [36, 47], 3: [51, 69], 4: [78, 105] } as const;
    for (const flat of flats) {
      const [min, max] = ranges[flat.rooms];
      expect(flat.area).toBeGreaterThanOrEqual(min);
      expect(flat.area).toBeLessThanOrEqual(max);
    }
  });

  it('keeps prices realistic and above the reservation fee cap threshold', () => {
    for (const flat of flats) {
      expect(pricePerM2(flat)).toBeGreaterThan(14000);
      expect(pricePerM2(flat)).toBeLessThan(19500);
      expect(reservationFee).toBeLessThanOrEqual(flat.price * 0.01);
    }
  });

  it('mixes statuses and keeps every room count and floor available', () => {
    const counts = countByStatus(flats);
    expect(counts.available + counts.reserved + counts.sold).toBe(48);
    expect(counts.available).toBeGreaterThan(15);
    expect(counts.reserved).toBeGreaterThan(0);
    expect(counts.sold).toBeGreaterThan(10);
    for (const rooms of [2, 3, 4]) {
      expect(flats.some(flat => flat.rooms === rooms && flat.status === 'available')).toBe(true);
    }
    for (const floor of [0, 1, 2, 3, 4]) {
      expect(flats.some(flat => flat.floor === floor && flat.status === 'available')).toBe(true);
    }
  });

  it('has no dash characters or empty notes', () => {
    for (const flat of flats) {
      expect(flat.note.length).toBeGreaterThan(20);
      for (const dash of dashes) expect(flat.note).not.toContain(dash);
    }
  });
});

describe('summaries', () => {
  it('summarises each room count with the lowest available price', () => {
    const summary = summaryByRooms(flats);
    expect(summary.map(item => item.rooms)).toEqual([2, 3, 4]);
    expect(summary.reduce((sum, item) => sum + item.total, 0)).toBe(48);
    for (const item of summary) {
      const open = flats.filter(flat => flat.rooms === item.rooms && flat.status === 'available');
      expect(item.available).toBe(open.length);
      expect(item.priceFrom).toBe(Math.min(...open.map(flat => flat.price)));
    }
  });

  it('suggests similar available flats and never the flat itself', () => {
    const flat = flats[0];
    const similar = similarFlats(flat, 3);
    expect(similar).toHaveLength(3);
    expect(similar).not.toContain(flat);
    for (const other of similar) expect(other.status).toBe('available');
    expect(similar.every(other => other.rooms === flat.rooms)).toBe(true);
  });
});
