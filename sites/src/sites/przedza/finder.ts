import { flatKey, flatsLabel, pluralPl } from './flats';
import type { Flat, Floor, Rooms } from './types';

export type SortKey =
  'numer' | 'cena-rosnaco' | 'cena-malejaco' | 'powierzchnia-rosnaco' | 'powierzchnia-malejaco';

export interface FinderState {
  rooms: Rooms[];
  floors: Floor[];
  onlyAvailable: boolean;
  sort: SortKey;
}

export const sortOptions: readonly { key: SortKey; label: string }[] = [
  { key: 'numer', label: 'Numer mieszkania' },
  { key: 'cena-rosnaco', label: 'Cena, od najniższej' },
  { key: 'cena-malejaco', label: 'Cena, od najwyższej' },
  { key: 'powierzchnia-rosnaco', label: 'Powierzchnia, od najmniejszej' },
  { key: 'powierzchnia-malejaco', label: 'Powierzchnia, od największej' },
];

export const defaultState: FinderState = {
  rooms: [],
  floors: [],
  onlyAvailable: false,
  sort: 'numer',
};

const roomValues: readonly Rooms[] = [2, 3, 4];
const floorValues: readonly Floor[] = [0, 1, 2, 3, 4];

const parseList = <T extends number>(raw: string | null, allowed: readonly T[]) => {
  if (!raw) return [];
  const found = raw
    .split(',')
    .map(part => Number(part))
    .filter((value): value is T => allowed.some(item => item === value));
  return allowed.filter(item => found.includes(item));
};

export const parseQuery = (search: string): FinderState => {
  const params = new URLSearchParams(search);
  const sort = params.get('sortuj');
  return {
    rooms: parseList(params.get('pokoje'), roomValues),
    floors: parseList(params.get('pietro'), floorValues),
    onlyAvailable: params.get('wolne') === '1',
    sort: sortOptions.find(option => option.key === sort)?.key ?? defaultState.sort,
  };
};

export const toQuery = (state: FinderState) => {
  const parts: string[] = [];
  if (state.rooms.length > 0) parts.push(`pokoje=${[...state.rooms].sort().join(',')}`);
  if (state.floors.length > 0) parts.push(`pietro=${[...state.floors].sort().join(',')}`);
  if (state.onlyAvailable) parts.push('wolne=1');
  if (state.sort !== defaultState.sort) parts.push(`sortuj=${state.sort}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

export const hasFilters = (state: FinderState) =>
  state.rooms.length > 0 || state.floors.length > 0 || state.onlyAvailable;

export const toggleValue = <T>(list: readonly T[], value: T) =>
  list.includes(value) ? list.filter(item => item !== value) : [...list, value];

export const matchesFilters = (flat: Flat, state: FinderState) =>
  (state.rooms.length === 0 || state.rooms.includes(flat.rooms)) &&
  (state.floors.length === 0 || state.floors.includes(flat.floor)) &&
  (!state.onlyAvailable || flat.status === 'available');

const compare: Record<SortKey, (a: Flat, b: Flat) => number> = {
  numer: (a, b) => flatKey(a) - flatKey(b),
  'cena-rosnaco': (a, b) => a.price - b.price,
  'cena-malejaco': (a, b) => b.price - a.price,
  'powierzchnia-rosnaco': (a, b) => a.area - b.area,
  'powierzchnia-malejaco': (a, b) => b.area - a.area,
};

export const filterAndSort = (list: readonly Flat[], state: FinderState) =>
  list
    .filter(flat => matchesFilters(flat, state))
    .sort((a, b) => compare[state.sort](a, b) || flatKey(a) - flatKey(b));

export const resultText = (count: number, total: number) => {
  if (count === 0) return 'Żadne mieszkanie nie pasuje do tych filtrów.';
  const verb = pluralPl(count, 'Pasuje', 'Pasują', 'Pasuje');
  return `${verb} ${flatsLabel(count)} z ${total}.`;
};
