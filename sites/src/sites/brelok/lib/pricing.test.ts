import { describe, expect, it } from 'vitest';
import { breakfastStatus, clampGuests, clampNights, packageFits, quoteStay } from './pricing';

describe('quoteStay', () => {
  it('multiplies the rate by the nights', () => {
    const quote = quoteStay({
      roomId: 'dziedziniec',
      nights: 1,
      guests: 2,
      packageId: null,
      breakfast: false,
    });
    expect(quote.total).toBe(430);
  });

  it('prices the apartment for three nights', () => {
    const quote = quoteStay({
      roomId: 'apartament',
      nights: 3,
      guests: 2,
      packageId: null,
      breakfast: false,
    });
    expect(quote.total).toBe(2220);
  });

  it('charges breakfast per guest and night', () => {
    const quote = quoteStay({
      roomId: 'cichy',
      nights: 2,
      guests: 2,
      packageId: null,
      breakfast: true,
    });
    expect(quote.total).toBe(410 * 2 + 55 * 2 * 2);
  });

  it('does not charge breakfast twice inside a package that includes it', () => {
    const quote = quoteStay({
      roomId: 'cichy',
      nights: 2,
      guests: 2,
      packageId: 'weekend',
      breakfast: true,
    });
    expect(quote.total).toBe(410 * 2 + 220);
    expect(quote.lines.some(line => line.kind === 'breakfast')).toBe(false);
  });

  it('ignores a package that does not fit the stay', () => {
    const quote = quoteStay({
      roomId: 'cichy',
      nights: 3,
      guests: 2,
      packageId: 'weekend',
      breakfast: false,
    });
    expect(quote.total).toBe(410 * 3);
  });
});

describe('limits', () => {
  it('checks package limits', () => {
    expect(packageFits('weekend', 2, 2)).toBe(true);
    expect(packageFits('weekend', 3, 2)).toBe(false);
    expect(packageFits('week', 5, 3)).toBe(false);
    expect(packageFits('evening', 7, 4)).toBe(true);
  });

  it('clamps nights and guests', () => {
    expect(clampNights(0)).toBe(1);
    expect(clampNights(12)).toBe(7);
    expect(clampGuests(5, 'cichy')).toBe(2);
    expect(clampGuests(0, 'apartament')).toBe(1);
  });
});

describe('breakfastStatus', () => {
  const base = { roomId: 'cichy', nights: 2, guests: 2 } as const;

  it('says included for a package that contains breakfast', () => {
    expect(breakfastStatus({ ...base, packageId: 'weekend', breakfast: true })).toBe('included');
  });

  it('says paid for the evening package with breakfast added', () => {
    expect(breakfastStatus({ ...base, packageId: 'evening', breakfast: true })).toBe('paid');
  });

  it('says paid for breakfast without a package', () => {
    expect(breakfastStatus({ ...base, packageId: null, breakfast: true })).toBe('paid');
  });

  it('says none when breakfast is not chosen and the package has none', () => {
    expect(breakfastStatus({ ...base, packageId: 'evening', breakfast: false })).toBe('none');
  });
});
