import type { Lang } from '../i18n/lang';

export type RoomTypeId = 'podworzowy' | 'klasyczny' | 'nadrzeczny' | 'rodzinny' | 'poddasze';

export interface RoomType {
  id: RoomTypeId;
  slug: Record<Lang, string>;
  size: number;
  capacity: number;
  basePrice: number;
}

export const roomTypes: readonly RoomType[] = [
  {
    id: 'podworzowy',
    slug: { pl: 'podworzowy', en: 'courtyard' },
    size: 17,
    capacity: 2,
    basePrice: 340,
  },
  {
    id: 'klasyczny',
    slug: { pl: 'klasyczny', en: 'classic' },
    size: 21,
    capacity: 2,
    basePrice: 420,
  },
  {
    id: 'nadrzeczny',
    slug: { pl: 'z-widokiem-na-odre', en: 'river-view' },
    size: 25,
    capacity: 2,
    basePrice: 520,
  },
  {
    id: 'rodzinny',
    slug: { pl: 'rodzinny', en: 'family' },
    size: 36,
    capacity: 4,
    basePrice: 640,
  },
  {
    id: 'poddasze',
    slug: { pl: 'poddasze', en: 'attic' },
    size: 46,
    capacity: 3,
    basePrice: 780,
  },
];

export interface Room {
  number: number;
  floor: number;
  type: RoomTypeId;
}

export const rooms: readonly Room[] = [
  { number: 101, floor: 1, type: 'nadrzeczny' },
  { number: 102, floor: 1, type: 'nadrzeczny' },
  { number: 103, floor: 1, type: 'klasyczny' },
  { number: 104, floor: 1, type: 'klasyczny' },
  { number: 105, floor: 1, type: 'podworzowy' },
  { number: 106, floor: 1, type: 'podworzowy' },
  { number: 201, floor: 2, type: 'nadrzeczny' },
  { number: 202, floor: 2, type: 'nadrzeczny' },
  { number: 203, floor: 2, type: 'rodzinny' },
  { number: 204, floor: 2, type: 'klasyczny' },
  { number: 205, floor: 2, type: 'podworzowy' },
  { number: 206, floor: 2, type: 'podworzowy' },
  { number: 301, floor: 3, type: 'nadrzeczny' },
  { number: 302, floor: 3, type: 'rodzinny' },
  { number: 303, floor: 3, type: 'klasyczny' },
  { number: 304, floor: 3, type: 'klasyczny' },
  { number: 305, floor: 3, type: 'podworzowy' },
  { number: 306, floor: 3, type: 'podworzowy' },
  { number: 401, floor: 4, type: 'poddasze' },
  { number: 402, floor: 4, type: 'poddasze' },
  { number: 403, floor: 4, type: 'poddasze' },
  { number: 404, floor: 4, type: 'rodzinny' },
  { number: 405, floor: 4, type: 'klasyczny' },
  { number: 406, floor: 4, type: 'podworzowy' },
];

export const isRoomTypeId = (value: unknown): value is RoomTypeId =>
  typeof value === 'string' && roomTypes.some(type => type.id === value);

export const roomTypeById = (id: RoomTypeId): RoomType => {
  const found = roomTypes.find(type => type.id === id);
  if (!found) throw new Error(`Unknown room type ${id}`);
  return found;
};

export const roomsOfType = (id: RoomTypeId): Room[] => rooms.filter(room => room.type === id);

export const maxCapacity = Math.max(...roomTypes.map(type => type.capacity));

export const cheapestBasePrice = Math.min(...roomTypes.map(type => type.basePrice));
