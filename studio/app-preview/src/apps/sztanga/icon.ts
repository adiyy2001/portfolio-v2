import { color } from './tokens';

export const iconSvg = ({ rounded = false, id = 's' }: { rounded?: boolean; id?: string } = {}) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%" data-icon="${id}">`,
    `<rect width="1024" height="1024" rx="${rounded ? 228 : 0}" fill="${color.ground}"/>`,
    `<rect x="64" y="490" width="896" height="44" fill="${color.ink}"/>`,
    `<rect x="214" y="232" width="128" height="560" fill="${color.signal}"/>`,
    `<rect x="682" y="232" width="128" height="560" fill="${color.signal}"/>`,
    `<rect x="350" y="452" width="28" height="120" fill="${color.ink}"/>`,
    `<rect x="646" y="452" width="28" height="120" fill="${color.ink}"/>`,
    `</svg>`,
  ].join('');
