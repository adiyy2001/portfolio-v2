import { link } from '../../shared/link';

const file = (name: string) => link(`/docisk/fonts/${name}.woff2`);

const latin =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const latinExt =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';

const faces = [
  ['Barlow Condensed', 'BarlowCondensed-700', 700],
  ['Barlow', 'Barlow-400', 400],
  ['Barlow', 'Barlow-600', 600],
] as const;

export const preloadFontUrls = [file('BarlowCondensed-700-latin'), file('Barlow-400-latin')];

export const fontFaceCss = faces
  .flatMap(([family, name, weight]) => [
    `@font-face{font-family:'${family}';src:url(${file(`${name}-latin-ext`)}) format('woff2');font-weight:${weight};font-style:normal;font-display:swap;unicode-range:${latinExt}}`,
    `@font-face{font-family:'${family}';src:url(${file(`${name}-latin`)}) format('woff2');font-weight:${weight};font-style:normal;font-display:swap;unicode-range:${latin}}`,
  ])
  .join('\n');
