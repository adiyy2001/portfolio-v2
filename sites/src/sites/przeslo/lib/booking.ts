import { extraDefinitions, isExtraId } from '../data/extras';
import type { ExtraSelection } from '../data/extras';
import { maxNights } from '../data/packages';
import { isRoomTypeId, roomTypeById, rooms } from '../data/rooms';
import type { RoomTypeId } from '../data/rooms';
import type { Lang } from '../i18n/lang';
import { isTaken, minNightsFor } from './availability';
import type { Occupancy } from './availability';
import { parseIsoDate, toIsoDate, weekdayOf } from './dates';
import type { Day } from './dates';
import { emptyGuest, hasErrors, isArrivalWindow, validateGuest, validateInvoice } from './guest';
import type { GuestDetails, InvoiceDetails } from './guest';
import { checkInInstant, checkOutInstant, freeCancellationDeadline } from './policy';
import { clampExtraCount, quoteStay, weekendPackageApplies } from './pricing';
import type { Quote, RateId, StayRequest } from './pricing';

export interface StoredBooking {
  version: 1;
  code: string;
  createdAt: string;
  lang: Lang;
  arrival: string;
  departure: string;
  guests: number;
  roomType: RoomTypeId;
  roomNumber: number;
  rate: RateId;
  extras: ExtraSelection;
  weekendPackage: boolean;
  guest: GuestDetails;
  invoice: InvoiceDetails | null;
  cancelledAt: string | null;
}

export interface BookingInput {
  lang: Lang;
  arrival: Day;
  departure: Day;
  guests: number;
  roomType: RoomTypeId;
  rate: RateId;
  extras: ExtraSelection;
  weekendPackage: boolean;
  guest: GuestDetails;
  invoice: InvoiceDetails | null;
}

const codeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const codePattern = /^PRZ-[A-HJ-NP-Z2-9]{6}$/;

export const generateBookingCode = (random: () => number): string => {
  let suffix = '';
  for (let index = 0; index < 6; index += 1) {
    suffix += codeAlphabet.charAt(Math.floor(random() * codeAlphabet.length) % codeAlphabet.length);
  }
  return `PRZ-${suffix}`;
};

export const isBookingCode = (value: string): boolean => codePattern.test(value);

export const assignRoom = (
  roomType: RoomTypeId,
  arrival: Day,
  nights: number,
  occupancy: Occupancy = isTaken,
): number | null => {
  const free = rooms.find(
    room =>
      room.type === roomType &&
      Array.from({ length: nights }, (_, index) => arrival + index).every(
        night => !occupancy(room, night),
      ),
  );
  return free ? free.number : null;
};

export const cleanExtras = (extras: ExtraSelection, guests: number): ExtraSelection => {
  const cleaned: ExtraSelection = {};
  for (const definition of extraDefinitions) {
    const count = clampExtraCount(definition.id, extras[definition.id], guests);
    if (count > 0) cleaned[definition.id] = count;
  }
  return cleaned;
};

const trimGuest = (guest: GuestDetails): GuestDetails => ({
  name: guest.name.trim(),
  email: guest.email.trim(),
  phone: guest.phone.trim(),
  arrivalWindow: guest.arrivalWindow,
  notes: guest.notes.trim(),
});

const trimInvoice = (invoice: InvoiceDetails): InvoiceDetails => ({
  company: invoice.company.trim(),
  nip: invoice.nip.trim(),
  street: invoice.street.trim(),
  postalCode: invoice.postalCode.trim(),
  city: invoice.city.trim(),
});

