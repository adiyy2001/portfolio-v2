import { color } from './tokens';

export const boltTravel = 128;

const parts = (shut: number, drawn: number) => {
  const dx = -(1 - shut) * boltTravel;
  const dash = (len: number) => (drawn >= 1 ? '' : ` stroke-dasharray="${len}" stroke-dashoffset="${(len * (1 - drawn)).toFixed(1)}"`);
  return [
    `<g transform="translate(-68.2 -32.3) scale(1.12)">`,
    `<rect x="176" y="396" width="420" height="232" rx="36" stroke="${color.dim}"${dash(1310)}/>`,
    `<path d="M748 412H860V612H748" stroke="${color.cyan}"${dash(424)}/>`,
    `<g transform="translate(${dx.toFixed(1)} 0)">`,
    `<rect x="236" y="478" width="600" height="68" rx="34" stroke="${color.cyan}"${dash(1300)}/>`,
    `<path d="M404 478V372" stroke="${color.cyan}"${dash(106)}/>`,
    `<circle cx="404" cy="344" r="28" stroke="${color.cyan}"${dash(176)}/>`,
    `</g>`,
    `</g>`,
  ].join('');
};

export const iconSvg = ({
  rounded = false,
  id = 'r',
  shut = 1,
  drawn = 1,
  glowAlpha = 0.55,
  bg = true,
}: { rounded?: boolean; id?: string; shut?: number; drawn?: number; glowAlpha?: number; bg?: boolean } = {}) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%" data-icon="${id}">`,
    `<defs><filter id="g-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter></defs>`,
    bg ? `<rect width="1024" height="1024" rx="${rounded ? 228 : 0}" fill="${color.void}"/>` : '',
    `<g fill="none" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" filter="url(#g-${id})" opacity="${glowAlpha}">${parts(shut, drawn)}</g>`,
    `<g fill="none" stroke-width="22" stroke-linecap="round" stroke-linejoin="round">${parts(shut, drawn)}</g>`,
    `</svg>`,
  ].join('');
