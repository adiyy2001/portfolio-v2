import type { DistrictId, Extra, ListingCard, PropertyType, Transaction } from '../data/types';
import { pricePerSquareMeter } from './price';

export type FloorBand = 'parter' | 'niskie' | 'srednie' | 'wysokie';
export type SortKey =
  'najnowsze' | 'cena-rosnaco' | 'cena-malejaco' | 'cena-za-m2' | 'powierzchnia';

export interface Filters {
  transaction: Transaction | null;
  type: PropertyType | null;
  districts: readonly DistrictId[];
  rooms: readonly number[];
  priceMin: number | null;
  priceMax: number | null;
  areaMin: number | null;
  areaMax: number | null;
  floors: readonly FloorBand[];
  extras: readonly Extra[];
  sort: SortKey;
}

export const defaultFilters: Filters = {
  transaction: null,
  type: null,
  districts: [],
  rooms: [],
  priceMin: null,
  priceMax: null,
  areaMin: null,
  areaMax: null,
  floors: [],
  extras: [],
  sort: 'najnowsze',
};

export const maxRoomsFilter = 5;

export const floorBandOf = (floor: number): FloorBand => {
  if (floor === 0) return 'parter';
  if (floor <= 2) return 'niskie';
  if (floor <= 5) return 'srednie';
  return 'wysokie';
};

const matchesRooms = (card: ListingCard, rooms: readonly number[]): boolean =>
  rooms.length === 0 ||
  rooms.some(wanted => (wanted >= maxRoomsFilter ? card.rooms >= wanted : card.rooms === wanted));

const matchesFloors = (card: ListingCard, floors: readonly FloorBand[]): boolean => {
  if (floors.length === 0) return true;
  if (card.floor === null) return false;
  return floors.includes(floorBandOf(card.floor));
};

const matchesPrice = (card: ListingCard, filters: Filters): boolean => {
  if (filters.transaction === null) return true;
  if (filters.priceMin !== null && card.price < filters.priceMin) return false;
  if (filters.priceMax !== null && card.price > filters.priceMax) return false;
  return true;
};

const matchesArea = (card: ListingCard, filters: Filters): boolean => {
  if (filters.areaMin !== null && card.area < filters.areaMin) return false;
  if (filters.areaMax !== null && card.area > filters.areaMax) return false;
  return true;
};

export const matchesFilters = (card: ListingCard, filters: Filters): boolean =>
  (filters.transaction === null || card.transaction === filters.transaction) &&
  (filters.type === null || card.type === filters.type) &&
  (filters.districts.length === 0 || filters.districts.includes(card.district)) &&
  matchesRooms(card, filters.rooms) &&
  matchesPrice(card, filters) &&
  matchesArea(card, filters) &&
  matchesFloors(card, filters.floors) &&
  filters.extras.every(extra => card.extras.includes(extra));

const transactionOrder: Record<Transaction, number> = { sprzedaz: 0, wynajem: 1 };

const compareBySlug = (a: ListingCard, b: ListingCard): number =>
  a.slug.localeCompare(b.slug, 'pl');

const comparators: Record<SortKey, (a: ListingCard, b: ListingCard) => number> = {
  najnowsze: (a, b) => b.published.localeCompare(a.published) || compareBySlug(a, b),
  'cena-rosnaco': (a, b) =>
    transactionOrder[a.transaction] - transactionOrder[b.transaction] ||
    a.price - b.price ||
    compareBySlug(a, b),
  'cena-malejaco': (a, b) =>
    transactionOrder[a.transaction] - transactionOrder[b.transaction] ||
    b.price - a.price ||
    compareBySlug(a, b),
  'cena-za-m2': (a, b) =>
    transactionOrder[a.transaction] - transactionOrder[b.transaction] ||
    pricePerSquareMeter(a.price, a.area) - pricePerSquareMeter(b.price, b.area) ||
    compareBySlug(a, b),
  powierzchnia: (a, b) => b.area - a.area || compareBySlug(a, b),
};

export const sortCards = (cards: readonly ListingCard[], sort: SortKey): ListingCard[] =>
  [...cards].sort(comparators[sort]);

export const filterCards = (cards: readonly ListingCard[], filters: Filters): ListingCard[] =>
  sortCards(
    cards.filter(card => matchesFilters(card, filters)),
    filters.sort,
  );

export const countByDistrict = (
  cards: readonly ListingCard[],
  filters: Filters,
): Map<DistrictId, number> => {
  const counts = new Map<DistrictId, number>();
  const withoutDistricts: Filters = { ...filters, districts: [] };
  for (const card of cards) {
    if (!matchesFilters(card, withoutDistricts)) continue;
    counts.set(card.district, (counts.get(card.district) ?? 0) + 1);
  }
  return counts;
};

export const countActiveFilters = (filters: Filters): number =>
  [
    filters.transaction !== null,
    filters.type !== null,
    filters.districts.length > 0,
    filters.rooms.length > 0,
    filters.priceMin !== null || filters.priceMax !== null,
    filters.areaMin !== null || filters.areaMax !== null,
    filters.floors.length > 0,
    filters.extras.length > 0,
  ].filter(Boolean).length;

export const priceBounds = (
  cards: readonly ListingCard[],
  transaction: Transaction,
): { min: number; max: number } => {
  const prices = cards.filter(card => card.transaction === transaction).map(card => card.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const toggleInOrder = <T>(list: readonly T[], item: T, order: readonly T[]): T[] => {
  const next = new Set(list);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return order.filter(candidate => next.has(candidate));
};

export const parseAmount = (text: string): number | null => {
  const digits = text.replace(/[\s ]/g, '');
  if (!/^\d{1,9}$/.test(digits)) return null;
  return Number(digits);
};
