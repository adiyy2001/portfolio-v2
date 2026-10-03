import { clampValue, describeValue, valueFromKey, valueFromPointer } from '../lib/compare';

const setupCompare = (root: HTMLElement) => {
  const stage = root.querySelector<HTMLElement>('.compare__stage');
  const handle = root.querySelector<HTMLElement>('[data-compare-handle]');
  const readout = root.querySelector<HTMLElement>('[data-compare-readout]');
  if (!stage || !handle || !readout) return;

  let value = Number(handle.getAttribute('aria-valuenow'));

  const render = (next: number) => {
    value = clampValue(next);
    const text = describeValue(value);
    stage.style.setProperty('--split', `${value}%`);
    handle.setAttribute('aria-valuenow', String(value));
    handle.setAttribute('aria-valuetext', text);
    readout.textContent = text;
  };

  const fromPointer = (event: PointerEvent) => {
    const box = stage.getBoundingClientRect();
    render(valueFromPointer(event.clientX, box.left, box.width));
  };

  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    handle.focus({ preventScroll: true });
    fromPointer(event);
  });

  stage.addEventListener('pointermove', event => {
    if (stage.hasPointerCapture(event.pointerId)) fromPointer(event);
  });

  handle.addEventListener('keydown', event => {
    const next = valueFromKey(event.key, value, event.shiftKey);
    if (next === null) return;
    event.preventDefault();
    render(next);
  });
};

document.querySelectorAll<HTMLElement>('[data-compare]').forEach(setupCompare);
