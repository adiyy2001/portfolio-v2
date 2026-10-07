export interface StripeColor {
  id: string;
  name: string;
  hex: string;
}

export interface StripeParams {
  count: number;
  colors: string[];
  curvature: number;
  wear: boolean;
}

export interface DrawnStripe {
  d: string;
  color: string;
  id: string;
}

export const stripeColors: StripeColor[] = [
  { id: 'pomarancz', name: 'Pomarańcz', hex: '#EC7424' },
  { id: 'musztarda', name: 'Musztarda', hex: '#E9A81D' },
  { id: 'brazowy', name: 'Brąz', hex: '#5B2F14' },
  { id: 'awokado', name: 'Awokado', hex: '#7C8A2B' },
  { id: 'rdza', name: 'Rdza', hex: '#A64A0D' },
  { id: 'kakao', name: 'Kakao', hex: '#3F2411' },
];

export const defaultParams: StripeParams = {
  count: 3,
  colors: ['pomarancz', 'musztarda', 'brazowy', 'awokado', 'rdza'],
  curvature: 0.55,
  wear: false,
};

export const presets: { name: string; params: StripeParams }[] = [
  { name: 'Klasyk', params: defaultParams },
  {
    name: 'Cztery pasy',
    params: {
      count: 4,
      colors: ['brazowy', 'pomarancz', 'musztarda', 'awokado', 'rdza'],
      curvature: 0.8,
      wear: false,
    },
  },
  {
    name: 'Dwa pasy',
    params: {
      count: 2,
      colors: ['rdza', 'musztarda', 'brazowy', 'awokado', 'pomarancz'],
      curvature: 0.3,
      wear: true,
    },
  },
  {
    name: 'Pięć pasów',
    params: {
      count: 5,
      colors: ['musztarda', 'pomarancz', 'rdza', 'brazowy', 'awokado'],
      curvature: 1,
      wear: false,
    },
  },
];

const fixed = (value: number) => Number(value.toFixed(1));

export const polar = (
  cx: number,
  cy: number,
  radius: number,
  degrees: number,
): [number, number] => {
  const radians = (degrees * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
};

const point = ([x, y]: [number, number]) => `${fixed(x)} ${fixed(y)}`;

export const arcStripe = (
  cx: number,
  cy: number,
  radius: number,
  width: number,
  from: number,
  to: number,
  round = true,
) => {
  const outer = radius + width / 2;
  const inner = radius - width / 2;
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  const back = sweep ? 0 : 1;
  const cap = width / 2;
  const startOuter = polar(cx, cy, outer, from);
  const endOuter = polar(cx, cy, outer, to);
  const endInner = polar(cx, cy, inner, to);
  const startInner = polar(cx, cy, inner, from);
  const tail = round
    ? `A${fixed(cap)} ${fixed(cap)} 0 0 ${sweep} ${point(endInner)}`
    : `L${point(endInner)}`;
  const head = round
    ? `A${fixed(cap)} ${fixed(cap)} 0 0 ${sweep} ${point(startOuter)}`
    : `L${point(startOuter)}`;
  return `M${point(startOuter)}A${fixed(outer)} ${fixed(outer)} 0 ${large} ${sweep} ${point(endOuter)}${tail}A${fixed(inner)} ${fixed(inner)} 0 ${large} ${back} ${point(startInner)}${head}Z`;
};

export const ringPath = (cx: number, cy: number, outer: number, inner: number) =>
  `M${fixed(cx - outer)} ${fixed(cy)}a${fixed(outer)} ${fixed(outer)} 0 1 0 ${fixed(outer * 2)} 0a${fixed(outer)} ${fixed(outer)} 0 1 0 ${fixed(-outer * 2)} 0ZM${fixed(cx - inner)} ${fixed(cy)}a${fixed(inner)} ${fixed(inner)} 0 1 1 ${fixed(inner * 2)} 0a${fixed(inner)} ${fixed(inner)} 0 1 1 ${fixed(-inner * 2)} 0Z`;

export const discPath = (cx: number, cy: number, radius: number) =>
  `M${fixed(cx - radius)} ${fixed(cy)}a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(radius * 2)} 0a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(-radius * 2)} 0Z`;

export const cogPath = (
  cx: number,
  cy: number,
  teeth: number,
  tip: number,
  root: number,
  rotation = 0,
) => {
  const step = 360 / teeth;
  const tipHalf = step * 0.2;
  const rootHalf = step * 0.31;
  let d = '';
  for (let i = 0; i < teeth; i += 1) {
    const mid = rotation + i * step;
    const a = polar(cx, cy, root, mid - rootHalf);
    const b = polar(cx, cy, tip, mid - tipHalf);
    const c = polar(cx, cy, tip, mid + tipHalf);
    const e = polar(cx, cy, root, mid + rootHalf);
    const next = polar(cx, cy, root, mid + step - rootHalf);
    d += `${i === 0 ? 'M' : 'L'}${point(a)}L${point(b)}A${fixed(tip)} ${fixed(tip)} 0 0 1 ${point(c)}L${point(e)}A${fixed(root)} ${fixed(root)} 0 0 1 ${point(next)}`;
  }
  return `${d}Z`;
};

export const holesPath = (
  cx: number,
  cy: number,
  count: number,
  orbit: number,
  radius: number,
  rotation = 0,
) => {
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const [x, y] = polar(cx, cy, orbit, rotation + (360 / count) * i);
    d += discPath(x, y, radius);
  }
  return d;
};

