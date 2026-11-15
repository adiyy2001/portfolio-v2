import { startFor } from '../data/ksef';
import { find, findAll, make } from './dom';
import { readStored, writeStored } from './storage';

const storageKey = 'kajet-ksef-start';

export const setupKsefStart = (): void => {
  const group = find(document, '#ksef-start', HTMLElement);
  const verdict = find(document, '#ksef-verdict', HTMLElement);
  const radios = findAll(group, 'input[type="radio"]', HTMLInputElement);

  const render = (choice: string | null): void => {
    const option = choice ? startFor(choice) : null;
    verdict.textContent = '';
    if (!option) {
      verdict.append(make('span', 'muted', 'Wybierz opis najbliższy Twojej firmie.'));
      return;
    }
    verdict.append(make('b', '', option.verdict), make('span', '', option.detail));
  };

  const stored = readStored(storageKey);
  for (const radio of radios) {
    radio.checked = radio.value === stored;
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      writeStored(storageKey, radio.value);
      render(radio.value);
    });
  }
  render(stored);
};
