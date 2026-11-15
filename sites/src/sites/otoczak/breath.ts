import { controlEvent, controlLabel, nextBreathState, type BreathEvent } from './breath-state';
import type { BreathState } from './breath-state';

export function initBreath() {
  const root = document.querySelector<HTMLElement>('[data-breath]');
  const disc = root?.querySelector<HTMLElement>('[data-breath-disc]');
  const control = root?.querySelector<HTMLButtonElement>('[data-breath-control]');
  if (!root || !disc || !control) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let state: BreathState = 'idle';

  const render = () => {
    root.dataset.state = state;
    control.textContent = controlLabel(state);
  };

  const send = (event: BreathEvent) => {
    const next = nextBreathState(state, event);
    if (next === state) return;
    if (event === 'restart') {
      root.dataset.state = 'idle';
      void disc.offsetWidth;
    }
    state = next;
    render();
  };

  control.hidden = false;
  render();

  control.addEventListener('click', () => send(controlEvent(state)));
  disc.addEventListener('animationend', () => send('ended'));

  const observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      send('visible');
      observer.disconnect();
    },
    { threshold: 0.5 },
  );
  observer.observe(root);
}
