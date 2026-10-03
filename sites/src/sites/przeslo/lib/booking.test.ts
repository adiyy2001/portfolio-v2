import { describe, expect, it } from 'vitest';
import { rooms } from '../data/rooms';
import type { Occupancy } from './availability';
import {
  assignRoom,
  bookingStatus,
  buildSampleBooking,
  cancelBooking,
  cancellationOutcome,
  createBooking,
  generateBookingCode,
  isBookingCode,
  parseStoredBooking,
  quoteBooking,
  stayOf,
  updateExtras,
} from './booking';
import type { BookingInput, StoredBooking } from './booking';
import { dayFromParts, weekdayOf } from './dates';
import { quoteStay } from './pricing';

const nothingTaken: Occupancy = () => false;
const friday = dayFromParts(2026, 10, 9);
const now = new Date('2026-10-03T08:00:00.000Z');
const fixedRandom = () => 0;

const input: BookingInput = {
  lang: 'pl',
  arrival: friday,
  departure: friday + 2,
  guests: 2,
  roomType: 'klasyczny',
  rate: 'flexible',
  extras: { breakfast: 2, parking: 1 },
  weekendPackage: false,
  guest: {
    name: ' Anna Wiśniewska ',
    email: 'anna@example.com',
    phone: '+48 600 100 200',
    arrivalWindow: 'evening',
    notes: '',
  },
  invoice: null,
};

const made = (overrides: Partial<BookingInput> = {}): StoredBooking => {
  const booking = createBooking({ ...input, ...overrides }, now, fixedRandom, nothingTaken);
  if (!booking) throw new Error('booking was not created');
  return booking;
};

const asJson = (booking: StoredBooking): unknown => JSON.parse(JSON.stringify(booking));

describe('booking codes', () => {
  it('uses the PRZ prefix and an alphabet without look-alike characters', () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return seed / 2147483647;
    };
    for (let index = 0; index < 300; index += 1) {
      const code = generateBookingCode(random);
      expect(isBookingCode(code)).toBe(true);
      expect(code).not.toMatch(/[01IO]/);
    }
  });

  it('is built from the random source', () => {
    expect(generateBookingCode(() => 0)).toBe('PRZ-AAAAAA');
    expect(generateBookingCode(() => 0.999999)).toBe('PRZ-999999');
  });

  it('rejects malformed codes', () => {
    expect(isBookingCode('PRZ-ABC12')).toBe(false);
    expect(isBookingCode('prz-ABC123')).toBe(false);
    expect(isBookingCode('PRZ-ABC10I')).toBe(false);
  });
});

describe('room assignment', () => {
  it('gives the lowest numbered free room of the type', () => {
    expect(assignRoom('klasyczny', friday, 2, nothingTaken)).toBe(103);
    const firstTaken: Occupancy = room => room.number === 103;
    expect(assignRoom('klasyczny', friday, 2, firstTaken)).toBe(104);
  });

  it('needs a room that is free for every night', () => {
    const secondNightTaken: Occupancy = (room, night) => night === friday + 1 && room.number < 300;
    expect(assignRoom('klasyczny', friday, 2, secondNightTaken)).toBe(303);
  });

  it('returns nothing when every room of the type is taken', () => {
    const typeTaken: Occupancy = room => room.type === 'poddasze';
    expect(assignRoom('poddasze', friday, 1, typeTaken)).toBeNull();
    expect(rooms.filter(room => room.type === 'poddasze')).toHaveLength(3);
  });
});

