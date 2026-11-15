import { link } from '../../shared/link';

const latinRange =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const latinExtRange =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';

export const textFontUrl = link('/otoczak/fonts/newsreader-latin.woff2');
export const italicFontUrl = link('/otoczak/fonts/newsreader-italic-latin.woff2');

const face = (file: string, style: 'normal' | 'italic', weight: string, range: string) =>
  `@font-face{font-family:'Newsreader';font-style:${style};font-weight:${weight};font-display:swap;src:url(${link(`/otoczak/fonts/${file}`)}) format('woff2');unicode-range:${range}}`;

export const fontFaceCss = [
  face('newsreader-latin-ext.woff2', 'normal', '300 400', latinExtRange),
  face('newsreader-latin.woff2', 'normal', '300 400', latinRange),
  face('newsreader-italic-latin-ext.woff2', 'italic', '300', latinExtRange),
  face('newsreader-italic-latin.woff2', 'italic', '300', latinRange),
].join('\n');
