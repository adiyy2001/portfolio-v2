import {
  approach,
  isSettled,
  maxTiltFor,
  pivotOffset,
  reachOf,
  restTiltFor,
  scrollSpeed,
  staticRestTilt,
  swingTilt,
  pointerTilt,
  transformFor,
  type Frame,
} from '../logic/tilt';

const TILT_TAU = 140;
const GLIDE_TAU = 260;
const SWING_TAU = 220;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const frameOf = (box: HTMLElement): Frame => {
  const rect = box.getBoundingClientRect();
  return { top: rect.top, height: rect.height, viewportHeight: window.innerHeight };
};

const initCard = (box: HTMLElement) => {
  const turn = box.querySelector<HTMLElement>('[data-tilt]');
  if (!turn) return;

  let max = 0;
  let rest = 0;
  let angle = 0;
  let glide = 0;
  let swing = 0;
  let scrollY = window.scrollY;
  let scrolledAt = performance.now();
  let pointerX: number | null = null;
  let overCard = false;
  let inView = false;
  let frameId = 0;
  let last = 0;

  const measure = () => {
    const slack = (box.clientWidth - turn.offsetWidth) / 2;
    max = maxTiltFor(slack, reachOf(frameOf(box)));
    rest = restTiltFor(max);
  };

  const render = () => {
    turn.style.transform = transformFor(angle, pivotOffset(frameOf(box)) * glide);
  };

  const target = () => {
    if (finePointer.matches) {
      if (pointerX === null) return rest;
      return pointerTilt({ pointerX, viewportWidth: window.innerWidth, max, rest, overCard });
    }
    return swingTilt(swing, max, rest);
  };

  const tick = (now: number) => {
    const elapsed = now - last;
    last = now;
    const goal = target();
    angle = approach(angle, goal, elapsed, TILT_TAU);
    glide = approach(glide, 1, elapsed, GLIDE_TAU);
    swing = approach(swing, 0, elapsed, SWING_TAU);
    render();
    const moving = !isSettled(angle, goal) || glide < 0.995 || swing > 0.005;
    frameId = moving ? window.requestAnimationFrame(tick) : 0;
  };

  const wake = () => {
    if (reducedMotion.matches || !inView || frameId !== 0) return;
    last = performance.now();
    frameId = window.requestAnimationFrame(tick);
  };

  const settleStatic = () => {
    measure();
    angle = staticRestTilt(
      (box.clientWidth - turn.offsetWidth) / 2,
      box.getBoundingClientRect().height,
    );
    glide = 0;
    turn.style.transform = transformFor(angle, 0);
  };

  const start = () => {
    measure();
    angle = rest;
    glide = 0;
    box.setAttribute('data-live', '');
    wake();
  };

  if (reducedMotion.matches) {
    settleStatic();
  } else {
    start();
  }

  new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting);
    if (inView) wake();
  }).observe(box);

  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      swing = Math.max(swing, scrollSpeed(window.scrollY - scrollY, now - scrolledAt));
      scrollY = window.scrollY;
      scrolledAt = now;
      wake();
    },
    { passive: true },
  );
  window.addEventListener(
    'pointermove',
    event => {
      if (event.pointerType === 'mouse') {
        pointerX = event.clientX;
        wake();
      }
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    pointerX = null;
    wake();
  });
  turn.addEventListener('pointerenter', () => {
    overCard = true;
    wake();
  });
  turn.addEventListener('pointerleave', () => {
    overCard = false;
    wake();
  });

  new ResizeObserver(() => {
    if (reducedMotion.matches) {
      settleStatic();
      return;
    }
    measure();
    wake();
    render();
  }).observe(box);

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      settleStatic();
    } else {
      start();
    }
  });
};

document.querySelectorAll<HTMLElement>('[data-tilt-box]').forEach(initCard);
