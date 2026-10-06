export type StickerShape = 'rect' | 'pill' | 'circle' | 'burst';

export interface Sticker {
  id: string;
  shape: StickerShape;
  fill: string;
  font: 'display' | 'mono';
  size: number;
  w: number;
  h: number;
  lines: string[];
  name: string;
}

export const inkColor = '#111111';
export const shadowOffset = 6;
export const strokeWidth = 5;

export const stickerSet: Sticker[] = [
  { id: 'push', shape: 'rect', fill: '#FFE14A', font: 'mono', size: 25, w: 150, h: 62, lines: ['git push'], name: 'git push' },
  { id: 'todo', shape: 'burst', fill: '#FF5FA8', font: 'display', size: 28, w: 132, h: 132, lines: ['TODO'], name: 'TODO' },
  { id: 'e404', shape: 'circle', fill: '#5CC8FF', font: 'display', size: 38, w: 112, h: 112, lines: ['404'], name: '404' },
  { id: 'braces', shape: 'rect', fill: '#3DDC97', font: 'display', size: 50, w: 112, h: 84, lines: ['{ }'], name: 'klamry' },
  { id: 'sudo', shape: 'pill', fill: '#FF5FA8', font: 'mono', size: 24, w: 124, h: 50, lines: ['sudo'], name: 'sudo' },
  { id: 'semi', shape: 'circle', fill: '#FFE14A', font: 'display', size: 70, w: 92, h: 92, lines: [';'], name: 'średnik' },
  { id: 'commit', shape: 'rect', fill: '#FFFFFF', font: 'mono', size: 22, w: 142, h: 56, lines: ['commit'], name: 'commit' },
  { id: 'works', shape: 'rect', fill: '#5CC8FF', font: 'display', size: 19, w: 156, h: 92, lines: ['works on', 'my machine'], name: 'works on my machine' },
  { id: 'tag', shape: 'pill', fill: '#3DDC97', font: 'mono', size: 25, w: 120, h: 50, lines: ['</>'], name: 'znaczniki' },
  { id: 'bug', shape: 'burst', fill: '#FFE14A', font: 'display', size: 25, w: 120, h: 120, lines: ['bug'], name: 'bug' },
];

const burstPoints = (w: number, h: number, spikes = 12) => {
  const cx = w / 2;
  const cy = h / 2;
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const radius = i % 2 === 0 ? 1 : 0.8;
    points.push(`${(cx + Math.cos(angle) * radius * (w / 2)).toFixed(1)},${(cy + Math.sin(angle) * radius * (h / 2)).toFixed(1)}`);
  }
  return points.join(' ');
};

const shapeMarkup = (sticker: Sticker, dx: number, dy: number, fill: string, stroke: string | null) => {
  const { shape, w, h } = sticker;
  const attrs = `fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="miter"` : ''}`;
  const x = strokeWidth / 2 + dx;
  const y = strokeWidth / 2 + dy;
  if (shape === 'circle') return `<ellipse ${attrs} cx="${w / 2 + strokeWidth / 2 + dx}" cy="${h / 2 + strokeWidth / 2 + dy}" rx="${w / 2}" ry="${h / 2}"/>`;
  if (shape === 'pill') return `<rect ${attrs} x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`;
  if (shape === 'burst') return `<polygon ${attrs} transform="translate(${strokeWidth / 2 + dx} ${strokeWidth / 2 + dy})" points="${burstPoints(w, h)}"/>`;
  return `<rect ${attrs} x="${x}" y="${y}" width="${w}" height="${h}"/>`;
};

export const stickerBox = (sticker: Sticker) => ({
  width: sticker.w + strokeWidth + shadowOffset,
  height: sticker.h + strokeWidth + shadowOffset,
});

export const stickerSvg = (sticker: Sticker) => {
  const { width, height } = stickerBox(sticker);
  const family = sticker.font === 'mono' ? "'Klamra Mono',monospace" : "'Klamra Display',sans-serif";
  const weight = sticker.font === 'mono' ? 800 : 900;
  const cx = sticker.w / 2 + strokeWidth / 2;
  const lineHeight = sticker.size * 1.12;
  const top = sticker.h / 2 + strokeWidth / 2 - ((sticker.lines.length - 1) * lineHeight) / 2;
  const text = sticker.lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${(top + i * lineHeight).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${family}" font-weight="${weight}" font-size="${sticker.size}" fill="${inkColor}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false">${shapeMarkup(sticker, shadowOffset, shadowOffset, inkColor, null)}${shapeMarkup(sticker, 0, 0, sticker.fill, inkColor)}${text}</svg>`;
};
