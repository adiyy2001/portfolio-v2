import { describe, expect, it } from 'vitest';
import { buildConfirmation, parseConfirmation } from './confirmation';
import type { CartState } from './cart';
import { emptyCheckout } from './validation';
import type { CheckoutValues } from './validation';

const values: CheckoutValues = {
  ...emptyCheckout,
  firstName: ' Anna ',
  lastName: 'Nowak',
  email: 'anna@poczta.example',
  phone: '600700800',
  delivery: 'kurier',
  street: 'Ofiar Oświęcimskich 1',
  postcode: '50-001',
  city: 'Wrocław',
  payment: 'blik',
};

const cartState: CartState = {
  lines: [{ productId: 'etiopia-gedeb', weight: 250, grind: 'przelew', quantity: 2 }],
  code: '',
};

describe('buildConfirmation', () => {
  it('summarises the cart with delivery', () => {
    const data = buildConfirmation(values, cartState);
    expect(data?.firstName).toBe('Anna');
    expect(data?.goodsGr).toBe(9800);
    expect(data?.deliveryGr).toBe(1799);
    expect(data?.totalGr).toBe(11599);
    expect(data?.lines[0]).toMatchObject({ name: 'Etiopia Gedeb', quantity: 2 });
  });

  it('returns null without delivery or payment', () => {
    expect(buildConfirmation({ ...values, delivery: '' }, cartState)).toBeNull();
    expect(buildConfirmation({ ...values, payment: '' }, cartState)).toBeNull();
  });

  it('has free delivery above the threshold', () => {
    const big: CartState = { ...cartState, lines: [{ ...cartState.lines[0], quantity: 4 }] };
    expect(buildConfirmation(values, big)?.deliveryGr).toBe(0);
  });
});

describe('parseConfirmation', () => {
  it('round trips a built confirmation', () => {
    const data = buildConfirmation(values, cartState);
    expect(parseConfirmation(JSON.stringify(data))).toEqual(data);
  });

  it('rejects garbage', () => {
    expect(parseConfirmation(null)).toBeNull();
    expect(parseConfirmation('not json')).toBeNull();
    expect(parseConfirmation('{"lines":[]}')).toBeNull();
    expect(parseConfirmation('{"lines":[{"name":1}]}')).toBeNull();
  });
});
