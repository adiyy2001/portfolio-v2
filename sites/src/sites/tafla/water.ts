import {
  POND_SEED,
  POND_WIDTH,
  STILL_TIME,
  createPond,
  createUserDrop,
  isAlive,
  type Drop,
} from './ripples';
import {
  advanceClock,
  canvasSize,
  pondPointFromClient,
  resolveWaterState,
  type WaterState,
} from './water-state';

const FRAME_INTERVAL = 1000 / 20;
const RIPPLE_RGB = '47, 93, 80';
const LINE_WIDTH = 1.5;
const MAX_USER_DROPS = 6;
const STORAGE_KEY = 'tafla-water-paused';
const LABEL_PAUSE = 'Zatrzymaj fale';
const LABEL_RESUME = 'Uruchom fale';

const readPaused = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const writePaused = (paused: boolean) => {
  try {
    if (paused) window.localStorage.setItem(STORAGE_KEY, '1');
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
};

export function initWater() {
  const root = document.querySelector<HTMLElement>('[data-water]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-water-canvas]');
  const context = canvas?.getContext('2d');
  const toggle = document.querySelector<HTMLButtonElement>('[data-water-toggle]');
  if (!root || !canvas || !context) return;

  const surface = root.closest<HTMLElement>('[data-water-surface]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pond = createPond(POND_SEED);

  let clock = STILL_TIME;
  let userDrops: Drop[] = [];
  let pixelRatio = 1;
  let frame = 0;
  let lastTick = 0;
  let lastDraw = 0;
  let state: WaterState = 'still';
  let userPaused = readPaused();
  let onScreen = true;

  const draw = () => {
    const scale = canvas.width / POND_WIDTH;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = LINE_WIDTH * pixelRatio;
    pond.ripplesAt(clock, userDrops).forEach(ripple => {
      context.strokeStyle = `rgba(${RIPPLE_RGB}, ${ripple.alpha.toFixed(3)})`;
      context.beginPath();
      context.ellipse(
        ripple.x * scale,
        ripple.y * scale,
        ripple.rx * scale,
        ripple.ry * scale,
        0,
        0,
        Math.PI * 2,
      );
      context.stroke();
    });
  };

  const resize = () => {
    const box = root.getBoundingClientRect();
    const size = canvasSize(box, window.devicePixelRatio || 1);
    if (size.width === 0 || size.height === 0) return;
    pixelRatio = size.ratio;
    canvas.width = size.width;
    canvas.height = size.height;
    draw();
  };

  const tick = (now: number) => {
    frame = window.requestAnimationFrame(tick);
    if (now - lastDraw < FRAME_INTERVAL - 1) return;
    clock = advanceClock(clock, now - lastTick);
    lastTick = now;
    lastDraw = now;
    userDrops = userDrops.filter(drop => isAlive(drop, clock));
    draw();
  };

  const stop = () => {
    if (frame === 0) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const start = () => {
    if (frame !== 0) return;
    const now = performance.now();
    lastTick = now;
    lastDraw = now;
    frame = window.requestAnimationFrame(tick);
  };

  const sync = () => {
    state = resolveWaterState({
      reducedMotion: motion.matches,
      userPaused,
      tabHidden: document.hidden,
      onScreen,
    });
    root.dataset.state = state;
    if (state === 'running') start();
    else stop();
    if (toggle) toggle.textContent = userPaused ? LABEL_RESUME : LABEL_PAUSE;
  };

  resize();
  root.dataset.ready = '';
  sync();

  new ResizeObserver(resize).observe(root);

  new IntersectionObserver(entries => {
    const latest = entries[entries.length - 1];
    if (!latest) return;
    onScreen = latest.isIntersecting;
    sync();
  }).observe(root);

  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);

  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    writePaused(userPaused);
    sync();
  });

  surface?.addEventListener('click', event => {
    if (state !== 'running') return;
    const onEmptyGround =
      event.target === surface ||
      (event.target instanceof HTMLElement && event.target.hasAttribute('data-water-empty'));
    if (!onEmptyGround) return;
    const point = pondPointFromClient(root.getBoundingClientRect(), event.clientX, event.clientY);
    if (!point) return;
    userDrops = [...userDrops, createUserDrop(clock, point.x, point.y)].slice(-MAX_USER_DROPS);
  });
}
