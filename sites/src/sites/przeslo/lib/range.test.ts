import { describe, expect, it } from 'vitest';
import type { Occupancy } from './availability';
import { dayFromParts, weekdayOf } from './dates';
import {
  arrivalBlock,
  blockOf,
  cellModel,
  departureBlock,
  emptySelection,
  nightsOf,
  reconcileSelection,
  selectDay,
} from './range';
import type { RangeContext, Selection } from './range';

const today = dayFromParts(2026, 10, 5);
const monday = today;

const context = (overrides: Partial<RangeContext> = {}): RangeContext => ({
  today,
  guests: 2,
  packageMode: false,
  occupancy: () => false,
  ...overrides,
});

const nightsTaken =
  (...nights: number[]): Occupancy =>
  (_room, night) =>
    nights.includes(night);

describe('choosing an arrival', () => {
  it('blocks days in the past and allows today', () => {
    expect(arrivalBlock(today - 1, context())).toBe('past');
    expect(arrivalBlock(today, context())).toBeNull();
  });

  it('blocks days beyond the 365 day horizon', () => {
    expect(arrivalBlock(today + 364, context())).toBeNull();
    expect(arrivalBlock(today + 365, context())).toBe('beyondHorizon');
  });

  it('blocks a night when every room is taken', () => {
    const soldOut = context({ occupancy: nightsTaken(today + 3) });
    expect(arrivalBlock(today + 3, soldOut)).toBe('soldOut');
    expect(arrivalBlock(today + 2, soldOut)).toBeNull();
  });

  it('blocks a night when the party does not fit in the rooms that are free', () => {
    const largeRoomsTaken: Occupancy = room => room.type === 'rodzinny' || room.type === 'poddasze';
    expect(arrivalBlock(today + 1, context({ guests: 3, occupancy: largeRoomsTaken }))).toBe(
      'soldOut',
    );
    expect(arrivalBlock(today + 1, context({ guests: 2, occupancy: largeRoomsTaken }))).toBeNull();
  });

  it('blocks a Friday when the minimum stay cannot be met', () => {
    const friday = today + 4;
    expect(weekdayOf(friday)).toBe(5);
    const saturdayTaken = context({ occupancy: nightsTaken(friday + 1) });
    expect(arrivalBlock(friday, saturdayTaken)).toBe('noStay');
    expect(arrivalBlock(friday, context())).toBeNull();
  });

  it('allows a Thursday before a sold out Friday', () => {
    const thursday = today + 3;
    expect(arrivalBlock(thursday, context({ occupancy: nightsTaken(thursday + 1) }))).toBeNull();
  });
});

describe('choosing a departure', () => {
  const arrival = monday;

  it('requires the minimum number of nights', () => {
    const friday = today + 4;
    expect(departureBlock(friday, friday + 1, context())).toBe('tooShort');
    expect(departureBlock(friday, friday + 2, context())).toBeNull();
    expect(departureBlock(arrival, arrival + 1, context())).toBeNull();
  });

  it('allows up to thirty nights', () => {
    expect(departureBlock(arrival, arrival + 30, context())).toBeNull();
    expect(departureBlock(arrival, arrival + 31, context())).toBe('tooLong');
  });

  it('blocks departures behind a night with no room', () => {
    const blocked = context({ occupancy: nightsTaken(arrival + 2) });
    expect(departureBlock(arrival, arrival + 2, blocked)).toBeNull();
    expect(departureBlock(arrival, arrival + 3, blocked)).toBe('unavailable');
    expect(departureBlock(arrival, arrival + 5, blocked)).toBe('unavailable');
  });

  it('allows leaving on the morning of a sold out night', () => {
    const blocked = context({ occupancy: nightsTaken(arrival + 2) });
    expect(blockOf(arrival + 2, { arrival, departure: null }, blocked)).toBeNull();
  });

  it('needs one room free for the whole stay, not just free rooms on each night', () => {
    const onlyOneRoomEachNight: Occupancy = (room, night) => {
      const freeRoomNumber = night % 2 === 0 ? 101 : 102;
      return room.number !== freeRoomNumber;
    };
    const split = context({ occupancy: onlyOneRoomEachNight });
    expect(departureBlock(arrival, arrival + 1, split)).toBeNull();
    expect(departureBlock(arrival, arrival + 2, split)).toBe('unavailable');
  });
});

