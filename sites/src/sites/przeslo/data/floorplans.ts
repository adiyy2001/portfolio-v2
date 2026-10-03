import type { RoomTypeId } from './rooms';

export type SpaceKind = 'room' | 'bath' | 'hall' | 'sitting' | 'bedroom' | 'children';

export interface Space {
  kind: SpaceKind;
  x: number;
  y: number;
  width: number;
  depth: number;
}

export type FurnitureKind =
  | 'doubleBed'
  | 'singleBed'
  | 'sofaBed'
  | 'desk'
  | 'wardrobe'
  | 'armchair'
  | 'table'
  | 'shower'
  | 'bathtub'
  | 'basin'
  | 'toilet';

export interface Furniture {
  kind: FurnitureKind;
  x: number;
  y: number;
  width: number;
  depth: number;
}

export type OpeningKind = 'window' | 'door' | 'passage';

export interface Opening {
  kind: OpeningKind;
  x: number;
  y: number;
  length: number;
  axis: 'x' | 'y';
  swing?: 1 | -1;
}

export interface Slope {
  x: number;
  y: number;
  width: number;
  depth: number;
}

export interface FloorPlan {
  roomType: RoomTypeId;
  width: number;
  depth: number;
  spaces: Space[];
  furniture: Furniture[];
  openings: Opening[];
  slopes: Slope[];
}

const bed = (x: number, y: number, width: number): Furniture => ({
  kind: 'doubleBed',
  x,
  y,
  width,
  depth: 200,
});

