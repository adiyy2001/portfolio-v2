import { find, findAll } from './dom';
import { readStored, writeStored } from './storage';

const storageKey = 'biuro-rachunkowe-gajowice-ksef-checklist';

const parseIds = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

export const setupKsefChecklist = (): void => {
  const root = find(document, '#ksef-check', HTMLElement);
  const progress = find(document, '#ksef-progress', HTMLElement);
  const reset = find(document, '#ksef-reset', HTMLButtonElement);
  const boxes = findAll(root, 'input[type="checkbox"]', HTMLInputElement);
  const saved = new Set(parseIds(readStored(storageKey)));

  const update = (): void => {
    const done = boxes.filter(box => box.checked);
    progress.textContent = `${done.length} z ${boxes.length} gotowe`;
    writeStored(storageKey, JSON.stringify(done.map(box => box.value)));
  };

  for (const box of boxes) {
    box.checked = saved.has(box.value);
    box.addEventListener('change', update);
  }
  reset.addEventListener('click', () => {
    for (const box of boxes) box.checked = false;
    update();
    boxes[0]?.focus();
  });
  update();
};
