import type { CalendarDate } from '../deadlines';
import { type Buyers, type KsefAnswer, type MonthlySales, checkKsef } from '../ksef';
import { pluralPl } from '../format';

const verdictLabels: Record<KsefAnswer['verdict'], string> = {
  mandatory: 'Obowiązek',
  relief: 'Ulga do końca 2026',
  optional: 'Dobrowolnie',
};

const buyerValues: readonly Buyers[] = ['business', 'consumers', 'both'];
const salesValues: readonly MonthlySales[] = ['upTo10k', 'over10k', 'exceeded'];

const readToday = (): CalendarDate => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
};

const selected = <Value extends string>(
  form: HTMLFormElement,
  name: string,
  allowed: readonly Value[],
): Value | null => {
  const checked = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  const found = allowed.find(value => value === checked?.value);
  return found ?? null;
};

export const setupKsefCheck = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-ksef-check]');
  const result = document.querySelector<HTMLElement>('[data-ksef-result]');
  if (!form || !result) return;
  const label = result.querySelector('[data-result-label]');
  const headline = result.querySelector('[data-result-headline]');
  const list = result.querySelector('[data-result-points]');
  const countdown = result.querySelector('[data-result-countdown]');
  const salesField = form.querySelector<HTMLFieldSetElement>('[data-sales-field]');
  const salesHint = form.querySelector<HTMLElement>('[data-sales-hint]');
  if (!label || !headline || !list || !countdown || !salesField || !salesHint) return;

  const render = (): void => {
    const buyers = selected(form, 'buyers', buyerValues);
    const sales = selected(form, 'sales', salesValues);
    if (!buyers || !sales) return;
    const salesIgnored = buyers === 'consumers';
    salesField.disabled = salesIgnored;
    salesHint.hidden = !salesIgnored;
    const answer = checkKsef({ buyers, sales }, readToday());
    result.dataset.verdict = answer.verdict;
    label.textContent = verdictLabels[answer.verdict];
    headline.textContent = answer.headline;
    list.replaceChildren(
      ...answer.points.map(point => {
        const item = document.createElement('li');
        item.textContent = point;
        return item;
      }),
    );
    countdown.textContent =
      answer.daysToDeadline === null
        ? ''
        : `Do 1 stycznia 2027 r. zostało ${answer.daysToDeadline} ${pluralPl(answer.daysToDeadline, 'dzień', 'dni', 'dni')}.`;
  };

  form.addEventListener('change', render);
  form.addEventListener('submit', event => event.preventDefault());
  render();
};
