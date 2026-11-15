import { describe, expect, it } from 'vitest';
import {
  clampBags,
  quoteSubscription,
  subscriptionBagPriceGr,
  subscriptionCoffeeLabel,
} from './subscription';

describe('quoteSubscription', () => {
  it('prices the subscription per bag and per week', () => {
    expect(subscriptionBagPriceGr).toBe(4400);
    expect(quoteSubscription(1)).toEqual({
      bags: 1,
      bagPriceGr: 4400,
      weeklyGr: 4400,
      gramsPerWeek: 250,
      cupsPerWeek: 16,
      perKgGr: 17600,
    });
    expect(quoteSubscription(3).weeklyGr).toBe(13200);
  });

  it('clamps the number of bags', () => {
    expect(clampBags(0)).toBe(1);
    expect(clampBags(9)).toBe(3);
  });

  it('names the coffee choice', () => {
    expect(subscriptionCoffeeLabel('kolumbia-huila')).toBe('Kolumbia Huila');
    expect(subscriptionCoffeeLabel('dobor')).toContain('stopień 6');
  });
});
