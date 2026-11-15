import { describe, expect, it } from 'vitest';
import { buildBooking } from './booking';
import { findBooking, normaliseReference } from './lookup';

const booking = buildBooking(
  {
    roomId: 'cichy',
    arrival: '2026-12-04',
    nights: 2,
    guests: 2,
    packageId: null,
    breakfast: false,
    name: 'Żaneta Łukasiewicz',
    phone: '600100200',
    email: '',
    note: '',
  },
  new Date(),
  () => 0.5,
);

describe('lookup', () => {
  it('normalises references', () => {
    expect(normaliseReference('550000')).toBe('BR-550000');
    expect(normaliseReference(' br-550000 ')).toBe('BR-550000');
  });

  it('finds a booking by reference and surname without accents', () => {
    expect(findBooking([booking], 'BR-550000', 'lukasiewicz')).toBe(booking);
    expect(findBooking([booking], '550000', 'ŁUKASIEWICZ')).toBe(booking);
  });

  it('rejects a wrong surname or reference', () => {
    expect(findBooking([booking], 'BR-550000', 'Kowalski')).toBeNull();
    expect(findBooking([booking], 'BR-111111', 'Łukasiewicz')).toBeNull();
    expect(findBooking([booking], 'BR-550000', '')).toBeNull();
  });
});
