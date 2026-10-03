import type { DistrictId, Extra, PropertyType, Transaction } from '../data/types';
import { districtIds } from '../data/districts';
import {
  defaultFilters,
  maxRoomsFilter,
  type Filters,
  type FloorBand,
  type SortKey,
} from './filters';

const transactions: readonly Transaction[] = ['sprzedaz', 'wynajem'];
const types: readonly PropertyType[] = ['mieszkanie', 'dom'];
const floorBands: readonly FloorBand[] = ['parter', 'niskie', 'srednie', 'wysokie'];
const extraKeys: readonly Extra[] = [
  'balkon',
  'ogrod',
  'winda',
  'parking',
  'piwnica',
  'umeblowane',
  'zwierzeta',
];
const sortKeys: readonly SortKey[] = [
  'najnowsze',
  'cena-rosnaco',
  'cena-malejaco',
  'cena-za-m2',
  'powierzchnia',
];

const pick = <T extends string>(allowed: readonly T[], value: string | null): T | null =>
  allowed.find(item => item === value) ?? null;

const pickMany = <T extends string>(allowed: readonly T[], value: string | null): T[] => {
  if (!value) return [];
  const wanted = new Set(value.split(','));
  return allowed.filter(item => wanted.has(item));
};

const parseWhole = (value: string | null): number | null => {
  if (value === null || !/^\d{1,9}$/.test(value)) return null;
  return Number(value);
};

const parseRooms = (value: string | null): number[] => {
  if (!value) return [];
  const wanted = new Set(
    value
      .split(',')
      .map(part => Number(part))
      .filter(part => Number.isInteger(part) && part >= 1 && part <= maxRoomsFilter),
  );
  return [...wanted].sort((a, b) => a - b);
};

export const parseFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);
  const priceMin = parseWhole(params.get('cena_od'));
  const priceMax = parseWhole(params.get('cena_do'));
  const areaMin = parseWhole(params.get('m2_od'));
  const areaMax = parseWhole(params.get('m2_do'));
  return {
    transaction: pick(transactions, params.get('transakcja')),
    type: pick(types, params.get('typ')),
    districts: pickMany<DistrictId>(districtIds, params.get('dzielnica')),
    rooms: parseRooms(params.get('pokoje')),
    priceMin,
    priceMax: priceMin !== null && priceMax !== null && priceMax < priceMin ? null : priceMax,
    areaMin,
    areaMax: areaMin !== null && areaMax !== null && areaMax < areaMin ? null : areaMax,
    floors: pickMany(floorBands, params.get('pietro')),
    extras: pickMany(extraKeys, params.get('dodatki')),
    sort: pick(sortKeys, params.get('sort')) ?? defaultFilters.sort,
  };
};

export const serializeFilters = (filters: Filters): string => {
  const parts: string[] = [];
  const push = (key: string, value: string | number | null) => {
    if (value === null || value === '') return;
    parts.push(`${key}=${encodeURIComponent(String(value)).replace(/%2C/g, ',')}`);
  };
  push('transakcja', filters.transaction);
  push('typ', filters.type);
  push('dzielnica', filters.districts.join(','));
  push('pokoje', filters.rooms.join(','));
  if (filters.transaction !== null) {
    push('cena_od', filters.priceMin);
    push('cena_do', filters.priceMax);
  }
  push('m2_od', filters.areaMin);
  push('m2_do', filters.areaMax);
  push('pietro', filters.floors.join(','));
  push('dodatki', filters.extras.join(','));
  if (filters.sort !== defaultFilters.sort) push('sort', filters.sort);
  return parts.join('&');
};

export const filtersEqual = (a: Filters, b: Filters): boolean =>
  serializeFilters(a) === serializeFilters(b);
