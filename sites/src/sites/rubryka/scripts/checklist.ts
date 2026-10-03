import {
  checklistStorageKey,
  parseChecked,
  progressText,
  serializeChecked,
  withChecked,
} from '../checklist';

const readStored = (): string | null => {
  try {
    return localStorage.getItem(checklistStorageKey);
  } catch {
    return null;
  }
};

const writeStored = (value: string | null): void => {
  try {
    if (value === null) localStorage.removeItem(checklistStorageKey);
    else localStorage.setItem(checklistStorageKey, value);
  } catch {
    return;
  }
};

export const setupChecklist = (): void => {
  const boxes = [...document.querySelectorAll<HTMLInputElement>('input[data-checklist-id]')];
  const progress = document.querySelector<HTMLElement>('[data-checklist-progress]');
  const reset = document.querySelector<HTMLButtonElement>('[data-checklist-reset]');
  if (boxes.length === 0 || !progress) return;

  const ids = boxes.map(box => box.dataset.checklistId ?? '');
  let checked = parseChecked(readStored(), ids);

  const render = (): void => {
    for (const box of boxes) box.checked = checked.has(box.dataset.checklistId ?? '');
    progress.textContent = progressText(checked.size, boxes.length);
    if (reset) reset.hidden = checked.size === 0;
  };

  for (const box of boxes) {
    box.addEventListener('change', () => {
      checked = withChecked(checked, box.dataset.checklistId ?? '', box.checked);
      writeStored(serializeChecked(checked));
      render();
    });
  }

  reset?.addEventListener('click', () => {
    checked = new Set();
    writeStored(null);
    render();
    boxes[0]?.focus();
  });

  render();
};
