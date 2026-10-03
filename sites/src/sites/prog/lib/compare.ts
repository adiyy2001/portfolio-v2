import type { ListingCard } from '../data/types';
import {
  floorLabel,
  formatArea,
  formatDecimal,
  formatMonthlyPrice,
  formatPrice,
  roomsLabel,
} from './format';
import { pricePerSquareMeter } from './price';

export interface CompareRow {
  label: string;
  values: string[];
}

const priceCell = (card: ListingCard): string =>
  card.transaction === 'sprzedaz' ? formatPrice(card.price) : formatMonthlyPrice(card.price);

const perSquareMeterCell = (card: ListingCard): string =>
  card.transaction === 'sprzedaz'
    ? `${formatDecimal(pricePerSquareMeter(card.price, card.area), 0)} zł`
    : 'nie dotyczy';

export const compareRows = (cards: readonly ListingCard[]): CompareRow[] => {
  const rows: CompareRow[] = [
    { label: 'Cena lub czynsz', values: cards.map(priceCell) },
    { label: 'Cena za m²', values: cards.map(perSquareMeterCell) },
    { label: 'Powierzchnia', values: cards.map(card => formatArea(card.area)) },
    { label: 'Pokoje', values: cards.map(card => roomsLabel(card.rooms)) },
    {
      label: 'Piętro',
      values: cards.map(card => (card.type === 'dom' ? 'dom' : floorLabel(card.floor))),
    },
  ];
  if (cards.some(card => card.plotArea)) {
    rows.push({
      label: 'Działka',
      values: cards.map(card => (card.plotArea ? formatArea(card.plotArea) : 'brak')),
    });
  }
  return rows;
};

export const cheapestPerSquareMeter = (cards: readonly ListingCard[]): string | null => {
  const sales = cards.filter(card => card.transaction === 'sprzedaz');
  if (sales.length < 2) return null;
  const best = sales.reduce((low, card) =>
    pricePerSquareMeter(card.price, card.area) < pricePerSquareMeter(low.price, low.area)
      ? card
      : low,
  );
  return best.slug;
};
