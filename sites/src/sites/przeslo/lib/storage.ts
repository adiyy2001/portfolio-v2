import { parseStoredBooking } from './booking';
import type { StoredBooking } from './booking';

export const bookingStorageKey = 'przeslo.booking';

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const browserStore = (): KeyValueStore | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const readStoredBooking = (store: KeyValueStore | null): StoredBooking | null => {
  if (!store) return null;
  try {
    const raw = store.getItem(bookingStorageKey);
    return raw === null ? null : parseStoredBooking(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const writeStoredBooking = (
  store: KeyValueStore | null,
  booking: StoredBooking,
): boolean => {
  if (!store) return false;
  try {
    store.setItem(bookingStorageKey, JSON.stringify(booking));
    return true;
  } catch {
    return false;
  }
};

export const removeStoredBooking = (store: KeyValueStore | null): boolean => {
  if (!store) return false;
  try {
    store.removeItem(bookingStorageKey);
    return true;
  } catch {
    return false;
  }
};
