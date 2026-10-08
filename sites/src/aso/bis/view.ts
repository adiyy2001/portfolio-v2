const round = (value: number) => Math.round(value * 100) / 100;

export const starPath = (cx: number, cy: number, r: number, pinch = 0.18) => {
  const k = r * pinch;
  const p = (x: number, y: number) => `${round(x)} ${round(y)}`;
  return [
    `M${p(cx, cy - r)}`,
    `C${p(cx + k, cy - k)} ${p(cx + k, cy - k)} ${p(cx + r, cy)}`,
    `C${p(cx + k, cy + k)} ${p(cx + k, cy + k)} ${p(cx, cy + r)}`,
    `C${p(cx - k, cy + k)} ${p(cx - k, cy + k)} ${p(cx - r, cy)}`,
    `C${p(cx - k, cy - k)} ${p(cx - k, cy - k)} ${p(cx, cy - r)}Z`,
  ].join('');
};

export const chromeStops: [number, string][] = [
  [0, '#FFFFFF'],
  [0.16, '#E2FAFF'],
  [0.42, '#9DB9D2'],
  [0.47, '#F7F9FC'],
  [0.5, '#2F3542'],
  [0.58, '#737C8F'],
  [0.76, '#FFA9DA'],
  [0.92, '#FFE1C9'],
  [1, '#FFFFFF'],
];

export const holo = ['#FF8AD0', '#FFC7A0', '#D7FF63', '#72EFFF'];

export const tilt = (i: number) => [-4, 3, -2, 5, -3, 2][i % 6];

export const sparkles = [
  { x: 8, y: 18, r: 14 },
  { x: 88, y: 12, r: 20 },
  { x: 94, y: 62, r: 11 },
  { x: 4, y: 74, r: 16 },
  { x: 62, y: 90, r: 10 },
];

export const keepLast = (text: string) => {
  const at = text.lastIndexOf(' ');
  if (at < 0 || text.slice(at + 1).includes(' ')) return text;
  return `${text.slice(0, at)} ${text.slice(at + 1)}`;
};
