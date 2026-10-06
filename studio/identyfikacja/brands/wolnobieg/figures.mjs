import { join } from 'node:path';
import { writeFile } from '../../lib/files.mjs';
import { optimizeSvg, viewBoxOf } from '../../lib/svg.mjs';
import { layoutText, lineToPath, loadFont, ringToPath, textBounds } from '../../lib/text-path.mjs';
import { fontsSrcRoot } from '../../lib/paths.mjs';
import { discPath } from '../../../../sites/src/identyfikacja/wolnobieg/lib/stripes.ts';
import { brand, c, logo } from './theme.mjs';
import { wordmark, wordmarkPlain } from './logo-parts.mjs';

const figure = (name, svg) => writeFile(join(brand.paths.pub, 'figures', name), `${optimizeSvg(svg, { precision: 1 })}\n`);
const sketch = `fill="none" stroke="${c.kakao}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"`;

const rough = (points, jitter = 1.4, seed = 3) => {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647 - 0.5;
  };
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x + rand() * jitter).toFixed(1)} ${(y + rand() * jitter).toFixed(1)}`).join('');
};

export const buildFigures = () => {
  const font = loadFont(join(fontsSrcRoot(), 'baloo2', 'Baloo2[wght].ttf'), { wght: 800 });
  const ringLayout = layoutText(font, 'WOLNOBIEG · SERWIS · GDAŃSK · ', { size: 15, tracking: 0.12 });
  const ring = ringToPath(ringLayout, { cx: 100, cy: 100, radius: 70, startAngle: -90, digits: 1 });
  figure(
    'direction-odznaka.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path ${sketch} stroke-width="2.6" d="${rough(Array.from({ length: 41 }, (_, i) => [100 + Math.cos((i / 40) * Math.PI * 2) * 92, 100 + Math.sin((i / 40) * Math.PI * 2) * 92]), 1.6, 4)}"/><path ${sketch} stroke-width="2" d="${rough(Array.from({ length: 41 }, (_, i) => [100 + Math.cos((i / 40) * Math.PI * 2) * 52, 100 + Math.sin((i / 40) * Math.PI * 2) * 52]), 1.6, 8)}"/><path fill="${c.kakao}" d="${ring}"/><path fill="${c.pomarancz}" d="${discPath(100, 100, 18)}"/></svg>`,
  );

  const wPoints = [[34, 54], [64, 150], [100, 86], [136, 150], [166, 54]];
  const offsets = [
    [0, 0, c.pomarancz],
    [0, 17, c.musztarda],
    [0, 34, c.brazowy],
  ];
  figure(
    'direction-wstega.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${offsets.map(([dx, dy, color], i) => `<path fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="${rough(wPoints.map(([x, y]) => [x + dx, y + dy - 14]), 2.2, 11 + i)}"/>`).join('')}</svg>`,
  );

  const full = logo('symbol').replace('<svg ', '<svg width="200" height="200" ');
  figure('direction-kolo.svg', full);

  const plain = wordmarkPlain(100);
  const kerned = wordmark(100, 0, { x: 0, y: 0 });
  const guides = w => `<g stroke="${c.rdza}" stroke-width="1" fill="none" stroke-dasharray="5 4"><path d="M0 150H${w}M0 ${150 - 79}H${w}M0 ${150 - 61}H${w}"/></g>`;
  const width = Math.ceil(Math.max(plain.width, kerned.width) + 24);
  const changedPairs = ['Wo', 'eg'];
  const outlines = result => {
    const glyphs = result.layout.glyphs;
    return changedPairs
      .map(pair => {
        const at = glyphs.findIndex((entry, i) => entry.char + (glyphs[i + 1]?.char ?? '') === pair);
        const first = glyphs[at];
        const second = glyphs[at + 1];
        const left = 12 + first.x - 6;
        const right = 12 + second.x + second.advance + 6;
        return `<rect x="${left.toFixed(1)}" y="52" width="${(right - left).toFixed(1)}" height="116" rx="22" fill="none" stroke="${c.pomarancz}" stroke-width="4"/>`;
      })
      .join('');
  };
  figure('wordmark-default.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${guides(width)}<g transform="translate(12 150)"><path fill="${c.kawa}" d="${plain.d}"/></g>${outlines(plain)}</svg>`);
  figure('wordmark-kerned.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 190">${guides(width)}<g transform="translate(12 150)"><path fill="${c.kakao}" d="${kerned.d}"/></g>${outlines(kerned)}</svg>`);

  const primary = logo('primary');
  const [, , pw, ph] = viewBoxOf(primary);
  const unit = 119;
  const inner = `<g transform="translate(${unit} ${unit})">${primary.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '')}</g>`;
  const total = [pw + unit * 2, ph + unit * 2];
  const bandPath = `M0 0H${total[0]}V${total[1]}H0ZM${unit} ${unit}V${total[1] - unit}H${total[0] - unit}V${unit}Z`;
  const xLayout = layoutText(font, 'X', { size: 64 });
  const xBounds = textBounds(xLayout);
  const marker = (cx, cy) => {
    const half = unit / 2;
    const labelX = cx - (xBounds.minX + xBounds.maxX) / 2;
    const labelY = cy + (xLayout.capHeight || 46) / 2;
    return `<rect x="${cx - half + 6}" y="${cy - half + 6}" width="${unit - 12}" height="${unit - 12}" rx="14" fill="${c.pomarancz}" stroke="${c.kakao}" stroke-width="4"/><path fill="${c['krem-jasny']}" d="${lineToPath(xLayout, { x: labelX, y: labelY, digits: 1 })}"/>`;
  };
  const centerX = total[0] / 2;
  const centerY = total[1] / 2;
  const half = unit / 2;
  figure(
    'clearspace.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total[0]} ${total[1]}"><path fill="${c.musztarda}" fill-opacity=".45" fill-rule="evenodd" d="${bandPath}"/><rect x="${unit}" y="${unit}" width="${pw}" height="${ph}" fill="none" stroke="${c.rdza}" stroke-width="2" stroke-dasharray="8 6"/>${inner}${marker(centerX, half)}${marker(centerX, total[1] - half)}${marker(half, centerY)}${marker(total[0] - half, centerY)}</svg>`,
  );
  return { unit };
};