export const clampParams = (params: StripeParams): StripeParams => ({
  count: Math.min(5, Math.max(2, Math.round(params.count))),
  colors: params.colors.slice(0, 5),
  curvature: Math.min(1, Math.max(0, params.curvature)),
  wear: Boolean(params.wear),
});

export const composerBox = { width: 600, height: 440 };

export const composerStripes = (input: StripeParams): DrawnStripe[] => {
  const params = clampParams(input);
  const { width, height } = composerBox;
  const stripeWidth = 30;
  const gap = 9;
  const pitch = stripeWidth + gap;
  const innerRadius = 2400 - params.curvature * 2160;
  const spreadOf = (radius: number) =>
    Math.min(80, (Math.asin(Math.min(1, (width / 2 - 28) / radius)) * 180) / Math.PI);
  const radii = Array.from(
    { length: params.count },
    (_, index) => innerRadius + (params.count - 1 - index) * pitch,
  );
  const top = -(radii[0] - innerRadius) - stripeWidth / 2;
  const bottom = Math.max(
    ...radii.map(
      radius =>
        innerRadius - radius * Math.cos((spreadOf(radius) * Math.PI) / 180) + stripeWidth / 2,
    ),
  );
  const peak = (height - (bottom - top)) / 2 - top;
  const cx = width / 2;
  const cy = peak + innerRadius;
  return radii.map((radius, index) => {
    const spread = spreadOf(radius);
    const id = params.colors[index] ?? 'pomarancz';
    const color = stripeColors.find(item => item.id === id)?.hex ?? '#EC7424';
    return {
      d: arcStripe(cx, cy, radius, stripeWidth, 270 - spread, 270 + spread, true),
      color,
      id,
    };
  });
};

export const wearFilter =
  '<filter id="wear" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.22" numOctaves="3" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 8 -2.35" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>';

export const composerSvg = (input: StripeParams) => {
  const params = clampParams(input);
  const { width, height } = composerBox;
  const stripes = composerStripes(params)
    .map(stripe => `<path fill="${stripe.color}" d="${stripe.d}"/>`)
    .join('');
  const defs = params.wear ? `<defs>${wearFilter}</defs>` : '';
  const body = params.wear ? `<g filter="url(#wear)">${stripes}</g>` : stripes;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${defs}${body}</svg>`;
};

export const describeParams = (input: StripeParams) => {
  const params = clampParams(input);
  const names = params.colors
    .slice(0, params.count)
    .map(id => stripeColors.find(item => item.id === id)?.name ?? id);
  const bend = Math.round(params.curvature * 100);
  return `${params.count} ${params.count === 5 ? 'pasów' : 'pasy'}: ${names.join(', ')}. Łuk ${bend} procent${params.wear ? ', lekkie zużycie' : ''}.`;
};
