import { describe, expect, it } from 'vitest';
import { roomTypeById, rooms } from '../data/rooms';
import {
  canStay,
  earliestDeparture,
  freeRoomsForStay,
  freeRoomsOnNight,
  isTaken,
  lastBookableNight,
  minNightsFor,
  summariseNight,
  typeAvailability,
  validateStay,
} from './availability';
import type { Occupancy } from './availability';
import { dayFromParts, weekdayOf } from './dates';
import { nightPrice } from './pricing';

const today = dayFromParts(2026, 10, 3);
const nothingTaken: Occupancy = () => false;
const everythingTaken: Occupancy = () => true;

describe('generated availability', () => {
  it('is deterministic', () => {
    for (let offset = 0; offset < 60; offset += 1) {
      const first = rooms.map(room => isTaken(room, today + offset));
      const second = rooms.map(room => isTaken(room, today + offset));
      expect(second).toEqual(first);
    }
  });

  it('keeps the free room count between zero and the number of rooms', () => {
    for (let offset = 0; offset < 365; offset += 1) {
      const free = freeRoomsOnNight(today + offset).length;
      expect(free).toBeGreaterThanOrEqual(0);
      expect(free).toBeLessThanOrEqual(rooms.length);
    }
  });

  it('is busier on Friday and Saturday nights than on Monday to Thursday nights', () => {
    const taken = { weekend: 0, weekday: 0 };
    const nights = { weekend: 0, weekday: 0 };
    for (let offset = 0; offset < 365; offset += 1) {
      const night = today + offset;
      const weekday = weekdayOf(night);
      const group =
        weekday === 5 || weekday === 6
          ? 'weekend'
          : weekday >= 1 && weekday <= 4
            ? 'weekday'
            : null;
      if (!group) continue;
      nights[group] += 1;
      taken[group] += rooms.length - freeRoomsOnNight(night).length;
    }
    expect(taken.weekend / nights.weekend).toBeGreaterThan(taken.weekday / nights.weekday + 4);
  });

  it('has some sold out nights in a year, but not many', () => {
    let soldOut = 0;
    for (let offset = 0; offset < 365; offset += 1) {
      if (freeRoomsOnNight(today + offset).length === 0) soldOut += 1;
    }
    expect(soldOut).toBeGreaterThan(3);
    expect(soldOut).toBeLessThan(40);
  });

  it('leaves a few rooms for New Year’s Eve', () => {
    const free = freeRoomsOnNight(dayFromParts(2026, 12, 31)).length;
    expect(free).toBeLessThan(8);
  });
});

describe('stays', () => {
  it('needs a room that is free on every night', () => {
    const takenOnSecondNight: Occupancy = (room, night) =>
      night === today + 11 && room.number !== 204;
    const free = freeRoomsForStay(today + 10, 2, takenOnSecondNight);
    expect(free.map(room => room.number)).toEqual([204]);
    expect(freeRoomsForStay(today + 10, 1, takenOnSecondNight)).toHaveLength(rooms.length);
  });

  it('groups free rooms by type', () => {
    const onlyFamilyFree: Occupancy = room => room.type !== 'rodzinny';
    const availability = typeAvailability(today + 5, 2, onlyFamilyFree);
    const family = availability.find(entry => entry.type.id === 'rodzinny');
    expect(family?.free).toHaveLength(3);
    expect(availability.filter(entry => entry.free.length > 0)).toHaveLength(1);
  });

  it('checks the room capacity against the party size', () => {
    const onlyFamilyFree: Occupancy = room => room.type !== 'rodzinny';
    expect(canStay(today + 5, 2, 4, onlyFamilyFree)).toBe(true);
    const onlyCourtyardFree: Occupancy = room => room.type !== 'podworzowy';
    expect(canStay(today + 5, 2, 2, onlyCourtyardFree)).toBe(true);
    expect(canStay(today + 5, 2, 3, onlyCourtyardFree)).toBe(false);
    expect(canStay(today + 5, 2, 1, everythingTaken)).toBe(false);
  });

  it('summarises a night with the lowest price among rooms that fit', () => {
    const onlyAtticAndFamilyFree: Occupancy = room =>
      room.type !== 'poddasze' && room.type !== 'rodzinny';
    const night = today + 6;
    expect(summariseNight(night, 2, onlyAtticAndFamilyFree).fromPrice).toBe(
      nightPrice('rodzinny', night),
    );
    expect(summariseNight(night, 4, onlyAtticAndFamilyFree).fromPrice).toBe(
      nightPrice('rodzinny', night),
    );
    const summary = summariseNight(night, 2, everythingTaken);
    expect(summary.soldOut).toBe(true);
    expect(summary.fromPrice).toBeNull();
    expect(summary.freeCount).toBe(0);
  });

  it('says a night is sold out for a party when only smaller rooms are free', () => {
    const largeRoomsTaken: Occupancy = room => roomTypeById(room.type).capacity > 2;
    expect(summariseNight(today + 3, 2, largeRoomsTaken).soldOut).toBe(false);
    expect(summariseNight(today + 3, 3, largeRoomsTaken).soldOut).toBe(true);
    expect(summariseNight(today + 3, 4, largeRoomsTaken).fromPrice).toBeNull();
  });
});

