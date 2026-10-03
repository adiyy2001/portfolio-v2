import { useEffect, useRef, useState } from 'preact/hooks';
import type { Coffee } from '../data/types';
import {
  beanColor,
  developmentRatio,
  formatClock,
  markers,
  phaseAt,
  phaseLabels,
  phases,
  riseAt,
  roastPath,
  roastDomain,
  tempAt,
  tempTicks,
} from '../lib/roast';
import { getCoffee } from '../data/catalog';

interface Props {
  coffeeId: string;
}

const chart = { width: 760, height: 340, left: 50, right: 16, top: 30, bottom: 36 };
const playSpeed = 38;
const flashSeconds = 24;

const formatDegrees = (value: number): string => `${Math.round(value)} °C`;

const formatRise = (value: number): string => `${value.toFixed(1).replace('.', ',')} °C/min`;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const RoastExplorer = ({ coffeeId }: Props) => {
  const coffee: Coffee | undefined = getCoffee(coffeeId);
  const [seconds, setSeconds] = useState((coffee?.profile.firstCrack.at ?? 0) + 2);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [width, setWidth] = useState(chart.width);
  const [measured, setMeasured] = useState(false);
  const frame = useRef(0);
  const last = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const element = box.current;
    if (!element) return;
    const measure = () => {
      setWidth(Math.max(280, Math.round(element.clientWidth)));
      setMeasured(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const drop = coffee?.profile.drop.at ?? 0;

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const delta = (now - last.current) / 1000;
      last.current = now;
      let finished = false;
      setSeconds(current => {
        const next = current + delta * playSpeed;
        if (next >= drop) {
          finished = true;
          return drop;
        }
        return next;
      });
      if (finished) setPlaying(false);
      else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [playing, drop]);

  if (!coffee) return null;
  const profile = coffee.profile;
  const maxSeconds = Math.ceil((profile.drop.at + 30) / 60) * 60;
  const compact = width < 520;
  const clockStep = compact ? 240 : 120;
  const clockTicks = Array.from(
    { length: Math.floor(maxSeconds / clockStep) + 1 },
    (_, index) => index * clockStep,
  );
  const plotWidth = width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const x = (value: number): number => chart.left + (value / maxSeconds) * plotWidth;
  const y = (temp: number): number =>
    chart.top +
    ((roastDomain.maxTemp - temp) / (roastDomain.maxTemp - roastDomain.minTemp)) * plotHeight;

  const rounded = Math.round(seconds);
  const temp = tempAt(profile, rounded);
  const rise = riseAt(profile, rounded);
  const phase = phaseAt(profile, rounded);
  const cracking =
    rounded >= profile.firstCrack.at && rounded < profile.firstCrack.at + flashSeconds;
  const eventList = markers(profile);
  const curveX = x(rounded);
  const curveY = y(temp);
  const crackX = x(profile.firstCrack.at);
  const crackY = y(profile.firstCrack.temp);
  const path = roastPath(profile, (time, degrees) => [x(time), y(degrees)]);

  const jump = (target: number): void => {
    setPlaying(false);
    setSeconds(target);
  };

  const togglePlay = (): void => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (seconds >= drop) setSeconds(0);
    setPlaying(true);
  };

  const summary = `Krzywa palenia kawy ${coffee.name}: temperatura ziaren rośnie od ${profile.turningPoint.temp} stopni w punkcie zwrotnym do ${profile.firstCrack.temp} stopni przy pierwszym trzasku w ${formatClock(profile.firstCrack.at)} i ${profile.drop.temp} stopni przy wysypaniu w ${formatClock(profile.drop.at)}.`;

  return (
    <div class="rx">
      <div class="rx__stage">
        <div class="rx__chart" ref={box}>
          <svg
            width="100%"
            height={chart.height}
            viewBox={`0 0 ${width} ${chart.height}`}
            role="img"
            aria-label={summary}
            data-pending={measured ? undefined : ''}
            focusable="false">
            <defs>
              <clipPath id="rx-reveal">
                <rect
                  x={chart.left}
                  y="0"
                  width={Math.max(0, curveX - chart.left)}
                  height={chart.height}
                />
              </clipPath>
            </defs>
            {phases(profile).map(item => (
              <g key={item.id}>
                <rect
                  class={`rx__band rx__band--${item.id}`}
                  x={x(item.from)}
                  y={chart.top}
                  width={x(item.to) - x(item.from)}
                  height={plotHeight}
                />
                {!compact ? (
                  <text class="rx__phase" x={x(item.from) + 8} y={chart.top - 10}>
                    {phaseLabels[item.id].toUpperCase()}
                  </text>
                ) : null}
              </g>
            ))}
            {tempTicks().map(tick => (
              <g key={tick}>
                <line
                  class="rx__grid"
                  x1={chart.left}
                  x2={width - chart.right}
                  y1={y(tick)}
                  y2={y(tick)}
                />
                <text class="rx__tick" x={chart.left - 8} y={y(tick) + 4} text-anchor="end">
                  {tick}
                </text>
              </g>
            ))}
            {clockTicks.map(tick => (
              <text
                key={tick}
                class="rx__tick"
                x={x(tick)}
                y={chart.height - 12}
                text-anchor={tick === 0 ? 'start' : 'middle'}>
                {formatClock(tick)}
              </text>
            ))}
            <path class="rx__curve rx__curve--ghost" d={path} />
            <g clip-path="url(#rx-reveal)">
              <path class="rx__curve" d={path} />
            </g>
            <line
              class="rx__crack-line"
              x1={crackX}
              x2={crackX}
              y1={chart.top}
              y2={chart.height - chart.bottom}
            />
            <circle class="rx__crack-ring" cx={crackX} cy={crackY} r="9" />
            <text
              class="rx__crack-text"
              x={crackX + (crackX > width - 190 ? -14 : 14)}
              y={crackY - 24}
              text-anchor={crackX > width - 190 ? 'end' : 'start'}>
              PIERWSZY TRZASK {formatClock(profile.firstCrack.at)}
            </text>
            {eventList
              .filter(item => item.id !== 'first')
              .map(item => (
                <circle key={item.id} class="rx__dot" cx={x(item.at)} cy={y(item.temp)} r="5" />
              ))}
            <line
              class="rx__cursor"
              x1={curveX}
              x2={curveX}
              y1={chart.top}
              y2={chart.height - chart.bottom}
            />
            <circle class="rx__head" cx={curveX} cy={curveY} r="7" />
          </svg>
        </div>
        {compact && (
          <ul class="rx__legend">
            {phases(profile).map(item => (
              <li key={item.id} class={`rx__legend-item rx__legend-item--${item.id}`}>
                <strong>{phaseLabels[item.id]}</strong>
                <span>
                  {formatClock(item.from)} do {formatClock(item.to)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div class="rx__panel">
          <div class="rx__bean-wrap">
            <svg class="rx__bean" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
              <ellipse
                cx="60"
                cy="60"
                rx="38"
                ry="52"
                transform="rotate(24 60 60)"
                fill={beanColor(temp)}
                stroke="#0e110f"
                stroke-width="4"
              />
              <path
                d="M44 22C62 44 52 70 76 98"
                fill="none"
                stroke="#0e110f"
                stroke-width="5"
                stroke-linecap="round"
                class={cracking ? 'rx__crease rx__crease--open' : 'rx__crease'}
              />
            </svg>
            {cracking && (
              <p class="rx__flash" aria-hidden="true">
                TRZASK
              </p>
            )}
          </div>
          <dl class="rx__read" aria-live="off">
            <div>
              <dt>Czas</dt>
              <dd>{formatClock(rounded)}</dd>
            </div>
            <div>
              <dt>Ziarno</dt>
              <dd>{formatDegrees(temp)}</dd>
            </div>
            <div>
              <dt>Przyrost</dt>
              <dd>{rounded < 40 ? 'brak' : formatRise(rise)}</dd>
            </div>
            <div>
              <dt>Faza</dt>
              <dd>{phaseLabels[phase]}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="rx__controls">
        {!reduced && (
          <button type="button" class="btn rx__play" onClick={togglePlay} aria-pressed={playing}>
            {playing ? 'Pauza' : seconds >= drop ? 'Jeszcze raz' : 'Odtwórz palenie'}
          </button>
        )}
        <div class="rx__slider field">
          <label for="rx-time">Czas palenia</label>
          <input
            id="rx-time"
            class="rx__range"
            type="range"
            min="0"
            max={drop}
            step="1"
            value={rounded}
            aria-valuetext={`${formatClock(rounded)}, ${Math.round(temp)} stopni, ${phaseLabels[phase]}`}
            onInput={event => {
              setPlaying(false);
              setSeconds(Number(event.currentTarget.value));
            }}
          />
        </div>
      </div>
      <ol class="rx__events">
        {eventList.map(item => (
          <li key={item.id}>
            <button type="button" class="rx__event" onClick={() => jump(item.at)}>
              <span class="rx__event-name">{item.label}</span>
              <span class="rx__event-data">
                {formatClock(item.at)}, {item.temp}&nbsp;°C
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p class="rx__note">
        Rozwój po pierwszym trzasku to {String(developmentRatio(profile)).replace('.', ',')}% całego
        palenia.
      </p>
    </div>
  );
};

export default RoastExplorer;
