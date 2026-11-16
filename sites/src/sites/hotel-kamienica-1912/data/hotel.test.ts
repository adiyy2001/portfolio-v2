import { describe, expect, it } from 'vitest';
import { hotel, highestRoomNumber, packages, padNumber, roomCount, roomTypes } from './hotel';

describe('hotel data', () => {
  const numbers = roomTypes.flatMap(type => [...type.numbers]);

  it('has fourteen rooms and no room 13', () => {
    expect(roomCount).toBe(14);
    expect(numbers).not.toContain(hotel.skippedNumber);
  });

  it('numbers every room once and stops at 15', () => {
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(highestRoomNumber).toBe(15);
    expect(Math.min(...numbers)).toBe(1);
  });

  it('shows a room number that belongs to its own type', () => {
    for (const type of roomTypes) expect(type.numbers).toContain(type.showcase);
  });

  it('pads numbers to two digits', () => {
    expect(padNumber(4)).toBe('04');
    expect(padNumber(12)).toBe('12');
  });

  it('keeps package limits inside the stay limits', () => {
    for (const item of packages) {
      expect(item.minNights).toBeGreaterThanOrEqual(hotel.minNights);
      expect(item.maxNights).toBeLessThanOrEqual(hotel.maxNights);
    }
  });
});
