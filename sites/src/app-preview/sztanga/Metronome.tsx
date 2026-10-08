import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { bezier, curvePath } from '../shared/curves';

interface Props {
  points: [number, number, number, number];
  slamMs: number;
  beatMs: number;
  caption: string;
}

const beatsShown = 4;

export default function Metronome({ points, slamMs, beatMs, caption }: Props) {
  const ease = useMemo(() => bezier(...points), [points]);
  const [time, setTime] = useState(slamMs + 1);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(0);

  const stop = () => {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
  };

  const start = () => {
    cancelAnimationFrame(raf.current);
    started.current = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const elapsed = now - started.current;
      setTime(elapsed);
      if (elapsed < beatMs * beatsShown * 4) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          start();
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

  const beat = Math.floor(time / beatMs) % beatsShown;
  const phase = time % beatMs;
  const slam = ease(Math.min(1, phase / slamMs));
  const linear = Math.min(1, phase / beatMs);
  const w = 300;
  const h = 110;
  const samples = 120;
  const slamCurve = Array.from({ length: samples + 1 }, (_, i) =>
    ease(Math.min(1, ((i / samples) * beatMs) / slamMs)),
  );
  const linearCurve = Array.from({ length: samples + 1 }, (_, i) => i / samples);
  const x = (phase / beatMs) * w;

  return (
    <div class="metro" ref={root}>
      <div class="metro__beats" aria-hidden="true">
        {Array.from({ length: beatsShown }, (_, i) => (
          <span class={i === beat ? 'is-on' : ''}>{i + 1}</span>
        ))}
      </div>
      <div class="metro__lanes">
        <div class="metro__lane">
          <p class="metro__label">
            <b>slam</b> cubic-bezier({points.join(', ')}), {slamMs}&nbsp;ms
          </p>
          <div class="metro__track" aria-hidden="true">
            <span
              class="metro__bar metro__bar--slam"
              style={{ transform: `scaleX(${slam})` }}></span>
          </div>
        </div>
        <div class="metro__lane">
          <p class="metro__label">
            <b>liniowo</b> przez całe uderzenie, {beatMs}&nbsp;ms
          </p>
          <div class="metro__track" aria-hidden="true">
            <span class="metro__bar" style={{ transform: `scaleX(${linear})` }}></span>
          </div>
        </div>
      </div>
      <svg
        class="metro__plot"
        viewBox={`-6 -6 ${w + 12} ${h + 12}`}
        role="img"
        aria-label="Wykres: slam dobija przed następnym uderzeniem, ruch liniowy nie zatrzymuje się wcale">
        <line x1="0" x2="0" y1="0" y2={h} class="metro__grid" />
        <line x1={w} x2={w} y1="0" y2={h} class="metro__grid" />
        <line
          x1={(slamMs / beatMs) * w}
          x2={(slamMs / beatMs) * w}
          y1="0"
          y2={h}
          class="metro__grid metro__grid--dash"
        />
        <path d={curvePath(linearCurve, w, h, 0)} class="metro__lin" />
        <path d={curvePath(slamCurve, w, h, 0)} class="metro__slam" />
        <line x1={x} x2={x} y1="0" y2={h} class="metro__head" />
      </svg>
      <div class="metro__controls">
        <button type="button" class="metro__play" onClick={() => (playing ? stop() : start())}>
          {playing ? 'Zatrzymaj metronom' : 'Uruchom metronom, 120 BPM'}
        </button>
        <p class="metro__caption">{caption}</p>
      </div>
    </div>
  );
}
