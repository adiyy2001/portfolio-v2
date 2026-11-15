import type { District, Offer } from '../data/offers';
import { pricePerM2 } from './format';

export type SortKey = 'number' | 'price-asc' | 'price-desc' | 'area-desc' | 'm2-asc';

export interface OfferFilters {
  rooms: number;
  district: District | '';
  budget: number;
}

export const emptyFilters: OfferFilters = { rooms: 0, district: '', budget: 0 };

export const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: 'number', label: 'numeru' },
  { key: 'price-asc', label: 'najtańsze' },
  { key: 'price-desc', label: 'najdroższe' },
  { key: 'area-desc', label: 'największe' },
  { key: 'm2-asc', label: 'cena za m²' },
];

export const roomOptions = [1, 2, 3, 4];
export const budgetOptions = [450000, 600000, 800000];
export const districtOptions: District[] = ['Psie Pole', 'Leśnica', 'Karłowice', 'Dąbie'];

export const matchesFilters = (offer: Offer, filters: OfferFilters): boolean =>
  (filters.rooms === 0 || offer.rooms === filters.rooms) &&
  (filters.district === '' || offer.district === filters.district) &&
  (filters.budget === 0 || offer.priceZl <= filters.budget);

const comparators: Record<SortKey, (a: Offer, b: Offer) => number> = {
  number: (a, b) => a.number.localeCompare(b.number),
  'price-asc': (a, b) => a.priceZl - b.priceZl,
  'price-desc': (a, b) => b.priceZl - a.priceZl,
  'area-desc': (a, b) => b.areaM2 - a.areaM2,
  'm2-asc': (a, b) => pricePerM2(a) - pricePerM2(b),
};

export const applyFilters = (
  offers: readonly Offer[],
  filters: OfferFilters,
  sort: SortKey = 'number',
): Offer[] =>
  offers
    .filter(offer => matchesFilters(offer, filters))
    .sort((a, b) => comparators[sort](a, b) || a.number.localeCompare(b.number));
