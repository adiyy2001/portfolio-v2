import { bezier } from '../shared/curves';

export const drawPoints: [number, number, number, number] = [0.65, 0, 0.35, 1];
export const countPoints: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const drawEase = bezier(...drawPoints);
export const countEase = bezier(...countPoints);
export const linearEase = (t: number) => Math.min(1, Math.max(0, t));

export const framesToMs = (frames: number) => Math.round((frames / 30) * 1000);

export const production = (hour: number) => {
  const x = (hour - (13 + 10 / 60)) / 7.5;
  return Math.abs(x) >= 1 ? 0 : 6.4 * Math.cos((Math.PI / 2) * x) ** 2.0217;
};

export const bellPath = (width: number, height: number, max = 7) => {
  const points: string[] = [];
  for (let i = 0; i <= 96; i += 1) {
    const hour = (i / 96) * 24;
    const x = (hour / 24) * width;
    const y = height - (production(hour) / max) * height;
    points.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
};

export const dayKwh = () => {
  let sum = 0;
  for (let i = 0; i < 288; i += 1) sum += production(i / 12 + 1 / 24) / 12;
  return sum;
};

export const counter = (value: number) => value.toFixed(1).replace('.', ',');
