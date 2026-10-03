import { describe, expect, it } from 'vitest';
import { buildSampleBooking } from './booking';
import type { StoredBooking } from './booking';
import { dayFromParts } from './dates';
import {
  bookingStorageKey,
  readStoredBooking,
  removeStoredBooking,
  writeStoredBooking,
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
    removeItem: key => {
      data.delete(key);
    },
  };
};

const blockedStore: KeyValueStore = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
  removeItem: () => {
    throw new Error('blocked');
  },
};

const sample = (): StoredBooking => {
  const booking = buildSampleBooking(
    dayFromParts(2026, 10, 3),
    'en',
    new Date('2026-10-03T08:00:00Z'),
  );
  if (!booking) throw new Error('no sample booking');
  return booking;
};

describe('stored booking', () => {
  it('reads back what was written', () => {
    const store = memoryStore();
    const booking = sample();
    expect(writeStoredBooking(store, booking)).toBe(true);
    expect(store.data.has(bookingStorageKey)).toBe(true);
    expect(readStoredBooking(store)).toEqual(booking);
  });

  it('returns nothing when there is no booking', () => {
    expect(readStoredBooking(memoryStore())).toBeNull();
  });

  it('ignores corrupted or tampered data', () => {
    const store = memoryStore();
    store.setItem(bookingStorageKey, '{not json');
    expect(readStoredBooking(store)).toBeNull();
    store.setItem(bookingStorageKey, JSON.stringify({ ...sample(), guests: 99 }));
    expect(readStoredBooking(store)).toBeNull();
    store.setItem(bookingStorageKey, 'null');
    expect(readStoredBooking(store)).toBeNull();
  });

  it('removes the booking', () => {
    const store = memoryStore();
    writeStoredBooking(store, sample());
    expect(removeStoredBooking(store)).toBe(true);
    expect(readStoredBooking(store)).toBeNull();
  });

  it('keeps working when storage is missing or blocked', () => {
    expect(readStoredBooking(null)).toBeNull();
    expect(writeStoredBooking(null, sample())).toBe(false);
    expect(removeStoredBooking(null)).toBe(false);
    expect(readStoredBooking(blockedStore)).toBeNull();
    expect(writeStoredBooking(blockedStore, sample())).toBe(false);
    expect(removeStoredBooking(blockedStore)).toBe(false);
  });
});
