import { describe, expect, it } from 'vitest';
import { dayFromParts } from './dates';
import {
  averageNightPrice,
  clampExtraCount,
  isWeekendNight,
  longStayPercent,
  nightPrice,
  quoteStay,
  rateNightPrice,
  seasonOf,
  weekendPackageApplies,
} from './pricing';
import type { StayRequest } from './pricing';

const day = (year: number, month: number, date: number) => dayFromParts(year, month, date);

const request = (overrides: Partial<StayRequest>): StayRequest => ({
  arrival: day(2026, 10, 4),
  nights: 3,
  guests: 2,
  roomType: 'podworzowy',
  rate: 'flexible',
  extras: {},
  weekendPackage: false,
  ...overrides,
});

describe('night prices', () => {
  it('charges the base price from Sunday to Thursday in the low season', () => {
    expect(nightPrice('podworzowy', day(2026, 10, 4))).toBe(340);
    expect(nightPrice('klasyczny', day(2026, 10, 8))).toBe(420);
    expect(nightPrice('poddasze', day(2027, 2, 3))).toBe(780);
  });

  it('adds a quarter on Friday and Saturday nights and rounds to ten', () => {
    expect(isWeekendNight(day(2026, 10, 9))).toBe(true);
    expect(isWeekendNight(day(2026, 10, 10))).toBe(true);
    expect(isWeekendNight(day(2026, 10, 11))).toBe(false);
    expect(nightPrice('podworzowy', day(2026, 10, 9))).toBe(430);
    expect(nightPrice('klasyczny', day(2026, 10, 10))).toBe(530);
    expect(nightPrice('nadrzeczny', day(2026, 10, 9))).toBe(650);
    expect(nightPrice('poddasze', day(2026, 10, 9))).toBe(980);
  });

  it('raises prices from May to September', () => {
    expect(seasonOf(day(2027, 5, 1))).toBe('highSeason');
    expect(seasonOf(day(2027, 9, 30))).toBe('highSeason');
    expect(seasonOf(day(2027, 10, 1))).toBeNull();
    expect(nightPrice('podworzowy', day(2027, 7, 15))).toBe(390);
    expect(nightPrice('podworzowy', day(2027, 7, 10))).toBe(490);
  });

  it('raises prices during the Christmas market weeks only', () => {
    expect(seasonOf(day(2026, 11, 19))).toBeNull();
    expect(seasonOf(day(2026, 11, 20))).toBe('christmasMarket');
    expect(seasonOf(day(2026, 12, 23))).toBe('christmasMarket');
    expect(seasonOf(day(2026, 12, 24))).toBeNull();
    expect(nightPrice('podworzowy', day(2026, 12, 1))).toBe(400);
    expect(nightPrice('poddasze', day(2026, 12, 1))).toBe(920);
  });

  it('prices New Year’s Eve on its own, whatever the weekday', () => {
    expect(seasonOf(day(2026, 12, 31))).toBe('newYearsEve');
    expect(nightPrice('podworzowy', day(2026, 12, 31))).toBe(650);
    expect(nightPrice('podworzowy', day(2027, 12, 31))).toBe(650);
    expect(nightPrice('poddasze', day(2026, 12, 31))).toBe(1480);
  });

  it('takes ten percent off the non-refundable rate', () => {
    expect(rateNightPrice('podworzowy', day(2026, 10, 9), 'flexible')).toBe(430);
    expect(rateNightPrice('podworzowy', day(2026, 10, 9), 'nonRefundable')).toBe(387);
    expect(rateNightPrice('klasyczny', day(2026, 10, 4), 'nonRefundable')).toBe(378);
  });

  it('never prices a night below the cheapest base price', () => {
    for (let offset = 0; offset < 730; offset += 1) {
      expect(nightPrice('podworzowy', day(2026, 10, 3) + offset)).toBeGreaterThanOrEqual(340);
    }
  });
});

