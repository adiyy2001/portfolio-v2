import { describe, expect, it } from 'vitest';
import { listings } from '../data/listings';
import { arrangePlan } from './arrange';
import { doorObstacles, overlapArea } from './labels';
import { layoutPlan, planScale } from './layout';

const floors = listings.flatMap(listing =>
  listing.plan.map((floor, index) => ({ slug: `${listing.slug}#${index}`, floor })),
);

const grazeLimit = 40;

describe('arrangePlan on every offer', () => {
  it('has plans to check', () => {
    expect(floors.length).toBeGreaterThan(20);
  });

  it('prints the room name next to the area in every room', () => {
    const unnamed = floors.flatMap(({ slug, floor }) =>
      arrangePlan(layoutPlan(floor, planScale))
        .rooms.filter(room => !room.showName)
        .map(room => `${slug}:${room.name}`),
    );
    expect(unnamed).toEqual([]);
  });

  it('keeps labels clear of door swings and stairs', () => {
    const clashes = floors.flatMap(({ slug, floor }) => {
      const layout = layoutPlan(floor, planScale);
      const { rooms, stairs } = arrangePlan(layout);
      const doors = [...layout.doors, ...(layout.entrance ? [layout.entrance] : [])];
      const obstacles = [...doors.flatMap(doorObstacles), ...(stairs ? [stairs] : [])];
      return rooms.flatMap(room => {
        const box = {
          x: room.centerX - room.width / 2,
          y: room.centerY - room.height / 2,
          w: room.width,
          h: room.height,
        };
        return obstacles.some(obstacle => overlapArea(box, obstacle) > grazeLimit)
          ? [`${slug}:${room.name}`]
          : [];
      });
    });
    expect(clashes).toEqual([]);
  });

  it('keeps every label inside its room', () => {
    const outside = floors.flatMap(({ slug, floor }) =>
      arrangePlan(layoutPlan(floor, planScale)).rooms.flatMap(room => {
        const inside =
          room.centerX - room.width / 2 >= room.x &&
          room.centerX + room.width / 2 <= room.x + room.w &&
          room.centerY - room.height / 2 >= room.y &&
          room.centerY + room.height / 2 <= room.y + room.h;
        return inside ? [] : [`${slug}:${room.name}`];
      }),
    );
    expect(outside).toEqual([]);
  });

  it('gives every room at least one door', () => {
    const closed = floors.flatMap(({ slug, floor }) => {
      const layout = layoutPlan(floor, planScale);
      const needed = layout.rooms.length - (floor.entrance ? 0 : 1);
      const doors = layout.doors.length + (layout.entrance ? 1 : 0);
      return doors >= needed ? [] : [`${slug}:${needed - doors}`];
    });
    expect(closed).toEqual([]);
  });
});
