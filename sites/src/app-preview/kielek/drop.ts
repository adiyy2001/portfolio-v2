import { bezier, springSamples, type SpringConfig } from '../shared/curves';

export const fallMs = 467;
export const squashMs = 133;
export const returnMs = 1200;
export const totalMs = fallMs + squashMs + returnMs;
export const rate = 240;

const fall = bezier(0.55, 0, 1, 0.45);
const settle = bezier(0.33, 1, 0.68, 1);

export interface DropPose {
  y: number;
  sx: number;
  sy: number;
}

export const returnCurve = (config: SpringConfig) => springSamples(config, returnMs / 1000, rate);

export const dropPose = (ms: number, curve: number[]): DropPose => {
  if (ms <= 0) return { y: 0, sx: 1, sy: 1 };
  if (ms < fallMs) return { y: fall(ms / fallMs), sx: 0.9, sy: 1.12 };
  if (ms < fallMs + squashMs) {
    const t = settle((ms - fallMs) / squashMs);
    return { y: 1, sx: 1 + 0.1 * t, sy: 1 - 0.12 * t };
  }
  const index = Math.min(curve.length - 1, Math.round(((ms - fallMs - squashMs) / 1000) * rate));
  const s = curve[index];
  return { y: 1, sx: 1.1 - 0.1 * s, sy: 0.88 + 0.12 * s };
};

export const peakStretch = (curve: number[]) => 0.88 + 0.12 * Math.max(...curve);
