import { describe, expect, it } from 'vitest';
import { hasIronColumn } from './building';
import { flats } from './data';
import { buildPlan, internalDepth, metre, nameFits, planWidthMetres } from './plan';

describe('buildPlan', () => {
  it('draws every flat at the same scale from its area', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      expect(plan.body.width / metre).toBeCloseTo(flat.area / internalDepth, 5);
      expect(plan.body.height / metre).toBeCloseTo(internalDepth, 5);
    }
  });

  it('splits the area between rooms so that the rooms add up to the flat', () => {
    for (const flat of flats) {
      const total = buildPlan(flat).rooms.reduce((sum, room) => sum + room.area, 0);
      expect(total).toBeCloseTo(flat.area, 1);
    }
  });

  it('gives each flat as many bedrooms and living rooms as its room count says', () => {
    for (const flat of flats) {
      const rooms = buildPlan(flat).rooms;
      const bedrooms = rooms.filter(room => room.kind === 'bedroom').length;
      const living = rooms.filter(room => room.kind === 'living').length;
      expect(living).toBe(1);
      expect(bedrooms).toBe(flat.rooms - 1);
    }
  });

  it('gives four room flats two bathrooms and the others one', () => {
    for (const flat of flats) {
      const bathrooms = buildPlan(flat).rooms.filter(room => room.kind === 'bathroom').length;
      expect(bathrooms).toBe(flat.rooms === 4 ? 2 : 1);
    }
  });

  it('labels rooms with unique letters', () => {
    for (const flat of flats) {
      const letters = buildPlan(flat).rooms.map(room => room.letter);
      expect(new Set(letters).size).toBe(letters.length);
    }
  });

  it('keeps every room inside the flat body', () => {
    for (const flat of flats) {
      const { body, rooms } = buildPlan(flat);
      for (const room of rooms) {
        expect(room.x).toBeGreaterThanOrEqual(body.x - 0.001);
        expect(room.y).toBeGreaterThanOrEqual(body.y - 0.001);
        expect(room.x + room.width).toBeLessThanOrEqual(body.x + body.width + 0.001);
        expect(room.y + room.height).toBeLessThanOrEqual(body.y + body.height + 0.001);
      }
    }
  });

  it('puts a window in every bedroom on the courtyard wall and in the living room on the street wall', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      const west = plan.windows.filter(window => window.side === 'west').length;
      const east = plan.windows.filter(window => window.side === 'east').length;
      expect(west).toBe(flat.rooms - 1);
      expect(east).toBeGreaterThanOrEqual(1);
    }
  });

  it('adds a side window only to the corner flats', () => {
    for (const flat of flats) {
      const sides = buildPlan(flat).windows.filter(
        window => window.side === 'south' || window.side === 'north',
      );
      expect(sides.length).toBe(flat.column === 1 || flat.column === 10 ? 1 : 0);
    }
  });

  it('draws the outdoor space with exactly the area in the data', () => {
    for (const flat of flats) {
      const { outdoor } = buildPlan(flat);
      if (!flat.outdoor) {
        expect(outdoor).toBeUndefined();
        continue;
      }
      expect(outdoor).toBeDefined();
      expect(((outdoor?.width ?? 0) * (outdoor?.height ?? 0)) / (metre * metre)).toBeCloseTo(
        flat.outdoor.area,
        5,
      );
    }
  });

  it('puts gardens and balconies on the courtyard side and terraces on the street side', () => {
    for (const flat of flats) {
      const { outdoor } = buildPlan(flat);
      if (!outdoor || !flat.outdoor) continue;
      expect(outdoor.side).toBe(flat.outdoor.kind === 'terrace' ? 'east' : 'west');
    }
  });

  it('fits every drawing inside its own canvas', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      const outdoor = plan.outdoor;
      expect(plan.body.x + plan.body.width).toBeLessThan(plan.width);
      expect(plan.body.y + plan.body.height).toBeLessThan(plan.height);
      if (outdoor) {
        expect(outdoor.y).toBeGreaterThanOrEqual(0);
        expect(outdoor.y + outdoor.height).toBeLessThan(plan.height);
      }
    }
  });

  it('marks a cast iron column in exactly the flats that have one', () => {
    for (const flat of flats) {
      expect(buildPlan(flat).ironColumn !== undefined).toBe(hasIronColumn(flat));
    }
    expect(flats.filter(hasIronColumn).length).toBeGreaterThan(0);
  });

  it('keeps the cast iron column inside the body and clear of the room labels', () => {
    for (const flat of flats.filter(hasIronColumn)) {
      const plan = buildPlan(flat);
      const column = plan.ironColumn;
      expect(column).toBeDefined();
      if (!column) continue;
      expect(column.x).toBeGreaterThan(plan.body.x);
      expect(column.x).toBeLessThan(plan.body.x + plan.body.width);
      expect(column.y).toBeGreaterThan(plan.body.y);
      expect(column.y).toBeLessThan(plan.body.y + plan.body.height);
      for (const room of plan.rooms) {
        const labelTop = room.y + room.height / 2 - 26;
        const insideX = column.x > room.x && column.x < room.x + room.width;
        const insideY = column.y > labelTop - 9 && column.y < room.y + room.height / 2 + 30;
        expect(insideX && insideY).toBe(false);
      }
    }
  });

  it('computes the frontage from the area', () => {
    expect(planWidthMetres(88)).toBeCloseTo(10, 5);
  });
});

