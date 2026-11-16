import { link } from '../../shared/link';

export const fontUrls = {
  latin: link('/nieruchomosci-psie-pole/fonts/newsreader-latin-opsz-normal.woff2'),
  latinExt: link('/nieruchomosci-psie-pole/fonts/newsreader-latin-ext-opsz-normal.woff2'),
};

export const preloadedFonts = [fontUrls.latin, fontUrls.latinExt];

export const fontFaceCss = `
@font-face{font-family:'Newsreader Variable';font-style:normal;font-display:swap;font-weight:200 800;src:url(${fontUrls.latinExt}) format('woff2-variations');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Newsreader Variable';font-style:normal;font-display:swap;font-weight:200 800;src:url(${fontUrls.latin}) format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Psie Pole Fallback';src:local('Georgia'),local('Liberation Serif'),local('Tinos'),local('Times New Roman');font-weight:200 800;size-adjust:97%;ascent-override:94%;descent-override:26%;line-gap-override:0%}
`.trim();
