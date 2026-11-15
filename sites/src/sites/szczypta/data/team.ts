import type { Localized } from './lang';

export interface Person {
  name: string;
  role: Localized;
  bio: Localized;
}

export const team: Person[] = [
  {
    name: 'Halina Wrońska',
    role: { pl: 'Szefowa kuchni', en: 'Head chef' },
    bio: {
      pl: 'Układa kartę tygodnia w niedzielę wieczorem, kiedy warzywa są już zamówione.',
      en: 'Writes the weekly menu on Sunday evening, once the vegetable order is in.',
    },
  },
  {
    name: 'Tomasz Lisowski',
    role: { pl: 'Sala i wino', en: 'Dining room and wine' },
    bio: {
      pl: 'Wybiera wina z jednej piwnicy na Morawach i prowadzi wieczory z degustacją.',
      en: 'Chooses the wines from one cellar in Moravia and hosts the tasting evenings.',
    },
  },
  {
    name: 'Ola Czerniak',
    role: { pl: 'Desery i pieczywo', en: 'Desserts and bread' },
    bio: {
      pl: 'Piecze desery do karty tygodnia i odbiera chleb od Piekarni Zakwas.',
      en: 'Bakes the desserts for the weekly menu and collects bread from Zakwas Bakery.',
    },
  },
];
