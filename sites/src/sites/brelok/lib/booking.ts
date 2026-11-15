import { isPackageId, isRoomId } from '../data/hotel';
import type { PackageId, RoomId } from '../data/hotel';
import { addDays, parseIso } from './dates';
import type { IsoDate } from './dates';
import { quoteStay } from './pricing';

export interface StoredBooking {
  reference: string;
  roomId: RoomId;
  arrival: IsoDate;
  nights: number;
  guests: number;
  packageId: PackageId | null;
  breakfast: boolean;
  name: string;
  phone: string;
  email: string;
  note: string;
  total: number;
  createdAt: string;
}

export interface BookingDraft {
  roomId: RoomId;
  arrival: IsoDate;
  nights: number;
  guests: number;
  packageId: PackageId | null;
  breakfast: boolean;
  name: string;
  phone: string;
  email: string;
  note: string;
}

export const departureOf = (booking: { arrival: IsoDate; nights: number }): IsoDate =>
  addDays(booking.arrival, booking.nights);

export const makeReference = (random: () => number = Math.random): string => {
  const digits = Math.floor(random() * 900000) + 100000;
  return `BR-${digits}`;
};

export const buildBooking = (
  draft: BookingDraft,
  now: Date = new Date(),
  random: () => number = Math.random,
): StoredBooking => ({
  ...draft,
  reference: makeReference(random),
  total: quoteStay(draft).total,
  createdAt: now.toISOString(),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseStoredBooking = (value: unknown): StoredBooking | null => {
  if (!isRecord(value)) return null;
  const { reference, roomId, arrival, nights, guests, packageId, breakfast } = value;
  const { name, phone, email, note, total, createdAt } = value;
  if (typeof reference !== 'string' || !/^BR-\d{6}$/.test(reference)) return null;
  if (!isRoomId(roomId)) return null;
  if (typeof arrival !== 'string' || !parseIso(arrival)) return null;
  if (typeof nights !== 'number' || nights < 1 || nights > 7) return null;
  if (typeof guests !== 'number' || guests < 1 || guests > 4) return null;
  if (packageId !== null && !isPackageId(packageId)) return null;
  if (typeof breakfast !== 'boolean') return null;
  if (typeof name !== 'string' || typeof phone !== 'string') return null;
  if (typeof email !== 'string' || typeof note !== 'string') return null;
  if (typeof total !== 'number' || typeof createdAt !== 'string') return null;
  return {
    reference,
    roomId,
    arrival,
    nights,
    guests,
    packageId,
    breakfast,
    name,
    phone,
    email,
    note,
    total,
    createdAt,
  };
};
