import { isKitchenBreak, maxPeople, seatingWindow } from '../data/hours';
import { parseIso } from './format';

export interface BookingInput {
  date: string;
  time: string;
  people: string;
  name: string;
  phone: string;
}

export type BookingField = keyof BookingInput;

export type BookingErrorCode =
  | 'dateMissing'
  | 'datePast'
  | 'timeMissing'
  | 'timeOutside'
  | 'timeBreak'
  | 'timePassed'
  | 'peopleRange'
  | 'nameShort'
  | 'phoneInvalid';

export interface BookingError {
  field: BookingField;
  code: BookingErrorCode;
  day?: number;
  window?: readonly [number, number];
}

export interface Booking {
  ref: string;
  date: string;
  time: string;
  people: number;
  name: string;
  phone: string;
  event?: string;
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const minutesOf = (time: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

export const phoneDigits = (value: string) => value.replace(/\D/g, '');

export const isPhone = (value: string) => {
  const digits = phoneDigits(value.trim());
  return /^\+?[0-9 ()-]+$/.test(value.trim()) && digits.length >= 9 && digits.length <= 13;
};

export const validateBooking = (input: BookingInput, now: Date): BookingError | null => {
  const chosen = input.date ? parseIso(input.date) : null;
  if (!chosen) return { field: 'date', code: 'dateMissing' };
  const today = startOfDay(now);
  if (chosen < today) return { field: 'date', code: 'datePast' };
  const minutes = minutesOf(input.time);
  if (minutes === null) return { field: 'time', code: 'timeMissing' };
  const window = seatingWindow(chosen.getDay());
  if (minutes < window[0] * 60 || minutes > window[1] * 60) {
    return { field: 'time', code: 'timeOutside', day: chosen.getDay(), window };
  }
  if (isKitchenBreak(minutes)) return { field: 'time', code: 'timeBreak' };
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (chosen.getTime() === today.getTime() && minutes <= nowMinutes) {
    return { field: 'time', code: 'timePassed' };
  }
  const people = Number(input.people);
  if (!Number.isInteger(people) || people < 1 || people > maxPeople) {
    return { field: 'people', code: 'peopleRange' };
  }
  if (input.name.trim().length < 2) return { field: 'name', code: 'nameShort' };
  if (!isPhone(input.phone)) return { field: 'phone', code: 'phoneInvalid' };
  return null;
};

export const makeRef = (random: () => number = Math.random) =>
  `BS-${String(Math.floor(random() * 900000) + 100000)}`;

export const storageKey = 'bistro-na-szczepinie:rezerwacje';

export const readBookings = (storage: Pick<Storage, 'getItem'> | undefined): Booking[] => {
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(storageKey) ?? '[]');
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
};

export const writeBookings = (
  storage: Pick<Storage, 'setItem'> | undefined,
  bookings: Booking[],
) => {
  if (!storage) return false;
  try {
    storage.setItem(storageKey, JSON.stringify(bookings));
    return true;
  } catch {
    return false;
  }
};

export const addBooking = (bookings: Booking[], booking: Booking) =>
  [...bookings, booking].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

export const removeBooking = (bookings: Booking[], ref: string) =>
  bookings.filter(booking => booking.ref !== ref);

export const bookableTimes = (day: number, step = 30) => {
  const [from, to] = seatingWindow(day);
  const times: string[] = [];
  for (let minutes = from * 60; minutes <= to * 60; minutes += step) {
    if (isKitchenBreak(minutes)) continue;
    times.push(
      `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
    );
  }
  return times;
};
