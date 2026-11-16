import { type FloorKey, type Status, type Unit, typeByKey } from './data';

export interface Filters {
  rooms: string[];
  floor: string[];
  status: string[];
}

export const emptyFilters = (): Filters => ({ rooms: [], floor: [], status: [] });

const keys = ['rooms', 'floor', 'status'] as const;

export const parseFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);
  const read = (name: string) => (params.get(name) ?? '').split(',').filter(Boolean);
  return { rooms: read('pokoje'), floor: read('pietro'), status: read('status') };
};

export const toQuery = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.rooms.length) params.set('pokoje', filters.rooms.join(','));
  if (filters.floor.length) params.set('pietro', filters.floor.join(','));
  if (filters.status.length) params.set('status', filters.status.join(','));
  const text = params.toString().replace(/%2C/g, ',');
  return text ? `?${text}` : '';
};

export interface Row {
  rooms: string;
  floor: string;
  status: string;
}

export const rowOf = (unit: Unit): Row => {
  const type = typeByKey(unit.type);
  return {
    rooms: String(type.rooms),
    floor: type.floorKey satisfies FloorKey,
    status: unit.status satisfies Status,
  };
};

export const matches = (row: Row, filters: Filters) =>
  keys.every(key => filters[key].length === 0 || filters[key].includes(row[key]));

export const countMatching = (rows: Row[], filters: Filters) =>
  rows.filter(row => matches(row, filters)).length;
