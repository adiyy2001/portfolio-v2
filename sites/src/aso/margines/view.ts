export const slotNumber = (value: number) => String(value).padStart(2, '0');

const jitter = (seed: number, i: number) => {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

const round = (value: number) => Math.round(value * 10) / 10;

export const underlinePath = (width: number, seed = 1, height = 12) => {
  const steps = 6;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const x = 4 + ((width - 8) * i) / steps;
    const y = height / 2 + jitter(seed, i) * 3 - (i / steps) * 2;
    return `${round(x)} ${round(y)}`;
  });
  return `M${points.join(' L')}`;
};

export const circlePath = (width: number, height: number, seed = 1) => {
  const cx = width / 2;
  const cy = height / 2;
  const steps = 28;
  const turn = Math.PI * 2 * 1.08;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * turn - Math.PI * 0.62;
    const wobble = 1 + jitter(seed, i) * 0.06;
    const rx = (width / 2 - 4) * wobble;
    const ry = (height / 2 - 4) * wobble;
    return `${round(cx + Math.cos(t) * rx)} ${round(cy + Math.sin(t) * ry)}`;
  });
  return `M${points.join(' L')}`;
};

export const arrowPath = (length: number, seed = 1) => {
  const mid = length / 2;
  const bend = 10 + jitter(seed, 1) * 6;
  return {
    shaft: `M4 ${round(24 + jitter(seed, 2) * 4)} Q${round(mid)} ${round(24 - bend * 2)} ${length - 6} 20`,
    head: `M${length - 18} 10 L${length - 6} 20 L${length - 20} 28`,
  };
};
