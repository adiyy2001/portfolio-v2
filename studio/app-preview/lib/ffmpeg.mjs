import { spawnSync } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

export const ffmpeg = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });

export const size = file => statSync(file).size;

export const searchQuality = ({ start, step, max, encode, file, target }) => {
  let q = start;
  for (;;) {
    encode(q);
    const bytes = size(file);
    if (bytes <= target || q >= max) return { q, bytes };
    q += step;
  }
};

export const toTv = (width, height, { flags = 'lanczos', crop } = {}) =>
  `${crop ? `crop=${crop},` : ''}scale=${width}:${height}:flags=${flags}:in_range=auto:out_range=tv,format=yuv420p`;

export const ssimFrames = (file, a, b) => {
  const graph = `[0]trim=start_frame=${a}:end_frame=${a + 1},setpts=PTS-STARTPTS[x];[1]trim=start_frame=${b}:end_frame=${b + 1},setpts=PTS-STARTPTS[y];[x][y]ssim`;
  const run = spawnSync('ffmpeg', ['-v', 'info', '-i', file, '-i', file, '-filter_complex', graph, '-f', 'null', '-'], { encoding: 'utf8' });
  const match = run.stderr.match(/All:([0-9.]+)/);
  return match ? Number(match[1]) : 0;
};
