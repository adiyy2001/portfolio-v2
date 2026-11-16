import { describe, expect, it } from 'vitest';
import {
  addLine,
  clampQuantity,
  computeTotals,
  emptyCart,
  lineKey,
  parseStoredCart,
  removeLine,
  resolveLines,
  serializeCart,
  setQuantity,
} from './cart';
import type { CartLine } from './cart';

const gedeb: CartLine = { coffeeId: 'etiopia-gedeb', grind: 'przelew', quantity: 1 };
const huila: CartLine = { coffeeId: 'kolumbia-huila', grind: 'ziarna', quantity: 2 };

describe('cart lines', () => {
  it('merges the same coffee and grind and keeps others apart', () => {
    const state = addLine(addLine(addLine(emptyCart, gedeb), gedeb), {
      ...gedeb,
      grind: 'prasa',
    });
    expect(state.lines).toHaveLength(2);
    expect(state.lines[0].quantity).toBe(2);
  });

  it('clamps quantities to the allowed range', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(99)).toBe(10);
    expect(addLine(emptyCart, { ...gedeb, quantity: 50 }).lines[0].quantity).toBe(10);
  });

  it('sets and removes quantities', () => {
    const state = addLine(emptyCart, gedeb);
    const key = lineKey(gedeb);
    expect(setQuantity(state, key, 4).lines[0].quantity).toBe(4);
    expect(setQuantity(state, key, 0).lines).toEqual([]);
    expect(removeLine(state, key).lines).toEqual([]);
  });
});

describe('cart totals', () => {
  it('prices lines by roast degree', () => {
    const state = addLine(addLine(emptyCart, gedeb), huila);
    const resolved = resolveLines(state);
    expect(resolved.map(entry => entry.unitPriceGr)).toEqual([5200, 4400]);
    expect(resolved.map(entry => entry.perKgGr)).toEqual([20800, 17600]);
    expect(computeTotals(state)).toEqual({ itemCount: 3, totalGr: 5200 + 2 * 4400 });
  });

  it('is empty for an empty cart', () => {
    expect(computeTotals(emptyCart)).toEqual({ itemCount: 0, totalGr: 0 });
  });
});

describe('stored cart', () => {
  it('round trips through serialisation', () => {
    const state = addLine(addLine(emptyCart, gedeb), huila);
    expect(parseStoredCart(serializeCart(state))).toEqual(state);
  });

  it('drops broken, unknown and tampered entries', () => {
    expect(parseStoredCart(null)).toEqual(emptyCart);
    expect(parseStoredCart('nie json')).toEqual(emptyCart);
    expect(parseStoredCart('{"lines":"x"}')).toEqual(emptyCart);
    const raw = JSON.stringify({
      lines: [
        { coffeeId: 'nie-ma', grind: 'ziarna', quantity: 1 },
        { coffeeId: 'etiopia-gedeb', grind: 'zly', quantity: 1 },
        { coffeeId: 'etiopia-gedeb', grind: 'ziarna', quantity: 1.5 },
        { coffeeId: 'etiopia-gedeb', grind: 'ziarna', quantity: 99 },
      ],
    });
    expect(parseStoredCart(raw).lines).toEqual([
      { coffeeId: 'etiopia-gedeb', grind: 'ziarna', quantity: 10 },
    ]);
  });
});
