import { asset } from './url';

export const outfitPreloadHref = () => asset('fonts/outfit.woff2');

export const fontFaceCss = () =>
  `@font-face{font-family:'Outfit';src:url(${outfitPreloadHref()}) format('woff2');font-weight:300 700;font-style:normal;font-display:swap}@font-face{font-family:'Outfit Fallback';src:local('Arial'),local('Liberation Sans');font-weight:300 500;size-adjust:98.59%;ascent-override:101.43%;descent-override:26.37%;line-gap-override:0%}@font-face{font-family:'Outfit Fallback';src:local('Arial Bold'),local('Liberation Sans Bold');font-weight:600 700;size-adjust:94.36%;ascent-override:105.98%;descent-override:27.55%;line-gap-override:0%}`;
