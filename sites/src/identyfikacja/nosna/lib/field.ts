export type Rng = () => number;

export type DayId = 'piatek' | 'sobota' | 'niedziela';
export type StageId = 'przedzalnia' | 'tkalnia' | 'farbiarnia' | 'wykonczalnia';
export type Family = 'ribbon' | 'steps' | 'bands' | 'fan';

export interface Variant {
  day: DayId;
  stage: StageId;
  bpm: number;
}

export interface Params {
  family: Family;
  cycles: number;
  threads: number;
  skew: number;
  phase: number;
  twist: number;
  detune: number[];
  wobble: number[];
}

export interface Thread {
  d: string;
  mode: 'stroke' | 'fill';
  width: number;
}

export interface Composed {
  threads: Thread[];
  count: number;
  cycles: number;
  seed: number;
  seedHex: string;
}

export interface WordData {
  d: string;
  width: number;
  top: number;
  bottom: number;
  size: number;
}

export interface MarkColors {
  thread: string;
  ink: string;
}

export const hashSeed = (input: string | number): number => {
  const text = String(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const mulberry32 = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const days = [
  {
    id: 'piatek',
    name: 'Piątek',
    short: 'PT',
    color: '#FF3D1F',
    text: '#B02A0B',
    skew: 0.62,
    phase: 0,
    rule: 'Piątek jest szybki i zaczyna mocno: energia sygnału kumuluje się na początku, a barwa jest cynobrowa.',
  },
  {
    id: 'sobota',
    name: 'Sobota',
    short: 'SB',
    color: '#00B3A4',
    text: '#00695F',
    skew: 1,
    phase: 2.0944,
    rule: 'Sobota jest środkiem festiwalu: sygnał nabrzmiewa symetrycznie, a barwa jest morska.',
  },
  {
    id: 'niedziela',
    name: 'Niedziela',
    short: 'ND',
    color: '#FF2D95',
    text: '#A8005C',
    skew: 1.65,
    phase: 4.1888,
    rule: 'Niedziela rozkręca się powoli i kończy głośno: energia leży na końcu, a barwa jest magentowa.',
  },
] as const;

export const stages = [
  {
    id: 'przedzalnia',
    name: 'Przędzalnia',
    family: 'ribbon',
    tempo: 100,
    rule: 'Skręcone nitki, jak przędza na wrzecionie: pęk linii obraca się wokół własnej osi.',
    program: 'instalacje dźwiękowe i warsztaty',
  },
  {
    id: 'tkalnia',
    name: 'Tkalnia',
    family: 'steps',
    tempo: 128,
    rule: 'Nitki zapisane schodkami, jak wzór na kartach krosna: poziome przebiegi i pionowe skoki.',
    program: 'koncerty na żywo',
  },
  {
    id: 'farbiarnia',
    name: 'Farbiarnia',
    family: 'bands',
    tempo: 92,
    rule: 'Pasma wypełnione kolorem, jak barwiona wstęga: między nitkami zostaje płaska plama.',
    program: 'pokazy wideo i projekcje',
  },
  {
    id: 'wykonczalnia',
    name: 'Wykończalnia',
    family: 'fan',
    tempo: 146,
    rule: 'Wachlarz równoległych linii, jak tkanina prasowana na gładko: porządek z lekkim drżeniem.',
    program: 'noc klubowa do rana',
  },
] as const;

export const tempoRange = { min: 60, max: 180 } as const;

export const geometry = {
  width: 600,
  height: 260,
  centerY: 130,
  half: 120,
  fieldFrom: 28,
  fieldTo: 528,
  carrier: 9,
  carrierEnd: 560,
  ringX: 578,
  ringR: 16,
  ringW: 8,
  thread: 5,
} as const;

const { centerY, half, fieldFrom, fieldTo } = geometry;

const fmt = (value: number) => {
  const text = value.toFixed(1);
  return text.endsWith('.0') ? text.slice(0, -2) : text;
};

export const seedOf = (variant: Variant): number =>
  hashSeed(`${variant.day}|${variant.stage}|${variant.bpm}`);

export const seedHex = (seed: number) => `0x${seed.toString(16).toUpperCase().padStart(8, '0')}`;

export const clampTempo = (bpm: number) =>
  Math.min(tempoRange.max, Math.max(tempoRange.min, Math.round(bpm)));

export const tempoPosition = (bpm: number) =>
  (clampTempo(bpm) - tempoRange.min) / (tempoRange.max - tempoRange.min);

export const threadCount = (stage: StageId, t: number) => {
  if (stage === 'farbiarnia') return 2 * Math.round(3 + t * 4);
  if (stage === 'tkalnia') return Math.round(5 + t * 4);
  if (stage === 'wykonczalnia') return 2 * Math.round(4 + t * 4) + 1;
  return Math.round(7 + t * 8);
};

export const paramsOf = (variant: Variant): Params => {
  const stage = stages.find(item => item.id === variant.stage)!;
  const day = days.find(item => item.id === variant.day)!;
  const t = tempoPosition(variant.bpm);
  const rng = mulberry32(seedOf(variant));
  const threads = threadCount(variant.stage, t);
  const cycles = 2.2 + t * 4.6;
  return {
    family: stage.family,
    cycles,
    threads,
    skew: day.skew,
    phase: day.phase + (rng() - 0.5) * 0.5,
    twist: 0.9 + rng() * 0.25,
    detune: Array.from({ length: threads }, () => 1 + (rng() - 0.5) * 0.03),
    wobble: Array.from({ length: threads }, () => (rng() - 0.5) * 0.06),
  };
};

const envelope = (u: number, skew: number) => Math.sin(Math.PI * Math.pow(u, skew));

const xAt = (u: number) => fieldFrom + u * (fieldTo - fieldFrom);

const waveY = (u: number, cycles: number, phase: number, skew: number, amp: number) =>
  centerY - half * amp * envelope(u, skew) * Math.sin(2 * Math.PI * cycles * u + phase);

interface Arch {
  cx: number;
  cy: number;
  x: number;
}

const arches = (cycles: number, phase: number, skew: number, amp: number): Arch[] => {
  const marks: number[] = [0];
  const kFrom = Math.ceil(phase / Math.PI + 1e-9);
  const kTo = Math.floor((2 * Math.PI * cycles + phase) / Math.PI - 1e-9);
  for (let k = kFrom; k <= kTo; k += 1) {
    const u = (k * Math.PI - phase) / (2 * Math.PI * cycles);
    if (u > 0.012 && u < 0.988 && u - marks[marks.length - 1] > 0.012) marks.push(u);
  }
  marks.push(1);
  const result: Arch[] = [];
  for (let i = 1; i < marks.length; i += 1) {
    const mid = (marks[i - 1] + marks[i]) / 2;
    const peak = waveY(mid, cycles, phase, skew, amp);
    result.push({ cx: xAt(mid), cy: centerY + 2 * (peak - centerY), x: xAt(marks[i]) });
  }
  return result;
};

const forwardPath = (list: Arch[]) =>
  `M${fmt(fieldFrom)} ${centerY}${list.map(a => `Q${fmt(a.cx)} ${fmt(a.cy)} ${fmt(a.x)} ${centerY}`).join('')}`;

const backwardPath = (list: Arch[]) => {
  let out = '';
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const from = i === 0 ? fieldFrom : list[i - 1].x;
    out += `Q${fmt(list[i].cx)} ${fmt(list[i].cy)} ${fmt(from)} ${centerY}`;
  }
  return out;
};

const ribbon = (p: Params, amp: number): Thread[] => {
  const strands: string[] = [];
  for (let j = 0; j < p.threads; j += 1) {
    const phase = p.phase + (Math.PI * p.twist * j) / Math.max(1, p.threads - 1);
    strands.push(forwardPath(arches(p.cycles * p.detune[j], phase, p.skew, amp)));
  }
  return [{ d: strands.join(''), mode: 'stroke', width: geometry.thread }];
};

const steps = (p: Params, amp: number): Thread[] => {
  const unit = half / 4;
  const samples = 250;
  const strands: string[] = [];
  for (let j = 0; j < p.threads; j += 1) {
    const phase = p.phase + (2 * Math.PI * p.twist * j) / p.threads;
    const cycles = p.cycles * p.detune[j];
    let path = `M${fmt(fieldFrom)} ${centerY}`;
    let last = 0;
    for (let i = 1; i <= samples; i += 1) {
      const u = i / samples;
      const raw = half * amp * envelope(u, p.skew) * Math.sin(2 * Math.PI * cycles * u + phase);
      const level = Math.round(raw / unit);
      if (level !== last) {
        path += `H${fmt(xAt(u))}V${fmt(centerY - level * unit)}`;
        last = level;
      }
    }
    strands.push(`${path}H${fmt(fieldTo)}`);
  }
  return [{ d: strands.join(''), mode: 'stroke', width: 3.6 }];
};

const bands = (p: Params, amp: number): Thread[] => {
  const count = p.threads / 2;
  const parts: string[] = [];
  for (let j = 0; j < count; j += 1) {
    const base = p.phase + (Math.PI * p.twist * j) / Math.max(1, count - 1);
    const cycles = p.cycles * p.detune[j * 2];
    const a = arches(cycles, base, p.skew, amp);
    const b = arches(cycles, base + 0.62, p.skew, amp);
    const closing = b.length > 0 ? `L${fmt(b[b.length - 1].x)} ${centerY}` : '';
    parts.push(`${forwardPath(a)}${closing}${backwardPath(b)}Z`);
  }
  return [{ d: parts.join(''), mode: 'fill', width: 0 }];
};

const fan = (p: Params, amp: number): Thread[] => {
  const points = 15;
  const strands: string[] = [];
  for (let j = 0; j < p.threads; j += 1) {
    const offset = p.threads === 1 ? 0 : -1 + (2 * j) / (p.threads - 1);
    const pts: [number, number][] = [];
    for (let i = 0; i < points; i += 1) {
      const u = i / (points - 1);
      const ripple =
        0.12 * Math.sin(2 * Math.PI * p.cycles * p.detune[j] * u + p.phase + offset * 2.2);
      const y = centerY - half * amp * envelope(u, p.skew) * (offset * 0.94 + ripple + p.wobble[j]);
      pts.push([xAt(u), y]);
    }
    let path = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
    for (let i = 1; i < points - 1; i += 1) {
      const end =
        i === points - 2
          ? pts[points - 1]
          : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      path += `Q${fmt(pts[i][0])} ${fmt(pts[i][1])} ${fmt(end[0])} ${fmt(end[1])}`;
    }
    strands.push(path);
  }
  return [{ d: strands.join(''), mode: 'stroke', width: 4 }];
};

export const composeParams = (p: Params, amp = 1): Thread[] => {
  if (p.family === 'ribbon') return ribbon(p, amp);
  if (p.family === 'steps') return steps(p, amp);
  if (p.family === 'bands') return bands(p, amp);
  return fan(p, amp);
};

export const compose = (variant: Variant, amp = 1): Composed => {
  const params = paramsOf(variant);
  const seed = seedOf(variant);
  return {
    threads: composeParams(params, amp),
    count: params.threads,
    cycles: Number(params.cycles.toFixed(1)),
    seed,
    seedHex: seedHex(seed),
  };
};

export const dayOf = (id: DayId) => days.find(item => item.id === id)!;
export const stageOf = (id: StageId) => stages.find(item => item.id === id)!;

export const grid: Variant[] = days.flatMap(day =>
  stages.map(stage => ({ day: day.id, stage: stage.id, bpm: stage.tempo })),
);

export const variantName = (variant: Variant) =>
  `${dayOf(variant.day).name}, ${stageOf(variant.stage).name}, ${variant.bpm} BPM`;

export const variantFile = (variant: Variant) =>
  `nosna-wariant-${variant.day}-${variant.stage}.svg`;

export const primaryVariant: Variant = { day: 'piatek', stage: 'przedzalnia', bpm: 100 };

const threadMarkup = (threads: Thread[], color: string, lite: boolean) =>
  threads
    .map(item =>
      item.mode === 'fill'
        ? `<path fill="${color}" d="${item.d}"/>`
        : `<path fill="none" stroke="${color}" stroke-width="${item.width}" stroke-linejoin="${lite ? 'round' : 'miter'}" d="${item.d}"/>`,
    )
    .join('');

export const carrierMarkup = (ink: string) =>
  `<path fill="none" stroke="${ink}" stroke-width="${geometry.carrier}" d="M0 ${centerY}H${geometry.carrierEnd}"/><circle cx="${geometry.ringX}" cy="${centerY}" r="${geometry.ringR}" fill="none" stroke="${ink}" stroke-width="${geometry.ringW}"/>`;

export const markBody = (
  variant: Variant,
  colors: MarkColors,
  { amp = 1, lite = false }: { amp?: number; lite?: boolean } = {},
) => {
  const composed = compose(variant, amp);
  return `${carrierMarkup(colors.ink)}${threadMarkup(composed.threads, colors.thread, lite)}`;
};

export const markBox = [0, 0, geometry.width, geometry.height] as const;

export const wordGap = 40;

export const primaryLockup = (variant: Variant, colors: MarkColors, word: WordData) => {
  const offset = geometry.height + wordGap - word.top;
  const height = Math.ceil(geometry.height + wordGap + (word.bottom - word.top));
  return {
    viewBox: [0, 0, geometry.width, height] as [number, number, number, number],
    body: `${markBody(variant, colors)}<path fill="${colors.ink}" transform="translate(0 ${fmt(offset)})" d="${word.d}"/>`,
  };
};

export const standaloneSvg = (
  variant: Variant,
  colors: MarkColors,
  word: WordData | null,
  title: string,
) => {
  const body = word ? primaryLockup(variant, colors, word) : null;
  const box = body ? body.viewBox : markBox;
  const inner = body ? body.body : markBody(variant, colors);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}" role="img"><title>${title}</title>${inner}</svg>`;
};
