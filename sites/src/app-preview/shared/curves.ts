export interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
}

export const springSamples = (config: SpringConfig, seconds = 2, rate = 240) => {
  const dt = 1 / rate;
  const out: number[] = [];
  let x = 0;
  let v = 0;
  for (let i = 0; i <= seconds * rate; i += 1) {
    out.push(x);
    const a = (-config.stiffness * (x - 1) - config.damping * v) / config.mass;
    v += a * dt;
    x += v * dt;
  }
  return out;
};

export const springStats = (config: SpringConfig, rate = 240) => {
  const samples = springSamples(config, 3, rate);
  const peak = Math.max(...samples);
  let settle = samples.length - 1;
  while (settle > 0 && Math.abs(samples[settle - 1] - 1) < 0.005) settle -= 1;
  return { overshoot: Math.max(0, peak - 1), settleMs: Math.round((settle / rate) * 1000) };
};

export const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const at = (a: number, b: number, t: number) =>
    3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 40; i += 1) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
};

export const curvePath = (values: number[], width: number, height: number, top = 0.2) => {
  const max = 1 + top;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};
