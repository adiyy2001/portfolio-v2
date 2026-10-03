const ascent = 1.125;
const descent = 0.4;

const regularSources = ['Times New Roman', 'Liberation Serif', 'Tinos', 'Times'];
const boldSources = ['Times New Roman Bold', 'Liberation Serif Bold', 'Tinos Bold', 'Times Bold'];

interface FallbackFace {
  weight: string;
  sizeAdjust: number;
  sources: string[];
}

const fallbackFaces: FallbackFace[] = [
  { weight: '400', sizeAdjust: 113, sources: regularSources },
  { weight: '500', sizeAdjust: 114.4, sources: regularSources },
  { weight: '600 700', sizeAdjust: 110.5, sources: boldSources },
];

export const fontFamily = "'Bodoni Moda', 'Bodoni Moda Fallback', 'Times New Roman', serif";

export const toPercent = (ratio: number): string => `${Math.round(ratio * 10000) / 100}%`;

export const fallbackFaceCss = ({ weight, sizeAdjust, sources }: FallbackFace): string => {
  const scale = sizeAdjust / 100;
  const src = sources.map(name => `local('${name}')`).join(',');
  return [
    "@font-face{font-family:'Bodoni Moda Fallback'",
    `src:${src}`,
    `font-weight:${weight}`,
    `size-adjust:${toPercent(scale)}`,
    `ascent-override:${toPercent(ascent / scale)}`,
    `descent-override:${toPercent(descent / scale)}`,
    'line-gap-override:0%}',
  ].join(';');
};

export const fontFacesCss = (fontUrl: string): string =>
  [
    `@font-face{font-family:'Bodoni Moda';src:url(${fontUrl}) format('woff2');font-weight:400 700;font-style:normal;font-display:swap}`,
    ...fallbackFaces.map(fallbackFaceCss),
  ].join('');
