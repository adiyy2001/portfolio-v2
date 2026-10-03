import { link } from '../../../shared/link';

export const fontUrl = link('/prog/fonts/archivo.woff2');

export const fontFaces = `
@font-face{font-family:'Archivo';src:url('${fontUrl}') format('woff2');font-weight:400 800;font-stretch:62% 100%;font-style:normal;font-display:swap}
@font-face{font-family:'Archivo Fallback';src:local('Arial'),local('ArialMT');size-adjust:98.43%;ascent-override:89.2%;descent-override:21.34%;line-gap-override:0%}
@font-face{font-family:'Archivo Display Fallback';src:local('Arial Bold'),local('Arial-BoldMT');font-weight:700 800;size-adjust:78.6%;ascent-override:111.7%;descent-override:26.72%;line-gap-override:0%}
`;
