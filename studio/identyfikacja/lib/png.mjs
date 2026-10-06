import { execFileSync } from 'node:child_process';
import { renameSync } from 'node:fs';

export const quantizePng = (path, colors = 128) => {
  const temp = `${path}.q.png`;
  execFileSync('ffmpeg', [
    '-loglevel', 'error', '-y', '-i', path,
    '-filter_complex', `[0]split[a][b];[a]palettegen=max_colors=${colors}[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`,
    '-frames:v', '1', temp,
  ]);
  renameSync(temp, path);
};
