import { Resvg } from '@resvg/resvg-js';

const lcg = seed => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

export const tornClip = (seed, { amp = 5, nx = 44, ny = 26 } = {}) => {
  const rand = lcg(seed);
  const phase = rand() * 6;
  const drift = i => 0.55 + 0.45 * Math.sin(i * 0.42 + phase);
  const jitter = i => (amp * (rand() * 0.55 + 0.45) * drift(i)).toFixed(1);
  const points = [];
  for (let i = 0; i <= nx; i += 1) points.push(`${((i / nx) * 100).toFixed(2)}% ${jitter(i)}px`);
  for (let i = 1; i <= ny; i += 1) points.push(`calc(100% - ${jitter(i)}px) ${((i / ny) * 100).toFixed(2)}%`);
  for (let i = 1; i <= nx; i += 1) points.push(`${(100 - (i / nx) * 100).toFixed(2)}% calc(100% - ${jitter(i + 7)}px)`);
  for (let i = 1; i < ny; i += 1) points.push(`${jitter(i + 3)}px ${(100 - (i / ny) * 100).toFixed(2)}%`);
  return `clip-path:polygon(${points.join(',')})`;
};

const wobblyRing = (seed, radius, wobble) => {
  const rand = lcg(seed);
  const count = 96;
  const phaseA = rand() * 6.28;
  const phaseB = rand() * 6.28;
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const r = radius + wobble * (0.6 * Math.sin(angle * 3 + phaseA) + 0.4 * Math.sin(angle * 7 + phaseB)) + (rand() - 0.5) * wobble * 0.5;
    points.push(`${i === 0 ? 'M' : 'L'}${(Math.cos(angle) * r).toFixed(1)} ${(Math.sin(angle) * r).toFixed(1)}`);
  }
  return `${points.join('')}Z`;
};

export const numStamp = (text, { size = 110, color, seed = 1, tilt = 0, fontSize } = {}) => {
  const outer = wobblyRing(seed, 51, 1.8);
  const inner = wobblyRing(seed + 5, 42, 1.4);
  return `<span class="nstamp" style="width:${size}px;height:${size}px;color:${color};transform:rotate(${tilt}deg)"><svg viewBox="-60 -60 120 120" width="${size}" height="${size}"><path d="${outer}" fill="none" stroke="${color}" stroke-width="5"/><path d="${inner}" fill="none" stroke="${color}" stroke-width="2.4"/></svg><b style="font-size:${fontSize ?? Math.round(size * 0.38)}px">${text}</b></span>`;
};

export const grainDataUri = ({ rgb, alpha, frequency = 0.8, seed = 4, size = 360 }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} 0 0 0 2.4 -0.9"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="${alpha}"/></svg>`;
  const png = new Resvg(svg).render().asPng();
  return `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
};
