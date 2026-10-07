import { Easing, interpolate, spring } from 'remotion';
import type { BezierPreset, SpringPreset, StepsPreset } from './types';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const springAt = (preset: SpringPreset, frame: number, start: number, fps = 30) =>
  frame < start
    ? 0
    : spring({
        frame: frame - start,
        fps,
        config: { mass: preset.mass, stiffness: preset.stiffness, damping: preset.damping },
      });

export const bezierAt = (preset: BezierPreset, frame: number, start: number, fps = 30) => {
  const frames = (preset.ms / 1000) * fps;
  const [a, b, c, d] = preset.points;
  return interpolate(frame, [start, start + frames], [0, 1], {
    ...clamp,
    easing: Easing.bezier(a, b, c, d),
  });
};

export const stepsAt = (preset: StepsPreset, frame: number, start: number, fps = 30) => {
  const frames = (preset.ms / 1000) * fps;
  const t = interpolate(frame, [start, start + frames], [0, 1], clamp);
  return Math.floor(t * preset.steps) / preset.steps;
};

export const window01 = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], clamp);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const springCurve = (preset: SpringPreset, frames: number, fps = 30) =>
  Array.from({ length: frames + 1 }, (_, i) => springAt(preset, i, 0, fps));

export const bezierCurve = (preset: BezierPreset, frames: number, fps = 30) =>
  Array.from({ length: frames + 1 }, (_, i) => bezierAt(preset, i, 0, fps));
