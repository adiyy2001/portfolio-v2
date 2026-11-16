import { parseStoredBooking } from './booking';
import type { StoredBooking } from './booking';

export const bookingsKey = 'hotel-kamienica-1912.bookings';
export const voucherKey = 'hotel-kamienica-1912.vouchers';

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const browserStore = (): KeyValueStore | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

const readList = (store: KeyValueStore | null, key: string): unknown[] => {
  if (!store) return [];
  try {
    const raw = store.getItem(key);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeList = (store: KeyValueStore | null, key: string, list: unknown[]): boolean => {
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
};

export const readBookings = (store: KeyValueStore | null): StoredBooking[] =>
  readList(store, bookingsKey).flatMap(item => {
    const booking = parseStoredBooking(item);
    return booking ? [booking] : [];
  });

export const saveBooking = (store: KeyValueStore | null, booking: StoredBooking): boolean => {
  const others = readBookings(store).filter(item => item.reference !== booking.reference);
  return writeList(store, bookingsKey, [booking, ...others]);
};

export const removeBooking = (store: KeyValueStore | null, reference: string): boolean =>
  writeList(
    store,
    bookingsKey,
    readBookings(store).filter(item => item.reference !== reference),
  );

export const readVouchers = (store: KeyValueStore | null): unknown[] => readList(store, voucherKey);

export const saveVoucher = (store: KeyValueStore | null, voucher: unknown): boolean =>
  writeList(store, voucherKey, [voucher, ...readVouchers(store)]);
