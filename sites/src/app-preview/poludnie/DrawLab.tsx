import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { bellPath, counter, countEase, drawEase, framesToMs, linearEase } from './lab';

interface Props {
  total: number;
  caption: string;
}

const W = 300;
const H = 120;

const Lane = ({
  title,
  note,
  draw,
  count,
  total,
  path,
  kind,
}: {
  title: string;
  note: string;
  draw: number;
  count: number;
  total: number;
  path: string;
  kind: 'ease' | 'linear';
}) => (
  <figure class={`lab__lane lab__lane--${kind}`}>
    <div class="lab__count">
      <span>{counter(total * count)}</span> kWh
    </div>
    <svg class="lab__plot" viewBox={`-4 -8 ${W + 8} ${H + 16}`} role="img" aria-label={`Wykres produkcji: ${title}`}>
      <line x1="0" x2={W} y1={H} y2={H} class="lab__axis" />
      <path d={path} class="lab__ghost" />
      <path d={path} class="lab__line" pathLength={1} style={{ strokeDasharray: '1 1', strokeDashoffset: 1 - draw }} />
    </svg>
    <figcaption>
      <b>{title}</b>
      <span>{note}</span>
    </figcaption>
  </figure>
);

export default function DrawLab({ total, caption }: Props) {
  const [frames, setFrames] = useState(40);
  const [t, setT] = useState(1);
  const raf = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const path = useMemo(() => bellPath(W, H), []);
  const ms = framesToMs(frames);

  const play = (length = ms) => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / length);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    setT(0);
    raf.current = requestAnimationFrame(tick);
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
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div class="lab" ref={root}>
      <div class="lab__lanes">
        <Lane
          title="draw i count"
          note="linia rusza powoli, liczba od razu skacze blisko wyniku i spokojnie dochodzi"
          draw={drawEase(t)}
          count={countEase(t)}
          total={total}
          path={path}
          kind="ease"
        />
        <Lane
          title="liniowo"
          note="stała prędkość: linia wlecze się na początku, liczba długo pokazuje przypadkowe wartości"
          draw={linearEase(t)}
          count={linearEase(t)}
          total={total}
          path={path}
          kind="linear"
        />
      </div>
      <div class="lab__controls">
        <label class="lab__slider">
          <span>
            Długość: <output>{frames}</output> klatek, {(ms / 1000).toFixed(2).replace('.', ',')} s
          </span>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={frames}
            onInput={event => setFrames(Number((event.target as HTMLInputElement).value))}
            onChange={event => play(framesToMs(Number((event.target as HTMLInputElement).value)))}
          />
        </label>
        <button type="button" class="lab__play" onClick={() => play()}>
          Narysuj jeszcze raz
        </button>
      </div>
      <p class="lab__caption">{caption}</p>
    </div>
  );
}
