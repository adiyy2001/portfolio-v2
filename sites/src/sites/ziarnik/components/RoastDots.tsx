import { numbers } from '../data/site';
import type { Degree } from '../data/types';

const beanFill = (index: number): string => {
  const mix = index / (numbers.scaleSteps - 1);
  const light = [201, 159, 110];
  const dark = [36, 22, 13];
  const channel = (i: number) => Math.round(light[i] + (dark[i] - light[i]) * mix);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
};

interface Props {
  degree: Degree;
  label?: string;
}

export const RoastDots = ({ degree, label }: Props) => (
  <svg
    class="dots"
    viewBox="0 0 156 22"
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : 'true'}
    focusable="false">
    {Array.from({ length: numbers.scaleSteps }, (_, index) => {
      const step = index + 1;
      const on = step === degree;
      return (
        <g key={step} transform={`translate(${index * 13 + 7} 11) rotate(-24)`}>
          <ellipse rx={on ? 5.4 : 4.2} ry={on ? 8.2 : 6.4} fill={beanFill(index)} />
          <path
            d={on ? 'M0 -7 C-2 -2 2 2 0 7' : 'M0 -5.4 C-1.6 -1.6 1.6 1.6 0 5.4'}
            fill="none"
            stroke="#e9dcc7"
            stroke-width={on ? 1.3 : 1}
            stroke-linecap="round"
          />
          {on && <ellipse rx="7.6" ry="10.4" fill="none" stroke="#24160d" stroke-width="1.4" />}
        </g>
      );
    })}
  </svg>
);
