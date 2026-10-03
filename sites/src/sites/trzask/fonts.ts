import { link } from '../../shared/link';

export const fontUrls = {
  display: link('/trzask/fonts/BigShouldersDisplay.woff2'),
  text: link('/trzask/fonts/Chivo.woff2'),
  stencil: link('/trzask/fonts/BigShouldersStencil.woff2'),
};

export const preloadedFonts = [fontUrls.display, fontUrls.text];

export const fontFaceCss = `
@font-face{font-family:'Trzask Display';src:url(${fontUrls.display}) format('woff2');font-weight:700 900;font-style:normal;font-display:swap}
@font-face{font-family:'Trzask Text';src:url(${fontUrls.text}) format('woff2');font-weight:400 700;font-style:normal;font-display:swap}
@font-face{font-family:'Trzask Stencil';src:url(${fontUrls.stencil}) format('woff2');font-weight:800;font-style:normal;font-display:swap}
@font-face{font-family:'Trzask Display Fallback';src:local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('Arimo Bold');font-weight:700 900;size-adjust:65.57%;ascent-override:150.06%;descent-override:32.48%;line-gap-override:0%}
@font-face{font-family:'Trzask Text Fallback';src:local('Arial'),local('ArialMT'),local('Liberation Sans'),local('Arimo');font-weight:400 500;size-adjust:107.17%;ascent-override:87.71%;descent-override:23.33%;line-gap-override:0%}
@font-face{font-family:'Trzask Text Fallback';src:local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('Arimo Bold');font-weight:600 700;size-adjust:101.29%;ascent-override:92.81%;descent-override:24.68%;line-gap-override:0%}
@font-face{font-family:'Trzask Stencil Fallback';src:local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('Arimo Bold');font-weight:800;size-adjust:66.01%;ascent-override:149.06%;descent-override:32.27%;line-gap-override:0%}
`.trim();