describe('long stay discount', () => {
  it('starts at five nights', () => {
    expect([1, 4, 5, 7, 8, 14, 30].map(longStayPercent)).toEqual([0, 0, 10, 10, 15, 15, 15]);
  });

  it('is applied on its own to the accommodation only', () => {
    const quote = quoteStay(
      request({ nights: 5, extras: { breakfast: 2, parking: 1 }, arrival: day(2026, 10, 4) }),
    );
    expect(quote.accommodation).toBe(1700);
    expect(quote.discountPercent).toBe(10);
    expect(quote.discount).toBe(170);
    expect(quote.extrasTotal).toBe(2 * 5 * 55 + 5 * 60);
    expect(quote.total).toBe(1700 - 170 + 550 + 300);
  });

  it('stacks with the non-refundable rate', () => {
    const quote = quoteStay(request({ nights: 5, rate: 'nonRefundable' }));
    expect(quote.accommodation).toBe(5 * 306);
    expect(quote.discount).toBe(153);
    expect(quote.total).toBe(1377);
  });

  it('does not apply to a four night stay', () => {
    const quote = quoteStay(request({ nights: 4 }));
    expect(quote.discount).toBe(0);
    expect(quote.total).toBe(1360);
  });
});

describe('quote', () => {
  it('lists every night with its price and flags', () => {
    const quote = quoteStay(
      request({ arrival: day(2026, 10, 8), nights: 3, roomType: 'klasyczny' }),
    );
    expect(quote.nights.map(line => line.price)).toEqual([420, 530, 530]);
    expect(quote.nights.map(line => line.weekend)).toEqual([false, true, true]);
    expect(quote.accommodation).toBe(1480);
    expect(averageNightPrice(quote)).toBe(493);
  });

  it('multiplies per night extras by nights and guests, and flat extras once', () => {
    const quote = quoteStay(
      request({
        nights: 3,
        extras: { breakfast: 2, parking: 1, bike: 1, transfer: 2, welcomeSet: 1, pet: 1, cot: 1 },
      }),
    );
    const amounts = Object.fromEntries(quote.extras.map(line => [line.id, line.amount]));
    expect(amounts).toEqual({
      breakfast: 330,
      parking: 180,
      bike: 135,
      transfer: 280,
      welcomeSet: 90,
      pet: 90,
      cot: 0,
    });
    expect(quote.extrasTotal).toBe(330 + 180 + 135 + 280 + 90 + 90);
    expect(quote.total).toBe(1020 + quote.extrasTotal);
  });

  it('clamps extra counts to what the party can use', () => {
    expect(clampExtraCount('breakfast', 5, 2)).toBe(2);
    expect(clampExtraCount('breakfast', -1, 2)).toBe(0);
    expect(clampExtraCount('breakfast', Number.NaN, 2)).toBe(0);
    expect(clampExtraCount('breakfast', undefined, 2)).toBe(0);
    expect(clampExtraCount('cot', 3, 2)).toBe(1);
    expect(clampExtraCount('transfer', 2.9, 1)).toBe(2);
  });
});

describe('weekend package', () => {
  const friday = day(2026, 10, 9);

  it('applies to two nights arriving on Friday only', () => {
    expect(weekendPackageApplies(friday, 2)).toBe(true);
    expect(weekendPackageApplies(friday, 3)).toBe(false);
    expect(weekendPackageApplies(friday + 1, 2)).toBe(false);
  });

  it('prices breakfast, late check-out and the welcome set at 85 percent of their list price', () => {
    const quote = quoteStay(
      request({ arrival: friday, nights: 2, roomType: 'klasyczny', weekendPackage: true }),
    );
    expect(quote.accommodation).toBe(1060);
    expect(quote.weekendPackage).toEqual({ listValue: 390, amount: 332, saving: 58 });
    expect(quote.extrasTotal).toBe(0);
    expect(quote.extras.filter(line => line.inPackage).map(line => line.id)).toEqual([
      'breakfast',
      'lateCheckOut',
      'welcomeSet',
    ]);
    expect(quote.total).toBe(1060 + 332);
  });

  it('does not double charge an extra the package already includes', () => {
    const quote = quoteStay(
      request({
        arrival: friday,
        nights: 2,
        weekendPackage: true,
        extras: { breakfast: 1, lateCheckOut: 1, parking: 1 },
      }),
    );
    expect(quote.weekendPackage?.listValue).toBe(390);
    expect(quote.extrasTotal).toBe(120);
  });

  it('is ignored when the stay does not qualify', () => {
    const quote = quoteStay(request({ arrival: friday, nights: 3, weekendPackage: true }));
    expect(quote.weekendPackage).toBeNull();
    expect(quote.extras).toEqual([]);
  });
});
