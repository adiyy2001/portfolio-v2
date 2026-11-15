import { describe, expect, it } from 'vitest';
import { types } from './data';
import { buildPlan, planSpec } from './plan';
import { comma } from './format';

describe('plan geometry', () => {
  it('labels every room with its area from the data', () => {
    for (const type of types) {
      const { markup } = buildPlan(type);
      const labels = [...markup.matchAll(/class="area"[^>]*>([^<]+)</g)].map(match => match[1]);
      const expected = type.roomList.map(room => comma(room.area));
      if (type.terrace) expected.push(`Taras ${comma(type.terrace)} m²`);
      expect(labels.sort()).toEqual(expected.sort());
    }
  });

  it('matches the number of north rooms to the data', () => {
    for (const type of types) {
      expect(planSpec(type.key).northWidths.length).toBe(type.roomList.length - 1);
    }
  });

  it('places one door from the living room into every north room', () => {
    for (const type of types) {
      const spec = planSpec(type.key);
      expect(spec.innerDoors.length).toBe(spec.northWidths.length);
      let start = 40;
      spec.northWidths.forEach((width, i) => {
        const door = spec.innerDoors[i];
        expect(door.x).toBeGreaterThanOrEqual(start);
        expect(door.x + door.length).toBeLessThanOrEqual(start + width);
        start += width;
      });
    }
  });

  it('keeps the entrance inside the last north room', () => {
    for (const type of types) {
      const spec = planSpec(type.key);
      const right = spec.outer.x + spec.outer.w;
      expect(spec.entranceX + 54).toBeLessThanOrEqual(right);
    }
  });
});
