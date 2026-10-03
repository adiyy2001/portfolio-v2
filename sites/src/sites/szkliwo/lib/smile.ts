export type ToothKind = 'incisor' | 'canine' | 'premolar';

export interface ToothAdjustment {
  dx?: number;
  dy?: number;
  rotate?: number;
}

export type ToothAdjustments = Readonly<Record<number, ToothAdjustment>>;

export interface SmileTooth {
  position: number;
  kind: ToothKind;
  x: number;
  width: number;
  top: number;
  bottom: number;
  rotate: number;
  depth: number;
  path: string;
}

export const closeUpView = '130 122 540 278';
export const centerX = 400;
const archHalfWidth = 250;
const cornerY = 235;
const openingLeft = 150;
const openingRight = 650;
const upperLipEdgeY = 190;
const lowerLipEdgeY = 330;
const upperToothBottomY = 284;
const lowerToothTopY = 298;
const toothTopY = 176;
const toothRootLength = 160;

const upperWidths = [66, 52, 50, 44, 40] as const;
const lowerWidths = [38, 38, 42, 42, 40] as const;

const kindAt = (distance: number): ToothKind => {
  if (distance <= 2) return 'incisor';
  if (distance === 3) return 'canine';
  return 'premolar';
};

const offsetOf = (x: number) => (x - centerX) / archHalfWidth;

export const upperLipEdge = (x: number) =>
  upperLipEdgeY + (cornerY - upperLipEdgeY) * offsetOf(x) ** 2;

export const lowerLipEdge = (x: number) =>
  lowerLipEdgeY - (lowerLipEdgeY - cornerY) * offsetOf(x) ** 2;

const upperBottom = (x: number) => upperToothBottomY - 16 * offsetOf(x) ** 2;

const lowerTop = (x: number) => lowerToothTopY - 20 * offsetOf(x) ** 2;

const depthAt = (x: number) => Math.min(1, Math.max(0, (Math.abs(offsetOf(x)) - 0.35) / 0.65));

const round = (value: number) => Math.round(value * 10) / 10;

const incisorPath = (x: number, width: number, root: number, edge: number, sign: number) => {
  const half = width / 2;
  const radius = width * 0.28 * sign;
  return [
    `M${round(x - half)},${root}`,
    `L${round(x + half)},${root}`,
    `L${round(x + half)},${round(edge - radius)}`,
    `Q${round(x + half)},${edge} ${round(x + half - radius * sign)},${edge}`,
    `L${round(x - half + radius * sign)},${edge}`,
    `Q${round(x - half)},${edge} ${round(x - half)},${round(edge - radius)}`,
    'Z',
  ].join(' ');
};

const canineShoulder = 0.3;

const caninePath = (x: number, width: number, root: number, edge: number, sign: number) => {
  const half = width / 2;
  const shoulder = round(edge - width * canineShoulder * sign);
  const tip = round(edge + 8 * sign);
  return [
    `M${round(x - half)},${root}`,
    `L${round(x + half)},${root}`,
    `L${round(x + half)},${shoulder}`,
    `C${round(x + half)},${edge} ${round(x + half * 0.4)},${tip} ${x},${tip}`,
    `C${round(x - half * 0.4)},${tip} ${round(x - half)},${edge} ${round(x - half)},${shoulder}`,
    'Z',
  ].join(' ');
};

const premolarPath = (x: number, width: number, root: number, edge: number, sign: number) => {
  const half = width / 2;
  const radius = width * 0.42 * sign;
  return [
    `M${round(x - half)},${root}`,
    `L${round(x + half)},${root}`,
    `L${round(x + half)},${round(edge - radius)}`,
    `Q${round(x + half)},${edge} ${round(x + half - radius * sign)},${edge}`,
    `L${round(x - half + radius * sign)},${edge}`,
    `Q${round(x - half)},${edge} ${round(x - half)},${round(edge - radius)}`,
    'Z',
  ].join(' ');
};

