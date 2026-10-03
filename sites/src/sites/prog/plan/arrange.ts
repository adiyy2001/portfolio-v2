import { formatDecimal } from '../lib/format';
import {
  bestLabelSpot,
  doorObstacles,
  fitsRoom,
  labelSize,
  labelTiers,
  overlapArea,
  type LabelTier,
} from './labels';
import type { Box, DoorMark, PlacedRoom, PlanLayout } from './layout';

export interface LabeledRoom extends PlacedRoom {
  areaText: string;
  tier: LabelTier;
  showName: boolean;
  upright: boolean;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  cost: number;
}

export interface Arrangement {
  rooms: LabeledRoom[];
  stairs: Box | null;
  score: number;
}

const missingNamePenalty = 400;
const uprightPenalty = 60;
const stairsOnDoorWeight = 40;
const costWeight = 2;

const rank = (item: LabeledRoom): number =>
  item.cost * costWeight +
  (item.showName ? 0 : missingNamePenalty) +
  (item.upright ? uprightPenalty : 0);

const labelRoom = (room: PlacedRoom, obstacles: readonly Box[]): LabeledRoom => {
  const areaText = `${formatDecimal(room.area, 1)} m²`;
  const canStand = room.h > room.w;
  const attempts = [
    ...labelTiers.flatMap(tier =>
      [false, ...(canStand ? [true] : [])].map(upright => ({ tier, showName: true, upright })),
    ),
    ...labelTiers.map(tier => ({ tier, showName: false, upright: false })),
  ];
  let best: LabeledRoom | null = null;
  for (const attempt of attempts) {
    const flat = labelSize(room.name, areaText, attempt.tier, attempt.showName);
    const size = attempt.upright ? { width: flat.height, height: flat.width } : flat;
    if (!fitsRoom(room, size)) continue;
    const { spot, cost } = bestLabelSpot(room, size, obstacles);
    const candidate: LabeledRoom = {
      ...room,
      areaText,
      tier: attempt.tier,
      showName: attempt.showName,
      upright: attempt.upright,
      width: size.width,
      height: size.height,
      centerX: spot.x,
      centerY: spot.y,
      cost,
    };
    if (cost === 0 && attempt.showName && !attempt.upright) return candidate;
    if (!best || rank(candidate) < rank(best)) best = candidate;
  }
  if (best) return best;
  const smallest = labelTiers[labelTiers.length - 1] ?? labelTiers[0];
  if (!smallest) throw new Error('no label tiers');
  return {
    ...room,
    areaText,
    tier: smallest,
    showName: false,
    upright: false,
    width: 0,
    height: 0,
    centerX: room.x + room.w / 2,
    centerY: room.y + room.h / 2,
    cost: 0,
  };
};

const arrangeWith = (
  rooms: readonly PlacedRoom[],
  doors: readonly DoorMark[],
  stairs: Box | null,
): Arrangement => {
  const doorBoxes = doors.flatMap(doorObstacles);
  const obstacles = [...doorBoxes, ...(stairs ? [inflate(stairs, 8)] : [])];
  const labeled = rooms.map(room => labelRoom(room, obstacles));
  const stairsOnDoors = stairs
    ? doorBoxes.reduce((sum, box) => sum + overlapArea(stairs, box), 0)
    : 0;
  const score = labeled.reduce((sum, item) => sum + rank(item), stairsOnDoors * stairsOnDoorWeight);
  return { rooms: labeled, stairs, score };
};

const inflate = (box: Box, margin: number): Box => ({
  x: box.x - margin,
  y: box.y - margin,
  w: box.w + margin * 2,
  h: box.h + margin * 2,
});

export const arrangePlan = (layout: PlanLayout): Arrangement => {
  const doors = [...layout.doors, ...(layout.entrance ? [layout.entrance] : [])];
  const options: (Box | null)[] = layout.stairsOptions.length > 0 ? layout.stairsOptions : [null];
  const arrangements = options.map(stairs => arrangeWith(layout.rooms, doors, stairs));
  return arrangements.reduce((best, next) => (next.score < best.score ? next : best));
};
