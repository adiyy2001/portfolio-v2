import type { CSSProperties } from 'react';
import { Easing, interpolate } from 'remotion';
import { springAt } from '../../../shared/motion';
import { count, draw, focus, rise, track } from '../tokens';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const drawEase = Easing.bezier(...draw.points);
export const countEase = Easing.bezier(...count.points);
export const trackEase = Easing.bezier(...track.points);
export const focusEase = Easing.bezier(...focus.points);
export const easeIn = Easing.bezier(0.32, 0, 0.67, 0);
export const easeOut = Easing.bezier(0.33, 1, 0.68, 1);

export const frames = { draw: 40, count: 30, track: 24, focus: 12, rise: 12 } as const;

export const progress = (f: number, at: number, length: number, ease: (t: number) => number = trackEase) =>
  ease(interpolate(f, [at, at + length], [0, 1], clamp));

export const drawAt = (f: number, at: number, length: number = frames.draw) => progress(f, at, length, drawEase);
export const countAt = (f: number, at: number, from: number, to: number, length: number = frames.count) =>
  from + (to - from) * progress(f, at, length, countEase);
export const trackAt = (f: number, at: number, length: number = frames.track) => progress(f, at, length, trackEase);
export const focusAt = (f: number, at: number) => progress(f, at, frames.focus, focusEase);
export const riseAt = (f: number, at: number) => springAt(rise, f, at);

export const dim = (f: number, at: number, lead: boolean) => (lead ? 1 : 1 - 0.6 * focusAt(f, at));

export const riseIn = (f: number, at: number, still = false, distance = 12): CSSProperties => {
  if (still) return {};
  if (f < at) return { opacity: 0, transform: `translateY(${distance}px)` };
  const s = riseAt(f, at);
  return { opacity: interpolate(f, [at, at + 6], [0, 1], clamp), transform: `translateY(${(1 - s) * distance}px)` };
};

export const fadeOut = (f: number, at: number, length = 8): CSSProperties => {
  if (f < at) return {};
  const t = progress(f, at, length, easeIn);
  return { opacity: 1 - t, transform: `translateY(${-6 * t}px)` };
};

export const mixN = (a: number, b: number, t: number) => a + (b - a) * t;
