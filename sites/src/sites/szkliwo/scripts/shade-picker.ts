import { describeChange, getShade, shadeRank, type ShadeName } from '../lib/shades';

const picker = document.querySelector<HTMLElement>('[data-picker]');
const result = document.querySelector<HTMLElement>('[data-picker-result]');
const nowSmile = document.querySelector<SVGElement>('[data-picker-now] svg');
const goalSmile = document.querySelector<SVGElement>('[data-picker-goal] svg');
const nowCode = document.querySelector<HTMLElement>('[data-picker-now-code]');
const goalCode = document.querySelector<HTMLElement>('[data-picker-goal-code]');

const selected = (name: string) =>
  picker?.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value as
    ShadeName | undefined;

if (picker && result && nowSmile && goalSmile && nowCode && goalCode) {
  const render = () => {
    const now = selected('now');
    const goal = selected('goal');
    if (!now || !goal) return;
    nowSmile.style.setProperty('--tooth', getShade(now).color);
    goalSmile.style.setProperty('--tooth', getShade(goal).color);
    nowCode.textContent = `${now}, ${shadeRank(now)}. w skali jasności`;
    goalCode.textContent = `${goal}, ${shadeRank(goal)}. w skali jasności`;
    result.textContent = describeChange(now, goal);
  };

  picker.addEventListener('change', render);
  render();
}
