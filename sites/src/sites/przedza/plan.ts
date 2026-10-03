import { hasIronColumn } from './building';
import type { Flat, OutdoorKind, Rooms } from './types';

export const metre = 36;
export const internalDepth = 8.8;
export const margin = { left: 44, right: 44, top: 52, bottom: 76 };
export const minCanvasWidth = 320;
export const edge = 16;

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RoomKind = 'living' | 'bedroom' | 'hall' | 'bathroom' | 'wardrobe';

export interface PlanRoom extends Rect {
  letter: string;
  chip?: Point;
  name: string;
  kind: RoomKind;
  area: number;
}

export interface PlanWindow {
  side: 'west' | 'east' | 'south' | 'north';
  start: number;
  length: number;
}

export interface PlanDoor {
  gap: Rect;
  hinge: Point;
  leafEnd: Point;
  closedEnd: Point;
  sweep: 0 | 1;
  room: PlanRoom | undefined;
  edge: 'top' | 'bottom' | 'west';
}

export type FixtureKind =
  'tub' | 'basin' | 'toilet-tank' | 'toilet-bowl' | 'counter' | 'sink' | 'hob' | 'fridge';

export interface PlanFixture extends Rect {
  kind: FixtureKind;
  round: boolean;
}

export interface PlanOutdoor extends Rect {
  kind: OutdoorKind;
  area: number;
  side: 'west' | 'east';
}

export interface Plan {
  width: number;
  height: number;
  origin: { x: number; y: number };
  body: Rect;
  widthMetres: number;
  depthMetres: number;
  rooms: PlanRoom[];
  windows: PlanWindow[];
  entrance: PlanDoor | undefined;
  doors: PlanDoor[];
  fixtures: PlanFixture[];
  kitchenWidth: number;
  outdoor: PlanOutdoor | undefined;
  ironColumn: { x: number; y: number } | undefined;
}

interface Cell {
  name: string;
  kind: RoomKind;
  share: number;
}

interface Band {
  depth: number;
  cells: Cell[];
}

const bedroom = (share: number): Cell => ({ name: 'Sypialnia', kind: 'bedroom', share });
const bathroom = (share: number): Cell => ({ name: 'Łazienka', kind: 'bathroom', share });
const hall = (share: number): Cell => ({ name: 'Przedpokój', kind: 'hall', share });

export const kitchenDepth = 0.55 * metre;
export const kitchenLength = 2.4 * metre;
const fridgeSize = 20;

const livingBand = (depth: number): Band => ({
  depth,
  cells: [{ name: 'Salon z aneksem', kind: 'living', share: 1 }],
});

const layouts: Record<Rooms, Band[]> = {
  2: [
    { depth: 0.33, cells: [bedroom(1)] },
    { depth: 0.22, cells: [hall(0.6), bathroom(0.4)] },
    livingBand(0.45),
  ],
  3: [
    { depth: 0.34, cells: [bathroom(0.25), bedroom(0.37), bedroom(0.38)] },
    { depth: 0.22, cells: [hall(0.8), { name: 'Garderoba', kind: 'wardrobe', share: 0.2 }] },
    livingBand(0.44),
  ],
  4: [
    {
      depth: 0.36,
      cells: [bathroom(0.18), bedroom(0.82 / 3), bedroom(0.82 / 3), bedroom(0.82 / 3)],
    },
    { depth: 0.22, cells: [hall(0.85), bathroom(0.15)] },
    livingBand(0.42),
  ],
};

const letters = 'ABCDEFGHIJ';
const balconyDepth = 1.4;
const terraceDepth = 3.2;
const gardenDepth = 3;
const windowLength = 1.5;

const round1 = (value: number) => Math.round(value * 10) / 10;

export const planWidthMetres = (area: number) => area / internalDepth;

const outdoorSize = (flat: Flat, bodyWidth: number) => {
  if (!flat.outdoor) return undefined;
  const { kind, area } = flat.outdoor;
  const depth = kind === 'terrace' ? terraceDepth : kind === 'balcony' ? balconyDepth : gardenDepth;
  const width = Math.min(bodyWidth - 1.2 * metre, (area / depth) * metre);
  return {
    kind,
    area,
    side: kind === 'terrace' ? ('east' as const) : ('west' as const),
    width,
    height: (area * metre * metre) / width,
  };
};