export const floorPlans: readonly FloorPlan[] = [
  {
    roomType: 'podworzowy',
    width: 400,
    depth: 425,
    spaces: [
      { kind: 'bath', x: 0, y: 0, width: 170, depth: 200 },
      { kind: 'hall', x: 170, y: 0, width: 230, depth: 200 },
      { kind: 'room', x: 0, y: 200, width: 400, depth: 225 },
    ],
    furniture: [
      { kind: 'shower', x: 10, y: 10, width: 90, depth: 90 },
      { kind: 'basin', x: 110, y: 10, width: 50, depth: 45 },
      { kind: 'toilet', x: 105, y: 110, width: 40, depth: 65 },
      { kind: 'wardrobe', x: 180, y: 10, width: 120, depth: 60 },
      bed(10, 210, 160),
      { kind: 'desk', x: 270, y: 345, width: 120, depth: 60 },
    ],
    openings: [
      { kind: 'door', x: 400, y: 60, length: 90, axis: 'y', swing: -1 },
      { kind: 'door', x: 170, y: 110, length: 70, axis: 'y', swing: 1 },
      { kind: 'door', x: 200, y: 200, length: 90, axis: 'x', swing: 1 },
      { kind: 'window', x: 140, y: 425, length: 160, axis: 'x' },
    ],
    slopes: [],
  },
  {
    roomType: 'klasyczny',
    width: 420,
    depth: 500,
    spaces: [
      { kind: 'bath', x: 0, y: 0, width: 190, depth: 210 },
      { kind: 'hall', x: 190, y: 0, width: 230, depth: 210 },
      { kind: 'room', x: 0, y: 210, width: 420, depth: 290 },
    ],
    furniture: [
      { kind: 'shower', x: 10, y: 10, width: 90, depth: 90 },
      { kind: 'basin', x: 115, y: 10, width: 55, depth: 45 },
      { kind: 'toilet', x: 120, y: 110, width: 40, depth: 65 },
      { kind: 'wardrobe', x: 200, y: 10, width: 120, depth: 60 },
      bed(10, 230, 180),
      { kind: 'desk', x: 290, y: 310, width: 120, depth: 60 },
      { kind: 'armchair', x: 300, y: 410, width: 80, depth: 80 },
    ],
    openings: [
      { kind: 'door', x: 420, y: 60, length: 90, axis: 'y', swing: -1 },
      { kind: 'door', x: 190, y: 110, length: 70, axis: 'y', swing: 1 },
      { kind: 'door', x: 230, y: 210, length: 90, axis: 'x', swing: 1 },
      { kind: 'window', x: 60, y: 500, length: 100, axis: 'x' },
      { kind: 'window', x: 260, y: 500, length: 100, axis: 'x' },
    ],
    slopes: [],
  },
  {
    roomType: 'nadrzeczny',
    width: 500,
    depth: 500,
    spaces: [
      { kind: 'bath', x: 0, y: 0, width: 250, depth: 200 },
      { kind: 'hall', x: 250, y: 0, width: 250, depth: 200 },
      { kind: 'room', x: 0, y: 200, width: 500, depth: 300 },
    ],
    furniture: [
      { kind: 'bathtub', x: 10, y: 10, width: 170, depth: 75 },
      { kind: 'basin', x: 190, y: 10, width: 55, depth: 45 },
      { kind: 'toilet', x: 190, y: 100, width: 40, depth: 65 },
      { kind: 'wardrobe', x: 260, y: 10, width: 150, depth: 60 },
      bed(160, 220, 180),
      { kind: 'desk', x: 10, y: 420, width: 120, depth: 60 },
      { kind: 'armchair', x: 400, y: 400, width: 80, depth: 80 },
    ],
    openings: [
      { kind: 'door', x: 500, y: 60, length: 90, axis: 'y', swing: -1 },
      { kind: 'door', x: 250, y: 110, length: 70, axis: 'y', swing: 1 },
      { kind: 'door', x: 400, y: 200, length: 90, axis: 'x', swing: 1 },
      { kind: 'window', x: 60, y: 500, length: 160, axis: 'x' },
      { kind: 'window', x: 280, y: 500, length: 160, axis: 'x' },
    ],
    slopes: [],
  },
  {
    roomType: 'rodzinny',
    width: 600,
    depth: 600,
    spaces: [
      { kind: 'bath', x: 0, y: 0, width: 280, depth: 200 },
      { kind: 'hall', x: 280, y: 0, width: 320, depth: 200 },
      { kind: 'bedroom', x: 0, y: 200, width: 380, depth: 400 },
      { kind: 'children', x: 380, y: 200, width: 220, depth: 400 },
    ],
    furniture: [
      { kind: 'bathtub', x: 10, y: 10, width: 170, depth: 75 },
      { kind: 'shower', x: 10, y: 100, width: 90, depth: 90 },
      { kind: 'basin', x: 190, y: 10, width: 55, depth: 45 },
      { kind: 'toilet', x: 200, y: 100, width: 40, depth: 65 },
      { kind: 'wardrobe', x: 290, y: 10, width: 180, depth: 60 },
      bed(20, 230, 160),
      { kind: 'armchair', x: 280, y: 430, width: 80, depth: 80 },
      { kind: 'desk', x: 250, y: 520, width: 120, depth: 60 },
      { kind: 'singleBed', x: 390, y: 300, width: 90, depth: 200 },
      { kind: 'singleBed', x: 500, y: 300, width: 90, depth: 200 },
      { kind: 'table', x: 400, y: 520, width: 70, depth: 70 },
    ],
    openings: [
      { kind: 'door', x: 600, y: 60, length: 90, axis: 'y', swing: -1 },
      { kind: 'door', x: 280, y: 110, length: 70, axis: 'y', swing: 1 },
      { kind: 'door', x: 290, y: 200, length: 80, axis: 'x', swing: 1 },
      { kind: 'door', x: 400, y: 200, length: 90, axis: 'x', swing: 1 },
      { kind: 'window', x: 60, y: 600, length: 120, axis: 'x' },
      { kind: 'window', x: 230, y: 600, length: 100, axis: 'x' },
      { kind: 'window', x: 420, y: 600, length: 120, axis: 'x' },
    ],
    slopes: [],
  },
  {
    roomType: 'poddasze',
    width: 800,
    depth: 575,
    spaces: [
      { kind: 'bedroom', x: 0, y: 0, width: 500, depth: 375 },
      { kind: 'sitting', x: 0, y: 375, width: 500, depth: 200 },
      { kind: 'bath', x: 500, y: 0, width: 300, depth: 275 },
      { kind: 'hall', x: 500, y: 275, width: 300, depth: 300 },
    ],
    furniture: [
      bed(160, 20, 180),
      { kind: 'desk', x: 20, y: 300, width: 140, depth: 60 },
      { kind: 'wardrobe', x: 330, y: 300, width: 150, depth: 60 },
      { kind: 'sofaBed', x: 20, y: 480, width: 200, depth: 90 },
      { kind: 'table', x: 300, y: 480, width: 70, depth: 70 },
      { kind: 'armchair', x: 400, y: 500, width: 80, depth: 70 },
      { kind: 'bathtub', x: 520, y: 10, width: 75, depth: 170 },
      { kind: 'basin', x: 610, y: 10, width: 60, depth: 45 },
      { kind: 'shower', x: 690, y: 10, width: 90, depth: 90 },
      { kind: 'toilet', x: 700, y: 190, width: 40, depth: 65 },
      { kind: 'wardrobe', x: 610, y: 290, width: 180, depth: 60 },
    ],
    openings: [
      { kind: 'door', x: 800, y: 400, length: 90, axis: 'y', swing: -1 },
      { kind: 'door', x: 520, y: 275, length: 70, axis: 'x', swing: 1 },
      { kind: 'door', x: 500, y: 400, length: 90, axis: 'y', swing: -1 },
      { kind: 'passage', x: 60, y: 375, length: 380, axis: 'x' },
      { kind: 'window', x: 120, y: 0, length: 100, axis: 'x' },
      { kind: 'window', x: 300, y: 0, length: 100, axis: 'x' },
      { kind: 'window', x: 0, y: 400, length: 120, axis: 'y' },
    ],
    slopes: [{ x: 0, y: 0, width: 70, depth: 575 }],
  },
];

export const planOf = (roomType: RoomTypeId): FloorPlan => {
  const found = floorPlans.find(plan => plan.roomType === roomType);
  if (!found) throw new Error(`No floor plan for ${roomType}`);
  return found;
};

export const planArea = (plan: FloorPlan): number =>
  plan.spaces.reduce((total, space) => total + space.width * space.depth, 0) / 10_000;

export const sleepingPlaces = (plan: FloorPlan): number =>
  plan.furniture.reduce((total, piece) => {
    if (piece.kind === 'doubleBed') return total + 2;
    if (piece.kind === 'singleBed' || piece.kind === 'sofaBed') return total + 1;
    return total;
  }, 0);
