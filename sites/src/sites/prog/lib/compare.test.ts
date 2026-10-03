import { describe, expect, it } from 'vitest';
import { cards } from '../data/listings';
import { cheapestPerSquareMeter, compareRows } from './compare';

const sale = cards.filter(card => card.transaction === 'sprzedaz' && card.type === 'mieszkanie');
const rent = cards.filter(card => card.transaction === 'wynajem');
const house = cards.find(card => card.type === 'dom' && card.plotArea);

describe('compareRows', () => {
  it('returns one value per card in every row', () => {
    const pair = sale.slice(0, 2);
    for (const row of compareRows(pair)) expect(row.values).toHaveLength(2);
  });

  it('marks price per square meter as not applicable for rentals', () => {
    const rows = compareRows(rent.slice(0, 1));
    const perMeter = rows.find(row => row.label === 'Cena za m²');
    expect(perMeter?.values[0]).toBe('nie dotyczy');
  });

  it('shows the plot only for houses that have one', () => {
    const rows = compareRows([sale[0], house].filter(card => card !== undefined));
    const plot = rows.find(row => row.label === 'Działka');
    expect(plot?.values[0]).toBe('brak');
    expect(plot?.values[1]).not.toBe('brak');
  });
});

describe('compareRows plot row', () => {
  it('is left out when no compared offer has a plot', () => {
    const rows = compareRows(sale.slice(0, 2));
    expect(rows.some(row => row.label === 'Działka')).toBe(false);
  });
});

describe('cheapestPerSquareMeter', () => {
  it('needs at least two sale offers', () => {
    expect(cheapestPerSquareMeter(sale.slice(0, 1))).toBeNull();
    expect(cheapestPerSquareMeter(rent)).toBeNull();
  });

  it('returns the slug with the lowest price per square meter', () => {
    const pair = sale.slice(0, 3);
    const slug = cheapestPerSquareMeter(pair);
    const lowest = Math.min(...pair.map(card => card.price / card.area));
    const winner = pair.find(card => card.slug === slug);
    expect(winner && winner.price / winner.area).toBe(lowest);
  });
});
