import { describe, expect, it } from 'vitest';
import { POND_HEIGHT, POND_WIDTH } from './ripples';
import {
  advanceClock,
  canvasSize,
  pondPointFromClient,
  resolveWaterState,
  type WaterConditions,
} from './water-state';

const awake: WaterConditions = {
  reducedMotion: false,
  userPaused: false,
  tabHidden: false,
  onScreen: true,
};

describe('resolveWaterState', () => {
  it('runs when nothing stops it', () => {
    expect(resolveWaterState(awake)).toBe('running');
  });

  it('is still under reduced motion whatever else is true', () => {
    expect(resolveWaterState({ ...awake, reducedMotion: true, userPaused: true })).toBe('still');
    expect(resolveWaterState({ ...awake, reducedMotion: true, onScreen: false })).toBe('still');
  });

  it('pauses when the visitor asks for it', () => {
    expect(resolveWaterState({ ...awake, userPaused: true })).toBe('paused-user');
  });

  it('pauses in a hidden tab', () => {
    expect(resolveWaterState({ ...awake, tabHidden: true })).toBe('paused-tab');
  });

  it('pauses when scrolled out of view', () => {
    expect(resolveWaterState({ ...awake, onScreen: false })).toBe('paused-offscreen');
  });

  it('reports the visitor pause before the automatic ones', () => {
    expect(
      resolveWaterState({ ...awake, userPaused: true, tabHidden: true, onScreen: false }),
    ).toBe('paused-user');
    expect(resolveWaterState({ ...awake, tabHidden: true, onScreen: false })).toBe('paused-tab');
  });
});

describe('advanceClock', () => {
  it('adds the elapsed time in seconds', () => {
    expect(advanceClock(10, 33)).toBeCloseTo(10.033, 6);
  });

  it('never jumps after a long gap', () => {
    expect(advanceClock(10, 5000)).toBeCloseTo(10.1, 6);
  });

  it('never runs backwards', () => {
    expect(advanceClock(10, -50)).toBe(10);
  });
});

describe('pondPointFromClient', () => {
  const box = { left: 100, top: 200, width: 500, height: 312.5 };

  it('maps the corners of the box to the corners of the pond', () => {
    expect(pondPointFromClient(box, 100, 200)).toEqual({ x: 0, y: 0 });
    const far = pondPointFromClient(box, 600, 512.5);
    expect(far?.x).toBeCloseTo(POND_WIDTH, 6);
    expect(far?.y).toBeCloseTo(POND_HEIGHT, 6);
  });

  it('maps the middle to the middle', () => {
    const middle = pondPointFromClient(box, 350, 356.25);
    expect(middle?.x).toBeCloseTo(POND_WIDTH / 2, 6);
    expect(middle?.y).toBeCloseTo(POND_HEIGHT / 2, 6);
  });

  it('ignores points outside the box', () => {
    expect(pondPointFromClient(box, 99, 300)).toBeUndefined();
    expect(pondPointFromClient(box, 300, 199)).toBeUndefined();
    expect(pondPointFromClient(box, 601, 300)).toBeUndefined();
    expect(pondPointFromClient(box, 300, 513)).toBeUndefined();
  });

  it('ignores an empty box', () => {
    expect(pondPointFromClient({ left: 0, top: 0, width: 0, height: 0 }, 0, 0)).toBeUndefined();
  });
});

describe('canvasSize', () => {
  it('scales by the pixel ratio', () => {
    expect(canvasSize({ width: 400, height: 250 }, 1.5)).toEqual({
      width: 600,
      height: 375,
      ratio: 1.5,
    });
  });

  it('caps the pixel ratio at 1.5', () => {
    expect(canvasSize({ width: 400, height: 250 }, 3)).toEqual({
      width: 600,
      height: 375,
      ratio: 1.5,
    });
  });

  it('never goes below 1', () => {
    expect(canvasSize({ width: 400, height: 250 }, 0.5).ratio).toBe(1);
  });

  it('rounds to whole pixels', () => {
    expect(canvasSize({ width: 333.3, height: 208.3 }, 1.5)).toEqual({
      width: 500,
      height: 312,
      ratio: 1.5,
    });
  });
});