describe('creating a booking', () => {
  it('stores ISO dates, a room and trimmed details', () => {
    const booking = made();
    expect(booking.arrival).toBe('2026-10-09');
    expect(booking.departure).toBe('2026-10-11');
    expect(booking.roomNumber).toBe(103);
    expect(booking.guest.name).toBe('Anna Wiśniewska');
    expect(booking.cancelledAt).toBeNull();
    expect(booking.createdAt).toBe('2026-10-03T08:00:00.000Z');
    expect(stayOf(booking)).toEqual({ arrival: friday, departure: friday + 2, nights: 2 });
  });

  it('clamps and cleans extras', () => {
    const booking = made({ extras: { breakfast: 9, parking: 0, cot: 4, transfer: 2 } });
    expect(booking.extras).toEqual({ breakfast: 2, cot: 1, transfer: 2 });
  });

  it('keeps the weekend package only for a Friday arrival with two nights', () => {
    expect(made({ weekendPackage: true }).weekendPackage).toBe(true);
    expect(made({ weekendPackage: true, departure: friday + 3 }).weekendPackage).toBe(false);
    expect(
      made({ weekendPackage: true, arrival: friday + 3, departure: friday + 5 }).weekendPackage,
    ).toBe(false);
  });

  it('fails when no room is free', () => {
    expect(createBooking(input, now, fixedRandom, () => true)).toBeNull();
  });

  it('prices the stored booking exactly like the quote', () => {
    const booking = made({ weekendPackage: true, extras: { parking: 1 } });
    const direct = quoteStay({
      arrival: friday,
      nights: 2,
      guests: 2,
      roomType: 'klasyczny',
      rate: 'flexible',
      extras: { parking: 1 },
      weekendPackage: true,
    });
    expect(quoteBooking(booking)).toEqual(direct);
  });
});

describe('reading a stored booking', () => {
  it('accepts what was written', () => {
    const booking = made({
      weekendPackage: true,
      invoice: {
        company: 'Studio Wzór sp. z o.o.',
        nip: '123-456-32-18',
        street: 'ul. Kuźnicza 10/2',
        postalCode: '50-138',
        city: 'Wrocław',
      },
    });
    expect(parseStoredBooking(asJson(booking))).toEqual(booking);
  });

  it('rejects things that are not bookings', () => {
    for (const value of [null, undefined, 'x', 5, [], {}, { version: 2 }]) {
      expect(parseStoredBooking(value)).toBeNull();
    }
  });

  const broken = (changes: Record<string, unknown>): unknown => ({
    ...(asJson(made()) as Record<string, unknown>),
    ...changes,
  });

  it('rejects wrong codes, timestamps and languages', () => {
    expect(parseStoredBooking(broken({ code: 'ABC' }))).toBeNull();
    expect(parseStoredBooking(broken({ createdAt: 'yesterday' }))).toBeNull();
    expect(parseStoredBooking(broken({ lang: 'de' }))).toBeNull();
  });

  it('rejects impossible stays', () => {
    expect(parseStoredBooking(broken({ arrival: '2026-02-30' }))).toBeNull();
    expect(parseStoredBooking(broken({ departure: '2026-10-09' }))).toBeNull();
    expect(parseStoredBooking(broken({ departure: '2026-10-08' }))).toBeNull();
    expect(
      parseStoredBooking(broken({ arrival: '2026-10-09', departure: '2026-10-10' })),
    ).toBeNull();
    expect(parseStoredBooking(broken({ departure: '2026-11-20' }))).toBeNull();
  });

  it('rejects a guest count, room or rate that does not fit', () => {
    expect(parseStoredBooking(broken({ guests: 3 }))).toBeNull();
    expect(parseStoredBooking(broken({ guests: 0 }))).toBeNull();
    expect(parseStoredBooking(broken({ guests: 1.5 }))).toBeNull();
    expect(parseStoredBooking(broken({ roomNumber: 101 }))).toBeNull();
    expect(parseStoredBooking(broken({ roomNumber: 999 }))).toBeNull();
    expect(parseStoredBooking(broken({ roomType: 'penthouse' }))).toBeNull();
    expect(parseStoredBooking(broken({ rate: 'cheap' }))).toBeNull();
  });

  it('rejects extras above the limit and drops unknown extras', () => {
    expect(parseStoredBooking(broken({ extras: { breakfast: 3 } }))).toBeNull();
    expect(parseStoredBooking(broken({ extras: { breakfast: -1 } }))).toBeNull();
    expect(parseStoredBooking(broken({ extras: { breakfast: 1.5 } }))).toBeNull();
    expect(parseStoredBooking(broken({ extras: 'x' }))).toBeNull();
    const parsed = parseStoredBooking(broken({ extras: { breakfast: 1, jacuzzi: 4 } }));
    expect(parsed?.extras).toEqual({ breakfast: 1 });
  });

  it('rejects a package that does not fit the stay', () => {
    expect(parseStoredBooking(broken({ weekendPackage: 'yes' }))).toBeNull();
    expect(
      parseStoredBooking(
        broken({ weekendPackage: true, arrival: '2026-10-10', departure: '2026-10-12' }),
      ),
    ).toBeNull();
  });

  it('rejects invalid guest and invoice details', () => {
    const good = asJson(made()) as { guest: Record<string, unknown> };
    expect(parseStoredBooking(broken({ guest: { ...good.guest, email: 'nope' } }))).toBeNull();
    expect(
      parseStoredBooking(broken({ guest: { ...good.guest, arrivalWindow: 'noon' } })),
    ).toBeNull();
    expect(parseStoredBooking(broken({ guest: null }))).toBeNull();
    expect(parseStoredBooking(broken({ invoice: { company: 'X' } }))).toBeNull();
    expect(parseStoredBooking(broken({ invoice: undefined }))).toBeNull();
    expect(parseStoredBooking(broken({ cancelledAt: 'later' }))).toBeNull();
  });
});

