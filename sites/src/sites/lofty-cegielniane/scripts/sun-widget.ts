import { sun as copy } from '../copy';
import type { TypeKey } from '../data';
import { comma } from '../format';
import {
  type DayKey,
  dayHours,
  dayKeys,
  days,
  formatTime,
  isLit,
  livingPatches,
  livingSun,
  sunAt,
  sunLofts,
  zoneArea,
} from '../sun';
import { all, need, prefersReducedMotion } from './dom';

interface State {
  loft: TypeKey;
  day: DayKey;
  t: number;
}

const isLoft = (value: string | null | undefined): value is TypeKey =>
  value !== null && value !== undefined && value in sunLofts;

const isDay = (value: string): value is DayKey => (dayKeys as string[]).includes(value);

const rad = Math.PI / 180;

const initSun = (root: HTMLElement) => {
  const lit = need<HTMLElement>(root, '#lit');
  const range = need<HTMLInputElement>(root, '#time');
  const clock = need<HTMLElement>(root, '#time-out');
  const bar = need<HTMLElement>(root, '#daybar');
  const caption = need<HTMLElement>(root, '#sun-caption');
  const status = need<HTMLElement>(root, '#sun-status');
  const playButton = need<HTMLButtonElement>(root, '#play');
  const playText = need<HTMLElement>(root, '#play-text');
  const loftInputs = all<HTMLInputElement>(root, 'input[name=loft]');
  const dayInputs = all<HTMLInputElement>(root, 'input[name=day]');
  const hourCells = all<HTMLElement>(root, '[data-hours]');

  const state: State = { loft: '64', day: 'jun', t: 13 };

  const requested = new URLSearchParams(window.location.search).get('loft');
  if (isLoft(requested)) state.loft = requested;

  const sentence = () => {
    const { loft, day, t } = state;
    const area = livingSun(loft, day, t);
    const pct = Math.round((area / zoneArea(loft)) * 100);
    const hours = dayHours(loft, day);
    const now =
      area < 0.05
        ? `O ${formatTime(t)} w salonie nie ma bezpośredniego słońca.`
        : `O ${formatTime(t)} słońce oświetla ${comma(area, 1)} m² salonu (${pct}%).`;
    return `${now} Między 8:00 a 18:00 łącznie ${comma(hours, 1)} godz. bezpośredniego słońca w salonie (${days[day].label}).`;
  };

  const buildBar = () => {
    bar.textContent = '';
    for (let i = 0; i < 40; i++) {
      const cell = document.createElement('i');
      if (isLit(state.loft, state.day, 8 + i * 0.25 + 0.125)) cell.className = 'lit';
      bar.appendChild(cell);
    }
  };

  const render = () => {
    const { loft, day, t } = state;
    const area = livingSun(loft, day, t);
    const pct = Math.round((area / zoneArea(loft)) * 100);
    const patches = livingPatches(sunLofts[loft], day, t);
    const position = sunAt(day, t);
    const azimuth = Math.max(-1, Math.min(1, position.a / (100 * rad)));
    const elevation = Math.max(0, position.e / rad);
    const left = 52 + azimuth * 40;
    const top = 70 - Math.min(1, elevation / 65) * 34;
    const opacity = patches.length ? Math.min(1, 0.85 + (pct / 100) * 0.3) : 0;
    lit.style.setProperty('--lx', `${left.toFixed(1)}%`);
    lit.style.setProperty('--ly', `${top.toFixed(1)}%`);
    lit.style.setProperty('--lw', `${(52 + pct * 0.4).toFixed(0)}%`);
    lit.style.setProperty('--lh', `${(44 + pct * 0.4).toFixed(0)}%`);
    lit.style.setProperty('--lo', opacity.toFixed(2));
    clock.textContent = formatTime(t);
    range.setAttribute('aria-valuetext', formatTime(t));
    hourCells.forEach(cell => {
      const key = cell.dataset.hours as DayKey;
      cell.textContent = `${comma(dayHours(loft, key), 1)} godz.`;
    });
    Array.from(bar.children).forEach((cell, i) => {
      const start = 8 + i * 0.25;
      cell.classList.toggle('now', t >= start && t < start + 0.25);
    });
    caption.textContent = sentence();
  };

  const announce = () => {
    status.textContent = sentence();
  };

  const setLoft = (key: TypeKey, speak: boolean) => {
    state.loft = key;
    loftInputs.forEach(input => {
      input.checked = input.value === key;
    });
    buildBar();
    render();
    if (speak) announce();
  };

  const setDay = (key: DayKey) => {
    state.day = key;
    dayInputs.forEach(input => {
      input.checked = input.value === key;
    });
    buildBar();
    render();
    announce();
  };

  let playing = false;
  let frame = 0;

  const setPlayLabel = () => {
    if (prefersReducedMotion()) playText.textContent = copy.next;
    else playText.textContent = playing ? copy.pause : copy.play;
  };

  const stopPlay = () => {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(frame);
    setPlayLabel();
  };

  const setTime = (t: number) => {
    state.t = t;
    range.value = String(t);
    render();
  };

  playButton.addEventListener('click', () => {
    if (prefersReducedMotion()) {
      const next = Math.floor(state.t) + 1;
      setTime(next > 18 ? 8 : next);
      return;
    }
    if (playing) {
      stopPlay();
      return;
    }
    playing = true;
    setPlayLabel();
    const from = state.t >= 18 ? 8 : state.t;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = from + ((now - startedAt) / 9000) * 10;
      if (t >= 18) {
        setTime(18);
        stopPlay();
        return;
      }
      setTime(Math.round(t * 4) / 4);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    stopPlay();
    setPlayLabel();
  });

  range.addEventListener('input', () => {
    state.t = parseFloat(range.value);
    render();
  });
  range.addEventListener('pointerdown', stopPlay);
  range.addEventListener('keydown', stopPlay);

  loftInputs.forEach(input =>
    input.addEventListener('change', () => {
      if (input.checked && isLoft(input.value)) setLoft(input.value, true);
    }),
  );
  dayInputs.forEach(input =>
    input.addEventListener('change', () => {
      if (input.checked && isDay(input.value)) setDay(input.value);
    }),
  );
  all<HTMLElement>(document, '[data-pick]').forEach(link =>
    link.addEventListener('click', () => {
      if (isLoft(link.dataset.pick)) setLoft(link.dataset.pick, true);
    }),
  );

  setLoft(state.loft, false);
  setPlayLabel();
};

const root = document.querySelector<HTMLElement>('[data-sun]');
if (root) initSun(root);
