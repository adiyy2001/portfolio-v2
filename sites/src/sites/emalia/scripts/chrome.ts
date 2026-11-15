const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shadeKey = 'emalia-shade';

const initReveal = (): void => {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach(item => observer.observe(item));
};

const initParallax = (): void => {
  const hero = document.getElementById('start');
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
  if (reduceMotion || !hero || layers.length === 0) return;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let running = false;
  const apply = (): void => {
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    const shift = Math.min(24, Math.max(0, window.scrollY) * 0.04);
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth ?? '0');
      const extra = layer.dataset.scroll ? shift : 0;
      const x = (current.x * depth).toFixed(2);
      const y = (current.y * depth + extra).toFixed(2);
      layer.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    if (Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002) {
      requestAnimationFrame(apply);
    } else {
      running = false;
    }
  };
  const kick = (): void => {
    if (running) return;
    running = true;
    requestAnimationFrame(apply);
  };
  if (!coarse) {
    hero.addEventListener('pointermove', event => {
      const box = hero.getBoundingClientRect();
      target.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      target.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
      kick();
    });
    hero.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
      kick();
    });
  }
  window.addEventListener('scroll', kick, { passive: true });
};

const initGuideTilt = (): void => {
  const journey = document.querySelector<HTMLElement>('.journey');
  const body = document.querySelector<HTMLElement>('.guide-body');
  if (reduceMotion || !journey || !body) return;
  let ticking = false;
  const tilt = (): void => {
    ticking = false;
    const box = journey.getBoundingClientRect();
    const span = Math.max(1, box.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -box.top / span));
    body.style.setProperty('--tilt', `${(-7 + progress * 14).toFixed(2)}deg`);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tilt);
    },
    { passive: true },
  );
  tilt();
};

const readShade = (): number => {
  try {
    const stored = parseInt(sessionStorage.getItem(shadeKey) ?? '0', 10);
    return stored >= 0 && stored < 5 ? stored : 0;
  } catch {
    return 0;
  }
};

const initShade = (): void => {
  const stacks = document.querySelectorAll<HTMLElement>('.tooth-stack');
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="shade"]');
  const value = document.getElementById('shade-sum');
  const names = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const apply = (index: number): void => {
    stacks.forEach(stack => {
      stack.querySelectorAll('img').forEach((image, position) => {
        const on = position === index;
        if (on && !image.getAttribute('src') && image.dataset.src) {
          image.setAttribute('src', image.dataset.src);
        }
        image.classList.toggle('is-on', on);
      });
    });
    if (value) value.textContent = names[index];
    radios.forEach(radio => {
      radio.checked = parseInt(radio.value, 10) === index;
    });
  };
  apply(readShade());
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      const index = parseInt(radio.value, 10);
      apply(index);
      try {
        sessionStorage.setItem(shadeKey, String(index));
      } catch {
        return;
      }
    });
  });
};

initReveal();
initParallax();
initGuideTilt();
initShade();
