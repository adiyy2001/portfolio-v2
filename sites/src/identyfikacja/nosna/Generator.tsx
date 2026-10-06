import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  carrierMarkup,
  clampTempo,
  composeParams,
  dayOf,
  days,
  paramsOf,
  seedHex,
  seedOf,
  stageOf,
  stages,
  standaloneSvg,
  tempoRange,
  variantName,
} from './lib/field';
import type { DayId, StageId, Variant } from './lib/field';
import wordData from './word-data.json';

interface Props {
  initial: Variant;
  ink: string;
}

const geometryBox = '0 0 600 260';
const reelLength = 3000;

export const exportName = (variant: Variant) =>
  `nosna-${variant.day}-${variant.stage}-${variant.bpm}bpm.svg`;

export default function Generator({ initial, ink }: Props) {
  const [day, setDay] = useState<DayId>(initial.day);
  const [stage, setStage] = useState<StageId>(initial.stage);
  const [bpm, setBpm] = useState(initial.bpm);
  const [moving, setMoving] = useState(false);
  const [calm, setCalm] = useState(false);
  const [drift, setDrift] = useState(0);
  const [reel, setReel] = useState<number | null>(null);
  const frame = useRef(0);
  const reelFrame = useRef(0);
  const root = useRef<HTMLDivElement>(null);

  const variant = useMemo<Variant>(() => ({ day, stage, bpm: clampTempo(bpm) }), [day, stage, bpm]);
  const shownDay =
    reel === null ? day : days[Math.min(days.length - 1, Math.floor(reel / 1000))].id;
  const shown = useMemo<Variant>(() => ({ ...variant, day: shownDay }), [variant, shownDay]);
  const params = useMemo(() => paramsOf(shown), [shown]);
  const color = dayOf(shownDay).color;
  const seed = seedHex(seedOf(variant));

  useEffect(() => {
    root.current
      ?.closest<HTMLElement>('[data-hero]')
      ?.style.setProperty('--hero', `var(--${shownDay})`);
  }, [shownDay]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setCalm(query.matches);
      if (query.matches) setMoving(false);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!moving) {
      setDrift(0);
      return undefined;
    }
    const started = performance.now();
    const tick = (now: number) => {
      setDrift(((now - started) / 1000) * 1.3);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [moving]);

  const reelDrift = reel === null ? 0 : (reel / reelLength) * Math.PI * 2;
  const threads = useMemo(
    () => composeParams({ ...params, phase: params.phase + drift + reelDrift }, 1),
    [params, drift, reelDrift],
  );

  const playReel = () => {
    setMoving(false);
    const started = performance.now();
    const tick = (now: number) => {
      const elapsed = now - started;
      if (elapsed >= reelLength) {
        setReel(null);
        return;
      }
      setReel(elapsed);
      reelFrame.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(reelFrame.current);
    reelFrame.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(reelFrame.current), []);

  const download = () => {
    const svg = standaloneSvg(
      variant,
      { thread: color, ink },
      wordData,
      `Nośna, ${variantName(variant)}`,
    );
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = exportName(variant);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const shuffle = () => {
    const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
    setDay(pick(days).id);
    setStage(pick(stages).id);
    setBpm(Math.round(tempoRange.min + Math.random() * (tempoRange.max - tempoRange.min)));
  };

  const description = `${variantName(variant)}, ziarno ${seed}`;

  return (
    <div class="gen" ref={root}>
      <figure class="gen__stage">
        <svg
          viewBox={geometryBox}
          role="img"
          aria-label={`Wygenerowany znak: ${description}`}
          class="gen__svg">
          <g dangerouslySetInnerHTML={{ __html: carrierMarkup(ink) }} />
          {threads.map(item =>
            item.mode === 'fill' ? (
              <path fill={color} d={item.d} />
            ) : (
              <path
                fill="none"
                stroke={color}
                stroke-width={item.width}
                stroke-linejoin="miter"
                d={item.d}
              />
            ),
          )}
        </svg>
        <figcaption class="gen__readout">
          <span>
            <b>{dayOf(day).name}</b>
            <i>{stageOf(stage).name}</i>
          </span>
          <span>{variant.bpm} BPM</span>
          <span>{params.threads} nitek</span>
          <span>{params.cycles.toFixed(1).replace('.', ',')} drgań</span>
          <span>ziarno {seed}</span>
        </figcaption>
      </figure>

      <div class="gen__panel">
        <fieldset class="gen__group">
          <legend>Dzień</legend>
          <div class="gen__days">
            {days.map(item => (
              <label class={`gen__day gen__day--${item.id}`}>
                <input
                  type="radio"
                  name="gen-day"
                  value={item.id}
                  checked={day === item.id}
                  onChange={() => setDay(item.id)}
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset class="gen__group">
          <legend>Scena</legend>
          <div class="gen__stages">
            {stages.map(item => (
              <label class="gen__stage-choice">
                <input
                  type="radio"
                  name="gen-stage"
                  value={item.id}
                  checked={stage === item.id}
                  onChange={() => {
                    setStage(item.id);
                    setBpm(item.tempo);
                  }}
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div class="gen__group">
          <label class="gen__tempo" for="gen-bpm">
            <span>Tempo</span>
            <output for="gen-bpm">{variant.bpm} BPM</output>
          </label>
          <input
            id="gen-bpm"
            type="range"
            min={tempoRange.min}
            max={tempoRange.max}
            step="1"
            value={bpm}
            onInput={event => setBpm(Number((event.currentTarget as HTMLInputElement).value))}
          />
          <div class="gen__ticks" aria-hidden="true">
            <span>{tempoRange.min}</span>
            <span>{tempoRange.max}</span>
          </div>
        </div>

        <p class="gen__rule">{stageOf(stage).rule}</p>
        <p class="gen__rule">{dayOf(day).rule}</p>

        <div class="gen__actions">
          <button type="button" class="gen__btn gen__btn--solid" onClick={download}>
            Pobierz SVG
          </button>
          <button type="button" class="gen__btn" onClick={shuffle}>
            Losuj
          </button>
          <button
            type="button"
            class="gen__btn"
            aria-pressed={moving}
            disabled={calm}
            onClick={() => setMoving(value => !value)}>
            {calm ? 'Ruch wyłączony w systemie' : moving ? 'Zatrzymaj ruch' : 'Poruszaj fazą'}
          </button>
          <button
            type="button"
            class="gen__btn"
            disabled={calm || reel !== null}
            onClick={playReel}>
            Trzy dni, 3 s
          </button>
        </div>
        <p class="gen__status" role="status">
          {description}
        </p>
      </div>
    </div>
  );
}
