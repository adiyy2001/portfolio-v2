import { coffeePriceGr, getCoffee } from '../data/catalog';
import { grindOrder } from '../data/facets';
import { numbers } from '../data/site';
import type { Coffee, GrindId } from '../data/types';
import { perKgGr } from './pricing';

export interface CartLine {
  coffeeId: string;
  grind: GrindId;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
}

export interface ResolvedLine {
  key: string;
  line: CartLine;
  coffee: Coffee;
  unitPriceGr: number;
  totalGr: number;
  perKgGr: number;
}

export interface Totals {
  itemCount: number;
  totalGr: number;
}

export const cartStorageKey = 'ziarnik:cart:v1';

export const emptyCart: CartState = { lines: [] };

export const lineKey = (line: Pick<CartLine, 'coffeeId' | 'grind'>): string =>
  `${line.coffeeId}:${line.grind}`;

export const clampQuantity = (quantity: number): number =>
  Math.min(numbers.maxLineQuantity, Math.max(1, Math.floor(quantity)));

export const addLine = (state: CartState, line: CartLine): CartState => {
  const key = lineKey(line);
  const exists = state.lines.some(entry => lineKey(entry) === key);
  if (!exists) {
    return { lines: [...state.lines, { ...line, quantity: clampQuantity(line.quantity) }] };
  }
  return {
    lines: state.lines.map(entry =>
      lineKey(entry) === key
        ? { ...entry, quantity: clampQuantity(entry.quantity + line.quantity) }
        : entry,
    ),
  };
};

export const removeLine = (state: CartState, key: string): CartState => ({
  lines: state.lines.filter(entry => lineKey(entry) !== key),
});

export const setQuantity = (state: CartState, key: string, quantity: number): CartState => {
  if (quantity < 1) return removeLine(state, key);
  return {
    lines: state.lines.map(entry =>
      lineKey(entry) === key ? { ...entry, quantity: clampQuantity(quantity) } : entry,
    ),
  };
};

export const resolveLines = (state: CartState): ResolvedLine[] =>
  state.lines.flatMap(line => {
    const coffee = getCoffee(line.coffeeId);
    if (!coffee) return [];
    const unitPriceGr = coffeePriceGr(coffee);
    return [
      {
        key: lineKey(line),
        line,
        coffee,
        unitPriceGr,
        totalGr: unitPriceGr * line.quantity,
        perKgGr: perKgGr(unitPriceGr),
      },
    ];
  });

export const computeTotals = (state: CartState): Totals => {
  const resolved = resolveLines(state);
  return {
    itemCount: resolved.reduce((sum, entry) => sum + entry.line.quantity, 0),
    totalGr: resolved.reduce((sum, entry) => sum + entry.totalGr, 0),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGrind = (value: unknown): value is GrindId => grindOrder.some(grind => grind === value);

const parseLine = (entry: unknown): CartLine | null => {
  if (!isRecord(entry) || typeof entry.coffeeId !== 'string') return null;
  const coffee = getCoffee(entry.coffeeId);
  if (!coffee || !isGrind(entry.grind)) return null;
  const quantity = entry.quantity;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) return null;
  return { coffeeId: coffee.id, grind: entry.grind, quantity: clampQuantity(quantity) };
};

export const parseStoredCart = (raw: string | null): CartState => {
  if (!raw) return emptyCart;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return emptyCart;
  }
  if (!isRecord(data) || !Array.isArray(data.lines)) return emptyCart;
  return data.lines.reduce<CartState>((state, entry) => {
    const line = parseLine(entry);
    return line ? addLine(state, line) : state;
  }, emptyCart);
};

export const serializeCart = (state: CartState): string => JSON.stringify(state);