const windowsFor = (flat: Flat, rooms: PlanRoom[], body: Rect) => {
  const result: PlanWindow[] = [];
  for (const room of rooms.filter(item => item.kind === 'bedroom')) {
    const centre = (room.x - body.x + room.width / 2) / metre;
    result.push({ side: 'west', start: centre - windowLength / 2, length: windowLength });
  }
  const living = rooms.find(room => room.kind === 'living');
  if (!living) return result;
  const livingWidth = living.width / metre;
  const count = livingWidth > 5.5 ? 2 : 1;
  for (let index = 0; index < count; index += 1) {
    const centre = (livingWidth * (index + 1)) / (count + 1);
    result.push({ side: 'east', start: centre - windowLength / 2, length: windowLength });
  }
  const livingCentre = (living.y - body.y + living.height / 2) / metre;
  const sideStart = livingCentre - windowLength / 2;
  if (flat.column === 1) result.push({ side: 'south', start: sideStart, length: windowLength });
  if (flat.column === 10) result.push({ side: 'north', start: sideStart, length: windowLength });
  return result;
};

const doorGapThickness = 4;
const entranceGapThickness = 8;
const minimumDoorMargin = 8;

const makeDoor = (
  orientation: 'horizontal' | 'vertical',
  fixed: number,
  from: number,
  to: number,
  direction: 1 | -1,
  hingeAtStart: boolean,
  thickness: number,
  room: PlanRoom | undefined,
  edge: PlanDoor['edge'],
): PlanDoor => {
  const length = Math.min(swing, to - from - minimumDoorMargin);
  const middle = (from + to) / 2;
  const start = middle - length / 2;
  const end = middle + length / 2;
  const along = (value: number, across: number): Point =>
    orientation === 'horizontal' ? { x: value, y: across } : { x: across, y: value };
  const hinge = along(hingeAtStart ? start : end, fixed);
  const closedEnd = along(hingeAtStart ? end : start, fixed);
  const leafEnd = along(hingeAtStart ? start : end, fixed + direction * length);
  const turn =
    (leafEnd.x - hinge.x) * (closedEnd.y - hinge.y) -
    (leafEnd.y - hinge.y) * (closedEnd.x - hinge.x);
  const gap: Rect =
    orientation === 'horizontal'
      ? { x: start, y: fixed - thickness / 2, width: length, height: thickness }
      : { x: fixed - thickness / 2, y: start, width: thickness, height: length };
  return { gap, hinge, leafEnd, closedEnd, sweep: turn > 0 ? 1 : 0, room, edge };
};

const touching = (a: number, b: number) => Math.abs(a - b) < 0.5;
const overlap = (aFrom: number, aTo: number, bFrom: number, bTo: number) => ({
  from: Math.max(aFrom, bFrom),
  to: Math.min(aTo, bTo),
});
const opensIntoRoom = (room: PlanRoom) => room.kind === 'bedroom' || room.kind === 'living';
const minimumDoorSpan = 0.7 * metre + minimumDoorMargin;

const clearOfEntrance = (hall: PlanRoom, span: { from: number; to: number }) => {
  const from = Math.max(span.from, hall.x + swing + 6);
  return span.to - from >= minimumDoorSpan ? { from, to: span.to } : span;
};

