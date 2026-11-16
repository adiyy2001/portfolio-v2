import { link } from '../../shared/link';

export const fontUrls = {
  latin: link('/kancelaria-swidnicka/fonts/bodoni-moda-latin.woff2'),
  latinExt: link('/kancelaria-swidnicka/fonts/bodoni-moda-latin-ext.woff2'),
};

export const preloadedFonts = [fontUrls.latin];

const latinRange =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const latinExtRange =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';

export const fontFaceCss = `
@font-face{font-family:'Bodoni Moda';font-style:normal;font-weight:400 900;font-display:swap;src:url(${fontUrls.latinExt}) format('woff2');unicode-range:${latinExtRange}}
@font-face{font-family:'Bodoni Moda';font-style:normal;font-weight:400 900;font-display:swap;src:url(${fontUrls.latin}) format('woff2');unicode-range:${latinRange}}
@font-face{font-family:'Bodoni Fallback';src:local('Times New Roman'),local('TimesNewRomanPSMT'),local('Liberation Serif'),local('Tinos');font-weight:400 900;size-adjust:96%;ascent-override:100%;descent-override:26%;line-gap-override:0%}
`.trim();

export const displayStack = "'Bodoni Moda','Bodoni Fallback',Didot,'Times New Roman',serif";
