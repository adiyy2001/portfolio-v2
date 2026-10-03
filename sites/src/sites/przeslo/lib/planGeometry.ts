import type { Opening } from '../data/floorplans';

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DoorShape {
  gap: Segment;
  leaf: Segment;
  arc: string;
}

export const gapOf = (opening: Opening): Segment =>
  opening.axis === 'y'
    ? { x1: opening.x, y1: opening.y, x2: opening.x, y2: opening.y + opening.length }
    : { x1: opening.x, y1: opening.y, x2: opening.x + opening.length, y2: opening.y };

export const doorShape = (opening: Opening): DoorShape => {
  const gap = gapOf(opening);
  const swing = opening.swing ?? 1;
  const length = opening.length;
  if (opening.axis === 'y') {
    const tipX = opening.x + swing * length;
    const sweep = swing === 1 ? 1 : 0;
    return {
      gap,
      leaf: { x1: opening.x, y1: opening.y, x2: tipX, y2: opening.y },
      arc: `M ${tipX} ${opening.y} A ${length} ${length} 0 0 ${sweep} ${opening.x} ${opening.y + length}`,
    };
  }
  const tipY = opening.y + swing * length;
  const sweep = swing === 1 ? 0 : 1;
  return {
    gap,
    leaf: { x1: opening.x, y1: opening.y, x2: opening.x, y2: tipY },
    arc: `M ${opening.x} ${tipY} A ${length} ${length} 0 0 ${sweep} ${opening.x + length} ${opening.y}`,
  };
};

export const windowLines = (opening: Opening, offset: number): Segment[] => {
  const gap = gapOf(opening);
  const shift = (amount: number): Segment =>
    opening.axis === 'y'
      ? { ...gap, x1: gap.x1 + amount, x2: gap.x2 + amount }
      : { ...gap, y1: gap.y1 + amount, y2: gap.y2 + amount };
  return [shift(-offset), shift(0), shift(offset)];
};
