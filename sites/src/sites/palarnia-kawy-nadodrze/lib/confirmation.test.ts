import { describe, expect, it } from 'vitest';
import { addLine, emptyCart } from './cart';
import { buildConfirmation, makeReference, parseConfirmation } from './confirmation';
import type { CheckoutValues } from './validation';

const values: CheckoutValues = {
  name: ' Anna Nowak ',
  phone: '600 700 800',
  email: 'anna@poczta.example',
  pickupDay: '2026-11-16',
  pickupWindow: '8:00 do 11:00',
  note: '',
};

const cart = addLine(emptyCart, { coffeeId: 'etiopia-gedeb', grind: 'przelew', quantity: 2 });

describe('makeReference', () => {
  it('builds a four digit reference from injected randomness', () => {
    expect(makeReference(() => 0)).toBe('PK-1000');
    expect(makeReference(() => 0.999999)).toBe('PK-9999');
  });
});

describe('confirmation', () => {
  it('builds a summary from the cart', () => {
    const data = buildConfirmation(values, cart, 'poniedziałek 16.11', 'PK-4821');
    expect(data?.name).toBe('Anna Nowak');
    expect(data?.totalGr).toBe(10400);
    expect(data?.lines).toEqual([
      { name: 'Etiopia Gedeb', grind: 'Przelew, jak sól morska', quantity: 2, totalGr: 10400 },
    ]);
  });

  it('refuses an empty cart', () => {
    expect(buildConfirmation(values, emptyCart, 'x', 'PK-1000')).toBeNull();
  });

  it('round trips and rejects broken storage', () => {
    const data = buildConfirmation(values, cart, 'poniedziałek 16.11', 'PK-4821');
    expect(parseConfirmation(JSON.stringify(data))).toEqual(data);
    expect(parseConfirmation(null)).toBeNull();
    expect(parseConfirmation('{')).toBeNull();
    expect(parseConfirmation('{"lines":[]}')).toBeNull();
    expect(parseConfirmation(JSON.stringify({ ...data, lines: [] }))).toBeNull();
    expect(parseConfirmation(JSON.stringify({ ...data, totalGr: 'x' }))).toBeNull();
  });
});