describe('minimum stay', () => {
  it('asks for two nights when the arrival night is a Friday or a Saturday', () => {
    expect(minNightsFor(dayFromParts(2026, 10, 9))).toBe(2);
    expect(minNightsFor(dayFromParts(2026, 10, 10))).toBe(2);
    expect(minNightsFor(dayFromParts(2026, 10, 11))).toBe(1);
    expect(minNightsFor(dayFromParts(2026, 10, 8))).toBe(1);
    expect(earliestDeparture(dayFromParts(2026, 10, 9))).toBe(dayFromParts(2026, 10, 11));
    expect(earliestDeparture(dayFromParts(2026, 10, 8))).toBe(dayFromParts(2026, 10, 9));
  });

  it('allows a single Thursday night and rejects a single Friday night', () => {
    const thursday = dayFromParts(2026, 10, 8);
    expect(validateStay(thursday, thursday + 1, 2, today, nothingTaken)).toBeNull();
    expect(validateStay(thursday + 1, thursday + 2, 2, today, nothingTaken)).toBe('tooShort');
    expect(validateStay(thursday + 1, thursday + 3, 2, today, nothingTaken)).toBeNull();
    expect(validateStay(thursday + 2, thursday + 3, 2, today, nothingTaken)).toBe('tooShort');
  });

  it('accepts a stay that includes a weekend night as long as it has two nights', () => {
    const wednesday = dayFromParts(2026, 10, 7);
    expect(validateStay(wednesday, wednesday + 3, 2, today, nothingTaken)).toBeNull();
  });
});

describe('stay validation', () => {
  const monday = dayFromParts(2026, 10, 5);

  it('reports missing dates, the past, long and distant stays', () => {
    expect(validateStay(null, null, 2, today, nothingTaken)).toBe('missingDates');
    expect(validateStay(monday, null, 2, today, nothingTaken)).toBe('missingDates');
    expect(validateStay(today - 1, today + 1, 2, today, nothingTaken)).toBe('inPast');
    expect(validateStay(monday, monday + 31, 2, today, nothingTaken)).toBe('tooLong');
    expect(validateStay(monday, monday + 30, 2, today, nothingTaken)).toBeNull();
    expect(validateStay(today + 364, today + 366, 2, today, nothingTaken)).toBe('beyondHorizon');
    expect(validateStay(monday, monday, 2, today, nothingTaken)).toBe('tooShort');
  });

  it('allows today and the last night of the 365 day horizon', () => {
    const monday = dayFromParts(2026, 10, 5);
    expect(validateStay(monday, monday + 1, 2, monday, nothingTaken)).toBeNull();
    const last = lastBookableNight(monday);
    expect(last).toBe(monday + 364);
    expect(weekdayOf(last)).toBe(1);
    expect(validateStay(last, last + 1, 2, monday, nothingTaken)).toBeNull();
    expect(validateStay(last, last + 2, 2, monday, nothingTaken)).toBe('beyondHorizon');
  });

  it('applies the minimum stay on a Saturday today', () => {
    expect(weekdayOf(today)).toBe(6);
    expect(validateStay(today, today + 1, 2, today, nothingTaken)).toBe('tooShort');
    expect(validateStay(today, today + 2, 2, today, nothingTaken)).toBeNull();
  });

  it('reports a stay with no free room', () => {
    expect(validateStay(monday, monday + 2, 2, today, everythingTaken)).toBe('unavailable');
  });
});
