export const floorHeights = [3.9, 3.5, 3.4, 3.4, 3.6] as const;
export const slab = 0.35;
export const buildingLength = 62;
export const bayLength = buildingLength / 10;
export const buildingDepth = 10.1;
export const wallThickness = 0.65;
export const clearDepth = buildingDepth - 2 * wallThickness;
export const chimneyHeight = 41;
export const shedRise = 4;

export const levelBottoms = (heights: readonly number[], slabThickness: number) => {
  const bottoms: number[] = [];
  let level = 0;
  for (const height of heights) {
    bottoms.push(level);
    level += height + slabThickness;
  }
  return { bottoms, top: level };
};

export const formatMetres = (value: number) => `${value.toFixed(1).replace('.', ',')} m`;

export const shedSpan = bayLength * 2;
export const shedPitchDegrees = (Math.atan(shedRise / shedSpan) * 180) / Math.PI;

export const brick = { stretcher: 250, header: 120, height: 65, joint: 10 } as const;
export const courseHeight = brick.height + brick.joint;
export const bondPeriod = brick.stretcher + brick.header + 2 * brick.joint;

export interface BrickUnit {
  x: number;
  width: number;
  kind: 'stretcher' | 'header';
}

export const brickCourse = (index: number, width: number): BrickUnit[] => {
  const units: BrickUnit[] = [];
  let cursor = index % 2 === 0 ? 0 : -bondPeriod / 2;
  let kind: BrickUnit['kind'] = 'stretcher';
  while (cursor < width) {
    const unitWidth = kind === 'stretcher' ? brick.stretcher : brick.header;
    const start = Math.max(cursor, 0);
    const end = Math.min(cursor + unitWidth, width);
    if (end > start) units.push({ x: start, width: end - start, kind });
    cursor += unitWidth + brick.joint;
    kind = kind === 'stretcher' ? 'header' : 'stretcher';
  }
  return units;
};
