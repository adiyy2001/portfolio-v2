import { describe, expect, it } from 'vitest';
import { buildBooking } from './booking';
import {
  bookingsKey,
  readBookings,
  readVouchers,
  removeBooking,
  saveBooking,
  saveVoucher,
} from './storage';
import type { KeyValueStore } from './storage';

const memoryStore = (): KeyValueStore & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
};

const sample = (random: number) =>
  buildBooking(
    {
      roomId: 'cichy',
      arrival: '2026-12-04',
      nights: 2,
      guests: 2,
      packageId: null,
      breakfast: false,
      name: 'Anna Nowak',
      phone: '600100200',
      email: '',
      note: '',
    },
    new Date(),
    () => random,
  );

describe('storage', () => {
  it('saves, lists and removes bookings', () => {
    const store = memoryStore();
    const first = sample(0.1);
    const second = sample(0.2);
    expect(saveBooking(store, first)).toBe(true);
    expect(saveBooking(store, second)).toBe(true);
    expect(readBookings(store).map(item => item.reference)).toEqual([
      second.reference,
      first.reference,
    ]);
    removeBooking(store, first.reference);
    expect(readBookings(store)).toHaveLength(1);
  });

  it('survives broken storage content', () => {
    const store = memoryStore();
    store.data.set(bookingsKey, '{oops');
    expect(readBookings(store)).toEqual([]);
    store.data.set(bookingsKey, JSON.stringify([{ nonsense: true }]));
    expect(readBookings(store)).toEqual([]);
  });

  it('reports a missing store', () => {
    expect(readBookings(null)).toEqual([]);
    expect(saveBooking(null, sample(0.3))).toBe(false);
  });

  it('stores vouchers', () => {
    const store = memoryStore();
    saveVoucher(store, { code: 'BON-10000' });
    expect(readVouchers(store)).toHaveLength(1);
  });
});
