import { color } from '../tokens';
import type { Species } from '../content';

const ink = (a: number) => `rgba(74,44,42,${a})`;
const white = (a: number) => `rgba(255,255,255,${a})`;

const shading = (id: string) =>
  [
    `<radialGradient id="hl-${id}" cx="32%" cy="26%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity="0.78"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="sh-${id}" cx="68%" cy="78%" r="75%"><stop offset="0.35" stop-color="${color.ink}" stop-opacity="0"/><stop offset="1" stop-color="${color.ink}" stop-opacity="0.26"/></radialGradient>`,
    `<radialGradient id="gs-${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${color.ink}" stop-opacity="0.22"/><stop offset="1" stop-color="${color.ink}" stop-opacity="0"/></radialGradient>`,
  ].join('');

const lit = (id: string, shape: (fill: string) => string, base: string) =>
  `${shape(base)}${shape(`url(#sh-${id})`)}${shape(`url(#hl-${id})`)}`;

export type Mood = 'smile' | 'cheer' | 'worry';

export interface MascotPose {
  id: string;
  blink?: number;
  mood?: Mood;
  tilt?: number;
  nod?: number;
  leafL?: number;
  leafR?: number;
  lookX?: number;
  lookY?: number;
  shadow?: boolean;
}

const eyes = (mood: Mood, blink: number, lx: number, ly: number) => {
  const pos = [82 + lx, 112 + ly];
  const pos2 = [118 + lx, 112 + ly];
  if (mood === 'cheer') {
    return [pos, pos2]
      .map(([x, y]) => `<path d="M${x - 8} ${y + 3}Q${x} ${y - 7} ${x + 8} ${y + 3}" fill="none" stroke="${color.ink}" stroke-width="5" stroke-linecap="round"/>`)
      .join('');
  }
  const ry = Math.max(1.2, 8 * (1 - blink * 0.88));
  return [pos, pos2]
    .map(
      ([x, y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="6.8" ry="${ry.toFixed(2)}" fill="${color.ink}"/>` +
        (blink < 0.5 ? `<circle cx="${x + 2.2}" cy="${y - 2.8}" r="2.2" fill="${white(0.95)}"/>` : ''),
    )
    .join('');
};

const mouth = (mood: Mood, lx: number) => {
  const x = 100 + lx * 0.6;
  if (mood === 'cheer') return `<path d="M${x - 11} 126Q${x} 144 ${x + 11} 126Z" fill="${color.ink}"/>`;
  if (mood === 'worry') return `<path d="M${x - 8} 133Q${x - 4} 128 ${x} 132Q${x + 4} 136 ${x + 8} 131" fill="none" stroke="${color.ink}" stroke-width="3.6" stroke-linecap="round"/>`;
  return `<path d="M${x - 8} 127Q${x} 135 ${x + 8} 127" fill="none" stroke="${color.ink}" stroke-width="4" stroke-linecap="round"/>`;
};

const brows = (mood: Mood, lx: number, ly: number) =>
  mood === 'worry'
    ? `<path d="M${73 + lx} ${101 + ly}L${88 + lx} ${95 + ly}M${112 + lx} ${95 + ly}L${127 + lx} ${101 + ly}" stroke="${color.ink}" stroke-width="3.6" stroke-linecap="round"/>`
    : '';

const leaf = (id: string, cx: number, cy: number, rx: number, ry: number, angle: number, pivot: [number, number]) =>
  `<g transform="rotate(${angle.toFixed(2)} ${pivot[0]} ${pivot[1]})">` +
  lit(id, fill => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`, color.leaf) +
  `<path d="M${cx - rx * 0.62} ${cy + 1}Q${cx} ${cy - ry * 0.32} ${cx + rx * 0.62} ${cy + 1}" fill="none" stroke="${color.pistachio}" stroke-width="3.2" stroke-linecap="round"/>` +
  `</g>`;

const potBody = (fill: string) => `<path d="M42 172H158L149 214Q147 228 133 228H67Q53 228 51 214Z" fill="${fill}"/>`;
const potRim = (fill: string) => `<rect x="30" y="146" width="140" height="32" rx="16" fill="${fill}"/>`;
const head = (fill: string) => `<ellipse cx="100" cy="114" rx="53" ry="47" fill="${fill}"/>`;

export const mascotSvg = ({
  id,
  blink = 0,
  mood = 'smile',
  tilt = 0,
  nod = 0,
  leafL = 0,
  leafR = 0,
  lookX = 0,
  lookY = 0,
  shadow = true,
}: MascotPose) => {
  const droop = mood === 'worry' ? 14 : mood === 'cheer' ? -16 : 0;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%" overflow="visible">`,
    `<defs>${shading(id)}</defs>`,
    shadow ? `<ellipse cx="100" cy="230" rx="74" ry="10" fill="url(#gs-${id})"/>` : '',
    `<g transform="rotate(${tilt.toFixed(2)} 100 160) translate(0 ${nod.toFixed(2)})">`,
    `<path d="M100 74C99 64 101 58 100 50" fill="none" stroke="${color.leaf}" stroke-width="8" stroke-linecap="round"/>`,
    leaf(id, 73, 46, 28, 16.5, -22 + droop * -1 + leafL, [100, 54]),
    leaf(id, 128, 42, 30, 17.5, 20 + droop + leafR, [100, 54]),
    lit(id, head, color.pistachio),
    `<ellipse cx="${68 + lookX * 0.6}" cy="129" rx="9.5" ry="5.8" fill="${color.blush}"/>`,
    `<ellipse cx="${132 + lookX * 0.6}" cy="129" rx="9.5" ry="5.8" fill="${color.blush}"/>`,
    eyes(mood, blink, lookX, lookY),
    brows(mood, lookX, lookY),
    mouth(mood, lookX),
    `</g>`,
    lit(id, potBody, color.terracotta),
    lit(id, potRim, color.terracotta),
    `<path d="M44 154Q70 150 96 151" fill="none" stroke="${white(0.55)}" stroke-width="5" stroke-linecap="round"/>`,
    `</svg>`,
  ].join('');
};

const dropPath = 'M20 2C20 2 3 22 3 33.5A17 17 0 0 0 37 33.5C37 22 20 2 20 2Z';

export const dropSvg = (id: string) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="100%" height="100%" overflow="visible">`,
    `<defs>${shading(id)}</defs>`,
    lit(id, fill => `<path d="${dropPath}" fill="${fill}"/>`, color.water),
    `<ellipse cx="13.5" cy="32" rx="3.6" ry="7" transform="rotate(18 13.5 32)" fill="${white(0.8)}"/>`,
    `</svg>`,
  ].join('');

const smallPot = (id: string) =>
  lit(id, fill => `<path d="M17 42H47L44 58Q43 62 39 62H25Q21 62 20 58Z" fill="${fill}"/>`, color.terracotta) +
  lit(id, fill => `<rect x="13" y="37" width="38" height="9" rx="4.5" fill="${fill}"/>`, color.terracotta);

const plantShapes: Record<Species, (id: string) => string> = {
  monstera: id =>
    `<path d="M32 38V26" stroke="${color.leaf}" stroke-width="3" stroke-linecap="round"/>` +
    lit(id, fill => `<path d="M32 6C18 6 9 15 10 26C11 33 18 37 26 36L30 28L26 27L29 21L23 18L30 17L32 36C42 37 54 31 54 21C54 12 45 6 32 6Z" fill="${fill}"/>`, color.leaf) +
    `<path d="M32 10V34" stroke="${color.pistachio}" stroke-width="2" stroke-linecap="round"/>`,
  calathea: id =>
    [[-14, 22, 9, 15], [14, 22, 9, 15], [0, 17, 10, 17]]
      .map(([dx, cy, rx, ry], i) => {
        const cx = 32 + dx;
        const rot = dx < 0 ? -18 : dx > 0 ? 18 : 0;
        return (
          `<g transform="rotate(${rot} 32 38)">` +
          lit(`${id}`, fill => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`, i === 2 ? color.leaf : color.pistachio) +
          `<path d="M${cx} ${cy - ry + 4}V${cy + ry - 3}M${cx - rx + 4} ${cy - 4}L${cx} ${cy}M${cx + rx - 4} ${cy - 4}L${cx} ${cy}M${cx - rx + 4} ${cy + 4}L${cx} ${cy + 8}M${cx + rx - 4} ${cy + 4}L${cx} ${cy + 8}" stroke="${i === 2 ? color.pistachio : color.leaf}" stroke-width="1.8" stroke-linecap="round" fill="none"/>` +
          `</g>`
        );
      })
      .join(''),
  sansevieria: id =>
    [[-10, 12, -10], [0, 4, 0], [10, 10, 9]]
      .map(([dx, top, rot]) =>
        `<g transform="rotate(${rot} 32 40)">` +
        lit(id, fill => `<path d="M${32 + dx - 6} 40Q${32 + dx - 7} ${top + 14} ${32 + dx} ${top}Q${32 + dx + 7} ${top + 14} ${32 + dx + 6} 40Z" fill="${fill}"/>`, color.leaf) +
        `<path d="M${32 + dx - 4} 38Q${32 + dx - 4.5} ${top + 16} ${32 + dx} ${top + 4}" stroke="${color.butter}" stroke-width="1.6" fill="none"/>` +
        `</g>`,
      )
      .join(''),
  epipremnum: id =>
    `<path d="M24 40C18 46 14 52 12 60M40 40C46 44 50 50 51 57" stroke="${color.leaf}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    [[32, 20, 0, 1.15], [21, 28, -24, 0.9], [43, 27, 22, 0.95], [12, 54, -40, 0.7], [51, 52, 36, 0.7]]
      .map(([x, y, rot, s]) =>
        `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
        lit(id, fill => `<path d="M0 12C-12 4 -12 -9 -4 -10C-1 -10 0 -8 0 -6C0 -8 1 -10 4 -10C12 -9 12 4 0 12Z" fill="${fill}"/>`, color.leaf) +
        `<path d="M-6 -2Q-2 0 2 -5" stroke="${color.butter}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
        `</g>`,
      )
      .join(''),
  zamioculcas: id =>
    [[-9, -14], [9, 14], [0, 0]]
      .map(([dx, rot]) => {
        const leaves = [10, 17, 24, 31]
          .map((y, i) => lit(id, fill => `<ellipse cx="${32 + dx + (i % 2 ? 4 : -4)}" cy="${y}" rx="4" ry="6.5" transform="rotate(${i % 2 ? 30 : -30} ${32 + dx + (i % 2 ? 4 : -4)} ${y})" fill="${fill}"/>`, color.leaf))
          .join('');
        return `<g transform="rotate(${rot} 32 40)"><path d="M${32 + dx} 40V7" stroke="${color.leaf}" stroke-width="2.4" stroke-linecap="round"/>${leaves}</g>`;
      })
      .join(''),
  spathiphyllum: id =>
    [[-12, 24, -24], [12, 24, 24], [0, 20, 0]]
      .map(([dx, cy, rot]) => `<g transform="rotate(${rot} 32 40)">${lit(id, fill => `<ellipse cx="${32 + dx * 0.5}" cy="${cy}" rx="7" ry="15" fill="${fill}"/>`, color.leaf)}</g>`)
      .join('') +
    `<path d="M41 34V16" stroke="${color.leaf}" stroke-width="2" stroke-linecap="round"/>` +
    lit(id, fill => `<path d="M41 4C47 8 48 16 41 20C34 16 35 8 41 4Z" fill="${fill}"/>`, color.card),
  basil: id =>
    [[24, 30], [40, 30], [32, 22], [22, 19], [42, 18], [32, 11]]
      .map(([x, y], i) => lit(id, fill => `<ellipse cx="${x}" cy="${y}" rx="8" ry="6.5" fill="${fill}"/>`, i % 2 ? color.pistachio : color.leaf))
      .join(''),
};

export const plantSvg = (species: Species, id: string) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%" overflow="visible">`,
    `<defs>${shading(id)}</defs>`,
    plantShapes[species](id),
    smallPot(id),
    `</svg>`,
  ].join('');