const doorsFromHall = (hall: PlanRoom, rooms: PlanRoom[]) => {
  const doors: PlanDoor[] = [];
  rooms
    .filter(room => room !== hall)
    .forEach((room, index) => {
      const hingeAtStart = index % 2 === 0;
      const into = opensIntoRoom(room);
      if (touching(room.y + room.height, hall.y)) {
        const span = clearOfEntrance(
          hall,
          overlap(room.x, room.x + room.width, hall.x, hall.x + hall.width),
        );
        if (span.to - span.from >= minimumDoorSpan)
          doors.push(
            makeDoor(
              'horizontal',
              hall.y,
              span.from,
              span.to,
              into ? -1 : 1,
              hingeAtStart,
              doorGapThickness,
              room,
              'bottom',
            ),
          );
      } else if (touching(hall.y + hall.height, room.y)) {
        const span = clearOfEntrance(
          hall,
          overlap(room.x, room.x + room.width, hall.x, hall.x + hall.width),
        );
        if (span.to - span.from >= minimumDoorSpan)
          doors.push(
            makeDoor(
              'horizontal',
              room.y,
              span.from,
              span.to,
              into ? 1 : -1,
              hingeAtStart,
              doorGapThickness,
              room,
              'top',
            ),
          );
      } else if (touching(hall.x + hall.width, room.x)) {
        const span = overlap(room.y, room.y + room.height, hall.y, hall.y + hall.height);
        if (span.to - span.from >= minimumDoorSpan)
          doors.push(
            makeDoor(
              'vertical',
              room.x,
              span.from,
              span.to,
              into ? 1 : -1,
              hingeAtStart,
              doorGapThickness,
              room,
              'west',
            ),
          );
      }
    });
  return doors;
};

const bathFixtures = (room: PlanRoom, doorEdge: PlanDoor['edge'] | undefined): PlanFixture[] => {
  const inset = 4;
  const tubWidth = 0.7 * metre;
  const tubLength = Math.min(1.6 * metre, room.height - 2 * inset);
  const hasTub = room.width >= 1.4 * metre;
  const topMounted: PlanFixture[] = [
    { kind: 'toilet-tank', round: false, x: room.x + 8, y: room.y + inset, width: 12, height: 5 },
    {
      kind: 'toilet-bowl',
      round: true,
      x: room.x + 8,
      y: room.y + inset + 5,
      width: 12,
      height: 16,
    },
  ];
  if (hasTub) {
    topMounted.push(
      {
        kind: 'tub',
        round: false,
        x: room.x + room.width - inset - tubWidth,
        y: room.y + inset,
        width: tubWidth,
        height: tubLength,
      },
      { kind: 'basin', round: false, x: room.x + 24, y: room.y + inset, width: 11, height: 9 },
    );
  }
  if (doorEdge !== 'top') return topMounted;
  return topMounted.map(fixture => ({
    ...fixture,
    y: room.y + room.height - (fixture.y - room.y) - fixture.height,
  }));
};

const chipRadius = 11;

const clearanceFromRect = (point: Point, rect: Rect) => {
  const dx = Math.max(rect.x - point.x, 0, point.x - rect.x - rect.width);
  const dy = Math.max(rect.y - point.y, 0, point.y - rect.y - rect.height);
  return Math.hypot(dx, dy);
};

const chipSpot = (room: PlanRoom, doors: PlanDoor[], fixtures: PlanFixture[]): Point => {
  const step = 4;
  const margin = chipRadius + 3;
  const centre = { x: room.x + room.width / 2, y: room.y + room.height / 2 };
  const nearby = doors.filter(
    door => door.room === room || clearanceFromRect(door.hinge, room) < 1,
  );
  const inside = fixtures.filter(
    fixture => clearanceFromRect({ x: fixture.x, y: fixture.y }, room) < 1,
  );
  let best = centre;
  let bestScore = -Infinity;
  for (let x = room.x + margin; x <= room.x + room.width - margin; x += step) {
    for (let y = room.y + margin; y <= room.y + room.height - margin; y += step) {
      const point = { x, y };
      const fromDoors = nearby.map(
        door => Math.hypot(point.x - door.hinge.x, point.y - door.hinge.y) - swing,
      );
      const fromFixtures = inside.map(fixture => clearanceFromRect(point, fixture));
      const clearance = Math.min(chipRadius * 2, ...fromDoors, ...fromFixtures);
      const score = clearance * 100 - Math.hypot(point.x - centre.x, point.y - centre.y);
      if (score > bestScore) {
        bestScore = score;
        best = point;
      }
    }
  }
  return best;
};

