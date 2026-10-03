import type { Drawing } from './draw';

export interface Placement {
  scale: number;
  x: number;
  y: number;
}

export interface StreetPlacement extends Placement {
  index: number;
}

const maxScale = 2.1;
const skyMargin = 26;

export const fitToBox = (
  drawing: Pick<Drawing, 'width' | 'height'>,
  boxWidth: number,
  boxHeight: number,
  ground: number,
  margin: number,
): Placement => {
  const scale = Math.min(
    (boxWidth - margin * 2) / drawing.width,
    (boxHeight - ground - margin) / drawing.height,
    maxScale,
  );
  return {
    scale,
    x: (boxWidth - drawing.width * scale) / 2,
    y: boxHeight - ground,
  };
};

export const layoutStreet = (
  drawings: readonly Pick<Drawing, 'width' | 'height'>[],
  boxWidth: number,
  boxHeight: number,
  ground: number,
  gap: number,
): StreetPlacement[] => {
  const totalWidth = drawings.reduce((sum, drawing) => sum + drawing.width, 0);
  const tallest = Math.max(...drawings.map(drawing => drawing.height));
  const gaps = gap * (drawings.length - 1);
  const scale = Math.min(
    (boxWidth - gaps) / totalWidth,
    (boxHeight - ground - skyMargin) / tallest,
    maxScale,
  );
  const used = totalWidth * scale + gaps;
  let cursor = (boxWidth - used) / 2;
  return drawings.map((drawing, index) => {
    const placement = { index, scale, x: cursor, y: boxHeight - ground };
    cursor += drawing.width * scale + gap;
    return placement;
  });
};
