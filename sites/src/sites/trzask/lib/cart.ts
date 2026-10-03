import { getProduct } from '../data/catalog';
import { grindOrder, weights } from '../data/facets';
import { freeDeliveryFromGr, maxLineQuantity, vatRatePercent } from '../data/site';
import type { DeliveryId } from '../data/site';
import type { GrindId, Product, WeightGrams } from '../data/types';
import { discountAmountGr, isValidCode, normalizeCode } from './discount';
import { deliveryCostGr, freeDeliveryStatus } from './delivery';
import type { FreeDeliveryStatus } from './delivery';
import { vatIncluded } from './money';
import { productPriceGr, unitPricePerKgGr } from './pricing';

export interface CartLine {
  productId: string;
  weight: WeightGrams | null;
  grind: GrindId | null;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  code: string;
}

export interface ResolvedLine {
  key: string;
  line: CartLine;
  product: Product;
  unitPriceGr: number;
  totalGr: number;
  perKgGr: number | null;
}

export interface Totals {
  itemCount: number;
  goodsGr: number;
  discountGr: number;
  goodsAfterDiscountGr: number;
  deliveryGr: number;
  totalGr: number;
  vatGr: number;
  freeDelivery: FreeDeliveryStatus;
}

export const cartStorageKey = 'trzask:cart:v1';

export const emptyCart: CartState = { lines: [], code: '' };

export const lineKey = (line: Pick<CartLine, 'productId' | 'weight' | 'grind'>): string =>
  `${line.productId}:${line.weight ?? 'x'}:${line.grind ?? 'x'}`;

export const clampQuantity = (quantity: number): number =>
  Math.min(maxLineQuantity, Math.max(1, Math.floor(quantity)));

export const addLine = (state: CartState, line: CartLine): CartState => {
  const key = lineKey(line);
  const exists = state.lines.some(entry => lineKey(entry) === key);
  if (!exists) {
    return {
      ...state,
      lines: [...state.lines, { ...line, quantity: clampQuantity(line.quantity) }],
    };
  }
  return {
    ...state,
    lines: state.lines.map(entry =>
      lineKey(entry) === key
        ? { ...entry, quantity: clampQuantity(entry.quantity + line.quantity) }
        : entry,
    ),
  };
};

export const removeLine = (state: CartState, key: string): CartState => ({
  ...state,
  lines: state.lines.filter(entry => lineKey(entry) !== key),
});

export const setQuantity = (state: CartState, key: string, quantity: number): CartState => {
  if (quantity < 1) return removeLine(state, key);
  return {
    ...state,
    lines: state.lines.map(entry =>
      lineKey(entry) === key ? { ...entry, quantity: clampQuantity(quantity) } : entry,
    ),
  };
};

export const applyCode = (state: CartState, input: string): CartState =>
  isValidCode(input) ? { ...state, code: normalizeCode(input) } : state;

export const clearCode = (state: CartState): CartState => ({ ...state, code: '' });

export const resolveLines = (state: CartState): ResolvedLine[] =>
  state.lines.flatMap(line => {
    const product = getProduct(line.productId);
    if (!product) return [];
    const unitPriceGr = productPriceGr(product, line.weight);
    const perKgGr =
      product.kind === 'coffee' && line.weight ? unitPricePerKgGr(unitPriceGr, line.weight) : null;
    return [
      {
        key: lineKey(line),
        line,
        product,
        unitPriceGr,
        totalGr: unitPriceGr * line.quantity,
        perKgGr,
      },
    ];
  });

export const computeTotals = (
  state: CartState,
  deliveryId: DeliveryId | null = null,
  thresholdGr: number = freeDeliveryFromGr,
): Totals => {
  const resolved = resolveLines(state);
  const itemCount = resolved.reduce((sum, entry) => sum + entry.line.quantity, 0);
  const goodsGr = resolved.reduce((sum, entry) => sum + entry.totalGr, 0);
  const discountGr = discountAmountGr(goodsGr, state.code);
  const goodsAfterDiscountGr = goodsGr - discountGr;
  const freeDelivery = freeDeliveryStatus(goodsAfterDiscountGr, thresholdGr);
  const deliveryGr =
    itemCount === 0 ? 0 : deliveryCostGr(deliveryId, goodsAfterDiscountGr, thresholdGr);
  const totalGr = goodsAfterDiscountGr + deliveryGr;
  return {
    itemCount,
    goodsGr,
    discountGr,
    goodsAfterDiscountGr,
    deliveryGr,
    totalGr,
    vatGr: vatIncluded(totalGr, vatRatePercent),
    freeDelivery,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isWeight = (value: unknown): value is WeightGrams => weights.some(weight => weight === value);

const isGrind = (value: unknown): value is GrindId => grindOrder.some(grind => grind === value);

const parseLine = (entry: unknown): CartLine | null => {
  if (!isRecord(entry) || typeof entry.productId !== 'string') return null;
  const product = getProduct(entry.productId);
  if (!product) return null;
  const quantity = entry.quantity;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) return null;
  if (product.kind === 'accessory') {
    return { productId: product.id, weight: null, grind: null, quantity: clampQuantity(quantity) };
  }
  if (!isWeight(entry.weight) || !isGrind(entry.grind)) return null;
  return {
    productId: product.id,
    weight: entry.weight,
    grind: entry.grind,
    quantity: clampQuantity(quantity),
  };
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
  const code =
    typeof data.code === 'string' && isValidCode(data.code) ? normalizeCode(data.code) : '';
  return data.lines.reduce<CartState>(
    (state, entry) => {
      const line = parseLine(entry);
      return line ? addLine(state, line) : state;
    },
    { lines: [], code },
  );
};

export const serializeCart = (state: CartState): string => JSON.stringify(state);
