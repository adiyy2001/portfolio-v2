import {
  brewLabels,
  brewOrder,
  countryLabels,
  countryOrder,
  processLabels,
  processOrder,
  roastLabels,
  roastOrder,
} from '../data/facets';
import type { BrewMethod, Coffee, CountryId, ProcessId, RoastLevel } from '../data/types';
import { pluralPl } from './plural';

export type SortId = 'polecane' | 'cena-rosnaco' | 'cena-malejaco' | 'nazwa' | 'palenie';

export type FilterGroup = 'roast' | 'brew' | 'country' | 'process';

export interface FilterState {
  roast: RoastLevel[];
  brew: BrewMethod[];
  country: CountryId[];
  process: ProcessId[];
  sort: SortId;
}

export interface FilterGroupDefinition {
  id: FilterGroup;
  label: string;
  param: string;
  options: Array<{ value: string; label: string }>;
}

export const sortParam = 'sortuj';

export const sortOptions: Array<{ id: SortId; label: string }> = [
  { id: 'polecane', label: 'Polecane' },
  { id: 'cena-rosnaco', label: 'Cena od najniższej' },
  { id: 'cena-malejaco', label: 'Cena od najwyższej' },
  { id: 'nazwa', label: 'Nazwa od A do Z' },
  { id: 'palenie', label: 'Palenie od jasnego do ciemnego' },
];

export const filterGroups: FilterGroupDefinition[] = [
  {
    id: 'roast',
    label: 'Palenie',
    param: 'palenie',
    options: roastOrder.map(value => ({ value, label: roastLabels[value] })),
  },
  {
    id: 'brew',
    label: 'Sposób parzenia',
    param: 'parzenie',
    options: brewOrder.map(value => ({ value, label: brewLabels[value] })),
  },
  {
    id: 'country',
    label: 'Kraj',
    param: 'kraj',
    options: countryOrder.map(value => ({ value, label: countryLabels[value] })),
  },
  {
    id: 'process',
    label: 'Obróbka',
    param: 'obrobka',
    options: processOrder.map(value => ({ value, label: processLabels[value] })),
  },
];

export const defaultFilters: FilterState = {
  roast: [],
  brew: [],
  country: [],
  process: [],
  sort: 'polecane',
};

const pick = <T extends string>(raw: string | null, allowed: readonly T[]): T[] => {
  if (!raw) return [];
  const wanted = new Set(raw.split(',').map(part => part.trim()));
  return allowed.filter(value => wanted.has(value));
};

const isSortId = (value: string | null): value is SortId =>
  sortOptions.some(option => option.id === value);

export const parseFilters = (search: string): FilterState => {
  const params = new URLSearchParams(search);
  const sort = params.get(sortParam);
  return {
    roast: pick(params.get('palenie'), roastOrder),
    brew: pick(params.get('parzenie'), brewOrder),
    country: pick(params.get('kraj'), countryOrder),
    process: pick(params.get('obrobka'), processOrder),
    sort: isSortId(sort) ? sort : defaultFilters.sort,
  };
};

export const serializeFilters = (state: FilterState): string => {
  const parts: string[] = [];
  const push = (param: string, values: readonly string[]) => {
    if (values.length > 0) parts.push(`${param}=${values.join(',')}`);
  };
  push('palenie', state.roast);
  push('parzenie', state.brew);
  push('kraj', state.country);
  push('obrobka', state.process);
  if (state.sort !== defaultFilters.sort) parts.push(`${sortParam}=${state.sort}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

export const toggleFilter = (
  state: FilterState,
  group: FilterGroup,
  value: string,
): FilterState => {
  const definition = filterGroups.find(entry => entry.id === group);
  if (!definition || !definition.options.some(option => option.value === value)) return state;
  const current: string[] = state[group];
  const next = current.includes(value)
    ? current.filter(entry => entry !== value)
    : definition.options
        .map(option => option.value)
        .filter(entry => entry === value || current.includes(entry));
  return { ...state, [group]: next };
};

export const clearFilters = (state: FilterState): FilterState => ({
  ...defaultFilters,
  sort: state.sort,
});

export const activeFilterCount = (state: FilterState): number =>
  state.roast.length + state.brew.length + state.country.length + state.process.length;

export const matchesFilters = (coffee: Coffee, state: FilterState): boolean =>
  (state.roast.length === 0 || state.roast.includes(coffee.roast)) &&
  (state.brew.length === 0 || state.brew.some(method => coffee.brew.includes(method))) &&
  (state.country.length === 0 || state.country.includes(coffee.country)) &&
  (state.process.length === 0 || state.process.includes(coffee.process));

const compareBySort = (sort: SortId, a: Coffee, b: Coffee): number => {
  if (sort === 'cena-rosnaco') return a.base250 - b.base250;
  if (sort === 'cena-malejaco') return b.base250 - a.base250;
  if (sort === 'nazwa') return a.name.localeCompare(b.name, 'pl');
  if (sort === 'palenie') return roastOrder.indexOf(a.roast) - roastOrder.indexOf(b.roast);
  return 0;
};

export const visibleCoffees = (all: Coffee[], state: FilterState): Coffee[] =>
  all
    .map((coffee, index) => ({ coffee, index }))
    .filter(entry => matchesFilters(entry.coffee, state))
    .sort((a, b) => compareBySort(state.sort, a.coffee, b.coffee) || a.index - b.index)
    .map(entry => entry.coffee);

export const resultMessage = (shown: number, total: number): string =>
  shown === 0
    ? 'Żadna kawa nie pasuje do wybranych filtrów.'
    : `Pokazano ${shown} ${pluralPl(shown, 'kawę', 'kawy', 'kaw')} z ${total}.`;
