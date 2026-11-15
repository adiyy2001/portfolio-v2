import { holdUnits } from '../lib/typography';
import type { BrewMethod } from './types';

export interface Recipe {
  method: BrewMethod;
  title: string;
  degree: 3 | 9;
  line: string;
  grind: string;
  steps: string[];
}

export const recipes: Record<BrewMethod, Recipe> = {
  espresso: {
    method: 'espresso',
    title: 'Espresso',
    degree: 9,
    line: holdUnits('18 g kawy na 36 g, 28 s'),
    grind: 'Mielenie jak cukier puder.',
    steps: [
      'Nasyp 18 g kawy do koszyka i wyrównaj.',
      'Wyciągnij 36 g napoju w 28 sekund, licząc od pierwszej kropli.',
      'Jeśli wyszło szybciej, zmiel drobniej. Jeśli wolniej, grubiej.',
    ],
  },
  przelew: {
    method: 'przelew',
    title: 'Przelew',
    degree: 3,
    line: holdUnits('15 g kawy na 250 ml, 3:00'),
    grind: 'Mielenie jak sól morska.',
    steps: [
      'Przepłucz filtr gorącą wodą i wsyp 15 g kawy.',
      'Zalej 40 ml wody, poczekaj 30 sekund, potem dolewaj spiralą do 250 ml.',
      'Całość powinna zająć 3 minuty.',
    ],
  },
  prasa: {
    method: 'prasa',
    title: 'Prasa francuska',
    degree: 3,
    line: holdUnits('30 g kawy na 500 ml, 4:00'),
    grind: 'Mielenie jak gruba sól.',
    steps: [
      'Wsyp 30 g kawy i zalej 500 ml wody.',
      'Po minucie delikatnie zamieszaj i przykryj.',
      'Po 4 minutach powoli wciśnij tłok i od razu przelej kawę do dzbanka.',
    ],
  },
  kawiarka: {
    method: 'kawiarka',
    title: 'Kawiarka',
    degree: 9,
    line: holdUnits('woda do zaworu, 15 g kawy, 5 min'),
    grind: 'Mielenie jak drobna sól.',
    steps: [
      'Nalej gorącą wodę do zaworu, a kawę wsyp luźno, bez ubijania.',
      'Postaw na małym ogniu i zdejmij, gdy kawa zacznie bulgotać.',
      'Schłodź dolną część pod zimną wodą, żeby kawa nie przypiekła się na końcu.',
    ],
  },
};

export const waterNote = 'woda około 94 stopni, nigdy wrzątek';

export const timeNote = 'Czas liczę od pierwszej kropli wody.';
