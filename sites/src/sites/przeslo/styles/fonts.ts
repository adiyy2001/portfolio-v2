const weights = [
  { range: '400 500', locals: ['Times New Roman', 'Liberation Serif', 'Times'], adjust: 122 },
  {
    range: '600 700',
    locals: ['Times New Roman Bold', 'Liberation Serif Bold', 'Times Bold'],
    adjust: 121.7,
  },
  {
    range: '800',
    locals: ['Times New Roman Bold', 'Liberation Serif Bold', 'Times Bold'],
    adjust: 130,
  },
] as const;

const ascent = 1.25;
const descent = 0.425;

const percent = (value: number): string => `${Math.round(value * 1000) / 10}%`;

export const fontFaceCss = (fontUrl: string): string => {
  const real = `@font-face{font-family:'Besley';src:url('${fontUrl}') format('woff2');font-weight:400 800;font-style:normal;font-display:swap}`;
  const fallbacks = weights.map(entry => {
    const sources = entry.locals.map(name => `local('${name}')`).join(',');
    const adjust = entry.adjust / 100;
    return `@font-face{font-family:'Besley Fallback';src:${sources};font-weight:${entry.range};size-adjust:${entry.adjust}%;ascent-override:${percent(ascent / adjust)};descent-override:${percent(descent / adjust)};line-gap-override:0%}`;
  });
  return [real, ...fallbacks].join('\n');
};
