import { handGlyphsJson } from './glyphs';

type Point = [number, number];
type Glyph = { a: number; s: Point[][] };
type StrokeWidthPoints = Point[] & { w?: number };

const glyphs = JSON.parse(handGlyphsJson) as Record<string, Glyph>;
const svgNamespace = 'http://www.w3.org/2000/svg';
const top = 0.32;
const height = 1.5;
const gap = 0.07;

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hash = (text: string): number => {
  let value = 2166136261;
  for (let index = 0; index < text.length; index++) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
};

const createRandom = (seed: number): (() => number) => {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
};

const round1 = (value: number): number => Math.round(value * 1000) / 10;

const densify = (stroke: Point[], step: number): Point[] => {
  const out: Point[] = [stroke[0]];
  for (let index = 1; index < stroke.length; index++) {
    const from = stroke[index - 1];
    const to = stroke[index];
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const parts = Math.max(1, Math.round(length / step));
    for (let part = 1; part <= parts; part++) {
      out.push([
        from[0] + ((to[0] - from[0]) * part) / parts,
        from[1] + ((to[1] - from[1]) * part) / parts,
      ]);
    }
  }
  return out;
};

const pathFrom = (points: Point[]): string => {
  let d = `M${round1(points[0][0])} ${round1(points[0][1])}`;
  if (points.length === 2) return `${d}L${round1(points[1][0])} ${round1(points[1][1])}`;
  for (let index = 1; index < points.length - 1; index++) {
    const midX = (points[index][0] + points[index + 1][0]) / 2;
    const midY = (points[index][1] + points[index + 1][1]) / 2;
    d += `Q${round1(points[index][0])} ${round1(points[index][1])} ${round1(midX)} ${round1(midY)}`;
  }
  const last = points[points.length - 1];
  return `${d}L${round1(last[0])} ${round1(last[1])}`;
};

const wordSvg = (word: string, seed: number, wobble: number): SVGSVGElement => {
  const random = createRandom(seed);
  let x = 0.06;
  const paths: StrokeWidthPoints[] = [];
  const drift = random() * 6.28;
  for (let charIndex = 0; charIndex < word.length; charIndex++) {
    const glyph = glyphs[word[charIndex]] ?? glyphs['?'];
    const scale = 1 + (random() - 0.5) * 0.16 * wobble;
    const stretch = 0.9 + random() * 0.26;
    const shiftY =
      (random() - 0.5) * 0.11 * wobble + Math.sin(charIndex * 0.8 + drift) * 0.035 * wobble;
    const rotation = (random() - 0.5) * 0.11 * wobble;
    const slant = 0.02 + random() * 0.3;
    const weight = 0.72 + random() * 0.62;
    const centerX = glyph.a / 2;
    const centerY = 0.4;
    const phaseA = random() * 6.28;
    const phaseB = random() * 6.28;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    for (const stroke of glyph.s) {
      const bowX = (random() - 0.5) * 0.07 * wobble;
      const bowY = (random() - 0.5) * 0.07 * wobble;
      const strokeWeight = weight * (0.88 + random() * 0.24);
      const dense = densify(stroke, 0.08);
      const lastIndex = dense.length - 1;
      const points: StrokeWidthPoints = dense.map((point, pointIndex): Point => {
        const t = lastIndex ? pointIndex / lastIndex : 0;
        const bow = Math.sin(t * Math.PI);
        const px = (point[0] - centerX) * scale * stretch;
        const py = (point[1] - centerY) * scale;
        let rx = px * cos - py * sin + centerX;
        let ry = px * sin + py * cos + centerY;
        rx += (0.75 - point[1]) * slant + bow * bowX;
        rx += Math.sin(point[1] * 9 + phaseA) * 0.014 * wobble + (random() - 0.5) * 0.012 * wobble;
        ry +=
          Math.sin(point[0] * 8 + phaseB) * 0.014 * wobble +
          (random() - 0.5) * 0.012 * wobble +
          shiftY +
          bow * bowY;
        return [rx + x, ry + top];
      });
      points.w = strokeWeight;
      paths.push(points);
    }
    x += glyph.a * stretch + gap * (0.4 + random() * 1.4);
    if (word[charIndex] === 'r' && (word[charIndex + 1] === 'n' || word[charIndex + 1] === 'm')) {
      x += 0.07;
    }
  }
  const width = x + 0.06;
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', `0 0 ${round1(width)} ${round1(height)}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'hand-svg');
  svg.style.width = `${width.toFixed(3)}em`;
  svg.style.height = `${height}em`;
  const group = document.createElementNS(svgNamespace, 'g');
  group.setAttribute('filter', 'url(#hand-rough)');
  let index = 0;
  for (const points of paths) {
    const d = pathFrom(points);
    const offset = 0.006 + (((index * 37) % 11) / 11) * 0.014;
    const strokeWeight = points.w ?? 1;
    const variants: Array<[string, number]> = [
      ['pen2', offset],
      ['pen', 0],
    ];
    for (const [name, shift] of variants) {
      const path = document.createElementNS(svgNamespace, 'path');
      const factor = name === 'pen2' ? 0.55 * strokeWeight : strokeWeight;
      path.style.strokeWidth = `calc(var(--pen, 8.5) * ${factor.toFixed(3)})`;
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '1');
      path.setAttribute('class', name);
      if (shift)
        path.setAttribute('transform', `translate(${round1(shift)} ${round1(shift * 0.7)})`);
      path.style.setProperty('--i', String(index));
      group.appendChild(path);
    }
    index++;
  }
  svg.appendChild(group);
  return svg;
};

