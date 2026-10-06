export interface MotionData {
  square: string;
  letters: string[];
  defs: string;
  captionLines: string[];
  captionFill: string;
  cap: number;
  gap: number;
}

export interface Step {
  id: string;
  keyframes: Record<string, string | number>[];
  options: { duration: number; delay: number };
}

export const duration = 3000;
export const stage = {
  size: 1080,
  margin: 60,
  cols: 12,
  gutter: 12,
  scale: 1.35,
  ox: 141,
  oy: 378,
};

const colWidth = () =>
  (stage.size - stage.margin * 2 - stage.gutter * (stage.cols - 1)) / stage.cols;
const rowStep = () => colWidth() + stage.gutter;
const verticals = () =>
  Array.from({ length: stage.cols + 1 }, (_, i) =>
    i === stage.cols
      ? stage.size - stage.margin
      : Number((stage.margin + i * rowStep()).toFixed(1)),
  );
const horizontals = () =>
  Array.from({ length: 13 }, (_, j) => Number((54 + j * rowStep()).toFixed(1)));

const palette = { grid: '#bdbdb9', square: '#1f4bff', word: '#0a0a0a', label: '#5a5a57' };

export const animationSvg = (data: MotionData) => {
  const vs = verticals();
  const hs = horizontals();
  const lines =
    vs
      .map(
        (x, i) => `<line id="v${i}" x1="${x}" y1="0" x2="${x}" y2="${stage.size}" class="gl gv"/>`,
      )
      .join('') +
    hs
      .map(
        (y, j) => `<line id="h${j}" x1="0" y1="${y}" x2="${stage.size}" y2="${y}" class="gl gh"/>`,
      )
      .join('');
  const place = `translate(${stage.ox} ${stage.oy}) scale(${stage.scale})`;
  const squareEl = `<g id="sq"><g transform="${place}"><path fill="${palette.square}" d="${data.square}"/></g></g>`;
  const letters = data.letters
    .map(
      (d, i) =>
        `<g id="L${i}"><g transform="${place}"><path fill="${palette.word}" d="${d}"/></g></g>`,
    )
    .join('');
  const caption = data.captionLines
    .map(
      (uses, i) =>
        `<g id="c${i}"><g transform="${place}" fill="${data.captionFill}">${uses}</g></g>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${stage.size} ${stage.size}" role="img" aria-label="Logo Rzut rysuje się na siatce modułowej"><defs>${data.defs}</defs><rect width="${stage.size}" height="${stage.size}" fill="#ffffff"/>${lines}${squareEl}${letters}${caption}</svg>`;
};

export const initialCss = `
.gl{stroke:${palette.grid};stroke-width:1.5}
.gv{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0)}
.gh{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}
#sq{opacity:0;transform:translateX(-330px)}
#L0,#L1,#L2,#L3{opacity:0;transform:translateX(150px)}
#c0,#c1{clip-path:inset(0 100% 0 0)}
`;

const snap = (steps: number) => `steps(${steps}, end)`;

export const timeline = (): Step[] => {
  const steps: Step[] = [];
  for (let i = 0; i <= stage.cols; i += 1) {
    steps.push({
      id: `v${i}`,
      keyframes: [{ transform: 'scaleY(0)', easing: snap(8) }, { transform: 'scaleY(1)' }],
      options: { duration: 500, delay: i * 35 },
    });
  }
  for (let j = 0; j < 13; j += 1) {
    steps.push({
      id: `h${j}`,
      keyframes: [{ transform: 'scaleX(0)', easing: snap(8) }, { transform: 'scaleX(1)' }],
      options: { duration: 500, delay: 80 + j * 35 },
    });
  }
  steps.push({
    id: 'sq',
    keyframes: [
      { opacity: 0, transform: 'translateX(-330px)', offset: 0, easing: 'linear' },
      { opacity: 1, transform: 'translateX(-330px)', offset: 0.02, easing: snap(6) },
      { opacity: 1, transform: 'translateX(0px)', offset: 1 },
    ],
    options: { duration: 480, delay: 900 },
  });
  for (let i = 0; i < 4; i += 1) {
    steps.push({
      id: `L${i}`,
      keyframes: [
        { opacity: 0, transform: 'translateX(150px)', offset: 0, easing: 'linear' },
        { opacity: 1, transform: 'translateX(150px)', offset: 0.02, easing: snap(4) },
        { opacity: 1, transform: 'translateX(0px)', offset: 1 },
      ],
      options: { duration: 360, delay: 1500 + i * 140 },
    });
  }
  for (let k = 0; k < 2; k += 1) {
    steps.push({
      id: `c${k}`,
      keyframes: [
        { clipPath: 'inset(0 100% 0 0)', easing: snap(10) },
        { clipPath: 'inset(0 0% 0 0)' },
      ],
      options: { duration: 420, delay: 2150 + k * 220 },
    });
  }
  return steps;
};

export const play = (root: ParentNode, paused = false) =>
  timeline().flatMap(step => {
    const element = root.querySelector(`#${step.id}`);
    if (!element) return [];
    const animation = element.animate(step.keyframes as Keyframe[], {
      ...step.options,
      fill: 'both',
      easing: 'linear',
    });
    if (paused) animation.pause();
    return [animation];
  });
