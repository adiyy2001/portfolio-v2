import { describe, expect, it } from 'vitest';
import { buildBooking, departureOf, makeReference, parseStoredBooking } from './booking';
import type { BookingDraft } from './booking';

const draft: BookingDraft = {
  roomId: 'poddasze',
  arrival: '2026-12-04',
  nights: 5,
  guests: 2,
  packageId: null,
  breakfast: false,
  name: 'Anna Nowak',
  phone: '600100200',
  email: 'anna@poczta.example',
  note: '',
};

describe('booking', () => {
  it('makes references with six digits', () => {
    expect(makeReference(() => 0)).toBe('BR-100000');
    expect(makeReference(() => 0.999999)).toBe('BR-999999');
  });

  it('builds a stored booking with the total', () => {
    const booking = buildBooking(draft, new Date('2026-11-15T10:00:00Z'), () => 0.5);
    expect(booking.reference).toBe('BR-550000');
    expect(booking.total).toBe(520 * 5);
    expect(booking.createdAt).toBe('2026-11-15T10:00:00.000Z');
  });

  it('finds the departure date', () => {
    expect(departureOf({ arrival: '2026-12-04', nights: 5 })).toBe('2026-12-09');
  });

  it('round trips and rejects broken data', () => {
    const booking = buildBooking(draft, new Date(), () => 0.1);
    expect(parseStoredBooking(JSON.parse(JSON.stringify(booking)))).toEqual(booking);
    expect(parseStoredBooking({ ...booking, roomId: 'nope' })).toBeNull();
    expect(parseStoredBooking({ ...booking, reference: 'X-1' })).toBeNull();
    expect(parseStoredBooking(null)).toBeNull();
  });
});
