import { link } from '../../shared/link';

export const fontUrls = {
  manropeLatin: link('/emalia/fonts/manrope-normal-400-800-latin.woff2'),
  manropeExt: link('/emalia/fonts/manrope-normal-400-800-latin-ext.woff2'),
  fraunces: link('/emalia/fonts/fraunces-italic-400-600-latin.woff2'),
  frauncesExt: link('/emalia/fonts/fraunces-italic-400-600-latin-ext.woff2'),
};

export const preloadedFonts = [fontUrls.manropeLatin, fontUrls.manropeExt];

const latinRange =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const extRange =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';

export const fontFaceCss = `
@font-face{font-family:'Manrope';font-style:normal;font-weight:400 800;font-display:swap;src:url(${fontUrls.manropeExt}) format('woff2');unicode-range:${extRange}}
@font-face{font-family:'Manrope';font-style:normal;font-weight:400 800;font-display:swap;src:url(${fontUrls.manropeLatin}) format('woff2');unicode-range:${latinRange}}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:400 600;font-display:swap;src:url(${fontUrls.frauncesExt}) format('woff2');unicode-range:${extRange}}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:400 600;font-display:swap;src:url(${fontUrls.fraunces}) format('woff2');unicode-range:${latinRange}}
`.trim();