describe('changing a booking', () => {
  it('replaces the extras and keeps the stay', () => {
    const booking = made();
    const changed = updateExtras(booking, { bike: 2, breakfast: 7 }, false);
    expect(changed.extras).toEqual({ breakfast: 2, bike: 2 });
    expect(changed.arrival).toBe(booking.arrival);
    expect(changed.code).toBe(booking.code);
  });

  it('turns the package on only when the stay allows it', () => {
    const booking = made();
    expect(updateExtras(booking, {}, true).weekendPackage).toBe(true);
    const midweek = made({ arrival: friday + 4, departure: friday + 6 });
    expect(updateExtras(midweek, {}, true).weekendPackage).toBe(false);
  });

  it('marks a booking as cancelled', () => {
    const cancelled = cancelBooking(made(), now);
    expect(cancelled.cancelledAt).toBe('2026-10-03T08:00:00.000Z');
    expect(bookingStatus(cancelled, now.getTime())).toBe('cancelled');
  });
});

describe('booking status', () => {
  const booking = made();
  const at = (value: string): number => new Date(value).getTime();

  it('is upcoming until check-in, underway until check-out, then finished', () => {
    expect(bookingStatus(booking, at('2026-10-09T12:59:00Z'))).toBe('upcoming');
    expect(bookingStatus(booking, at('2026-10-09T13:00:00Z'))).toBe('underway');
    expect(bookingStatus(booking, at('2026-10-11T08:59:00Z'))).toBe('underway');
    expect(bookingStatus(booking, at('2026-10-11T09:00:00Z'))).toBe('finished');
  });
});

describe('cancellation outcome', () => {
  const at = (value: string): number => new Date(value).getTime();

  it('is free until 15:00 two days before arrival on the flexible rate', () => {
    const booking = made();
    expect(cancellationOutcome(booking, at('2026-10-07T13:00:00Z'))).toEqual({
      kind: 'free',
      charge: 0,
    });
    expect(cancellationOutcome(booking, at('2026-10-03T08:00:00Z')).kind).toBe('free');
  });

  it('charges the first night after the deadline on the flexible rate', () => {
    const booking = made();
    expect(cancellationOutcome(booking, at('2026-10-07T13:00:01Z'))).toEqual({
      kind: 'firstNight',
      charge: 530,
    });
  });

  it('charges the accommodation on the non-refundable rate at any time', () => {
    const booking = made({ rate: 'nonRefundable' });
    const outcome = cancellationOutcome(booking, at('2026-10-03T08:00:00Z'));
    expect(outcome).toEqual({ kind: 'nonRefundable', charge: 954 });
  });

  it('subtracts the long stay discount from the non-refundable charge', () => {
    const booking = made({ rate: 'nonRefundable', arrival: friday + 3, departure: friday + 8 });
    const quote = quoteBooking(booking);
    expect(cancellationOutcome(booking, now.getTime()).charge).toBe(
      quote.accommodation - quote.discount,
    );
  });
});

describe('sample booking', () => {
  it('is a valid weekend stay a few weeks ahead', () => {
    const today = dayFromParts(2026, 10, 3);
    const booking = buildSampleBooking(today, 'pl', now);
    expect(booking).not.toBeNull();
    if (!booking) return;
    expect(parseStoredBooking(asJson(booking))).toEqual(booking);
    const { arrival, nights } = stayOf(booking);
    expect(weekdayOf(arrival)).toBe(5);
    expect(nights).toBe(2);
    expect(arrival - today).toBeGreaterThanOrEqual(24);
    expect(booking.weekendPackage).toBe(true);
  });
});
