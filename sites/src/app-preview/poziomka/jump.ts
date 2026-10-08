export const periodMs = 1600 / 3;
export const peak = 5;
export const tempos = [4, 7.5, 15] as const;

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

export const smoothHeight = (ms: number) => {
  const t = (((ms % periodMs) + periodMs) % periodMs) / periodMs;
  const half = t < 0.5 ? t * 2 : (1 - t) * 2;
  return easeInOut(half) * peak;
};

export const stepIndex = (ms: number, fps: number) => Math.floor((ms * fps) / 1000 + 1e-9);

export const steppedHeight = (ms: number, fps: number) =>
  Math.round(smoothHeight(stepIndex(ms, fps) * (1000 / fps)) + 1e-9);

export const posesPerJump = (fps: number) => Math.round((periodMs / 1000) * fps);

export const smoothPath = (width: number, height: number, samples = 96) =>
  Array.from({ length: samples + 1 }, (_, i) => {
    const x = (i / samples) * width;
    const y = height - (smoothHeight((i / samples) * periodMs) / peak) * (height - 4) - 2;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

export const stepPath = (width: number, height: number, fps: number) => {
  const steps = Math.max(1, Math.ceil((periodMs / 1000) * fps));
  const parts: string[] = [];
  for (let k = 0; k < steps; k += 1) {
    const ms = k * (1000 / fps);
    const x0 = (ms / periodMs) * width;
    const x1 = Math.min(width, ((k + 1) * (1000 / fps) * width) / periodMs);
    const y = height - (steppedHeight(ms, fps) / peak) * (height - 4) - 2;
    parts.push(
      `${k ? 'L' : 'M'}${x0.toFixed(1)} ${y.toFixed(1)} L${x1.toFixed(1)} ${y.toFixed(1)}`,
    );
  }
  return parts.join(' ');
};

export const berry = [
  '.......kk.......',
  '...kkk.kfk.kkk..',
  '..kseekkfkkeesk.',
  '.kkseeeffeeeskk.',
  '.kbkkeeffeekkbk.',
  'kblbbkkkkkkbbbbk',
  'kllbbbbbbbbbbbrk',
  'klbbgbbbbbbgbbrk',
  'kbbbwkbbbbwkbbrk',
  'kbgbkkbbbbkkbgrk',
  'kbbbbbkbbkbbbbrk',
  '.kbbbbbkkbbbbrk.',
  '.kbgbbbbbbbgbrk.',
  '..kbbbbbbbbbrk..',
  '..kbbbgbbbbrrk..',
  '...kbbbbbbrrk...',
  '....kbbbbrrk....',
  '.....kkkkkk.....',
];

export const colors: Record<string, string> = {
  k: '#140C1C',
  f: '#2D5A3A',
  e: '#4FA34A',
  s: '#A6DE5C',
  r: '#A23B4E',
  b: '#E0474F',
  l: '#FF8F8F',
  g: '#F7C873',
  w: '#FFFFFF',
};
