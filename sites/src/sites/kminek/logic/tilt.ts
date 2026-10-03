export const MAX_TILT = 4;
export const REST_TILT = 2;
export const CALM_OVER_CARD = 0.35;

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export interface Frame {
  top: number;
  height: number;
  viewportHeight: number;
}

export const reachOf = ({ height, viewportHeight }: Frame) => Math.min(height, viewportHeight) / 2;

export const maxTiltFor = (slack: number, reach: number) => {
  if (reach <= 0) return MAX_TILT;
  return clamp(toDegrees(Math.asin(clamp(slack / reach, 0, 1))), 0, MAX_TILT);
};

export const restTiltFor = (max: number) => Math.min(REST_TILT, max);

export const staticRestTilt = (slack: number, height: number) =>
  restTiltFor(maxTiltFor(slack, height / 2));

export interface PointerInput {
  pointerX: number;
  viewportWidth: number;
  max: number;
  rest: number;
  overCard: boolean;
}

export const pointerTilt = ({ pointerX, viewportWidth, max, rest, overCard }: PointerInput) => {
  const half = viewportWidth / 2;
  const offset = half > 0 ? clamp((pointerX - half) / half, -1, 1) : 0;
  const free = offset * max;
  return overCard ? rest + (free - rest) * CALM_OVER_CARD : free;
};

export const SWING_GAIN = 1.6;

export const swingTilt = (speed: number, max: number, rest: number) =>
  clamp(rest - Math.abs(speed) * SWING_GAIN, -max, rest);

export const scrollSpeed = (distance: number, elapsed: number) =>
  Math.abs(distance) / Math.max(elapsed, 8);

export const approach = (current: number, target: number, elapsed: number, tau: number) =>
  current + (target - current) * (1 - Math.exp(-Math.max(elapsed, 0) / tau));

export const pivotOffset = ({ top, height, viewportHeight }: Frame) => {
  const visibleTop = Math.max(top, 0);
  const visibleBottom = Math.min(top + height, viewportHeight);
  const cardCentre = top + height / 2;
  if (visibleBottom <= visibleTop) return 0;
  return (visibleTop + visibleBottom) / 2 - cardCentre;
};

export const pivotShift = (offset: number, angle: number) => {
  const radians = toRadians(angle);
  return { x: offset * Math.sin(radians), y: offset * (1 - Math.cos(radians)) };
};

export const transformFor = (angle: number, offset: number) => {
  const shift = pivotShift(offset, angle);
  return `translate(${shift.x.toFixed(2)}px, ${shift.y.toFixed(2)}px) rotate(${angle.toFixed(3)}deg)`;
};

export const isSettled = (current: number, target: number) => Math.abs(current - target) < 0.01;
