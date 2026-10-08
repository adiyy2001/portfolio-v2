import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { curvePath } from '../shared/curves';
import { doneAt, presets, pulse, scramble, settledShare, type ScramblePreset } from './scramble';

interface Props {
  sample: string;
  password: string;
  period: number;
  low: number;
  high: number;
  caption: string;
}

const fps = 30;
const fastPulse = { period: 12, low: 0.1, high: 1 };

const Text = ({ text, frame, preset }: { text: string; frame: number; preset: ScramblePreset }) => (
  <span class="lab__text">
    {scramble(text, frame, preset).map((g, i) => (
      <span key={i} class={`is-${g.state}`}>
        {g.ch}
      </span>
    ))}
  </span>
);

const Lane = ({
  preset,
  frame,
  sample,
  password,
  span,
}: {
  preset: ScramblePreset;
  frame: number;
  sample: string;
  password: string;
  span: number;
}) => {
  const w = 240;
  const h = 72;
  const values = Array.from({ length: span + 1 }, (_, i) => settledShare(password, i, preset));
  const x = (Math.min(frame, span) / span) * w;
  const y = h - settledShare(password, Math.min(frame, span), preset) * h;
  const done = doneAt(password, preset);
  return (
    <figure class={`lab__lane lab__lane--${preset.id}`}>
      <figcaption>
        <b>{preset.label}</b>
        <span>
          {preset.step.toString().replace('.', ',')} kl. na znak, zmiana co {preset.rate} kl.,
          gotowe po {(done / fps).toFixed(1).replace('.', ',')} s
        </span>
      </figcaption>
      <div class="lab__screen" aria-hidden="true">
        <Text text={password} frame={frame} preset={preset} />
        <Text text={sample} frame={frame} preset={preset} />
      </div>
      <svg
        class="lab__plot"
        viewBox={`-4 -4 ${w + 8} ${h + 8}`}
        role="img"
        aria-label={`Udział gotowych znaków w czasie, preset ${preset.label}`}>
        <line x1="0" x2={w} y1="0" y2="0" class="lab__target" />
        <path d={curvePath(values, w, h, 0)} class="lab__curve" />
        <circle cx={x} cy={y} r="4" class="lab__dot" />
      </svg>
    </figure>
  );
};

export default function ScrambleLab({ sample, password, period, low, high, caption }: Props) {
  const [step, setStep] = useState(presets.readable.step);
  const [frame, setFrame] = useState(999);
  const raf = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const readable = useMemo(() => ({ ...presets.readable, step }), [step]);
  const span = Math.ceil(Math.max(doneAt(password, readable), doneAt(sample, readable), 60));

  const play = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const f = ((now - start) / 1000) * fps;
      setFrame(f);
      if (f < span + 20) raf.current = requestAnimationFrame(tick);
    };
    setFrame(0);
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
      { threshold: 0.4 },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const f = Math.floor(frame);
  const glowA = pulse(f, period, low, high);
  const glowB = pulse(f, fastPulse.period, fastPulse.low, fastPulse.high);
  const pw = 240;
  const ph = 60;
  const pulseValues = (p: number, l: number, hi: number) =>
    Array.from({ length: 73 }, (_, i) => pulse(i, p, l, hi));
  const at = ((f % 72) / 72) * pw;

  return (
    <div class="lab" ref={root}>
      <div class="lab__lanes">
        <Lane preset={readable} frame={f} sample={sample} password={password} span={span} />
        <Lane preset={presets.fast} frame={f} sample={sample} password={password} span={span} />
      </div>
      <div class="lab__pulses">
        {[
          {
            label: 'puls',
            note: `okres ${period} kl., krycie od ${low.toString().replace('.', ',')} do ${high.toString().replace('.', ',')}`,
            value: glowA,
            values: pulseValues(period, low, high),
            mod: 'ok',
          },
          {
            label: 'za szybki puls',
            note: `okres ${fastPulse.period} kl., od 0,1 do 1: poświata zaczyna migać`,
            value: glowB,
            values: pulseValues(fastPulse.period, fastPulse.low, fastPulse.high),
            mod: 'bad',
          },
        ].map(item => (
          <figure class={`lab__pulse lab__pulse--${item.mod}`}>
            <div class="lab__box" aria-hidden="true" style={{ '--glow': String(item.value) }}>
              <span>Zmień hasło teraz</span>
            </div>
            <svg
              class="lab__plot"
              viewBox={`-4 -4 ${pw + 8} ${ph + 8}`}
              role="img"
              aria-label={`Krycie poświaty w czasie: ${item.label}`}>
              <path d={curvePath(item.values, pw, ph, 0)} class="lab__curve" />
              <line x1={at} x2={at} y1="0" y2={ph} class="lab__head" />
            </svg>
            <figcaption>
              <b>{item.label}</b>
              <span>{item.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div class="lab__controls">
        <label class="lab__slider">
          <span>
            Czytelny: klatki na znak <output>{step.toString().replace('.', ',')}</output>
          </span>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={step}
            onInput={event => setStep(Number((event.target as HTMLInputElement).value))}
            onChange={play}
          />
        </label>
        <button type="button" class="lab__play" onClick={play}>
          Odszyfruj jeszcze raz
        </button>
      </div>
      <p class="lab__caption">{caption}</p>
    </div>
  );
}
