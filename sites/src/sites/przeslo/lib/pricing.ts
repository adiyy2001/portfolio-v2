import { extraById, extraDefinitions } from '../data/extras';
import type { ExtraId, ExtraSelection } from '../data/extras';
import { longStayTiers, nonRefundablePercentOff, weekendPackage } from '../data/packages';
import { roomTypeById } from '../data/rooms';
import type { RoomTypeId } from '../data/rooms';
import { partsFromDay, weekdayOf } from './dates';
import type { Day } from './dates';

export type RateId = 'flexible' | 'nonRefundable';
export type SeasonKind = 'newYearsEve' | 'christmasMarket' | 'highSeason';

const neutralPercent = 100;
const weekendPercent = 125;
const seasonPercent: Record<SeasonKind, number> = {
  newYearsEve: 190,
  christmasMarket: 118,
  highSeason: 115,
};

export const isWeekendNight = (night: Day): boolean => {
  const weekday = weekdayOf(night);
  return weekday === 5 || weekday === 6;
};

export const seasonOf = (night: Day): SeasonKind | null => {
  const { month, date } = partsFromDay(night);
  if (month === 12 && date === 31) return 'newYearsEve';
  if ((month === 11 && date >= 20) || (month === 12 && date <= 23)) return 'christmasMarket';
  if (month >= 5 && month <= 9) return 'highSeason';
  return null;
};

export const nightPrice = (roomType: RoomTypeId, night: Day): number => {
  const season = seasonOf(night);
  const seasonal = season ? seasonPercent[season] : neutralPercent;
  const weekend =
    season === 'newYearsEve' || !isWeekendNight(night) ? neutralPercent : weekendPercent;
  const base = roomTypeById(roomType).basePrice;
  return Math.round((base * seasonal * weekend) / 100_000) * 10;
};

export const rateNightPrice = (roomType: RoomTypeId, night: Day, rate: RateId): number => {
  const price = nightPrice(roomType, night);
  if (rate === 'flexible') return price;
  return Math.round((price * (100 - nonRefundablePercentOff)) / 100);
};

export const longStayPercent = (nights: number): number =>
  longStayTiers.reduce((percent, tier) => (nights >= tier.fromNights ? tier.percent : percent), 0);

export const weekendPackageApplies = (arrival: Day, nights: number): boolean =>
  weekdayOf(arrival) === weekendPackage.arrivalWeekday && nights === weekendPackage.nights;

export interface StayRequest {
  arrival: Day;
  nights: number;
  guests: number;
  roomType: RoomTypeId;
  rate: RateId;
  extras: ExtraSelection;
  weekendPackage: boolean;
}

export interface NightLine {
  night: Day;
  price: number;
  weekend: boolean;
  season: SeasonKind | null;
}

export interface ExtraLine {
  id: ExtraId;
  count: number;
  unitPrice: number;
  multiplier: number;
  amount: number;
  inPackage: boolean;
}

export interface PackageLine {
  listValue: number;
  amount: number;
  saving: number;
}

export interface Quote {
  nights: NightLine[];
  accommodation: number;
  discountPercent: number;
  discount: number;
  extras: ExtraLine[];
  extrasTotal: number;
  weekendPackage: PackageLine | null;
  total: number;
}

export const clampExtraCount = (id: ExtraId, count: number | undefined, guests: number): number => {
  if (count === undefined || !Number.isFinite(count)) return 0;
  return Math.min(Math.max(0, Math.floor(count)), extraById(id).maxCount(guests));
};

const effectiveCount = (request: StayRequest, id: ExtraId, packageOn: boolean): number => {
  if (packageOn && weekendPackage.includedExtras.includes(id)) {
    return clampExtraCount(id, id === 'breakfast' ? request.guests : 1, request.guests);
  }
  return clampExtraCount(id, request.extras[id], request.guests);
};

export const quoteStay = (request: StayRequest): Quote => {
  const nights: NightLine[] = Array.from({ length: request.nights }, (_, index) => {
    const night = request.arrival + index;
    return {
      night,
      price: rateNightPrice(request.roomType, night, request.rate),
      weekend: isWeekendNight(night),
      season: seasonOf(night),
    };
  });
  const accommodation = nights.reduce((sum, line) => sum + line.price, 0);
  const discountPercent = longStayPercent(request.nights);
  const discount = Math.round((accommodation * discountPercent) / 100);

  const packageOn =
    request.weekendPackage && weekendPackageApplies(request.arrival, request.nights);

  const extras: ExtraLine[] = [];
  for (const definition of extraDefinitions) {
    const count = effectiveCount(request, definition.id, packageOn);
    if (count === 0) continue;
    const multiplier = definition.unit === 'night' ? request.nights : 1;
    extras.push({
      id: definition.id,
      count,
      unitPrice: definition.price,
      multiplier,
      amount: definition.price * count * multiplier,
      inPackage: packageOn && weekendPackage.includedExtras.includes(definition.id),
    });
  }

  const extrasTotal = extras.reduce((sum, line) => (line.inPackage ? sum : sum + line.amount), 0);

  let packageLine: PackageLine | null = null;
  if (packageOn) {
    const listValue = extras.reduce((sum, line) => (line.inPackage ? sum + line.amount : sum), 0);
    const amount = Math.round((listValue * weekendPackage.priceShare) / 100);
    packageLine = { listValue, amount, saving: listValue - amount };
  }

  const total = accommodation - discount + extrasTotal + (packageLine ? packageLine.amount : 0);
  return {
    nights,
    accommodation,
    discountPercent,
    discount,
    extras,
    extrasTotal,
    weekendPackage: packageLine,
    total,
  };
};

export const averageNightPrice = (quote: Quote): number =>
  quote.nights.length === 0 ? 0 : Math.round(quote.accommodation / quote.nights.length);
