import { openStatus } from '../lib/open-status';

const targets = document.querySelectorAll<HTMLElement>('[data-open-status]');

const render = () => {
  const { isOpen, message } = openStatus(new Date());
  targets.forEach(target => {
    target.textContent = message;
    target.dataset.open = String(isOpen);
    target.hidden = false;
  });
};

if (targets.length) {
  render();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') render();
  });
}
