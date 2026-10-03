import { POND_HEIGHT, POND_WIDTH } from './ripples';

export type WaterState = 'running' | 'paused-offscreen' | 'paused-tab' | 'paused-user' | 'still';

export interface WaterConditions {
  reducedMotion: boolean;
  userPaused: boolean;
  tabHidden: boolean;
  onScreen: boolean;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const MAX_STEP_SECONDS = 0.1;
const MAX_PIXEL_RATIO = 1.5;

export const resolveWaterState = (conditions: WaterConditions): WaterState => {
  if (conditions.reducedMotion) return 'still';
  if (conditions.userPaused) return 'paused-user';
  if (conditions.tabHidden) return 'paused-tab';
  if (!conditions.onScreen) return 'paused-offscreen';
  return 'running';
};

export const advanceClock = (clock: number, elapsedMilliseconds: number) =>
  clock + Math.min(Math.max(elapsedMilliseconds, 0) / 1000, MAX_STEP_SECONDS);

export const pondPointFromClient = (box: Box, clientX: number, clientY: number) => {
  if (box.width <= 0 || box.height <= 0) return undefined;
  const across = (clientX - box.left) / box.width;
  const down = (clientY - box.top) / box.height;
  if (across < 0 || across > 1 || down < 0 || down > 1) return undefined;
  return { x: across * POND_WIDTH, y: down * POND_HEIGHT };
};

export const canvasSize = (box: Pick<Box, 'width' | 'height'>, pixelRatio: number) => {
  const ratio = Math.min(Math.max(pixelRatio, 1), MAX_PIXEL_RATIO);
  return { width: Math.round(box.width * ratio), height: Math.round(box.height * ratio), ratio };
};