const kitchenFixtures = (body: Rect, living: PlanRoom): PlanFixture[] => {
  const top = living.y + 8;
  const length = Math.min(kitchenLength, living.height - 16);
  const x = body.x + 3;
  const hobX = x + 5;
  const hobY = top + length * 0.55;
  const burners = [0, 1, 2, 3].map(index => ({
    kind: 'hob' as const,
    round: true,
    x: hobX + (index % 2) * 8,
    y: hobY + Math.floor(index / 2) * 8,
    width: 6,
    height: 6,
  }));
  return [
    { kind: 'counter', round: false, x, y: top, width: kitchenDepth, height: length },
    { kind: 'sink', round: false, x: x + 3, y: top + 8, width: kitchenDepth - 6, height: 22 },
    ...burners,
    {
      kind: 'fridge',
      round: false,
      x,
      y: top + length - fridgeSize,
      width: kitchenDepth,
      height: fridgeSize,
    },
  ];
};

export const buildPlan = (flat: Flat): Plan => {
  const widthMetres = planWidthMetres(flat.area);
  const bodyWidth = widthMetres * metre;
  const bodyHeight = internalDepth * metre;

  const size = outdoorSize(flat, bodyWidth);
  const topExtra = size?.side === 'west' ? size.height : 0;
  const bottomExtra = size?.side === 'east' ? size.height : 0;

  const canvasWidth = Math.max(bodyWidth + margin.left + margin.right, minCanvasWidth);
  const origin = { x: (canvasWidth - bodyWidth) / 2, y: margin.top + topExtra };
  const body: Rect = { x: origin.x, y: origin.y, width: bodyWidth, height: bodyHeight };

  const rooms: PlanRoom[] = [];
  let bandTop = body.y;
  let letterIndex = 0;
  for (const band of layouts[flat.rooms]) {
    const height = bodyHeight * band.depth;
    let cellLeft = body.x;
    for (const cell of band.cells) {
      const width = bodyWidth * cell.share;
      rooms.push({
        x: cellLeft,
        y: bandTop,
        width,
        height,
        letter: letters[letterIndex],
        name: cell.name,
        kind: cell.kind,
        area: round1(flat.area * band.depth * cell.share),
      });
      letterIndex += 1;
      cellLeft += width;
    }
    bandTop += height;
  }

  const living = rooms.find(room => room.kind === 'living');
  if (living) {
    const others = rooms.filter(room => room !== living).reduce((sum, room) => sum + room.area, 0);
    living.area = round1(flat.area - others);
  }

  const hall = rooms.find(room => room.kind === 'hall');
  const doors = hall ? doorsFromHall(hall, rooms) : [];
  const entrance = hall
    ? makeDoor(
        'vertical',
        body.x,
        hall.y,
        hall.y + hall.height,
        1,
        true,
        entranceGapThickness,
        hall,
        'west',
      )
    : undefined;
  const kitchenWidth = living ? kitchenDepth + 6 : 0;
  const fixtures = [
    ...(living ? kitchenFixtures(body, living) : []),
    ...rooms
      .filter(room => room.kind === 'bathroom')
      .flatMap(room => bathFixtures(room, doors.find(door => door.room === room)?.edge)),
  ];

  const allDoors = entrance ? [...doors, entrance] : doors;
  for (const room of rooms.filter(item => !opensIntoRoom(item))) {
    room.chip = chipSpot(room, allDoors, fixtures);
  }

  const outdoor: PlanOutdoor | undefined = size && {
    ...size,
    x: body.x + 0.6 * metre,
    y: size.side === 'east' ? body.y + body.height : body.y - size.height,
  };
  const livingRoom = living ?? rooms[rooms.length - 1];
  const ironColumn = hasIronColumn(flat)
    ? { x: body.x + body.width / 2, y: livingRoom.y + Math.min(22, livingRoom.height * 0.2) }
    : undefined;

  return {
    width: canvasWidth,
    height: margin.top + topExtra + bodyHeight + bottomExtra + margin.bottom,
    origin,
    body,
    widthMetres,
    depthMetres: internalDepth,
    rooms,
    windows: windowsFor(flat, rooms, body),
    entrance,
    doors,
    fixtures,
    kitchenWidth,
    outdoor,
    ironColumn,
  };
};

const nameCharWidth = 8.4;

export const nameFits = (room: Pick<PlanRoom, 'name' | 'width'>) =>
  room.width >= room.name.length * nameCharWidth + 10;

export const labelCentre = (room: PlanRoom, kitchenWidth: number) =>
  room.kind === 'living' ? room.x + (room.width + kitchenWidth) / 2 : room.x + room.width / 2;

export const swing = 0.9 * metre;
