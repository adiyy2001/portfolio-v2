import { link } from '../../shared/link';

export const fontUrl = link('/rubryka/fonts/BricolageGrotesque-subset.woff2');

const arialBold =
  "local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('Helvetica Bold')";

export const fontFaceCss = [
  `@font-face{font-family:'Bricolage Grotesque';font-style:normal;font-weight:400 800;font-display:swap;src:url(${fontUrl}) format('woff2')}`,
  `@font-face{font-family:'Bricolage Fallback';font-weight:400 500;src:local('Arial'),local('Liberation Sans'),local('Helvetica');size-adjust:104.3%;ascent-override:89.2%;descent-override:25.9%;line-gap-override:0%}`,
  `@font-face{font-family:'Bricolage Fallback';font-weight:600 800;src:${arialBold};size-adjust:101.5%;ascent-override:91.6%;descent-override:26.6%;line-gap-override:0%}`,
  `@font-face{font-family:'Bricolage Fallback Display';font-weight:700 800;src:${arialBold};size-adjust:100%;ascent-override:98.9%;descent-override:28.7%;line-gap-override:0%}`,
].join('');