export const createBooking = (
  input: BookingInput,
  now: Date,
  random: () => number,
  occupancy: Occupancy = isTaken,
): StoredBooking | null => {
  const nights = input.departure - input.arrival;
  const roomNumber = assignRoom(input.roomType, input.arrival, nights, occupancy);
  if (roomNumber === null) return null;
  return {
    version: 1,
    code: generateBookingCode(random),
    createdAt: now.toISOString(),
    lang: input.lang,
    arrival: toIsoDate(input.arrival),
    departure: toIsoDate(input.departure),
    guests: input.guests,
    roomType: input.roomType,
    roomNumber,
    rate: input.rate,
    extras: cleanExtras(input.extras, input.guests),
    weekendPackage: input.weekendPackage && weekendPackageApplies(input.arrival, nights),
    guest: trimGuest(input.guest),
    invoice: input.invoice ? trimInvoice(input.invoice) : null,
    cancelledAt: null,
  };
};

export interface Stay {
  arrival: Day;
  departure: Day;
  nights: number;
}

export const stayOf = (booking: StoredBooking): Stay => {
  const arrival = parseIsoDate(booking.arrival) ?? 0;
  const departure = parseIsoDate(booking.departure) ?? 0;
  return { arrival, departure, nights: departure - arrival };
};

export const requestOf = (booking: StoredBooking): StayRequest => {
  const { arrival, nights } = stayOf(booking);
  return {
    arrival,
    nights,
    guests: booking.guests,
    roomType: booking.roomType,
    rate: booking.rate,
    extras: booking.extras,
    weekendPackage: booking.weekendPackage,
  };
};

export const quoteBooking = (booking: StoredBooking): Quote => quoteStay(requestOf(booking));

export const updateExtras = (
  booking: StoredBooking,
  extras: ExtraSelection,
  weekendPackage: boolean,
): StoredBooking => {
  const { arrival, nights } = stayOf(booking);
  return {
    ...booking,
    extras: cleanExtras(extras, booking.guests),
    weekendPackage: weekendPackage && weekendPackageApplies(arrival, nights),
  };
};

export const cancelBooking = (booking: StoredBooking, now: Date): StoredBooking => ({
  ...booking,
  cancelledAt: now.toISOString(),
});

export type BookingStatus = 'upcoming' | 'underway' | 'finished' | 'cancelled';

export const bookingStatus = (booking: StoredBooking, nowMs: number): BookingStatus => {
  if (booking.cancelledAt !== null) return 'cancelled';
  const { arrival, departure } = stayOf(booking);
  if (nowMs < checkInInstant(arrival)) return 'upcoming';
  if (nowMs < checkOutInstant(departure)) return 'underway';
  return 'finished';
};

export type CancellationOutcome =
  | { kind: 'free'; charge: 0 }
  | { kind: 'firstNight'; charge: number }
  | { kind: 'nonRefundable'; charge: number };

export const cancellationOutcome = (booking: StoredBooking, nowMs: number): CancellationOutcome => {
  const quote = quoteBooking(booking);
  if (booking.rate === 'nonRefundable') {
    return { kind: 'nonRefundable', charge: quote.accommodation - quote.discount };
  }
  const { arrival } = stayOf(booking);
  if (nowMs <= freeCancellationDeadline(arrival)) return { kind: 'free', charge: 0 };
  return { kind: 'firstNight', charge: quote.nights[0]?.price ?? 0 };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

const text = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const parseExtras = (value: unknown, guests: number): ExtraSelection | null => {
  if (!isRecord(value)) return null;
  const extras: ExtraSelection = {};
  for (const [key, count] of Object.entries(value)) {
    if (!isExtraId(key)) continue;
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) return null;
    if (count !== clampExtraCount(key, count, guests)) return null;
    if (count > 0) extras[key] = count;
  }
  return extras;
};

const parseGuest = (value: unknown): GuestDetails | null => {
  if (!isRecord(value)) return null;
  const name = text(value.name);
  const email = text(value.email);
  const phone = text(value.phone);
  const notes = text(value.notes);
  const arrivalWindow = value.arrivalWindow;
  if (name === null || email === null || phone === null || notes === null) return null;
  if (!isArrivalWindow(arrivalWindow)) return null;
  const guest = { ...emptyGuest, name, email, phone, notes, arrivalWindow };
  return hasErrors(validateGuest(guest)) ? null : guest;
};

