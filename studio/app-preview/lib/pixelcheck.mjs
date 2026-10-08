import { execFileSync } from 'node:child_process';
import { probe } from './ffprobe.mjs';

const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

export const rawFrame = (file, frame) => {
  const info = probe(file);
  const { width, height } = info.video;
  const data = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', file, '-vf', `select=eq(n\\,${frame})`, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { maxBuffer: width * height * 3 + 1024 },
  );
  return { width, height, data };
};

export const gridReport = ({ width, data }, { cell, cols, rows, palette, tolerance }) => {
  const colors = palette.map(rgb);
  let cells = 0;
  let flat = 0;
  let inPalette = 0;
  let worst = 0;
  for (let cy = 0; cy < rows; cy += 1)
    for (let cx = 0; cx < cols; cx += 1) {
      const sum = [0, 0, 0];
      const px = [];
      for (let y = 0; y < cell; y += 1)
        for (let x = 0; x < cell; x += 1) {
          const i = ((cy * cell + y) * width + cx * cell + x) * 3;
          const p = [data[i], data[i + 1], data[i + 2]];
          px.push(p);
          for (let k = 0; k < 3; k += 1) sum[k] += p[k];
        }
      const mean = sum.map(v => v / px.length);
      const spread = Math.max(...px.map(p => Math.max(...p.map((v, k) => Math.abs(v - mean[k])))));
      const nearest = Math.min(...colors.map(c => Math.max(...c.map((v, k) => Math.abs(v - mean[k])))));
      cells += 1;
      if (spread <= tolerance) flat += 1;
      if (nearest <= tolerance) inPalette += 1;
      worst = Math.max(worst, spread);
    }
  return { cells, flat: flat / cells, inPalette: inPalette / cells, worst: Math.round(worst) };
};
