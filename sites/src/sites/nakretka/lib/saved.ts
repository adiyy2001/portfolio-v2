import { addBooking, bookingStorageKey, parseBookings, removeBooking } from './booking';
import type { Booking } from './booking';
import { readStorage, writeStorage } from './storage';

export const loadBookings = (): Booking[] => parseBookings(readStorage(bookingStorageKey));

export const saveBooking = (booking: Booking): { stored: boolean; list: Booking[] } => {
  const list = addBooking(loadBookings(), booking);
  return { stored: writeStorage(bookingStorageKey, JSON.stringify(list)), list };
};

export const deleteBooking = (id: string): Booking[] => {
  const list = removeBooking(loadBookings(), id);
  writeStorage(bookingStorageKey, JSON.stringify(list));
  return list;
};
