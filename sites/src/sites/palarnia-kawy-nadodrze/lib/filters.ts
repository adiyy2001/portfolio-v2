import {
  brewLabels,
  brewOrder,
  countryLabels,
  countryOrder,
  degreeLabels,
  degreeOrder,
} from '../data/facets';
import { coffeePriceZl } from '../data/catalog';
import type { BrewMethod, Coffee, CountryId, Degree } from '../data/types';
import { pluralPl } from './plural';

export type SortId = 'polecane' | 'cena-rosnaco' | 'cena-malejaco' | 'nazwa' | 'palenie';

export type FilterGroup = 'degree' | 'brew' | 'country';

export interface FilterState {
  degree: Degree[];
  brew: BrewMethod[];
  country: CountryId[];
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
    id: 'degree',
    label: 'Stopień palenia',
    param: 'stopien',
    options: degreeOrder.map(value => ({ value: String(value), label: degreeLabels[value] })),
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
];

export const defaultFilters: FilterState = {
  degree: [],
  brew: [],
  country: [],
  sort: 'polecane',
};

const pick = <T extends string | number>(raw: string | null, allowed: readonly T[]): T[] => {
  if (!raw) return [];
  const wanted = new Set(raw.split(',').map(part => part.trim()));
  return allowed.filter(value => wanted.has(String(value)));
};

const isSortId = (value: string | null): value is SortId =>
  sortOptions.some(option => option.id === value);

export const parseFilters = (search: string): FilterState => {
  const params = new URLSearchParams(search);
  const sort = params.get(sortParam);
  return {
    degree: pick(params.get('stopien'), degreeOrder),
    brew: pick(params.get('parzenie'), brewOrder),
    country: pick(params.get('kraj'), countryOrder),
    sort: isSortId(sort) ? sort : defaultFilters.sort,
  };
};

export const serializeFilters = (state: FilterState): string => {
  const parts: string[] = [];
  const push = (param: string, values: readonly (string | number)[]) => {
    if (values.length > 0) parts.push(`${param}=${values.join(',')}`);
  };
  push('stopien', state.degree);
  push('parzenie', state.brew);
  push('kraj', state.country);
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
  const current = state[group].map(String);
  const next = current.includes(value)
    ? current.filter(entry => entry !== value)
    : definition.options
        .map(option => option.value)
        .filter(entry => entry === value || current.includes(entry));
  const typed = group === 'degree' ? next.map(Number) : next;
  return { ...state, [group]: typed };
};

export const clearFilters = (state: FilterState): FilterState => ({
  ...defaultFilters,
  sort: state.sort,
});

export const activeFilterCount = (state: FilterState): number =>
  state.degree.length + state.brew.length + state.country.length;

export const matchesFilters = (coffee: Coffee, state: FilterState): boolean =>
  (state.degree.length === 0 || state.degree.includes(coffee.degree)) &&
  (state.brew.length === 0 || state.brew.some(method => coffee.brew.includes(method))) &&
  (state.country.length === 0 || state.country.includes(coffee.country));

const compareBySort = (sort: SortId, a: Coffee, b: Coffee): number => {
  if (sort === 'cena-rosnaco') return coffeePriceZl(a) - coffeePriceZl(b);
  if (sort === 'cena-malejaco') return coffeePriceZl(b) - coffeePriceZl(a);
  if (sort === 'nazwa') return a.name.localeCompare(b.name, 'pl');
  if (sort === 'palenie') return a.degree - b.degree;
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
