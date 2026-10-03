import { describe, expect, it } from 'vitest';
import {
  addLine,
  applyCode,
  cartStorageKey,
  clearCode,
  computeTotals,
  emptyCart,
  lineKey,
  parseStoredCart,
  removeLine,
  resolveLines,
  serializeCart,
  setQuantity,
} from './cart';
import type { CartLine, CartState } from './cart';
import { deliveryCostGr, freeDeliveryMessage, freeDeliveryStatus } from './delivery';
import { discountAmountGr, isValidCode, normalizeCode } from './discount';

const gedeb = (quantity: number, weight: 250 | 500 | 1000 = 250): CartLine => ({
  productId: 'etiopia-gedeb',
  weight,
  grind: 'ziarna',
  quantity,
});

const dripper = (quantity: number): CartLine => ({
  productId: 'dripper-02',
  weight: null,
  grind: null,
  quantity,
});

const cartWith = (...lines: CartLine[]): CartState =>
  lines.reduce<CartState>((state, line) => addLine(state, line), emptyCart);

describe('cart lines', () => {
  it('merges identical lines and keeps different grinds apart', () => {
    const state = cartWith(gedeb(1), gedeb(2), { ...gedeb(1), grind: 'przelew' });
    expect(state.lines).toHaveLength(2);
    expect(state.lines[0].quantity).toBe(3);
    expect(state.lines[1].quantity).toBe(1);
  });

  it('caps a line at twenty items', () => {
    const state = cartWith(gedeb(15), gedeb(15));
    expect(state.lines[0].quantity).toBe(20);
  });

  it('changes and removes lines by key', () => {
    const state = cartWith(gedeb(2), dripper(1));
    const key = lineKey(gedeb(1));
    expect(setQuantity(state, key, 5).lines[0].quantity).toBe(5);
    expect(setQuantity(state, key, 0).lines).toHaveLength(1);
    expect(removeLine(state, lineKey(dripper(1))).lines).toHaveLength(1);
  });

  it('resolves prices per line', () => {
    const resolved = resolveLines(cartWith(gedeb(2, 500), dripper(1)));
    expect(resolved[0].unitPriceGr).toBe(9400);
    expect(resolved[0].totalGr).toBe(18800);
    expect(resolved[0].perKgGr).toBe(18800);
    expect(resolved[1].unitPriceGr).toBe(7900);
    expect(resolved[1].perKgGr).toBeNull();
  });
});

describe('discount code', () => {
  it('accepts the sample code in any case with spaces around it', () => {
    expect(normalizeCode(' trzask10 ')).toBe('TRZASK10');
    expect(isValidCode('trzask10')).toBe(true);
    expect(isValidCode('TRZASK20')).toBe(false);
    expect(isValidCode('')).toBe(false);
  });

  it('takes ten percent off the goods', () => {
    expect(discountAmountGr(9800, 'TRZASK10')).toBe(980);
    expect(discountAmountGr(9800, '')).toBe(0);
    expect(discountAmountGr(9805, 'TRZASK10')).toBe(981);
  });

  it('applies and clears the code on the cart', () => {
    const state = applyCode(cartWith(gedeb(1)), 'trzask10');
    expect(state.code).toBe('TRZASK10');
    expect(applyCode(state, 'nope').code).toBe('TRZASK10');
    expect(clearCode(state).code).toBe('');
    expect(applyCode(cartWith(gedeb(1)), 'nope').code).toBe('');
  });
});

describe('delivery threshold', () => {
  it('reports progress towards free delivery', () => {
    expect(freeDeliveryStatus(4500)).toEqual({ reached: false, remainingGr: 10500, progress: 0.3 });
    expect(freeDeliveryStatus(15000)).toEqual({ reached: true, remainingGr: 0, progress: 1 });
    expect(freeDeliveryStatus(20000).progress).toBe(1);
  });

  it('charges the method price below the threshold and nothing from it', () => {
    expect(deliveryCostGr('paczkomat', 14999)).toBe(1299);
    expect(deliveryCostGr('kurier', 14999)).toBe(1799);
    expect(deliveryCostGr('odbior', 100)).toBe(0);
    expect(deliveryCostGr('kurier', 15000)).toBe(0);
    expect(deliveryCostGr(null, 100)).toBe(0);
  });

  it('writes the progress message', () => {
    expect(freeDeliveryMessage(freeDeliveryStatus(0), 0)).toBe('Dostawa gratis od 150\u00a0zł.');
    expect(freeDeliveryMessage(freeDeliveryStatus(4500), 1)).toBe(
      'Do darmowej dostawy brakuje 105,00\u00a0zł.',
    );
    expect(freeDeliveryMessage(freeDeliveryStatus(15000), 1)).toContain('darmową dostawę');
  });
});

