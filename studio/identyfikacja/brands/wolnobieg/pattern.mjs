import { join } from 'node:path';
import { optimizeSvg } from '../../lib/svg.mjs';
import { writeFile } from '../../lib/files.mjs';
import { brand, c, file } from './theme.mjs';

const radii = [34, 42, 50, 58, 66];
const stripeWidth = 6;

export const patternSvg = ({ colors = [c.brazowy, c.musztarda, c.pomarancz, c.musztarda, c.brazowy], size = 200, cells = [2, 2], extend = 1.5 } = {}) => {
  const bucket = Object.fromEntries(colors.map(color => [color, '']));
  const arc = (r, mode) => {
    const e = extend;
    if (mode === 'tl') return e ? `M${r} ${-e}V0A${r} ${r} 0 0 1 0 ${r}H${-e}` : `M${r} 0A${r} ${r} 0 0 1 0 ${r}`;
    if (mode === 'br') return e ? `M${100 - r} ${100 + e}V100A${r} ${r} 0 0 1 100 ${100 - r}H${100 + e}` : `M${100 - r} 100A${r} ${r} 0 0 1 100 ${100 - r}`;
    if (mode === 'tr') return e ? `M${100 - r} ${-e}V0A${r} ${r} 0 0 0 100 ${r}H${100 + e}` : `M${100 - r} 0A${r} ${r} 0 0 0 100 ${r}`;
    return e ? `M${-e} ${100 - r}H0A${r} ${r} 0 0 1 ${r} 100V${100 + e}` : `M0 ${100 - r}A${r} ${r} 0 0 1 ${r} 100`;
  };
  for (let i = 0; i < cells[0]; i += 1) {
    for (let j = 0; j < cells[1]; j += 1) {
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
  return optimizeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cells[0] * 100} ${cells[1] * 100}" width="${(size * cells[0]) / 2}" height="${(size * cells[1]) / 2}"><g fill="none" stroke-width="${stripeWidth}">${groups}</g></svg>`, { precision: 1 });
};

export const buildPattern = () => writeFile(join(brand.paths.pub, file.pattern), `${patternSvg()}\n`);
