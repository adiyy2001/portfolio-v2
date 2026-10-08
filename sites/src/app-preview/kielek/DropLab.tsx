import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { curvePath, springStats, type SpringConfig } from '../shared/curves';
import { dropPose, fallMs, peakStretch, returnCurve, squashMs, totalMs } from './drop';

interface Props {
  bounce: SpringConfig;
  stiff: SpringConfig;
  caption: string;
}

const dropPath = 'M20 2C20 2 3 22 3 33.5A17 17 0 0 0 37 33.5C37 22 20 2 20 2Z';
const fmt = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');

const Lane = ({
  name,
  config,
  ms,
  kind,
}: {
  name: string;
  config: SpringConfig;
  ms: number;
  kind: 'bounce' | 'stiff';
}) => {
  const curve = useMemo(() => returnCurve(config), [config.mass, config.stiffness, config.damping]);
  const pose = dropPose(ms, curve);
  const stats = springStats(config);
  const bottom = 64 + (186 - 64) * pose.y;
  const w = 240;
  const h = 110;
  const shown = curve.slice(0, Math.round(curve.length * 0.75));
  const back = Math.max(0, ms - fallMs - squashMs);
  const index = Math.min(shown.length - 1, Math.round((back / 1000) * 240));
  const x = (index / (shown.length - 1)) * w;
  const y = h - (shown[index] / 1.4) * h;
  return (
    <figure class={`lab__lane lab__lane--${kind}`}>
      <svg class="lab__scene" viewBox="0 0 200 220" role="img" aria-label={`Kropla: ${name}`}>
        <ellipse cx="100" cy="196" rx="78" ry="16" class="lab__leaf" />
        <ellipse cx="80" cy="190" rx="40" ry="6" class="lab__shine" />
        <g transform={`translate(100 ${bottom}) scale(${pose.sx} ${pose.sy}) translate(-20 -52)`}>
          <path d={dropPath} class="lab__drop" />
          <ellipse
            cx="13.5"
            cy="32"
            rx="3.6"
            ry="7"
            transform="rotate(18 13.5 32)"
            class="lab__glint"
          />
        </g>
      </svg>
      <svg class="lab__plot" viewBox={`-4 -4 ${w + 8} ${h + 8}`} aria-hidden="true">
        <line x1="0" x2={w} y1={h - h / 1.4} y2={h - h / 1.4} class="lab__target" />
        <path d={curvePath(shown, w, h, 0.4)} class="lab__curve" />
        <circle cx={x} cy={y} r="5" class="lab__dot" />
      </svg>
      <figcaption>
        <b>{name}</b>
        <span>
          masa {config.mass}, sztywność {config.stiffness}, tłumienie {config.damping}
        </span>
        <span>
          przestrzelenie {fmt(stats.overshoot * 100)}%, najwyższe rozciągnięcie{' '}
          {fmt(peakStretch(curve), 2)}, spokój po {stats.settleMs} ms
        </span>
      </figcaption>
    </figure>
  );
};

export default function DropLab({ bounce, stiff, caption }: Props) {
  const [stiffness, setStiffness] = useState(bounce.stiffness);
  const [damping, setDamping] = useState(bounce.damping);
  const [ms, setMs] = useState(totalMs);
  const frame = useRef(0);
  const root = useRef<HTMLDivElement>(null);

  const play = () => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(totalMs, now - start);
      setMs(t);
      if (t < totalMs) frame.current = requestAnimationFrame(tick);
    };
    setMs(0);
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

  const left = { mass: bounce.mass, stiffness, damping };

  return (
    <div class="lab" ref={root}>
      <div class="lab__lanes">
        <Lane name="Sprężyna bounce" config={left} ms={ms} kind="bounce" />
        <Lane name="Sprężyna sztywna" config={stiff} ms={ms} kind="stiff" />
      </div>
      <div class="lab__controls">
        <label class="lab__slider">
          <span>
            Sztywność: <output>{stiffness}</output>
          </span>
          <input
            type="range"
            min="80"
            max="400"
            step="10"
            value={stiffness}
            onInput={event => setStiffness(Number((event.target as HTMLInputElement).value))}
            onChange={play}
          />
        </label>
        <label class="lab__slider">
          <span>
            Tłumienie: <output>{damping}</output>
          </span>
          <input
            type="range"
            min="6"
            max="40"
            step="1"
            value={damping}
            onInput={event => setDamping(Number((event.target as HTMLInputElement).value))}
            onChange={play}
          />
        </label>
        <button type="button" class="lab__play" onClick={play}>
          Upuść krople
        </button>
      </div>
      <p class="lab__caption">{caption}</p>
    </div>
  );
}
