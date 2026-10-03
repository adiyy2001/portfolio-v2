import { describe, expect, it } from 'vitest';
import { planTables } from '../data/plan';
import { seatPositions, seatsAtTables, totalSeats } from './plan';

describe('floor plan', () => {
  it('seats thirty-four guests in total', () => {
    expect(totalSeats()).toBe(34);
  });

  it('puts four seats at a table for four and two at a table for two', () => {
    const four = planTables.find(table => table.kind === 'four');
    const two = planTables.find(table => table.kind === 'two');
    expect(four && seatPositions(four)).toHaveLength(4);
    expect(two && seatPositions(two)).toHaveLength(2);
  });

  it('counts the seats at tables only', () => {
    expect(seatsAtTables()).toBe(18);
  });

  it('keeps every seat inside the room', () => {
    for (const table of planTables) {
      for (const seat of seatPositions(table)) {
        expect(seat.x).toBeGreaterThan(40);
        expect(seat.x).toBeLessThan(600);
        expect(seat.y).toBeGreaterThan(130);
        expect(seat.y).toBeLessThan(330);
      }
    }
  });
});
