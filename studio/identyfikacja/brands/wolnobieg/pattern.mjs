import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const radii = [34, 42, 50, 58, 66];
const stripeWidth = 6;

export const patternSvg = ({ colors = [c.brazowy, c.musztarda, c.pomarancz, c.musztarda, c.brazowy], size = 200 } = {}) => {
  const bucket = Object.fromEntries(colors.map(color => [color, '']));
  const arc = (r, mode) => {
    if (mode === 'tl') return `M${r} 0A${r} ${r} 0 0 1 0 ${r}`;
    if (mode === 'br') return `M${100 - r} 100A${r} ${r} 0 0 1 100 ${100 - r}`;
    if (mode === 'tr') return `M${100 - r} 0A${r} ${r} 0 0 0 100 ${r}`;
    return `M0 ${100 - r}A${r} ${r} 0 0 1 ${r} 100`;
  };
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      const modes = (i + j) % 2 === 0 ? ['tl', 'br'] : ['tr', 'bl'];
      radii.forEach((r, index) => {
        for (const mode of modes) {
          bucket[colors[index]] += `<path d="${arc(r, mode)}" transform="translate(${i * 100} ${j * 100})"/>`;
        }
      });
    }
  }
  const groups = Object.entries(bucket)
    .map(([color, paths]) => `<g stroke="${color}">${paths}</g>`)
    .join('');
  return optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}"><g fill="none" stroke-width="${stripeWidth}">${groups}</g></svg>`, { precision: 1 });
};

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
