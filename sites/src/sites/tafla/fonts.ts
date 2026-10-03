import { link } from '../../shared/link';

export const displayFontUrl = link('/tafla/fonts/Newsreader-Display.woff2');
export const textFontUrl = link('/tafla/fonts/Newsreader-Text.woff2');

const fallbackSources =
  "local('Times New Roman'), local('Liberation Serif'), local('TimesNewRomanPSMT')";

export const fontFaceCss = `
@font-face{font-family:'Newsreader Display';src:url(${displayFontUrl}) format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Newsreader Text';src:url(${textFontUrl}) format('woff2');font-weight:400 650;font-style:normal;font-display:swap}
@font-face{font-family:'Newsreader Display Fallback';src:${fallbackSources};size-adjust:110.5%;ascent-override:66.5%;descent-override:24%;line-gap-override:0%}
@font-face{font-family:'Newsreader Text Fallback';src:${fallbackSources};size-adjust:104.4%;ascent-override:70.4%;descent-override:25.4%;line-gap-override:0%}
`;
