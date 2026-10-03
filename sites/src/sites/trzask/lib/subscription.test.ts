import { describe, expect, it } from 'vitest';
import { defaultSubscription, quoteSubscription } from './subscription';

describe('quoteSubscription', () => {
  it('prices a 250 g parcel from the profile base price', () => {
    const quote = quoteSubscription(defaultSubscription);
    expect(quote.parcelGr).toBe(5200);
    expect(quote.perKgGr).toBe(20800);
    expect(quote.cups).toBe(16);
  });

  it('uses the weight discount for larger bags', () => {
    const quote = quoteSubscription({ profileId: 'filtr', weight: 1000, frequencyId: '4' });
    expect(quote.parcelGr).toBe(19100);
    expect(quote.perKgGr).toBe(19100);
    expect(quote.cups).toBe(66);
  });

  it('spreads the parcels over a month by frequency', () => {
    const everyTwo = quoteSubscription({ profileId: 'uniwersalna', weight: 500, frequencyId: '2' });
    const everyFour = quoteSubscription({
      profileId: 'uniwersalna',
      weight: 500,
      frequencyId: '4',
    });
    expect(everyTwo.parcelGr).toBe(everyFour.parcelGr);
    expect(everyTwo.monthlyGr).toBeGreaterThan(everyFour.monthlyGr);
    expect(everyTwo.gramsPerMonth).toBe(1080);
    expect(everyFour.gramsPerMonth).toBe(540);
    expect(everyTwo.monthlyGr % 100).toBe(0);
  });

  it('falls back to the first profile and frequency for unknown ids', () => {
    const quote = quoteSubscription({
      profileId: 'nie-ma' as never,
      weight: 250,
      frequencyId: '9' as never,
    });
    expect(quote.profile.id).toBe('filtr');
    expect(quote.frequency.id).toBe('2');
  });
});
