import { useEffect, useRef, useState } from 'preact/hooks';
import {
  berry,
  colors,
  peak,
  periodMs,
  posesPerJump,
  smoothHeight,
  smoothPath,
  stepPath,
  steppedHeight,
  tempos,
} from './jump';

interface Props {
  caption: string;
}

const art = { w: 28, h: 32 };
const scale = 6;
const ground = 29;

const paint = (canvas: HTMLCanvasElement | null, lift: number) => {
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, art.w, art.h);
  const top = ground - berry.length - lift;
  berry.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const c = colors[row[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(6 + x, top + y, 1, 1);
    }
  });
};

const shadowWidth = (lift: number) => (lift >= 4 ? 8 : lift >= 2 ? 10 : 12) * scale;

const fmt = (value: number) => String(value).replace('.', ',');

export default function StepLab({ caption }: Props) {
  const [fps, setFps] = useState<number>(7.5);
  const [playing, setPlaying] = useState(false);
  const [ms, setMs] = useState(periodMs / 2);
  const smoothRef = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) setPlaying(true);
    paint(smoothRef.current, 0);
  }, []);

  useEffect(() => {
    paint(stepRef.current, steppedHeight(ms, fps));
  }, [ms, fps]);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - ms;
    const tick = (now: number) => {
      setMs((now - start) % (periodMs * 4));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [playing]);

  const local = ms % periodMs;
  const smooth = smoothHeight(local);
  const markerX = (local / periodMs) * 240;
  return (
    <div class="lab">
      <div class="lab__lanes">
        <figure class="lab__lane">
          <div
            class="lab__stage"
            style={{ width: `${art.w * scale}px`, height: `${art.h * scale}px` }}>
            <canvas
              ref={smoothRef}
              class="lab__smooth"
              width={art.w}
              height={art.h}
              role="img"
              aria-label="Poziomka w płynnym skoku"
              style={{ transform: `translateY(${(-smooth * scale).toFixed(2)}px)` }}
            />
            <span class="lab__shadow" style={{ width: `${shadowWidth(smooth)}px` }} />
          </div>
          <svg class="lab__plot" viewBox="-2 -2 244 64" aria-hidden="true">
            <path d={smoothPath(240, 60)} class="lab__curve" />
            <line x1={markerX} x2={markerX} y1="0" y2="60" class="lab__marker" />
          </svg>
          <figcaption>
            <b>Płynnie, 60 kl./s</b>
            <span>ease-in-out, wysokość {smooth.toFixed(2).replace('.', ',')} px, poza siatką</span>
          </figcaption>
        </figure>
        <figure class="lab__lane lab__lane--step">
          <div
            class="lab__stage"
            style={{ width: `${art.w * scale}px`, height: `${art.h * scale}px` }}>
            <canvas
              ref={stepRef}
              class="lab__pixel"
              width={art.w}
              height={art.h}
              role="img"
              aria-label="Poziomka w skoku z krokami"
            />
            <span
              class="lab__shadow"
              style={{ width: `${shadowWidth(steppedHeight(ms, fps))}px` }}
            />
          </div>
          <svg class="lab__plot" viewBox="-2 -2 244 64" aria-hidden="true">
            <path d={stepPath(240, 60, fps)} class="lab__curve lab__curve--step" />
            <line x1={markerX} x2={markerX} y1="0" y2="60" class="lab__marker" />
          </svg>
          <figcaption>
            <b>Kroki, {fmt(fps)} kl./s</b>
            <span>
              {posesPerJump(fps)} pozy na skok, wysokość {steppedHeight(ms, fps)} z {peak} px
            </span>
          </figcaption>
        </figure>
      </div>
      <div class="lab__controls">
        <fieldset class="lab__tempo">
          <legend>Tempo kroków</legend>
          {tempos.map(value => (
            <label key={value}>
              <input
                type="radio"
                name="tempo"
                checked={fps === value}
                onChange={() => setFps(value)}
              />
              <span>{fmt(value)} kl./s</span>
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          class="lab__play"
          onClick={() => setPlaying(!playing)}
          aria-pressed={playing}>
          {playing ? 'Zatrzymaj' : 'Odtwórz skok'}
        </button>
      </div>
      <p class="lab__caption">{caption}</p>
    </div>
  );
}
