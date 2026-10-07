import { color } from './tokens';

export const iconSvg = ({ rounded = false, id = 'k' }: { rounded?: boolean; id?: string } = {}) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">`,
    `<defs><mask id="${id}-m"><rect width="1024" height="1024" fill="#fff"/>`,
    `<circle cx="196" cy="512" r="58" fill="#000"/><circle cx="828" cy="512" r="58" fill="#000"/>`,
    `<circle cx="702" cy="420" r="44" fill="#000"/></mask></defs>`,
    `<rect width="1024" height="1024" rx="${rounded ? 228 : 0}" fill="${color.brand}"/>`,
    `<rect x="196" y="316" width="632" height="392" rx="52" fill="#fff" mask="url(#${id}-m)"/>`,
    `<path d="M346 520l84 82 166-170" fill="none" stroke="${color.brand}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join('');
