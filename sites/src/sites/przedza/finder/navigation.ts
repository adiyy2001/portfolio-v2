import type { Flat } from '../types';

export type Direction = 'left' | 'right' | 'up' | 'down' | 'rowStart' | 'rowEnd' | 'top' | 'bottom';

type Position = Pick<Flat, 'floor' | 'column'>;

const closestInFloor = (candidates: readonly Flat[], floor: number, column: number) =>
  candidates
    .filter(flat => flat.floor === floor)
    .sort(
      (a, b) => Math.abs(a.column - column) - Math.abs(b.column - column) || a.column - b.column,
    )[0];

const floorsWithFlats = (candidates: readonly Flat[]) =>
  [...new Set(candidates.map(flat => flat.floor))].sort((a, b) => b - a);

export const moveFocus = (candidates: readonly Flat[], from: Position, direction: Direction) => {
  const row = candidates
    .filter(flat => flat.floor === from.floor)
    .sort((a, b) => a.column - b.column);
  const levels = floorsWithFlats(candidates);

  if (direction === 'left') return row.filter(flat => flat.column < from.column).at(-1);
  if (direction === 'right') return row.find(flat => flat.column > from.column);
  if (direction === 'rowStart') return row[0];
  if (direction === 'rowEnd') return row.at(-1);

  if (direction === 'up') {
    const floor = levels.filter(level => level > from.floor).at(-1);
    return floor === undefined ? undefined : closestInFloor(candidates, floor, from.column);
  }
  if (direction === 'down') {
    const floor = levels.find(level => level < from.floor);
    return floor === undefined ? undefined : closestInFloor(candidates, floor, from.column);
  }
  if (direction === 'top') {
    return levels.length > 0 ? closestInFloor(candidates, levels[0], from.column) : undefined;
  }
  return levels.length > 0
    ? closestInFloor(candidates, levels[levels.length - 1], from.column)
    : undefined;
};

export const firstInReadingOrder = (candidates: readonly Flat[]) =>
  [...candidates].sort((a, b) => b.floor - a.floor || a.column - b.column)[0];

export const directionForKey = (key: string): Direction | undefined => {
  const map: Record<string, Direction> = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
    Home: 'rowStart',
    End: 'rowEnd',
    PageUp: 'top',
    PageDown: 'bottom',
  };
  return map[key];
};
