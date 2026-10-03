import { flats } from './data';
import type { Flat, Rooms, Status } from './types';

const nbsp = String.fromCharCode(0xa0);

export const pluralPl = (count: number, one: string, few: string, many: string) => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
};

export const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);

export const formatPrice = (value: number) => `${formatNumber(value)}${nbsp}zł`;

export const formatArea = (value: number) => `${value.toFixed(1).replace('.', ',')}${nbsp}m²`;

export const pricePerM2 = (flat: Flat) => Math.round(flat.price / flat.area);

export const formatPricePerM2 = (flat: Flat) => `${formatNumber(pricePerM2(flat))}${nbsp}zł/m²`;

export const roomsLabel = (rooms: number) =>
  `${rooms} ${pluralPl(rooms, 'pokój', 'pokoje', 'pokoi')}`;

export const flatsLabel = (count: number) =>
  `${count} ${pluralPl(count, 'mieszkanie', 'mieszkania', 'mieszkań')}`;

export const statusLabel: Record<Status, string> = {
  available: 'Wolne',
  reserved: 'Zarezerwowane',
  sold: 'Sprzedane',
};

const twoDigits = (value: number) => value.toString().padStart(2, '0');

export const flatCode = (flat: Flat) => `M ${flat.floor}.${twoDigits(flat.column)}`;

export const flatSlug = (flat: Flat) => `${flat.floor}-${twoDigits(flat.column)}`;

export const flatPath = (flat: Flat) => `/przedza/mieszkania/${flatSlug(flat)}/`;

export const findFlat = (slug: string) => flats.find(flat => flatSlug(flat) === slug);

export const flatKey = (flat: Flat) => flat.floor * 100 + flat.column;

export const neighbours = (flat: Flat) => {
  const index = flats.indexOf(flat);
  return { previous: flats[index - 1], next: flats[index + 1] };
};

export const similarFlats = (flat: Flat, limit = 3) =>
  flats
    .filter(other => other !== flat && other.status === 'available')
    .map(other => ({
      other,
      distance: Math.abs(other.area - flat.area) + (other.rooms === flat.rooms ? 0 : 1000),
    }))
    .sort((a, b) => a.distance - b.distance || flatKey(a.other) - flatKey(b.other))
    .slice(0, limit)
    .map(item => item.other);

export interface RoomsSummary {
  rooms: Rooms;
  total: number;
  available: number;
  minArea: number;
  maxArea: number;
  priceFrom: number | undefined;
}

export const summaryByRooms = (list: readonly Flat[]): RoomsSummary[] =>
  ([2, 3, 4] as const).map(rooms => {
    const group = list.filter(flat => flat.rooms === rooms);
    const open = group.filter(flat => flat.status === 'available');
    return {
      rooms,
      total: group.length,
      available: open.length,
      minArea: Math.min(...group.map(flat => flat.area)),
      maxArea: Math.max(...group.map(flat => flat.area)),
      priceFrom: open.length > 0 ? Math.min(...open.map(flat => flat.price)) : undefined,
    };
  });

export const countByStatus = (list: readonly Flat[]): Record<Status, number> => ({
  available: list.filter(flat => flat.status === 'available').length,
  reserved: list.filter(flat => flat.status === 'reserved').length,
  sold: list.filter(flat => flat.status === 'sold').length,
});
