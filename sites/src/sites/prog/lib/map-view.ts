import type { MapPoint } from '../data/types';

export interface MapWindow {
  x: number;
  y: number;
  size: number;
}

export const cityWindow: MapWindow = { x: 40, y: 90, size: 880 };

export const officePoint: MapPoint = { x: 600, y: 367 };

export const windowAround = (center: MapPoint, size: number): MapWindow => ({
  x: center.x - size / 2,
  y: center.y - size / 2,
  size,
});

export const toPercent = (point: MapPoint, view: MapWindow): { left: number; top: number } => ({
  left: Math.round(((point.x - view.x) / view.size) * 10000) / 100,
  top: Math.round(((point.y - view.y) / view.size) * 10000) / 100,
});

export const isInside = (point: MapPoint, view: MapWindow): boolean =>
  point.x >= view.x &&
  point.x <= view.x + view.size &&
  point.y >= view.y &&
  point.y <= view.y + view.size;

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface LabelCandidate {
  name: string;
  x: number;
  y: number;
}

export interface LandmarkSpot {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface PlacedLandmark extends LandmarkSpot {
  labelShiftX: number;
  labelShiftY: number;
  labelBox: Box;
}

const referenceWidth = 521;
const characterWidth = 6.6;
const labelPadding = 3;
const labelHalfHeight = 8;
const dotHalf = 8;
const pinHalfWidth = 23;
const pinTop = 46;
const pinFoot = 6;
const frameMargin = 4;

const landmarkAngles: readonly number[] = [90, 270, 0, 180, 45, 135, 315, 225];
const landmarkGaps: readonly number[] = [2, 16, 32, 48];

const landmarkShifts = (name: string): MapPoint[] => {
  const halfWidth = (name.length * characterWidth) / 2 + labelPadding;
  return landmarkGaps.flatMap(gap =>
    landmarkAngles.map(angle => {
      const radians = (angle * Math.PI) / 180;
      return {
        x: Math.round(Math.cos(radians) * (dotHalf + halfWidth + gap)),
        y: Math.round(Math.sin(radians) * (dotHalf + labelHalfHeight + gap)),
      };
    }),
  );
};

const labelOffsets: readonly MapPoint[] = [
  { x: 0, y: 0 },
  { x: 0, y: 16 },
  { x: 0, y: -16 },
  { x: 0, y: 32 },
  { x: 0, y: -32 },
  { x: -48, y: 0 },
  { x: 48, y: 0 },
  { x: -48, y: 18 },
  { x: 48, y: 18 },
  { x: -48, y: -18 },
  { x: 48, y: -18 },
  { x: -48, y: 34 },
  { x: 48, y: 34 },
  { x: -48, y: -34 },
  { x: 48, y: -34 },
  { x: 0, y: 48 },
  { x: 0, y: -48 },
  { x: -80, y: 0 },
  { x: 80, y: 0 },
  { x: -80, y: 20 },
  { x: 80, y: 20 },
  { x: -80, y: -20 },
  { x: 80, y: -20 },
];

export const unitsPerPixel = (view: MapWindow): number => view.size / referenceWidth;

const boxAround = (center: MapPoint, halfWidth: number, halfHeight: number): Box => ({
  left: center.x - halfWidth,
  right: center.x + halfWidth,
  top: center.y - halfHeight,
  bottom: center.y + halfHeight,
});

const boxesOverlap = (a: Box, b: Box): boolean =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

const fitsInside = (box: Box, view: MapWindow, unit: number): boolean => {
  const margin = frameMargin * unit;
  return (
    box.left >= view.x + margin &&
    box.right <= view.x + view.size - margin &&
    box.top >= view.y + margin &&
    box.bottom <= view.y + view.size - margin
  );
};

const textBox = (name: string, center: MapPoint, unit: number): Box =>
  boxAround(
    center,
    ((name.length * characterWidth) / 2 + labelPadding) * unit,
    labelHalfHeight * unit,
  );

export const pinBox = (pin: MapPoint, view: MapWindow): Box => {
  const unit = unitsPerPixel(view);
  return {
    left: pin.x - pinHalfWidth * unit,
    right: pin.x + pinHalfWidth * unit,
    top: pin.y - pinTop * unit,
    bottom: pin.y + pinFoot * unit,
  };
};

export const dotBox = (point: MapPoint, view: MapWindow): Box => {
  const unit = unitsPerPixel(view);
  return boxAround(point, dotHalf * unit, dotHalf * unit);
};

export const scaleBox = (view: MapWindow): Box => {
  const unit = unitsPerPixel(view);
  return {
    left: view.x,
    right: view.x + 120 * unit,
    top: view.y + view.size - 40 * unit,
    bottom: view.y + view.size,
  };
};

export const officeNameBox = (office: MapPoint, view: MapWindow): Box => {
  const unit = unitsPerPixel(view);
  return textBox('Próg', { x: office.x, y: office.y + 22 * unit }, unit);
};

export const placeLandmarks = (
  landmarks: readonly LandmarkSpot[],
  view: MapWindow,
  blockers: readonly Box[],
): PlacedLandmark[] => {
  const unit = unitsPerPixel(view);
  const dots = landmarks.map(landmark => dotBox(landmark, view));
  const labelBoxes: Box[] = [];
  const placed: PlacedLandmark[] = [];
  landmarks.forEach((landmark, index) => {
    const ownDot = dots[index];
    if (!ownDot || !fitsInside(ownDot, view, unit)) return;
    const otherDots = dots.filter((_, other) => other !== index);
    for (const shift of landmarkShifts(landmark.name)) {
      const shiftX = shift.x;
      const shiftY = shift.y;
      const center = { x: landmark.x + shiftX * unit, y: landmark.y + shiftY * unit };
      const box = textBox(landmark.name, center, unit);
      const blocked = [...blockers, ...otherDots, ...labelBoxes].some(other =>
        boxesOverlap(box, other),
      );
      if (blocked || !fitsInside(box, view, unit)) continue;
      labelBoxes.push(box);
      placed.push({ ...landmark, labelShiftX: shiftX, labelShiftY: shiftY, labelBox: box });
      break;
    }
  });
  return placed;
};

export const placeLabels = (
  labels: readonly LabelCandidate[],
  view: MapWindow,
  blockers: readonly Box[],
): LabelCandidate[] => {
  const unit = unitsPerPixel(view);
  const taken: Box[] = [...blockers];
  const placed: LabelCandidate[] = [];
  for (const label of labels) {
    for (const offset of labelOffsets) {
      const spot = { x: label.x + offset.x * unit, y: label.y + offset.y * unit };
      const box = textBox(label.name, spot, unit);
      if (!fitsInside(box, view, unit) || taken.some(other => boxesOverlap(box, other))) continue;
      taken.push(box);
      placed.push({ name: label.name, ...spot });
      break;
    }
  }
  return placed;
};

export interface PinSpot {
  id: string;
  x: number;
  y: number;
}

const overlaps = (a: PinSpot, b: PinSpot, gapX: number, gapY: number): boolean =>
  Math.abs(a.x - b.x) < gapX && Math.abs(a.y - b.y) < gapY;

export const spreadPins = (
  spots: readonly PinSpot[],
  gapX: number,
  gapY: number,
): Map<string, MapPoint> => {
  const moved = spots.map(spot => ({ ...spot }));
  for (let round = 0; round < 40; round++) {
    let touched = false;
    for (let i = 0; i < moved.length; i++) {
      for (let j = i + 1; j < moved.length; j++) {
        const a = moved[i];
        const b = moved[j];
        if (!a || !b || !overlaps(a, b, gapX, gapY)) continue;
        touched = true;
        const needX = gapX - Math.abs(a.x - b.x);
        const needY = gapY - Math.abs(a.y - b.y);
        if (needX <= needY) {
          const direction = a.x <= b.x ? 1 : -1;
          a.x -= (direction * needX) / 2;
          b.x += (direction * needX) / 2;
        } else {
          const direction = a.y <= b.y ? 1 : -1;
          a.y -= (direction * needY) / 2;
          b.y += (direction * needY) / 2;
        }
      }
    }
    if (!touched) break;
  }
  return new Map(moved.map(spot => [spot.id, { x: spot.x, y: spot.y }]));
};