export const iconMascotBox = { x: 196, y: 150, w: 632, h: 758 } as const;

export const iconSvg = ({ rounded = false, id = 'k', mascot = true, pose = {} as Partial<MascotPose> } = {}) => {
  const r = rounded ? 228 : 0;
  const m = iconMascotBox;
  const inner = mascot
    ? mascotSvg({ id: `${id}-m`, ...pose })
        .replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%" overflow="visible">', `<svg x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" viewBox="0 0 200 240" overflow="visible">`)
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%" data-icon="${id}">`,
    `<defs><radialGradient id="ig-${id}" cx="30%" cy="22%" r="85%"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="is-${id}" cx="72%" cy="82%" r="80%"><stop offset="0.45" stop-color="${color.ink}" stop-opacity="0"/><stop offset="1" stop-color="${color.ink}" stop-opacity="0.12"/></radialGradient></defs>`,
    `<rect width="1024" height="1024" rx="${r}" fill="${color.ground}"/>`,
    `<rect width="1024" height="1024" rx="${r}" fill="url(#is-${id})"/>`,
    `<rect width="1024" height="1024" rx="${r}" fill="url(#ig-${id})"/>`,
    `<circle cx="512" cy="478" r="336" fill="${color.card}"/>`,
    `<circle cx="512" cy="478" r="336" fill="url(#is-${id})"/>`,
    inner,
    `</svg>`,
  ].join('');
};

export const tabIcon = (tab: string) => {
  const s = `fill="none" stroke="${color.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
  if (tab === 'today') return `<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="4.5" ${s}/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" ${s}/></svg>`;
  if (tab === 'calendar') return `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="3.5" y="5" width="17" height="15.5" rx="4" ${s}/><path d="M8 3v4M16 3v4M3.5 10h17" ${s}/><circle cx="9" cy="15" r="1.4" fill="${color.ink}"/><circle cx="15" cy="15" r="1.4" fill="${color.ink}"/></svg>`;
  if (tab === 'diagnosis') return `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 20c0-9 5-15 15-16 0 9-5 15-13 15" ${s}/><path d="M4 20 13 11" ${s}/></svg>`;
  return `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3.5 11 12 4l8.5 7" ${s}/><path d="M6 9.5V19a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V9.5" ${s}/><path d="M10 20.5v-5h4v5" ${s}/></svg>`;
};

export const checkSvg = (stroke: string, width = 3.4) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M5.5 12.5l4.2 4.2L18.5 7.5" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const ink18 = ink(0.18);
