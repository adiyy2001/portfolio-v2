const wave = (width: number, base: number, amp: number, seed: number, step: number) => {
  const points: [number, number][] = [];
  for (let x = -step; x <= width + step; x += step) {
    const y =
      base +
      Math.sin(x / 140 + seed) * amp * 0.6 +
      Math.sin(x / 57 + seed * 2.3) * amp * 0.3 +
      Math.sin(x / 23 + seed * 4.1) * amp * 0.1;
    points.push([x, Math.round(y * 10) / 10]);
  }
  return points;
};

const toPath = (points: [number, number][], height: number) =>
  `M${points.map(([x, y]) => `${x},${y}`).join('L')}L${points[points.length - 1][0]},${height}L${points[0][0]},${height}Z`;

export const ridgeLayers = (width = 1440, height = 160) => [
  { fill: '#AFC3CB', d: toPath(wave(width, 70, 38, 1.2, 24), height) },
  { fill: '#6E8F9B', d: toPath(wave(width, 104, 30, 3.4, 20), height) },
  { fill: '#2E5446', d: toPath(wave(width, 136, 18, 5.1, 18), height) },
];

export const twoDigits = (value: number) => String(value).padStart(2, '0');
