import type { CSSProperties } from 'react';
import { Easing, interpolate } from 'remotion';
import { bezierAt, springAt } from '../../../shared/motion';
import { bounce, drop, puff, squash, wiggle } from '../tokens';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const easeOut = Easing.bezier(0.33, 1, 0.68, 1);
export const easeIn = Easing.bezier(0.32, 0, 0.67, 0);
export const inOut = Easing.bezier(0.45, 0, 0.55, 1);
export const dropEase = Easing.bezier(...drop.points);

export const progress = (f: number, at: number, frames: number, ease: (t: number) => number = inOut) =>
  ease(interpolate(f, [at, at + frames], [0, 1], clamp));

export const bounceAt = (f: number, at: number) => springAt(bounce, f, at);
export const puffAt = (f: number, at: number) => springAt(puff, f, at);

export const enter = (f: number, at: number, still = false, rise = 34, cy?: number): CSSProperties => {
  if (still) return {};
  const origin = cy === undefined ? {} : { transformOrigin: `50% ${cy}px` };
  if (f < at) return { opacity: 0, transform: `translateY(${rise}px) scale(0.9)`, ...origin };
  const s = bounceAt(f, at);
  const o = interpolate(f, [at, at + 5], [0, 1], clamp);
  return { opacity: o, transform: `translateY(${(1 - s) * rise}px) scale(${0.9 + 0.1 * s})`, ...origin };
};

export const puffIn = (f: number, at: number, still = false, origin = '50% 50%'): CSSProperties => {
  if (still) return {};
  if (f < at) return { opacity: 0, transform: 'scale(0)', transformOrigin: origin };
  const s = puffAt(f, at);
  return { opacity: Math.min(1, (f - at) / 3), transform: `scale(${s})`, transformOrigin: origin };
};

export const leave = (f: number, at: number, frames = 8): CSSProperties => {
  if (f < at) return {};
  const t = progress(f, at, frames, easeIn);
  return { opacity: 1 - t, transform: `scale(${1 - 0.08 * t}) translateY(${t * 10}px)` };
};

export const pressAt = (f: number, at: number) => {
  if (f < at) return 0;
  const down = progress(f, at, 4, easeOut);
  const up = f < at + 6 ? 0 : springAt(bounce, f, at + 6);
  return Math.max(0, down - up);
};

export interface Body {
  y: number;
  sx: number;
  sy: number;
}

export const rest: Body = { y: 0, sx: 1, sy: 1 };

export const landing = (f: number, at: number): Body => {
  if (f < at) return rest;
  const hold = squash.ms / 1000 * 30;
  if (f < at + hold) {
    const t = bezierAt(squash, f, at);
    return { y: 0, sx: 1 + 0.1 * t, sy: 1 - 0.12 * t };
  }
  const s = springAt(bounce, f, at + hold);
  return { y: 0, sx: 1.1 - 0.1 * s, sy: 0.88 + 0.12 * s };
};

export const hop = (f: number, at: number, height = 36, up = 9, down = 8): Body => {
  if (f < at - 4) return rest;
  if (f < at) {
    const t = progress(f, at - 4, 4, inOut);
    return { y: 0, sx: 1 + 0.05 * t, sy: 1 - 0.07 * t };
  }
  if (f < at + up) {
    const t = progress(f, at, up, easeOut);
    return { y: -height * t, sx: 0.96 + 0.04 * t, sy: 1.07 - 0.07 * t };
  }
  const land = at + up + down;
  if (f < land) {
    const t = progress(f, at + up, down, easeIn);
    return { y: -height * (1 - t), sx: 1 - 0.03 * t, sy: 1 + 0.04 * t };
  }
  return landing(f, land);
};

export const combine = (a: Body, b: Body): Body => ({ y: a.y + b.y, sx: a.sx * b.sx, sy: a.sy * b.sy });

export const wiggleAt = (f: number, period = 50, phase = 0, amplitude = 4) => {
  const omega = Math.sqrt(wiggle.stiffness / wiggle.mass);
  const zeta = wiggle.damping / (2 * Math.sqrt(wiggle.stiffness * wiggle.mass));
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const local = (((f + phase) % period) + period) % period;
  const t = local / 30;
  return amplitude * 2.2 * Math.exp(-zeta * omega * t) * Math.sin(wd * t);
};

export const blinkAt = (f: number, at: number) => {
  if (f < at || f > at + 6) return 0;
  const k = f - at;
  return [0.5, 1, 1, 0.7, 0.3, 0.1, 0][k] ?? 0;
};

export const arc = (t: number, height: number) => -4 * height * t * (1 - t);

export const dropFall = (f: number, land: number, distance: number) => {
  const frames = (drop.ms / 1000) * 30;
  const start = land - frames;
  if (f < start) return { visible: false, y: -distance, body: rest };
  if (f < land) {
    const t = dropEase(interpolate(f, [start, land], [0, 1], clamp));
    return { visible: true, y: -distance * (1 - t), body: { y: 0, sx: 0.9, sy: 1.12 } };
  }
  return { visible: true, y: 0, body: landing(f, land) };
};
