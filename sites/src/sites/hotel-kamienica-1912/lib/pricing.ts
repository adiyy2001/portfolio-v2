import { hotel, packageById, roomTypeById } from '../data/hotel';
import type { PackageId, RoomId } from '../data/hotel';

export interface StayChoice {
  roomId: RoomId;
  nights: number;
  guests: number;
  packageId: PackageId | null;
  breakfast: boolean;
}

export type QuoteLineKind = 'room' | 'breakfast' | 'package';

export interface QuoteLine {
  kind: QuoteLineKind;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  total: number;
}

export const packageFits = (packageId: PackageId, nights: number, guests: number): boolean => {
  const item = packageById(packageId);
  return nights >= item.minNights && nights <= item.maxNights && guests <= item.maxGuests;
};

export const breakfastIncluded = (choice: StayChoice): boolean =>
  choice.packageId !== null &&
  packageFits(choice.packageId, choice.nights, choice.guests) &&
  packageById(choice.packageId).includesBreakfast;

export const fitToPackage = (
  packageId: PackageId,
  nights: number,
  guests: number,
): { nights: number; guests: number } => {
  const item = packageById(packageId);
  return {
    nights: Math.min(item.maxNights, Math.max(item.minNights, nights)),
    guests: Math.min(item.maxGuests, Math.max(1, guests)),
  };
};

export type BreakfastStatus = 'included' | 'paid' | 'none';

export const breakfastStatus = (choice: StayChoice): BreakfastStatus => {
  if (breakfastIncluded(choice)) return 'included';
  return choice.breakfast ? 'paid' : 'none';
};

export const quoteStay = (choice: StayChoice): Quote => {
  const lines: QuoteLine[] = [
    { kind: 'room', amount: roomTypeById(choice.roomId).rate * choice.nights },
  ];
  const packageApplies =
    choice.packageId !== null && packageFits(choice.packageId, choice.nights, choice.guests);
  if (packageApplies && choice.packageId) {
    lines.push({ kind: 'package', amount: packageById(choice.packageId).price });
  }
  if (choice.breakfast && !breakfastIncluded(choice)) {
    lines.push({
      kind: 'breakfast',
      amount: hotel.breakfastPrice * choice.guests * choice.nights,
    });
  }
  return { lines, total: lines.reduce((sum, line) => sum + line.amount, 0) };
};

export const clampNights = (value: number): number =>
  Math.min(hotel.maxNights, Math.max(hotel.minNights, Math.round(value)));

export const clampGuests = (value: number, roomId: RoomId): number =>
  Math.min(roomTypeById(roomId).guests, Math.max(1, Math.round(value)));
