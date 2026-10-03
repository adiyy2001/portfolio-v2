import { createRandom } from './random';
import { arch, circle, line, polygon, rect } from './shapes';

export type BuildingKind = 'kamienica' | 'loft' | 'blok' | 'nowy' | 'willa' | 'dom';
export type RoofKind = 'dwuspadowy' | 'kopertowy' | 'mansardowy' | 'plaski' | 'jednospadowy';

export interface MarkedRange {
  floors: readonly [number, number];
  bays: readonly [number, number];
}

export interface FacadeSpec {
  seed: string;
  kind: BuildingKind;
  floors: number;
  bays: number;
  roof: RoofKind;
  tone: number;
  mark?: MarkedRange;
  units?: number;
}

export type Role =
  | 'neighbour'
  | 'neighbourWindow'
  | 'tree'
  | 'wall'
  | 'shade'
  | 'roof'
  | 'gable'
  | 'stack'
  | 'door'
  | 'glass'
  | 'lit'
  | 'blind'
  | 'sill'
  | 'mullion'
  | 'rail'
  | 'step'
  | 'flat'
  | 'flatFrame'
  | 'bracket';

export interface Layer {
  role: Role;
  d: string;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Drawing {
  width: number;
  height: number;
  layers: readonly Layer[];
  marked: Box | null;
  doorX: number;
}

interface Profile {
  bayW: number;
  floorH: number;
  groundH: number;
  winW: number;
  winH: number;
  lift: number;
}

export const profiles: Record<BuildingKind, Profile> = {
  kamienica: { bayW: 36, floorH: 40, groundH: 46, winW: 15, winH: 26, lift: 7 },
  loft: { bayW: 44, floorH: 48, groundH: 52, winW: 24, winH: 38, lift: 5 },
  blok: { bayW: 30, floorH: 28, groundH: 32, winW: 16, winH: 15, lift: 8 },
  nowy: { bayW: 40, floorH: 33, groundH: 38, winW: 28, winH: 22, lift: 6 },
  willa: { bayW: 38, floorH: 42, groundH: 44, winW: 16, winH: 24, lift: 9 },
  dom: { bayW: 40, floorH: 36, groundH: 38, winW: 20, winH: 20, lift: 9 },
};

const layerOrder: readonly Role[] = [
  'neighbour',
  'neighbourWindow',
  'tree',
  'wall',
  'shade',
  'roof',
  'gable',
  'stack',
  'door',
  'glass',
  'lit',
  'blind',
  'sill',
  'mullion',
  'rail',
  'step',
  'flat',
  'flatFrame',
  'bracket',
];

export const inRange = (value: number, range: readonly [number, number]): boolean =>
  value >= range[0] && value <= range[1];

export const isMarked = (spec: FacadeSpec, floor: number, bay: number): boolean =>
  spec.mark !== undefined && inRange(floor, spec.mark.floors) && inRange(bay, spec.mark.bays);

export const doorBayOf = (spec: FacadeSpec, random: () => number): number => {
  if (spec.kind === 'blok')
    return Math.min(spec.bays - 2, 1 + Math.floor(random() * (spec.bays - 2)));
  if (spec.kind === 'dom') return 0;
  if (spec.bays % 2 === 1) return (spec.bays - 1) / 2;
  return random() < 0.5 ? spec.bays / 2 - 1 : spec.bays / 2;
};

export const drawFacade = (spec: FacadeSpec): Drawing => {
  const profile = profiles[spec.kind];
  const random = createRandom(spec.seed);
  const paths = new Map<Role, string>();
  const add = (role: Role, d: string) => paths.set(role, (paths.get(role) ?? '') + d);

  const { bayW, floorH, groundH, winW, winH, lift } = profile;
  const width = spec.bays * bayW;
  const wallHeight = groundH + (spec.floors - 1) * floorH;
  const floorTop = (floor: number) => -(groundH + floor * floorH);
  const floorBottom = (floor: number) => (floor === 0 ? 0 : floorTop(floor - 1));
  const doorBay = doorBayOf(spec, random);
  const units = spec.units ?? 1;
  const unitBays = spec.bays / units;
  const detached = spec.kind === 'dom' || spec.kind === 'willa';
  const tenement = spec.kind === 'kamienica' || spec.kind === 'loft';

  const doorBays = new Set<number>();
  if (spec.kind === 'dom') {
    for (let unit = 0; unit < units; unit++) {
      doorBays.add(unit % 2 === 0 ? unit * unitBays : (unit + 1) * unitBays - 1);
    }
  } else {
    doorBays.add(doorBay);
  }

  const drawNeighbours = () => {
    const gap = detached ? 20 : 0;
    const sides: readonly [number, number][] = [
      [-gap, -1],
      [width + gap, 1],
    ];
    for (const [edge, dir] of sides) {
      const nWidth = 120;
      const nFloors = Math.max(2, Math.round(spec.floors * (0.7 + random() * 0.4)));
      const nFloorH = detached ? 34 : floorH * 0.92;
      const nHeight = detached ? 2 * nFloorH : (nFloors - 1) * nFloorH + groundH * 0.9;
      const x = dir < 0 ? edge - nWidth : edge;
      add('neighbour', rect(x, -nHeight, nWidth, nHeight));
      if (detached) {
        add(
          'neighbour',
          polygon([
            [x - 3, -nHeight],
            [x + nWidth + 3, -nHeight],
            [x + nWidth / 2, -nHeight - 30],
          ]),
        );
      } else {
        add('neighbour', rect(x - 2, -nHeight - 5, nWidth + 4, 5));
      }
      const rows = Math.max(1, Math.floor((nHeight - 14) / (nFloorH * 0.95)));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 5; c++) {
          add('neighbourWindow', rect(x + 8 + c * 22, -nHeight + 12 + r * nFloorH * 0.95, 9, 13));
        }
      }
    }
    if (detached) {
      for (const tx of [-gap - 10, width + gap + 14, width + gap + 78]) {
        const h = 26 + random() * 14;
        add('tree', circle(tx, -h - 8, 12 + random() * 4));
        add('tree', rect(tx - 1.5, -h, 3, h));
      }
    }
  };
  drawNeighbours();

  add('wall', rect(0, -wallHeight, width, wallHeight));

  add('shade', rect(0, -6, width, 6));

  if (tenement) {
    add('shade', rect(-2, -wallHeight - 5, width + 4, 5));
    add('shade', rect(-3, -wallHeight - 7, width + 6, 2));
    for (let floor = 1; floor < spec.floors; floor++) {
      add('shade', rect(0, floorBottom(floor) - 1.2, width, 2.4));
    }
    for (let y = 8; y < groundH; y += 6) {
      add('shade', rect(0, -y, width, 0.9));
    }
  } else if (spec.kind === 'blok') {
    for (let floor = 1; floor < spec.floors; floor++) {
      add('shade', rect(0, floorBottom(floor) - 0.5, width, 1));
    }
    for (let x = bayW * 2; x < width; x += bayW * 2) {
      add('shade', rect(x - 0.5, -wallHeight, 1, wallHeight));
    }
  } else if (spec.kind === 'nowy') {
    add('shade', rect(0, -wallHeight, width, 4));
    for (let x = 0; x <= width; x += bayW) {
      add('shade', rect(x - 1, -wallHeight, 2, wallHeight - groundH + 4));
    }
  } else {
    add('shade', rect(-2, -wallHeight - 3, width + 4, 3));
    for (let unit = 1; unit < units; unit++) {
      add('shade', rect(unit * unitBays * bayW - 1, -wallHeight, 2, wallHeight));
    }
  }

  const drawWindow = (
    floor: number,
    bay: number,
    w: number,
    h: number,
    bottom: number,
    shape: 'rect' | 'arch',
  ) => {
    const x = bay * bayW + (bayW - w) / 2;
    const y = floorBottom(floor) - bottom - h;
    const marked = isMarked(spec, floor, bay);
    const body = shape === 'arch' ? arch(x, y, w, h) : rect(x, y, w, h);
    if (marked) {
      add('flat', body);
      add('flatFrame', body);
      add('mullion', line(x + w / 2, y + (shape === 'arch' ? w / 2 : 0), x + w / 2, y + h));
      return;
    }
    const roll = random();
    add(roll < 0.16 ? 'lit' : 'glass', body);
    if (roll > 0.72) add('blind', rect(x, y, w, h * (0.25 + random() * 0.3)));
    if (spec.kind === 'nowy') return;
    add('mullion', line(x + w / 2, y + (shape === 'arch' ? w / 2 : 0), x + w / 2, y + h));
    if (tenement && h > 24) add('mullion', line(x, y + h * 0.34, x + w, y + h * 0.34));
    add('sill', rect(x - 2, y + h, w + 4, 2.4));
  };

  for (let floor = 0; floor < spec.floors; floor++) {
    for (let bay = 0; bay < spec.bays; bay++) {
      if (floor === 0 && doorBays.has(bay)) continue;
      if (spec.kind === 'blok' && bay === doorBay) {
        const x = bay * bayW + (bayW - 8) / 2;
        const y = floorBottom(floor) - floorH * 0.5 - 7;
        add('glass', rect(x, y + (floor === 0 ? 0 : 0), 8, 14));
        continue;
      }
      if (floor === 0) {
        if (tenement) drawWindow(0, bay, winW - 2, 17, 15, 'rect');
        else if (spec.kind === 'nowy') drawWindow(0, bay, bayW - 8, 24, 5, 'rect');
        else drawWindow(0, bay, winW, winH, lift + 3, 'rect');
        continue;
      }
      const shape =
        spec.kind === 'loft' ||
        (spec.kind === 'kamienica' && floor === spec.floors - 1 && spec.roof === 'plaski')
          ? 'arch'
          : 'rect';
      drawWindow(floor, bay, winW, winH, lift, shape);
    }
  }

  if (tenement) {
    for (let floor = 1; floor <= Math.min(2, spec.floors - 1); floor++) {
      for (let bay = 0; bay < spec.bays; bay++) {
        const x = bay * bayW + (bayW - winW) / 2;
        const top = floorBottom(floor) - lift - winH;
        add('shade', rect(x - 2.5, top - 3.6, winW + 5, 3));
        if (floor === 1 && bay % 2 === 0 && spec.kind === 'kamienica') {
          add(
            'shade',
            polygon([
              [x - 2.5, top - 3.6],
              [x + winW / 2, top - 11],
              [x + winW + 2.5, top - 3.6],
            ]),
          );
        }
      }
    }
    const gateW = 18;
    const gateX = doorBay * bayW + (bayW - gateW) / 2;
    add('door', arch(gateX, -34, gateW, 34));
    add('step', rect(gateX - 4, -3, gateW + 8, 3));
    add('step', rect(gateX - 7, -1.5, gateW + 14, 1.5));
    if (spec.floors > 3 && spec.kind === 'kamienica') {
      const balconyFloor = 2;
      const bx = doorBay * bayW - 3;
      add('shade', rect(bx, floorBottom(balconyFloor) - 2.4, bayW + 6, 2.4));
      add('rail', rect(bx, floorBottom(balconyFloor) - 10.4, bayW + 6, 8));
    }
  }

  if (spec.kind === 'blok') {
    for (let floor = 1; floor < spec.floors; floor++) {
      for (let bay = 1; bay < spec.bays; bay += 2) {
        if (bay === doorBay) continue;
        add('shade', rect(bay * bayW + 1.5, floorBottom(floor) - 2.2, bayW - 3, 2.2));
        add('rail', rect(bay * bayW + 1.5, floorBottom(floor) - 10.2, bayW - 3, 8));
      }
    }
    const doorX = doorBay * bayW + (bayW - 14) / 2;
    add('door', rect(doorX, -23, 14, 23));
    add('shade', rect(doorX - 5, -27, 24, 3));
    add('step', rect(doorX - 3, -2.5, 20, 2.5));
  }

  if (spec.kind === 'nowy') {
    const balconyFrom = Math.floor(spec.bays / 2);
    for (let floor = 1; floor < spec.floors - 1; floor++) {
      const x = balconyFrom * bayW;
      add('roof', rect(x, floorBottom(floor) - 2.4, width - x, 2.4));
      add('rail', rect(x, floorBottom(floor) - 11.4, width - x, 9));
    }
    const doorX = doorBay * bayW + (bayW - 20) / 2;
    add('door', rect(doorX, -25, 20, 25));
    add('roof', rect(doorX - 8, -29, 36, 3));
    add('step', rect(doorX - 4, -2.5, 28, 2.5));
  }

  if (detached) {
    for (const bay of doorBays) {
      const doorW = spec.kind === 'dom' ? 13 : 15;
      const doorH = 27;
      const doorX = bay * bayW + (bayW - doorW) / 2;
      add('door', rect(doorX, -doorH, doorW, doorH));
      add(
        'shade',
        polygon([
          [doorX - 5, -doorH - 1],
          [doorX + doorW / 2, -doorH - 9],
          [doorX + doorW + 5, -doorH - 1],
        ]),
      );
      add('step', rect(doorX - 4, -3, doorW + 8, 3));
      add('step', rect(doorX - 7, -1.5, doorW + 14, 1.5));
    }
    if (spec.kind === 'dom' && units === 1) {
      const garageX = (spec.bays - 1) * bayW + 2;
      add('shade', rect(garageX, -26, bayW - 4, 26));
      for (let y = 5; y < 26; y += 5) add('wall', rect(garageX, -y, bayW - 4, 0.8));
    }
  }

  let roofHeight = 0;
  const eave = -wallHeight - (tenement ? 7 : detached ? 3 : 0);
  const unitWidth = unitBays * bayW;
  const addStack = (x: number, base: number) => {
    add('stack', rect(x, base - 20, 8, 20));
    add('stack', rect(x - 1.5, base - 22, 11, 2.4));
  };

  if (spec.roof === 'kopertowy') {
    roofHeight = Math.min(34, width * 0.2);
    add(
      'roof',
      polygon([
        [-4, eave],
        [width + 4, eave],
        [width - width * 0.17, eave - roofHeight],
        [width * 0.17, eave - roofHeight],
      ]),
    );
    addStack(width * 0.66, eave - roofHeight + 6);
    roofHeight += 14;
  } else if (spec.roof === 'mansardowy') {
    const lower = 26;
    const upper = 12;
    add(
      'roof',
      polygon([
        [-4, eave],
        [width + 4, eave],
        [width - 8, eave - lower],
        [8, eave - lower],
      ]),
    );
    add(
      'roof',
      polygon([
        [8, eave - lower],
        [width - 8, eave - lower],
        [width - 28, eave - lower - upper],
        [28, eave - lower - upper],
      ]),
    );
    add('shade', rect(8, eave - lower - 0.6, width - 16, 1.2));
    for (let bay = 0; bay < spec.bays; bay++) {
      if (bay % 2 !== (spec.bays % 2 === 1 ? 0 : 1)) continue;
      const x = bay * bayW + (bayW - 13) / 2;
      const y = eave - 4 - 15;
      add(
        'gable',
        polygon([
          [x - 2, y],
          [x + 6.5, y - 8],
          [x + 15, y],
        ]),
      );
      add('gable', rect(x - 2, y, 17, 15));
      const marked = isMarked(spec, spec.floors, bay);
      add(marked ? 'flat' : 'glass', rect(x, y + 2, 13, 11));
      if (marked) add('flatFrame', rect(x, y + 2, 13, 11));
    }
    addStack(width * 0.78, eave - lower - upper + 4);
    roofHeight = lower + upper + 16;
  } else if (spec.roof === 'dwuspadowy') {
    const span = unitWidth;
    const rise = Math.min(46, span * 0.34);
    for (let unit = 0; unit < units; unit++) {
      const x = unit * span;
      add(
        'roof',
        polygon([
          [x - 3, eave],
          [x + span + 3, eave],
          [x + span / 2, eave - rise - 5],
        ]),
      );
      add(
        'gable',
        polygon([
          [x + 5, eave - 3],
          [x + span - 5, eave - 3],
          [x + span / 2, eave - rise + 2],
        ]),
      );
      const atticMarked = isMarked(spec, spec.floors, unit * unitBays);
      add(atticMarked ? 'flat' : 'glass', circle(x + span / 2, eave - rise * 0.38, 5.5));
      if (atticMarked) add('flatFrame', circle(x + span / 2, eave - rise * 0.38, 5.5));
    }
    addStack(width * 0.2, eave - rise + 4);
    roofHeight = rise + 22;
  } else if (spec.roof === 'jednospadowy') {
    const rise = 30;
    add(
      'roof',
      polygon([
        [-4, eave],
        [width + 4, eave],
        [width + 4, eave - 8],
        [-4, eave - rise],
      ]),
    );
    roofHeight = rise;
  } else {
    add('shade', rect(-2, eave - 6, width + 4, 6));
    if (spec.kind === 'blok') add('shade', rect(width * 0.55, eave - 18, 22, 12));
    if (spec.kind === 'loft') addStack(width * 0.82, eave - 6);
    if (spec.kind === 'nowy' && spec.floors >= 4) {
      add('roof', rect(-3, eave - 4, width + 6, 4));
    }
    roofHeight = spec.kind === 'loft' ? 28 : spec.kind === 'blok' ? 20 : 8;
  }

  let marked: Box | null = null;
  if (spec.mark) {
    const x0 = spec.mark.bays[0] * bayW;
    const x1 = (spec.mark.bays[1] + 1) * bayW;
    const y0 = floorTop(spec.mark.floors[1]);
    const y1 = floorBottom(spec.mark.floors[0]);
    const whole =
      spec.mark.floors[0] === 0 &&
      spec.mark.floors[1] === spec.floors - 1 &&
      x0 === 0 &&
      x1 === width;
    marked = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    if (!whole && !detached) add('bracket', rect(x0 + 1.5, y0 + 1.5, x1 - x0 - 3, y1 - y0 - 3));
  }

  const layers: Layer[] = layerOrder.flatMap(role => {
    const d = paths.get(role);
    return d ? [{ role, d }] : [];
  });

  return {
    width,
    height: wallHeight + roofHeight,
    layers,
    marked,
    doorX: doorBay * bayW + bayW / 2,
  };
};