const pathFor = (kind: ToothKind, x: number, width: number, root: number, edge: number) => {
  const sign = root < edge ? 1 : -1;
  if (kind === 'canine') return caninePath(x, width, root, edge, sign);
  if (kind === 'premolar') return premolarPath(x, width, root, edge, sign);
  return incisorPath(x, width, root, edge, sign);
};

const positionsOutward = [5, 4, 3, 2, 1].flatMap(distance => [-distance, distance]);

const layoutCenters = (widths: readonly number[]) => {
  const centers = new Map<number, number>();
  let edge = 0;
  widths.forEach((width, index) => {
    const distance = index + 1;
    centers.set(distance, centerX + edge + width / 2);
    centers.set(-distance, centerX - edge - width / 2);
    edge += width;
  });
  return centers;
};

const upperCenters = layoutCenters(upperWidths);
const lowerCenters = layoutCenters(lowerWidths);

interface BuildOptions {
  adjustments?: ToothAdjustments;
  missing?: readonly number[];
}

const build = (
  widths: readonly number[],
  centers: ReadonlyMap<number, number>,
  options: BuildOptions,
  edge: (x: number) => number,
  facesDown: boolean,
) => {
  const { adjustments = {}, missing = [] } = options;
  return positionsOutward
    .filter(position => !missing.includes(position))
    .map((position): SmileTooth => {
      const distance = Math.abs(position);
      const baseX = centers.get(position) ?? centerX;
      const width = widths[distance - 1] ?? 40;
      const adjustment = adjustments[position] ?? {};
      const x = round(baseX + (adjustment.dx ?? 0));
      const kind = kindAt(distance);
      const edgeY = round(edge(baseX) + (adjustment.dy ?? 0));
      const top = facesDown ? toothTopY : edgeY;
      const bottom = facesDown ? edgeY : edgeY + toothRootLength;
      return {
        position,
        kind,
        x,
        width,
        top,
        bottom,
        rotate: adjustment.rotate ?? 0,
        depth: round(depthAt(baseX) * 100) / 100,
        path: facesDown
          ? pathFor(kind, x, width, top, bottom)
          : pathFor(kind, x, width, bottom, top),
      };
    });
};

export const buildUpperTeeth = (options: BuildOptions = {}) =>
  build(upperWidths, upperCenters, options, upperBottom, true);

export const buildLowerTeeth = (options: BuildOptions = {}) =>
  build(lowerWidths, lowerCenters, options, lowerTop, false);

export const openingPath = () =>
  `M${openingLeft},${cornerY} Q${centerX},${2 * upperLipEdgeY - cornerY} ${openingRight},${cornerY} Q${centerX},${2 * lowerLipEdgeY - cornerY} ${openingLeft},${cornerY} Z`;

const gumTopY = 140;
const gumTipDrop = 26;
const gumArchLift = 4;
const missingRidgeDrop = 46;

const slotsAscending = [...positionsOutward].sort((first, second) => first - second);

export const gumPath = (missing: readonly number[] = []) => {
  const slots = slotsAscending.map(position => {
    const width = upperWidths[Math.abs(position) - 1] ?? 40;
    const x = upperCenters.get(position) ?? centerX;
    return { position, x, left: x - width / 2, right: x + width / 2 };
  });
  const left = Math.min(...slots.map(slot => slot.left));
  const right = Math.max(...slots.map(slot => slot.right));
  const tip = (x: number) => round(upperLipEdge(x) + gumTipDrop);
  const arches = [...slots].reverse().map(slot => {
    const lift = missing.includes(slot.position) ? missingRidgeDrop : gumArchLift;
    return `Q${slot.x},${round(upperLipEdge(slot.x) + lift)} ${round(slot.left)},${tip(slot.left)}`;
  });
  return [
    `M${round(left)},${gumTopY}`,
    `L${round(right)},${gumTopY}`,
    `L${round(right)},${tip(right)}`,
    ...arches,
    'Z',
  ].join(' ');
};
