import type { AllergenId } from '../data/allergens';
import { allergenIds } from '../data/allergens';
import type { Diet } from '../data/menu';

export type DietFilter = 'any' | 'vegetarian' | 'vegan';

export interface Filterable {
  diet: Diet;
  allergens: readonly AllergenId[];
}

export interface Filters {
  diet: DietFilter;
  without: ReadonlySet<AllergenId>;
}

export const noFilters = (): Filters => ({ diet: 'any', without: new Set() });

const passesDiet = (diet: Diet, wanted: DietFilter) => {
  if (wanted === 'any') return true;
  if (wanted === 'vegan') return diet === 'vegan';
  return diet === 'vegan' || diet === 'vegetarian';
};

export const matchesFilters = (item: Filterable, filters: Filters) =>
  passesDiet(item.diet, filters.diet) &&
  item.allergens.every(allergen => !filters.without.has(allergen));

export const isFiltering = (filters: Filters) => filters.diet !== 'any' || filters.without.size > 0;

export const countByAllergen = (items: readonly Filterable[]) =>
  Object.fromEntries(
    allergenIds.map(id => [id, items.filter(item => item.allergens.includes(id)).length]),
  ) as Record<AllergenId, number>;

export const parseAllergens = (value: string | undefined): AllergenId[] =>
  (value ?? '')
    .split(/\s+/)
    .filter((token): token is AllergenId => allergenIds.some(id => id === token));

export const parseDiet = (value: string | undefined): Diet =>
  value === 'vegan' || value === 'vegetarian' ? value : 'none';

export const formatCount = (template: string, shown: number, total: number) =>
  template.replace('{shown}', String(shown)).replace('{total}', String(total));

const dietFilters: readonly DietFilter[] = ['any', 'vegetarian', 'vegan'];

export const parseDietFilter = (value: string | null | undefined): DietFilter =>
  dietFilters.find(option => option === value) ?? 'any';

export const filtersFromSearch = (search: string): Filters => {
  const params = new URLSearchParams(search);
  return {
    diet: parseDietFilter(params.get('dieta')),
    without: new Set(parseAllergens(params.get('bez')?.replaceAll(',', ' '))),
  };
};

export const searchFromFilters = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.diet !== 'any') params.set('dieta', filters.diet);
  const without = allergenIds.filter(id => filters.without.has(id));
  if (without.length > 0) params.set('bez', without.join(','));
  const text = params.toString().replaceAll('%2C', ',');
  return text === '' ? '' : `?${text}`;
};
