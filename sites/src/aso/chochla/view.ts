const round = (value: number) => Math.round(value * 10) / 10;

const jitter = (seed: number, i: number) => {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const burstPoints = (spikes: number, outer: number, inner: number, seed = 1) => {
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const radius =
      i % 2 === 0 ? outer * (0.88 + jitter(seed, i) * 0.12) : inner * (0.9 + jitter(seed, i) * 0.1);
    points.push(`${round(50 + Math.cos(angle) * radius)},${round(50 + Math.sin(angle) * radius)}`);
  }
  return points.join(' ');
};

export const zigzagPoints = (teeth: number, width = 100, height = 10) =>
  Array.from(
    { length: teeth * 2 + 1 },
    (_, i) => `${round((i * width) / (teeth * 2))},${i % 2 ? 0 : height}`,
  ).join(' ');

export const shapes = {
  bubble:
    '<svg viewBox="0 0 96 64" aria-hidden="true"><path d="M8 26C8 12 26 6 48 6s40 6 40 20-18 20-40 20c-5 0-9 0-13-1L18 58l5-16C13 38 8 32 8 26Z" fill="#fff" stroke="#1A1714" stroke-width="4" stroke-linejoin="round"/></svg>',
  halftone:
    '<svg viewBox="0 0 96 64" aria-hidden="true"><defs><pattern id="lg-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.4" fill="#1A1714"/></pattern></defs><circle cx="48" cy="32" r="27" fill="#F6B400" stroke="#1A1714" stroke-width="4"/><circle cx="48" cy="32" r="25" fill="url(#lg-dots)" opacity=".5"/></svg>',
  confetti:
    '<svg viewBox="0 0 96 64" aria-hidden="true"><path d="M14 46 26 24 38 46Z" fill="#19B3A3" stroke="#1A1714" stroke-width="3" stroke-linejoin="round"/><path d="M44 18q5-8 10 0t10 0 10 0" fill="none" stroke="#EE4B2B" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="44" r="9" fill="none" stroke="#2547C8" stroke-width="5"/><path d="M50 50h10M55 45v10" stroke="#F7A8C9" stroke-width="5" stroke-linecap="round"/></svg>',
  panels:
    '<svg viewBox="0 0 96 64" aria-hidden="true"><rect x="6" y="6" width="40" height="24" fill="#F7A8C9" stroke="#1A1714" stroke-width="4"/><rect x="52" y="6" width="38" height="24" fill="#F6B400" stroke="#1A1714" stroke-width="4"/><rect x="6" y="36" width="84" height="22" fill="#2547C8" stroke="#1A1714" stroke-width="4"/></svg>',
};
