import type { Localized } from './lang';

export type FootnoteId = 'vegetables' | 'bread' | 'dairy' | 'pepper';

export interface Footnote {
  id: FootnoteId;
  mark: string;
  product: Localized;
  supplier: Localized;
  when: Localized;
}

export const footnotes: Footnote[] = [
  {
    id: 'vegetables',
    mark: '*',
    product: { pl: 'Warzywa', en: 'Vegetables' },
    supplier: { pl: 'Gospodarstwo Krzyżanowice', en: 'Krzyżanowice Farm' },
    when: {
      pl: 'dwa razy w tygodniu, w poniedziałek i w czwartek',
      en: 'twice a week, on Monday and Thursday',
    },
  },
  {
    id: 'bread',
    mark: '†',
    product: { pl: 'Chleb', en: 'Bread' },
    supplier: { pl: 'Piekarnia Zakwas, Wrocław', en: 'Zakwas Bakery, Wrocław' },
    when: { pl: 'codziennie', en: 'every day' },
  },
  {
    id: 'dairy',
    mark: '‡',
    product: { pl: 'Nabiał', en: 'Dairy' },
    supplier: { pl: 'Serowarnia Księginice', en: 'Księginice Creamery' },
    when: { pl: 'w środy', en: 'on Wednesdays' },
  },
  {
    id: 'pepper',
    mark: '§',
    product: { pl: 'Pieprz', en: 'Pepper' },
    supplier: { pl: 'Ziarno z Kerali', en: 'Whole berries from Kerala' },
    when: { pl: 'mielone w młynku na stole', en: 'ground in the mill at the table' },
  },
];

export const footnoteById = (id: FootnoteId) => footnotes.find(note => note.id === id)!;
