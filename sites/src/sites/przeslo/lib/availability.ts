import { horizonDays, maxNights } from '../data/packages';
import { roomTypeById, roomTypes, rooms } from '../data/rooms';
import type { Room, RoomType, RoomTypeId } from '../data/rooms';
import { partsFromDay, weekdayOf } from './dates';
import type { Day } from './dates';
import { isWeekendNight, nightPrice, seasonOf } from './pricing';

export type Occupancy = (room: Room, night: Day) => boolean;

const mix = (first: number, second: number, salt: number): number => {
  let hash =
    Math.imul(first ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(second + salt * 0x27d4eb2f, 0xc2b2ae35);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x2c1b3c6d);
  hash ^= hash >>> 12;
  hash = Math.imul(hash, 0x297a2d39);
  hash ^= hash >>> 15;
  return (hash >>> 0) / 4294967296;
};

const startWeight = [14, 24, 28, 32, 36, 58, 22];

const runLengths: number[][] = [
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [2, 2, 2, 3],
  [2, 2, 2, 2, 3],
];

const typeBias: Record<RoomTypeId, number> = {
  podworzowy: -4,
  klasyczny: 0,
  nadrzeczny: 4,
  rodzinny: -2,
  poddasze: 3,
};

export const startPercent = (night: Day): number => {
  const season = seasonOf(night);
  const weekend = isWeekendNight(night);
  let percent = startWeight[weekdayOf(night)] ?? 30;
  if (season === 'highSeason') percent += weekend ? 14 : 8;
  if (season === 'christmasMarket') percent += weekend ? 16 : 10;
  if (season === 'newYearsEve') percent = 80;
  const { month, date } = partsFromDay(night);
  if (month === 12 && date >= 24 && date <= 26) percent -= 20;
  return Math.min(90, Math.max(8, percent));
};

const typeIndex = (type: RoomTypeId): number => roomTypes.findIndex(entry => entry.id === type);

const runLengthStartingOn = (room: Room, night: Day): number => {
  const chance = (startPercent(night) + typeBias[room.type]) / 100;
  const seed = typeIndex(room.type) * 1000 + room.number;
  if (mix(room.number, night, seed) >= chance) return 0;
  const lengths = runLengths[weekdayOf(night)] ?? [1];
  return lengths[Math.floor(mix(room.number, night, seed + 1) * lengths.length)] ?? 1;
};

export const isFullHouse = (night: Day): boolean =>
  isWeekendNight(night) && mix(night, 0, 4242) < 0.1;

export const isTaken: Occupancy = (room, night) =>
  isFullHouse(night) ||
  runLengthStartingOn(room, night) > 0 ||
  runLengthStartingOn(room, night - 1) > 1 ||
  runLengthStartingOn(room, night - 2) > 2;

export const freeRoomsOnNight = (night: Day, occupancy: Occupancy = isTaken): Room[] =>
  rooms.filter(room => !occupancy(room, night));

export const freeRoomsForStay = (
  arrival: Day,
  nights: number,
  occupancy: Occupancy = isTaken,
): Room[] =>
  rooms.filter(room => {
    for (let index = 0; index < nights; index += 1) {
      if (occupancy(room, arrival + index)) return false;
    }
    return true;
  });

export interface TypeAvailability {
  type: RoomType;
  free: Room[];
  total: number;
}

export const typeAvailability = (
  arrival: Day,
  nights: number,
  occupancy: Occupancy = isTaken,
): TypeAvailability[] => {
  const free = freeRoomsForStay(arrival, nights, occupancy);
  return roomTypes.map(type => ({
    type,
    free: free.filter(room => room.type === type.id),
    total: rooms.filter(room => room.type === type.id).length,
  }));
};

export const canStay = (
  arrival: Day,
  nights: number,
  guests: number,
  occupancy: Occupancy = isTaken,
): boolean =>
  typeAvailability(arrival, nights, occupancy).some(
    entry => entry.type.capacity >= guests && entry.free.length > 0,
  );

export interface NightSummary {
  night: Day;
  soldOut: boolean;
  fromPrice: number | null;
  freeCount: number;
}

export const summariseNight = (
  night: Day,
  guests: number,
  occupancy: Occupancy = isTaken,
): NightSummary => {
  const free = freeRoomsOnNight(night, occupancy).filter(
    room => roomTypeById(room.type).capacity >= guests,
  );
  const prices = free.map(room => nightPrice(room.type, night));
  return {
    night,
    soldOut: free.length === 0,
    fromPrice: prices.length === 0 ? null : Math.min(...prices),
    freeCount: free.length,
  };
};

export const minNightsFor = (arrival: Day): number => (isWeekendNight(arrival) ? 2 : 1);

export const earliestDeparture = (arrival: Day): Day => arrival + minNightsFor(arrival);

export type StayProblem =
  'missingDates' | 'inPast' | 'tooShort' | 'tooLong' | 'beyondHorizon' | 'unavailable';

export const validateStay = (
  arrival: Day | null,
  departure: Day | null,
  guests: number,
  today: Day,
  occupancy: Occupancy = isTaken,
): StayProblem | null => {
  if (arrival === null || departure === null) return 'missingDates';
  if (arrival < today) return 'inPast';
  const nights = departure - arrival;
  if (nights < minNightsFor(arrival)) return 'tooShort';
  if (nights > maxNights) return 'tooLong';
  if (departure > today + horizonDays) return 'beyondHorizon';
  if (!canStay(arrival, nights, guests, occupancy)) return 'unavailable';
  return null;
};

export const lastBookableNight = (today: Day): Day => today + horizonDays - 1;
