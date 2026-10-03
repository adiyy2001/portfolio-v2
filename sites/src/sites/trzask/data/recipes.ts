import type { BrewMethod } from './types';

export interface RecipeTemplate {
  title: string;
  dose: number;
  water: string;
  time: string;
  grind: string;
  steps: string[];
}

export const recipeTemplates: Record<BrewMethod, RecipeTemplate> = {
  przelew: {
    title: 'Przelew w\u00a0dripperze',
    dose: 15,
    water: '250 g',
    time: '2:45-3:15',
    grind: 'średnio drobny, jak gruba sól morska',
    steps: [
      'Przepłucz filtr gorącą wodą i\u00a0wylej ją z\u00a0karafki.',
      'Wsyp 15 g kawy, wyrównaj powierzchnię i\u00a0wlej 45 g wody. Odczekaj 40 sekund.',
      'Dolewaj wodę spiralą do 150 g, w\u00a01:15 dolej do 250 g.',
      'Gdy woda spłynie, zamieszaj karafkę i\u00a0nalej. Całość trwa 2:45 do 3:15.',
    ],
  },
  espresso: {
    title: 'Espresso',
    dose: 18,
    water: '38 g w\u00a0filiżance',
    time: '26-30 s',
    grind: 'drobny, jak mąka ziemniaczana z\u00a0lekką ziarnistością',
    steps: [
      'Zmiel 18 g kawy i\u00a0wyrównaj ją w\u00a0koszyku.',
      'Ubij równo, z\u00a0siłą około 15 kg, i\u00a0od razu włóż do grupy.',
      'Zacznij wagę razem z\u00a0ekspresem. Po 26 do 30 sekundach w\u00a0filiżance powinno być 38 g.',
      'Za szybko i\u00a0kwaśno: zmiel drobniej. Za wolno i\u00a0gorzko: zmiel grubiej.',
    ],
  },
  aeropress: {
    title: 'AeroPress, odwrócony',
    dose: 15,
    water: '220 g',
    time: '2:00',
    grind: 'średnio drobny, jak do przelewu',
    steps: [
      'Ustaw AeroPress odwrócony, wsyp 15 g kawy i\u00a0wlej całą wodę.',
      'Zamieszaj trzy razy, załóż filtr i\u00a0odczekaj do 1:30.',
      'Obróć na kubek i\u00a0dociskaj powoli, około 30 sekund.',
      'Przerwij dociskanie, gdy usłyszysz syk. Resztka na dnie to najgorsza część.',
    ],
  },
  zaparzacz: {
    title: 'French press',
    dose: 30,
    water: '500 g',
    time: '4:00',
    grind: 'gruby, jak sól do peklowania',
    steps: [
      'Wsyp 30 g kawy i\u00a0zalej 500 g wody. Nie mieszaj.',
      'Po czterech minutach zdejmij łyżką skorupę z\u00a0wierzchu.',
      'Dociśnij tłok tylko do poziomu kawy, nie na dno.',
      'Odlej od razu, żeby kawa nie ciągnęła dalej w\u00a0zaparzaczu.',
    ],
  },
  moka: {
    title: 'Kawiarka',
    dose: 17,
    water: 'do zaworu, około 150 g',
    time: '4-5 min',
    grind: 'średnio drobny, grubszy niż do espresso',
    steps: [
      'Napełnij zbiornik gorącą wodą z\u00a0czajnika do zaworu.',
      'Wsyp kawę do sitka, wyrównaj i\u00a0nie ubijaj.',
      'Postaw na małym ogniu z\u00a0otwartym wieczkiem.',
      'Gdy kawa zacznie bulgotać, zdejmij kawiarkę i\u00a0podstaw dno pod zimną wodę.',
    ],
  },
};