describe('selecting days', () => {
  it('picks the arrival first and the departure second', () => {
    let selection: Selection = emptySelection;
    selection = selectDay(selection, today + 1, context());
    expect(selection).toEqual({ arrival: today + 1, departure: null });
    selection = selectDay(selection, today + 3, context());
    expect(selection).toEqual({ arrival: today + 1, departure: today + 3 });
    expect(nightsOf(selection)).toBe(2);
  });

  it('starts again after a complete selection', () => {
    const complete: Selection = { arrival: today + 1, departure: today + 3 };
    expect(selectDay(complete, today + 8, context())).toEqual({
      arrival: today + 8,
      departure: null,
    });
    expect(selectDay(complete, today + 2, context())).toEqual({
      arrival: today + 2,
      departure: null,
    });
  });

  it('moves the arrival when an earlier day is clicked while choosing a departure', () => {
    const chosen: Selection = { arrival: today + 5, departure: null };
    expect(selectDay(chosen, today + 2, context())).toEqual({
      arrival: today + 2,
      departure: null,
    });
  });

  it('ignores blocked days', () => {
    const chosen: Selection = { arrival: today + 1, departure: null };
    expect(selectDay(chosen, today - 3, context())).toBe(chosen);
    expect(selectDay(emptySelection, today - 3, context())).toBe(emptySelection);
    const tooLong = selectDay(chosen, today + 40, context());
    expect(tooLong).toBe(chosen);
  });

  it('keeps the arrival when it is clicked again', () => {
    const chosen: Selection = { arrival: today + 1, departure: null };
    expect(selectDay(chosen, today + 1, context())).toEqual(chosen);
  });
});

describe('weekend package mode', () => {
  const packageContext = context({ packageMode: true });
  const friday = today + 4;

  it('allows only Fridays as arrival', () => {
    expect(arrivalBlock(friday, packageContext)).toBeNull();
    expect(arrivalBlock(friday + 1, packageContext)).toBe('packageFriday');
    expect(arrivalBlock(today, packageContext)).toBe('packageFriday');
  });

  it('chooses the two night departure on its own', () => {
    expect(selectDay(emptySelection, friday, packageContext)).toEqual({
      arrival: friday,
      departure: friday + 2,
    });
  });

  it('blocks other lengths', () => {
    expect(departureBlock(friday, friday + 3, packageContext)).toBe('packageNights');
    expect(departureBlock(friday, friday + 2, packageContext)).toBeNull();
  });

  it('blocks a Friday when the Saturday night has no room', () => {
    const blocked = context({ packageMode: true, occupancy: nightsTaken(friday + 1) });
    expect(arrivalBlock(friday, blocked)).toBe('noStay');
  });
});

describe('keeping a selection valid', () => {
  it('keeps a valid selection', () => {
    const selection: Selection = { arrival: today + 1, departure: today + 3 };
    expect(reconcileSelection(selection, context())).toBe(selection);
  });

  it('clears everything when the arrival is no longer possible', () => {
    const selection: Selection = { arrival: today + 1, departure: today + 3 };
    const soldOut = context({ occupancy: nightsTaken(today + 1) });
    expect(reconcileSelection(selection, soldOut)).toEqual(emptySelection);
  });

  it('drops the departure when the stay is no longer possible', () => {
    const selection: Selection = { arrival: today + 1, departure: today + 4 };
    const blocked = context({ occupancy: nightsTaken(today + 2) });
    expect(reconcileSelection(selection, blocked)).toEqual({ arrival: today + 1, departure: null });
  });

  it('fills in the departure when package mode turns on', () => {
    const friday = today + 4;
    expect(
      reconcileSelection({ arrival: friday, departure: null }, context({ packageMode: true })),
    ).toEqual({
      arrival: friday,
      departure: friday + 2,
    });
    expect(
      reconcileSelection({ arrival: today + 1, departure: null }, context({ packageMode: true })),
    ).toEqual(emptySelection);
  });

  it('starts from nothing', () => {
    expect(reconcileSelection(emptySelection, context())).toEqual(emptySelection);
  });
});

describe('calendar cells', () => {
  const selection: Selection = { arrival: today + 1, departure: today + 4 };

  it('marks the arrival, the departure and the days between', () => {
    expect(cellModel(today + 1, selection, context()).role).toBe('arrival');
    expect(cellModel(today + 2, selection, context()).role).toBe('inside');
    expect(cellModel(today + 3, selection, context()).role).toBe('inside');
    expect(cellModel(today + 4, selection, context()).role).toBe('departure');
    expect(cellModel(today + 5, selection, context()).role).toBe('none');
  });

  it('carries the lowest night price for the party', () => {
    const cell = cellModel(today + 2, emptySelection, context());
    expect(cell.price).toBe(340);
    expect(cell.soldOut).toBe(false);
    expect(cell.inHorizon).toBe(true);
  });

  it('shows no price for sold out nights and for days outside the horizon', () => {
    const soldOut = cellModel(
      today + 2,
      emptySelection,
      context({ occupancy: nightsTaken(today + 2) }),
    );
    expect(soldOut.price).toBeNull();
    expect(soldOut.soldOut).toBe(true);
    expect(soldOut.block).toBe('soldOut');
    const past = cellModel(today - 2, emptySelection, context());
    expect(past.price).toBeNull();
    expect(past.inHorizon).toBe(false);
    expect(past.block).toBe('past');
    expect(cellModel(today + 365, emptySelection, context()).inHorizon).toBe(false);
  });
});