describe('computeTotals', () => {
  it('sums goods without delivery until a method is chosen', () => {
    const totals = computeTotals(cartWith(gedeb(2)));
    expect(totals.itemCount).toBe(2);
    expect(totals.goodsGr).toBe(9800);
    expect(totals.deliveryGr).toBe(0);
    expect(totals.totalGr).toBe(9800);
  });

  it('adds the delivery price below the threshold', () => {
    const totals = computeTotals(cartWith(gedeb(2)), 'paczkomat');
    expect(totals.deliveryGr).toBe(1299);
    expect(totals.totalGr).toBe(11099);
    expect(totals.vatGr).toBe(2075);
  });

  it('applies the discount before the delivery threshold', () => {
    const state = applyCode(cartWith(gedeb(2)), 'TRZASK10');
    const totals = computeTotals(state, 'kurier', 9800);
    expect(totals.discountGr).toBe(980);
    expect(totals.goodsAfterDiscountGr).toBe(8820);
    expect(totals.deliveryGr).toBe(1799);
    expect(totals.totalGr).toBe(10619);
  });

  it('gives free delivery exactly at the threshold', () => {
    const totals = computeTotals(cartWith(gedeb(2)), 'kurier', 9800);
    expect(totals.freeDelivery.reached).toBe(true);
    expect(totals.deliveryGr).toBe(0);
    expect(totals.totalGr).toBe(9800);
  });

  it('does not charge delivery for an empty cart', () => {
    const totals = computeTotals(emptyCart, 'kurier');
    expect(totals.deliveryGr).toBe(0);
    expect(totals.totalGr).toBe(0);
  });

  it('reaches the real threshold with a grinder', () => {
    const totals = computeTotals(cartWith({ ...dripper(1), productId: 'mlynek-reczny' }), 'kurier');
    expect(totals.goodsGr).toBe(25900);
    expect(totals.freeDelivery.reached).toBe(true);
    expect(totals.totalGr).toBe(25900);
  });
});

describe('parseStoredCart', () => {
  it('round-trips a valid cart', () => {
    const state = applyCode(cartWith(gedeb(2), dripper(1)), 'TRZASK10');
    expect(parseStoredCart(serializeCart(state))).toEqual(state);
  });

  it('returns an empty cart for missing or broken data', () => {
    expect(parseStoredCart(null)).toEqual(emptyCart);
    expect(parseStoredCart('{nope')).toEqual(emptyCart);
    expect(parseStoredCart('[]')).toEqual(emptyCart);
    expect(parseStoredCart('{"lines":"x"}')).toEqual(emptyCart);
  });

  it('drops lines that do not match the catalog', () => {
    const raw = JSON.stringify({
      code: 'WRONG',
      lines: [
        { productId: 'nie-ma', weight: 250, grind: 'ziarna', quantity: 1 },
        { productId: 'etiopia-gedeb', weight: 300, grind: 'ziarna', quantity: 1 },
        { productId: 'etiopia-gedeb', weight: 250, grind: 'mielona', quantity: 1 },
        { productId: 'etiopia-gedeb', weight: 250, grind: 'ziarna', quantity: 0 },
        { productId: 'etiopia-gedeb', weight: 250, grind: 'ziarna', quantity: 1.5 },
        { productId: 'etiopia-gedeb', weight: 250, grind: 'ziarna', quantity: 3 },
        { productId: 'dripper-02', weight: 250, grind: 'ziarna', quantity: 99 },
      ],
    });
    const state = parseStoredCart(raw);
    expect(state.code).toBe('');
    expect(state.lines).toEqual([gedeb(3), dripper(20)]);
  });

  it('uses a versioned storage key', () => {
    expect(cartStorageKey).toBe('trzask:cart:v1');
  });
});
