import { columnCount, floors, gateColumns } from '../building';
import type { Flat, Floor, Rooms } from '../types';

export const view = { width: 600, height: 440 };
export const wallLeft = 30;
export const bayWidth = 54;
export const floorHeight = 72;
export const wallTop = 66;
export const toothHeight = 52;
export const windowWidth = 30;
export const windowHeight = 46;
const windowInsetX = (bayWidth - windowWidth) / 2;
const windowInsetY = 14;
const frameInset = 2;
const mullion = 2;

export const wallRight = wallLeft + bayWidth * columnCount;
export const groundY = wallTop + floorHeight * floors.length;
export const teethCount = columnCount / 2;

export const bayX = (column: number) => wallLeft + (column - 1) * bayWidth;
export const floorY = (floor: Floor) => wallTop + (floors.length - 1 - floor) * floorHeight;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const windowBox = (flat: Pick<Flat, 'floor' | 'column'>): Box => ({
  x: bayX(flat.column) + windowInsetX,
  y: floorY(flat.floor) + windowInsetY,
  width: windowWidth,
  height: windowHeight,
});

export const cellBox = (flat: Pick<Flat, 'floor' | 'column'>): Box => ({
  x: bayX(flat.column),
  y: floorY(flat.floor),
  width: bayWidth,
  height: floorHeight,
});

export const panesOf = (rooms: Rooms, box: Box): Box[] => {
  const innerWidth = box.width - frameInset * 2;
  const paneWidth = (innerWidth - mullion * (rooms - 1)) / rooms;
  return Array.from({ length: rooms }, (_, index) => ({
    x: box.x + frameInset + index * (paneWidth + mullion),
    y: box.y + frameInset,
    width: paneWidth,
    height: box.height - frameInset * 2,
  }));
};

export const toothPath = (tooth: number) => {
  const left = wallLeft + tooth * bayWidth * 2;
  const right = left + bayWidth * 2;
  return `M${left} ${wallTop}L${right} ${wallTop - toothHeight}V${wallTop}Z`;
};

export const toothGlass = (tooth: number): Box => {
  const right = wallLeft + (tooth + 1) * bayWidth * 2;
  return { x: right - 12, y: wallTop - toothHeight, width: 12, height: toothHeight };
};

export const gateBox: Box = {
  x: bayX(gateColumns[0]) + 6,
  y: wallTop + floorHeight * (floors.length - 1) + 8,
  width: bayWidth * gateColumns.length - 12,
  height: floorHeight - 8,
};

export const tagAnchor = (flat: Pick<Flat, 'floor' | 'column'>) => {
  const box = windowBox(flat);
  return {
    x: ((box.x + box.width / 2) / view.width) * 100,
    y: (box.y / view.height) * 100,
  };
};

export const tagAlign = (column: number) => {
  if (column <= 2) return 'start';
  if (column >= columnCount - 1) return 'end';
  return 'middle';
};
