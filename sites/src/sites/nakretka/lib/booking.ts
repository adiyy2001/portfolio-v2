import { weekHours } from '../data/site';
import { addDays, isoDate } from './clock';
import type { WallClock } from './clock';

export interface BookingDay {
  iso: string;
  weekday: number;
  short: string;
  label: string;
  hours: number[];
}

export interface Booking {
  id: string;
  service: string;
  serviceName: string;
  date: string | null;
  hour: number | null;
  name: string;
  phone: string;
  car: string;
  note: string;
  createdAt: number;
}

export const bookingStorageKey = 'nakretka-bookings';
export const maxStoredBookings = 12;
export const lastArrivalGapHours = 2;
export const leadHours = 2;
export const horizonDays = 14;
export const maxDays = 8;

const weekdayShort = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
const weekdayLong = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
];
const monthGenitive = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

export const arrivalHours = (weekday: number): number[] => {
  const hours = weekHours[weekday];
  if (!hours) return [];
  const result: number[] = [];
  for (let hour = hours.from; hour <= hours.to - lastArrivalGapHours; hour += 1) result.push(hour);
  return result;
};

const hashText = (text: string): number => {
  let hash = 7;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 100003;
  }
  return hash;
};

export const takenHours = (iso: string): number[] => {
  const weekday = new Date(`${iso}T12:00:00Z`).getUTCDay();
  const hours = arrivalHours(weekday);
  if (hours.length === 0) return [];
  const hash = hashText(iso);
  const free = hours[hash % hours.length];
  return hours.filter(hour => hour !== free && (hash + hour * hour * 3) % 7 < 3);
};

export const nextWorkingDays = (now: WallClock, count = maxDays): BookingDay[] => {
  const days: BookingDay[] = [];
  for (let offset = 0; offset <= horizonDays && days.length < count; offset += 1) {
    const day = addDays(now, offset);
    let hours = arrivalHours(day.weekday);
    if (offset === 0) hours = hours.filter(hour => hour >= now.hour + leadHours);
    if (hours.length === 0) continue;
    days.push({
      iso: isoDate(day),
      weekday: day.weekday,
      short: `${weekdayShort[day.weekday]} ${day.day}.${String(day.month).padStart(2, '0')}`,
      label: `${weekdayLong[day.weekday]}, ${day.day} ${monthGenitive[day.month - 1]}`,
      hours,
    });
  }
  return days;
};

export const freeHours = (day: BookingDay, booked: Booking[]): number[] => {
  const taken = takenHours(day.iso);
  const mine = booked.filter(item => item.date === day.iso).map(item => item.hour);
  return day.hours.filter(hour => !taken.includes(hour) && !mine.includes(hour));
};

export const formatHour = (hour: number): string => `${hour}:00`;

export const orderNumber = (random: () => number = Math.random): string =>
  `NK-${String(100000 + Math.floor(random() * 900000))}`;

const isText = (value: unknown): value is string => typeof value === 'string';

const isBooking = (value: unknown): value is Booking => {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    isText(item.id) &&
    /^NK-\d{6}$/.test(item.id) &&
    isText(item.service) &&
    isText(item.serviceName) &&
    (item.date === null || (isText(item.date) && /^\d{4}-\d{2}-\d{2}$/.test(item.date))) &&
    (item.hour === null || (typeof item.hour === 'number' && Number.isInteger(item.hour))) &&
    isText(item.name) &&
    isText(item.phone) &&
    isText(item.car) &&
    isText(item.note) &&
    typeof item.createdAt === 'number'
  );
};

export const parseBookings = (raw: string | null): Booking[] => {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isBooking).slice(0, maxStoredBookings);
  } catch {
    return [];
  }
};

export const addBooking = (list: Booking[], booking: Booking): Booking[] =>
  [booking, ...list.filter(item => item.id !== booking.id)].slice(0, maxStoredBookings);

export const removeBooking = (list: Booking[], id: string): Booking[] =>
  list.filter(item => item.id !== id);

export const describeBooking = (booking: Booking): string => {
  if (!booking.date || booking.hour === null) return 'Termin ustalimy telefonicznie';
  const day = new Date(`${booking.date}T12:00:00Z`);
  const label = `${weekdayLong[day.getUTCDay()]}, ${day.getUTCDate()} ${monthGenitive[day.getUTCMonth()]}`;
  return `${label}, godz. ${formatHour(booking.hour)}`;
};
