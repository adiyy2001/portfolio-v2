import { describe, expect, it } from 'vitest';
import { floorPlans, planArea, planOf, sleepingPlaces } from './floorplans';
import type { Furniture, Space } from './floorplans';
import { roomTypeById, roomTypes } from './rooms';

interface Box {
  x: number;
  y: number;
  width: number;
  depth: number;
}

const overlaps = (first: Box, second: Box): boolean =>
  first.x < second.x + second.width &&
  second.x < first.x + first.width &&
  first.y < second.y + second.depth &&
  second.y < first.y + first.depth;

const inside = (inner: Box, outer: Box): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.depth <= outer.y + outer.depth;

describe('floor plans', () => {
  it('has one plan per room type', () => {
    expect(floorPlans.map(plan => plan.roomType).sort()).toEqual(
      roomTypes.map(type => type.id).sort(),
    );
  });

  it('draws spaces that add up to the stated size of the room', () => {
    for (const type of roomTypes) {
      expect(planArea(planOf(type.id))).toBe(type.size);
    }
  });

  it('fills the whole footprint with spaces that do not overlap', () => {
    for (const plan of floorPlans) {
      const footprint: Box = { x: 0, y: 0, width: plan.width, depth: plan.depth };
      expect(plan.width * plan.depth).toBe(roomTypeById(plan.roomType).size * 10_000);
      plan.spaces.forEach((space: Space, index) => {
        expect(inside(space, footprint)).toBe(true);
        for (const other of plan.spaces.slice(index + 1)) {
          expect(overlaps(space, other)).toBe(false);
        }
      });
    }
  });

  it('keeps every piece of furniture inside one space and clear of the others', () => {
    for (const plan of floorPlans) {
      plan.furniture.forEach((piece: Furniture, index) => {
        expect(plan.spaces.some(space => inside(piece, space))).toBe(true);
        for (const other of plan.furniture.slice(index + 1)) {
          expect(overlaps(piece, other)).toBe(false);
        }
      });
    }
  });

  it('has as many sleeping places as the room has guests', () => {
    for (const type of roomTypes) {
      expect(sleepingPlaces(planOf(type.id))).toBe(type.capacity);
    }
  });

  it('keeps openings on the footprint or on the walls between spaces', () => {
    for (const plan of floorPlans) {
      for (const opening of plan.openings) {
        const endX = opening.axis === 'x' ? opening.x + opening.length : opening.x;
        const endY = opening.axis === 'y' ? opening.y + opening.length : opening.y;
        expect(opening.x).toBeGreaterThanOrEqual(0);
        expect(opening.y).toBeGreaterThanOrEqual(0);
        expect(endX).toBeLessThanOrEqual(plan.width);
        expect(endY).toBeLessThanOrEqual(plan.depth);
      }
    }
  });

  it('keeps door swings clear of furniture', () => {
    for (const plan of floorPlans) {
      for (const opening of plan.openings.filter(entry => entry.kind === 'door')) {
        const side = opening.swing ?? 1;
        const swing: Box =
          opening.axis === 'x'
            ? {
                x: opening.x,
                y: side === 1 ? opening.y : opening.y - opening.length,
                width: opening.length,
                depth: opening.length,
              }
            : {
                x: side === 1 ? opening.x : opening.x - opening.length,
                y: opening.y,
                width: opening.length,
                depth: opening.length,
              };
        for (const piece of plan.furniture) expect(overlaps(swing, piece)).toBe(false);
      }
    }
  });
});