const build = (element: HTMLElement, text: string): void => {
  const seed = hash(text + (element.getAttribute('data-seed') ?? ''));
  const wobble = parseFloat(element.getAttribute('data-wobble') ?? '1.5');
  const lines = text.split('|');
  element.textContent = '';
  const readable = document.createElement('span');
  readable.className = 'sr-only';
  readable.textContent = element.getAttribute('data-read') ?? lines.join(' ');
  element.appendChild(readable);
  const run = document.createElement('span');
  run.className = 'hand-run';
  run.setAttribute('aria-hidden', 'true');
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) run.appendChild(document.createElement('br'));
    const words = line.split(' ');
    words.forEach((word, wordIndex) => {
      if (!word) return;
      const holder = document.createElement('span');
      holder.className = 'hand-word';
      holder.appendChild(wordSvg(word, seed + lineIndex * 131 + wordIndex * 17, wobble));
      run.appendChild(holder);
      if (wordIndex < words.length - 1) run.appendChild(document.createTextNode(' '));
    });
  });
  element.appendChild(run);
  element.classList.add('hand-built');
};

let observer: IntersectionObserver | null = null;

const draw = (element: HTMLElement): void => {
  build(element, element.getAttribute('data-hand') ?? (element.textContent ?? '').trim());
  if (observer) observer.observe(element);
  else element.classList.add('drawn');
};

export const setHandText = (element: HTMLElement, text: string): void => {
  element.setAttribute('data-hand', text);
  build(element, text);
  element.classList.add('drawn');
};

export const initHand = (): void => {
  if (document.documentElement.classList.contains('hand-on')) return;
  if ('IntersectionObserver' in window && !reducedMotion()) {
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('drawn');
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
  }
  const filter = document.createElementNS(svgNamespace, 'svg');
  filter.setAttribute('width', '0');
  filter.setAttribute('height', '0');
  filter.setAttribute('aria-hidden', 'true');
  filter.style.position = 'absolute';
  filter.innerHTML =
    '<filter id="hand-rough" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>';
  document.body.insertBefore(filter, document.body.firstChild);
  document.querySelectorAll<HTMLElement>('[data-hand]').forEach(draw);
  document.documentElement.classList.add('hand-on');
};