const parseInvoice = (value: unknown): InvoiceDetails | null => {
  if (!isRecord(value)) return null;
  const company = text(value.company);
  const nip = text(value.nip);
  const street = text(value.street);
  const postalCode = text(value.postalCode);
  const city = text(value.city);
  if (company === null || nip === null || street === null || postalCode === null || city === null) {
    return null;
  }
  const invoice = { company, nip, street, postalCode, city };
  return hasErrors(validateInvoice(invoice)) ? null : invoice;
};

export const parseStoredBooking = (value: unknown): StoredBooking | null => {
  if (!isRecord(value) || value.version !== 1) return null;
  const { code, createdAt, lang, arrival, departure, guests, roomType, roomNumber, rate } = value;
  if (typeof code !== 'string' || !isBookingCode(code)) return null;
  if (!isTimestamp(createdAt)) return null;
  if (lang !== 'pl' && lang !== 'en') return null;
  if (typeof arrival !== 'string' || typeof departure !== 'string') return null;
  const arrivalDay = parseIsoDate(arrival);
  const departureDay = parseIsoDate(departure);
  if (arrivalDay === null || departureDay === null) return null;
  const nights = departureDay - arrivalDay;
  if (nights < minNightsFor(arrivalDay) || nights > maxNights) return null;
  if (!isRoomTypeId(roomType)) return null;
  if (typeof guests !== 'number' || !Number.isInteger(guests)) return null;
  if (guests < 1 || guests > roomTypeById(roomType).capacity) return null;
  const room = rooms.find(candidate => candidate.number === roomNumber);
  if (!room || room.type !== roomType) return null;
  if (rate !== 'flexible' && rate !== 'nonRefundable') return null;
  const extras = parseExtras(value.extras, guests);
  if (extras === null) return null;
  const weekendPackage = value.weekendPackage;
  if (typeof weekendPackage !== 'boolean') return null;
  if (weekendPackage && !weekendPackageApplies(arrivalDay, nights)) return null;
  const guest = parseGuest(value.guest);
  if (guest === null) return null;
  const invoice = value.invoice === null ? null : parseInvoice(value.invoice);
  if (value.invoice !== null && invoice === null) return null;
  const cancelledAt = value.cancelledAt;
  if (cancelledAt !== null && !isTimestamp(cancelledAt)) return null;
  return {
    version: 1,
    code,
    createdAt,
    lang,
    arrival,
    departure,
    guests,
    roomType,
    roomNumber: room.number,
    rate,
    extras,
    weekendPackage,
    guest,
    invoice,
    cancelledAt,
  };
};

const sequence =
  (...values: number[]) =>
  () => {
    const value = values.shift() ?? 0.5;
    values.push(value);
    return value;
  };

export const buildSampleBooking = (today: Day, lang: Lang, now: Date): StoredBooking | null => {
  const earliest = today + 24;
  const firstFriday = earliest + ((5 - weekdayOf(earliest) + 7) % 7);
  for (let week = 0; week < 12; week += 1) {
    const arrival = firstFriday + week * 7;
    const booking = createBooking(
      {
        lang,
        arrival,
        departure: arrival + 2,
        guests: 2,
        roomType: 'klasyczny',
        rate: 'flexible',
        extras: { breakfast: 2, lateCheckOut: 1, welcomeSet: 1 },
        weekendPackage: true,
        guest: {
          name: lang === 'pl' ? 'Anna Przykładowa' : 'Anna Sample',
          email: 'anna.przykladowa@gosc.example',
          phone: '+48 71 000 00 08',
          arrivalWindow: 'evening',
          notes: '',
        },
        invoice: null,
      },
      now,
      sequence(0.12, 0.57, 0.83, 0.21, 0.66, 0.39),
    );
    if (booking) return booking;
  }
  return null;
};
