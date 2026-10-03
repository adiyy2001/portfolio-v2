import { roomTypes } from '../data/rooms';
import type { RoomTypeId } from '../data/rooms';
import { dayFromParts } from '../lib/dates';
import { quoteStay } from '../lib/pricing';

export const weekendArrival = dayFromParts(2027, 2, 12);
export const longStayArrival = dayFromParts(2027, 3, 1);
export const exampleGuests = 2;

export interface WeekendRow {
  roomType: RoomTypeId;
  accommodation: number;
  extrasSeparately: number;
  extrasInPackage: number;
  saving: number;
  total: number;
}

export interface LongStayRow {
  roomType: RoomTypeId;
  sevenNightsList: number;
  sevenNightsPay: number;
  eightNightsList: number;
  eightNightsPay: number;
}

const base = { guests: exampleGuests, rate: 'flexible', extras: {} } as const;

export const weekendRows = (): WeekendRow[] =>
  roomTypes.map(type => {
    const quote = quoteStay({
      ...base,
      arrival: weekendArrival,
      nights: 2,
      roomType: type.id,
      weekendPackage: true,
    });
    const line = quote.weekendPackage;
    const listValue = line ? line.listValue : 0;
    const amount = line ? line.amount : 0;
    return {
      roomType: type.id,
      accommodation: quote.accommodation,
      extrasSeparately: listValue,
      extrasInPackage: amount,
      saving: listValue - amount,
      total: quote.total,
    };
  });

export const longStayRows = (): LongStayRow[] =>
  roomTypes.map(type => {
    const seven = quoteStay({
      ...base,
      arrival: longStayArrival,
      nights: 7,
      roomType: type.id,
      weekendPackage: false,
    });
    const eight = quoteStay({
      ...base,
      arrival: longStayArrival,
      nights: 8,
      roomType: type.id,
      weekendPackage: false,
    });
    return {
      roomType: type.id,
      sevenNightsList: seven.accommodation,
      sevenNightsPay: seven.total,
      eightNightsList: eight.accommodation,
      eightNightsPay: eight.total,
    };
  });
