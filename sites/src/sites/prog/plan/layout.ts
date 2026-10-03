import { isRoom, kindOf, nodeArea } from './build';
import type { PlanFloor, PlanNode, RoomKind, Side } from './types';

export interface PlacedRoom {
  name: string;
  kind: RoomKind;
  area: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DoorMark {
  gap: Segment;
  leaf: Segment;
  arc: string;
}

export interface WindowMark {
  gap: Segment;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlanLayout {
  width: number;
  height: number;
  rooms: PlacedRoom[];
  doors: DoorMark[];
  windows: WindowMark[];
  entrance: DoorMark | null;
  entranceSide: Side | null;
  stairsOptions: Box[];
  balcony: Box | null;
  bounds: Box;
}

const epsilon = 0.01;
export const planScale = 56;
const padding = 30;

const roundUnit = (value: number): number => Math.round(value * 100) / 100;

const placeNode = (node: PlanNode, box: Box, out: PlacedRoom[]): void => {
  if (isRoom(node)) {
    out.push({
      name: node.name,
      kind: kindOf(node.name),
      area: node.area,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
    });
    return;
  }
  const total = nodeArea(node);
  let cursor = node.direction === 'row' ? box.x : box.y;
  for (const child of node.children) {
    const share = nodeArea(child) / total;
    if (node.direction === 'row') {
      const w = box.w * share;
      placeNode(child, { x: cursor, y: box.y, w, h: box.h }, out);
      cursor += w;
    } else {
      const h = box.h * share;
      placeNode(child, { x: box.x, y: cursor, w: box.w, h }, out);
      cursor += h;
    }
  }
};

interface SharedEdge {
  orientation: 'vertical' | 'horizontal';
  fixed: number;
  from: number;
  to: number;
}

const sharedEdge = (a: PlacedRoom, b: PlacedRoom): SharedEdge | null => {
  if (Math.abs(a.x + a.w - b.x) < epsilon || Math.abs(b.x + b.w - a.x) < epsilon) {
    const from = Math.max(a.y, b.y);
    const to = Math.min(a.y + a.h, b.y + b.h);
    if (to - from > epsilon) {
      const fixed = Math.abs(a.x + a.w - b.x) < epsilon ? b.x : a.x;
      return { orientation: 'vertical', fixed, from, to };
    }
  }
  if (Math.abs(a.y + a.h - b.y) < epsilon || Math.abs(b.y + b.h - a.y) < epsilon) {
    const from = Math.max(a.x, b.x);
    const to = Math.min(a.x + a.w, b.x + b.w);
    if (to - from > epsilon) {
      const fixed = Math.abs(a.y + a.h - b.y) < epsilon ? b.y : a.y;
      return { orientation: 'horizontal', fixed, from, to };
    }
  }
  return null;
};

const makeDoor = (
  orientation: 'vertical' | 'horizontal',
  fixed: number,
  start: number,
  size: number,
  inward: 1 | -1,
): DoorMark => {
  const along = (value: number) =>
    orientation === 'vertical' ? { x: fixed, y: value } : { x: value, y: fixed };
  const hinge = along(start);
  const open = along(start + size);
  const unit = orientation === 'vertical' ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const normal = orientation === 'vertical' ? { x: inward, y: 0 } : { x: 0, y: inward };
  const leafEnd = { x: hinge.x + normal.x * size, y: hinge.y + normal.y * size };
  const sweep = normal.x * unit.y - normal.y * unit.x > 0 ? 1 : 0;
  return {
    gap: { x1: hinge.x, y1: hinge.y, x2: open.x, y2: open.y },
    leaf: { x1: hinge.x, y1: hinge.y, x2: leafEnd.x, y2: leafEnd.y },
    arc: `M${roundUnit(leafEnd.x)} ${roundUnit(leafEnd.y)}A${roundUnit(size)} ${roundUnit(size)} 0 0 ${sweep} ${roundUnit(open.x)} ${roundUnit(open.y)}`,
  };
};

const hubPriority: Record<RoomKind, number> = {
  hall: 0,
  living: 1,
  kitchen: 2,
  office: 3,
  bedroom: 3,
  storage: 4,
  bath: 5,
  garage: 5,
};

const doorBetween = (inner: PlacedRoom, other: PlacedRoom, scale: number): DoorMark | null => {
  const edge = sharedEdge(inner, other);
  if (!edge) return null;
  const size = (inner.kind === 'bath' || inner.kind === 'storage' ? 0.7 : 0.85) * scale;
  const length = edge.to - edge.from;
  if (length < size + 0.3 * scale) return null;
  const start = edge.from + (length - size) / 2;
  const innerIsLeftOrTop =
    edge.orientation === 'vertical'
      ? inner.x < edge.fixed - epsilon
      : inner.y < edge.fixed - epsilon;
  const opensIntoInner =
    !(inner.kind === 'bath' || inner.kind === 'storage') || inner.area >= other.area * 0.5;
  const towardInner = innerIsLeftOrTop ? -1 : 1;
  return makeDoor(
    edge.orientation,
    edge.fixed,
    start,
    size,
    opensIntoInner ? towardInner : towardInner === 1 ? -1 : 1,
  );
};

const connectRooms = (rooms: PlacedRoom[], scale: number): DoorMark[] => {
  const doors: DoorMark[] = [];
  const halls = rooms.filter(candidate => candidate.kind === 'hall');
  const roots = halls.length > 0 ? halls : rooms.filter(candidate => candidate.kind === 'living');
  const connected = new Set<PlacedRoom>(roots);
  let progress = true;
  while (progress && connected.size < rooms.length) {
    progress = false;
    const waiting = rooms
      .filter(candidate => !connected.has(candidate))
      .sort((a, b) => hubPriority[a.kind] - hubPriority[b.kind] || b.area - a.area);
    for (const current of waiting) {
      const options = [...connected]
        .sort((a, b) => hubPriority[a.kind] - hubPriority[b.kind] || b.area - a.area)
        .map(other => ({ other, door: doorBetween(current, other, scale) }))
        .filter(option => option.door !== null);
      const choice = options[0];
      if (!choice || !choice.door) continue;
      doors.push(choice.door);
      connected.add(current);
      progress = true;
      break;
    }
  }
  return doors;
};

const touches = (room: PlacedRoom, side: Side, width: number, height: number): boolean => {
  if (side === 'top') return room.y < epsilon;
  if (side === 'bottom') return Math.abs(room.y + room.h - height) < epsilon;
  if (side === 'left') return room.x < epsilon;
  return Math.abs(room.x + room.w - width) < epsilon;
};

const edgeLength = (room: PlacedRoom, side: Side): number =>
  side === 'top' || side === 'bottom' ? room.w : room.h;

const edgeStart = (room: PlacedRoom, side: Side): number =>
  side === 'top' || side === 'bottom' ? room.x : room.y;

const wallLine = (side: Side, width: number, height: number): number => {
  if (side === 'top' || side === 'left') return 0;
  return side === 'bottom' ? height : width;
};

const windowFor = (
  room: PlacedRoom,
  side: Side,
  line: number,
  scale: number,
): WindowMark | null => {
  const length = edgeLength(room, side);
  if (length < 1.5 * scale) return null;
  const size = Math.min(Math.max(length * 0.55, 0.85 * scale), 2.2 * scale);
  const start = edgeStart(room, side) + (length - size) / 2;
  const horizontal = side === 'top' || side === 'bottom';
  return {
    gap: horizontal
      ? { x1: start, y1: line, x2: start + size, y2: line }
      : { x1: line, y1: start, x2: line, y2: start + size },
  };
};

const hasWindows = (kind: RoomKind): boolean =>
  kind === 'living' || kind === 'kitchen' || kind === 'bedroom' || kind === 'office';

const entranceDoor = (
  rooms: PlacedRoom[],
  side: Side,
  width: number,
  height: number,
  scale: number,
): DoorMark | null => {
  const onSide = rooms.filter(candidate => touches(candidate, side, width, height));
  const host =
    onSide.filter(candidate => candidate.kind === 'hall').sort((a, b) => b.area - a.area)[0] ??
    onSide.sort((a, b) => b.area - a.area)[0];
  if (!host) return null;
  const size = 0.95 * scale;
  const length = edgeLength(host, side);
  const start = edgeStart(host, side) + Math.max((length - size) / 2, 0.1 * scale);
  const line = wallLine(side, width, height);
  const horizontal = side === 'top' || side === 'bottom';
  const inward = side === 'top' || side === 'left' ? 1 : -1;
  return makeDoor(horizontal ? 'horizontal' : 'vertical', line, start, size, inward);
};

const balconyBox = (
  rooms: PlacedRoom[],
  floor: PlanFloor,
  width: number,
  height: number,
  scale: number,
): Box | null => {
  if (!floor.balcony) return null;
  const target = rooms.find(candidate => candidate.name === floor.balcony?.room);
  if (!target || !touches(target, floor.balcony.side, width, height)) return null;
  const side = floor.balcony.side;
  const length = edgeLength(target, side);
  const span = Math.min(length * 0.9, 3.6 * scale);
  const depth = Math.min(Math.max((floor.balcony.area * scale * scale) / span, scale), 2.2 * scale);
  const start = edgeStart(target, side) + (length - span) / 2;
  if (side === 'top') return { x: start, y: -depth, w: span, h: depth };
  if (side === 'bottom') return { x: start, y: height, w: span, h: depth };
  if (side === 'left') return { x: -depth, y: start, w: depth, h: span };
  return { x: width, y: start, w: depth, h: span };
};

const stairPositions: readonly number[] = [0.5, 0.2, 0.8, 0, 1, 0.35, 0.65, 0.1, 0.9];
const stairLengths: readonly number[] = [1, 0.75];

const stairsOptions = (rooms: PlacedRoom[], floor: PlanFloor, scale: number): Box[] => {
  if (!floor.stairsIn) return [];
  const host = rooms.find(candidate => candidate.name === floor.stairsIn);
  if (!host) return [];
  const lengthwise = host.w > host.h;
  const hostLong = lengthwise ? host.w : host.h;
  const hostShort = lengthwise ? host.h : host.w;
  const short = Math.min(hostShort - 0.4 * scale, 0.85 * scale);
  const edge = 0.2 * scale;
  return stairLengths.flatMap(lengthShare => {
    const long = Math.min(hostLong - 0.4 * scale, 2.2 * scale) * lengthShare;
    if (short < 0.5 * scale || long < 1 * scale) return [];
    const w = lengthwise ? long : short;
    const h = lengthwise ? short : long;
    const slackX = host.w - w;
    const slackY = host.h - h;
    return stairPositions.map(fraction => {
      const along = (slack: number) =>
        slack < 2 * edge ? slack / 2 : Math.min(Math.max(slack * fraction, edge), slack - edge);
      return {
        x: host.x + (lengthwise ? along(slackX) : slackX / 2),
        y: host.y + (lengthwise ? slackY / 2 : along(slackY)),
        w,
        h,
      };
    });
  });
};

export const layoutPlan = (floor: PlanFloor, scale = planScale): PlanLayout => {
  const area = nodeArea(floor.root);
  const widthMeters = Math.sqrt(area * floor.ratio);
  const heightMeters = area / widthMeters;
  const width = widthMeters * scale;
  const height = heightMeters * scale;
  const rooms: PlacedRoom[] = [];
  placeNode(floor.root, { x: 0, y: 0, w: width, h: height }, rooms);

  const windows: WindowMark[] = [];
  for (const placed of rooms) {
    if (!hasWindows(placed.kind)) continue;
    for (const side of floor.windowSides) {
      if (!touches(placed, side, width, height)) continue;
      const mark = windowFor(placed, side, wallLine(side, width, height), scale);
      if (mark) windows.push(mark);
    }
  }

  const balcony = balconyBox(rooms, floor, width, height, scale);
  const left = Math.min(0, balcony?.x ?? 0) - padding;
  const top = Math.min(0, balcony?.y ?? 0) - padding;
  const right = Math.max(width, balcony ? balcony.x + balcony.w : 0) + padding;
  const bottom = Math.max(height, balcony ? balcony.y + balcony.h : 0) + padding;

  return {
    width,
    height,
    rooms,
    doors: connectRooms(rooms, scale),
    windows,
    entrance: floor.entrance ? entranceDoor(rooms, floor.entrance, width, height, scale) : null,
    entranceSide: floor.entrance ?? null,
    stairsOptions: stairsOptions(rooms, floor, scale),
    balcony,
    bounds: { x: left, y: top, w: right - left, h: bottom - top },
  };
};
