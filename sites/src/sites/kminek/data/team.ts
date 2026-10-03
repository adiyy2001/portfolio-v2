import type { Localized } from './lang';

export interface Person {
  id: 'basia' | 'tomek' | 'ola';
  name: string;
  monogram: string;
  role: Localized;
  line: Localized;
}

export const team: readonly Person[] = [
  {
    id: 'basia',
    name: 'Basia',
    monogram: 'B',
    role: { pl: 'Kuchnia', en: 'Kitchen' },
    line: {
      pl: 'Układa kartę we wtorek rano, po targu. Gotuje to, co dostała od ludzi, których zna po imieniu.',
      en: 'Writes the menu on Tuesday morning, after the market. Cooks what she got from people she knows by first name.',
    },
  },
  {
    id: 'tomek',
    name: 'Tomek',
    monogram: 'T',
    role: { pl: 'Sala i bar', en: 'Floor and bar' },
    line: {
      pl: 'Wie, co jest w karcie i czego nie ma w karcie. Pytaj go o alergeny, polskie piwa i wino z Dolnego Śląska.',
      en: 'Knows what is on the menu and what is not. Ask him about allergens, Polish beers and wine from Lower Silesia.',
    },
  },
  {
    id: 'ola',
    name: 'Ola',
    monogram: 'O',
    role: { pl: 'Chleb i ciasta', en: 'Bread and cakes' },
    line: {
      pl: 'Wstaje przed piekarniami. Zakwas na żytnim chlebie ma od siedmiu lat, a szarlotkę zmienia dopiero, gdy skończą się jabłka.',
      en: 'Gets up before the bakeries do. The rye sourdough is seven years old, and the apple pie changes only when the apples run out.',
    },
  },
];
