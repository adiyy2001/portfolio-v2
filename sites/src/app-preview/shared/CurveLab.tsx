import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { bezier, curvePath, springSamples, springStats } from './curves';

interface SpringLane {
  kind: 'spring';
  label: string;
  mass: number;
  stiffness: number;
  damping: number;
}

interface BezierLane {
  kind: 'bezier';
  label: string;
  points: [number, number, number, number];
  ms: number;
}

type Lane = SpringLane | BezierLane;

interface Props {
  spring: SpringLane;
  other: BezierLane;
  dampingMin: number;
  dampingMax: number;
  caption: string;
}

const rate = 240;
const windowMs = 900;

const laneValues = (lane: Lane) => {
  const count = Math.round((windowMs / 1000) * rate);
  if (lane.kind === 'spring') return springSamples(lane, windowMs / 1000, rate).slice(0, count + 1);
  const ease = bezier(...lane.points);
  return Array.from({ length: count + 1 }, (_, i) => ease(((i / rate) * 1000) / lane.ms));
};

const describe = (lane: Lane) => {
  if (lane.kind === 'spring') {
    const stats = springStats(lane);
    const over = (stats.overshoot * 100).toFixed(1).replace('.', ',');
    return `uspokaja się po ${stats.settleMs} ms, przestrzelenie ${over}%`;
  }
  return `kończy się dokładnie po ${lane.ms} ms, bez przestrzelenia`;
};

const Demo = ({
  lane,
  values,
  ghost,
  t,
}: {
  lane: Lane;
  values: number[];
  ghost: number[];
  t: number;
}) => {
  const index = Math.min(values.length - 1, Math.round(t * (values.length - 1)));
  const value = values[index];
  const w = 240;
  const h = 120;
  const path = curvePath(values, w, h);
  const x = (index / (values.length - 1)) * w;
  const y = h - (value / 1.2) * h;
  return (
    <figure class="lab__lane">
      <div class="lab__phone" aria-hidden="true">
        <div class="lab__sheet" style={{ transform: `translateY(${(1 - value) * 100}%)` }}>
          <span class="lab__grab"></span>
          <span class="lab__line lab__line--title"></span>
          <span class="lab__line"></span>
          <span class="lab__btn"></span>
        </div>
      </div>
      <svg
        class="lab__plot"
        viewBox={`-4 -4 ${w + 8} ${h + 8}`}
        role="img"
        aria-label={`Krzywa: ${lane.label}`}>
        <line x1="0" x2={w} y1={h - h / 1.2} y2={h - h / 1.2} class="lab__target" />
        <path d={curvePath(ghost, w, h)} class="lab__ghost" />
        <path d={path} class="lab__curve" />
        <circle cx={x} cy={y} r="5" class="lab__dot" />
      </svg>
      <figcaption>
        <strong>{lane.label}</strong>
        <span>{describe(lane)}</span>
      </figcaption>
    </figure>
  );
};

export default function CurveLab({ spring, other, dampingMin, dampingMax, caption }: Props) {
  const [damping, setDamping] = useState(spring.damping);
  const [t, setT] = useState(1);
  const frame = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const lane = { ...spring, damping };
  const springValues = useMemo(() => laneValues(lane), [damping]);
  const otherValues = useMemo(() => laneValues(other), [other]);

  const play = () => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / windowMs);
      setT(p);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    setT(0);
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          play();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div class="lab" ref={root}>
      <div class="lab__lanes">
        <Demo lane={lane} values={springValues} ghost={otherValues} t={t} />
        <Demo lane={other} values={otherValues} ghost={springValues} t={t} />
      </div>
      <div class="lab__controls">
        <label class="lab__slider">
          <span>
            Tłumienie sprężyny: <output>{damping}</output>
          </span>
          <input
            type="range"
            min={dampingMin}
            max={dampingMax}
            step="1"
            value={damping}
            onInput={event => setDamping(Number((event.target as HTMLInputElement).value))}
            onChange={play}
          />
        </label>
        <button type="button" class="lab__play" onClick={play}>
          Odtwórz oba ruchy
        </button>
      </div>
      <p class="lab__caption">{caption}</p>
    </div>
  );
}
