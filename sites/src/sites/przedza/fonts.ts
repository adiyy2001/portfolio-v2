import { link } from '../../shared/link';

export const fontHref = link('/przedza/fonts/unbounded.woff2');

export const fontFaceCss = [
  `@font-face{font-family:'Unbounded';font-style:normal;font-weight:300 800;font-display:swap;src:url('${fontHref}') format('woff2')}`,
  `@font-face{font-family:'Unbounded Fallback';font-weight:300 500;src:local('Arial'),local('Liberation Sans'),local('Helvetica');size-adjust:129.96%;ascent-override:76.56%;descent-override:18.85%;line-gap-override:0%}`,
  `@font-face{font-family:'Unbounded Fallback';font-weight:600 800;src:local('Arial Bold'),local('Liberation Sans Bold'),local('Helvetica Bold');size-adjust:130.12%;ascent-override:76.47%;descent-override:18.83%;line-gap-override:0%}`,
].join('');
