export interface WavePoint {
  x: number;
  y: number;
}

export const SESSION_MINUTES = 50;
export const ARRIVAL_END = 10;
export const CLOSING_START = 45;
const WAVELENGTH_MINUTES = 6.4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const smoothstep = (from: number, to: number, value: number) => {
  const progress = clamp((value - from) / (to - from), 0, 1);
  return progress * progress * (3 - 2 * progress);
};

export const waveAmplitude = (minute: number) =>
  smoothstep(0, ARRIVAL_END, minute) * (1 - smoothstep(CLOSING_START, SESSION_MINUTES, minute));

export const wavePoints = (
  width: number,
  height: number,
  samples: number,
  phase = 0,
): WavePoint[] =>
  Array.from({ length: samples + 1 }, (_, index) => {
    const minute = (index / samples) * SESSION_MINUTES;
    const swing =
      waveAmplitude(minute) * Math.sin((minute / WAVELENGTH_MINUTES) * Math.PI * 2 + phase);
    return { x: (minute / SESSION_MINUTES) * width, y: (height / 2) * (1 - swing) };
  });

export const wavePath = (points: readonly WavePoint[]) =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

export const minuteToX = (minute: number, width: number) => (minute / SESSION_MINUTES) * width;
