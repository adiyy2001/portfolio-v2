import { footer } from '../copy';
import { all, prefersReducedMotion } from './dom';

const stillKey = 'cegielnia-14:still';

const initReveal = () => {
  const items = all<HTMLElement>(document, '[data-reveal]');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach(item => observer.observe(item));
};

const initMenu = () => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  all<HTMLAnchorElement>(menu, 'a').forEach(link =>
    link.addEventListener('click', () => setOpen(false)),
  );
};

const initMotion = () => {
  const buttons = all<HTMLButtonElement>(document, '[data-motion]');
  if (buttons.length === 0) return;
  const root = document.documentElement;
  const paint = () => {
    const still = root.classList.contains('still');
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(still));
      button.textContent = still ? footer.stopOff : footer.stopOn;
    });
  };
  buttons.forEach(button =>
    button.addEventListener('click', () => {
      const still = root.classList.toggle('still');
      try {
        localStorage.setItem(stillKey, still ? '1' : '0');
      } catch {
        return;
      } finally {
        paint();
      }
    }),
  );
  paint();
};

initReveal();
initMenu();
initMotion();