describe('doors and fixtures', () => {
  it('connects every room to the hall with its own door and gives the hall an entrance', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      const others = plan.rooms.filter(room => room.kind !== 'hall');
      expect(plan.entrance).toBeDefined();
      expect(plan.doors.length).toBe(others.length);
      for (const room of others) {
        expect(plan.doors.filter(door => door.room === room).length).toBe(1);
      }
    }
  });

  it('opens every door in a wall that the hall shares with the room', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      for (const door of plan.doors) {
        const room = door.room;
        expect(room).toBeDefined();
        if (!room) continue;
        const { gap } = door;
        const inX =
          gap.x + gap.width / 2 >= room.x - 3 && gap.x + gap.width / 2 <= room.x + room.width + 3;
        const inY =
          gap.y + gap.height / 2 >= room.y - 3 &&
          gap.y + gap.height / 2 <= room.y + room.height + 3;
        expect(inX && inY).toBe(true);
        expect(Math.max(gap.width, gap.height)).toBeGreaterThan(0.6 * metre);
      }
    }
  });

  it('keeps every fixture inside the body of the flat', () => {
    for (const flat of flats) {
      const { body, fixtures } = buildPlan(flat);
      expect(fixtures.length).toBeGreaterThan(0);
      for (const fixture of fixtures) {
        expect(fixture.x).toBeGreaterThanOrEqual(body.x);
        expect(fixture.y).toBeGreaterThanOrEqual(body.y);
        expect(fixture.x + fixture.width).toBeLessThanOrEqual(body.x + body.width);
        expect(fixture.y + fixture.height).toBeLessThanOrEqual(body.y + body.height);
      }
    }
  });

  it('puts the chip of hall, bathroom and wardrobe clear of the doors', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      const doors = plan.entrance ? [...plan.doors, plan.entrance] : plan.doors;
      for (const room of plan.rooms.filter(item => item.chip)) {
        const chip = room.chip;
        if (!chip) continue;
        expect(chip.x).toBeGreaterThan(room.x);
        expect(chip.x).toBeLessThan(room.x + room.width);
        expect(chip.y).toBeGreaterThan(room.y);
        expect(chip.y).toBeLessThan(room.y + room.height);
        for (const door of doors) {
          const onRoom =
            door.room === room ||
            (door.hinge.x >= room.x - 1 &&
              door.hinge.x <= room.x + room.width + 1 &&
              door.hinge.y >= room.y - 1 &&
              door.hinge.y <= room.y + room.height + 1);
          if (!onRoom) continue;
          const gap = Math.hypot(chip.x - door.hinge.x, chip.y - door.hinge.y);
          expect(gap).toBeGreaterThan(11);
        }
      }
    }
  });
});

describe('nameFits', () => {
  it('shows a room name only when it fits the room width', () => {
    expect(nameFits({ name: 'Łazienka', width: 60 })).toBe(false);
    expect(nameFits({ name: 'Łazienka', width: 100 })).toBe(true);
  });
});

describe('canvas', () => {
  it('never draws narrower than the minimum canvas and centres the flat', () => {
    for (const flat of flats) {
      const plan = buildPlan(flat);
      expect(plan.width).toBeGreaterThanOrEqual(320);
      expect(plan.origin.x * 2 + plan.body.width).toBeCloseTo(plan.width, 5);
    }
  });
});
