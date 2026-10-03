import type { DiagramKind } from './treatments';

type Point = readonly [number, number];

export interface DiagramLabel {
  text: string;
  from: Point;
  to: Point;
}

const enamel: DiagramLabel = { text: 'szkliwo', from: [248, 78], to: [322, 50] };
const dentin: DiagramLabel = { text: 'zębina', from: [236, 150], to: [322, 134] };
const pulp: DiagramLabel = { text: 'miazga', from: [196, 170], to: [322, 170] };
const gum: DiagramLabel = { text: 'dziąsło', from: [290, 205], to: [322, 205] };
const bone: DiagramLabel = { text: 'kość', from: [290, 300], to: [322, 300] };

export const diagramLabels: Readonly<Record<DiagramKind, readonly DiagramLabel[]>> = {
  cleaning: [
    enamel,
    { text: 'zębina', from: [232, 120], to: [322, 92] },
    { text: 'miazga', from: [196, 128], to: [322, 134] },
    { text: 'kamień', from: [262, 180], to: [322, 170] },
    gum,
    bone,
  ],
  filling: [
    enamel,
    { text: 'wypełnienie', from: [236, 100], to: [322, 92] },
    dentin,
    pulp,
    gum,
    bone,
  ],
  canal: [
    enamel,
    { text: 'odbudowa', from: [190, 110], to: [322, 92] },
    dentin,
    { text: 'gutaperka', from: [190, 240], to: [322, 250] },
    gum,
    bone,
  ],
  whitening: [
    { text: 'żel', from: [258, 60], to: [322, 30] },
    { text: 'szkliwo', from: [244, 100], to: [322, 80] },
    dentin,
    pulp,
    gum,
    bone,
  ],
  implant: [
    { text: 'korona', from: [250, 100], to: [322, 60] },
    { text: 'łącznik', from: [205, 185], to: [322, 150] },
    { text: 'implant', from: [208, 260], to: [322, 250] },
    gum,
    bone,
  ],
  aligner: [
    { text: 'nakładka', from: [320, 100], to: [366, 80] },
    { text: 'ząb', from: [316, 176], to: [366, 170] },
    { text: 'dziąsło', from: [340, 270], to: [366, 270] },
  ],
};

export const diagramCaptions: Readonly<Record<DiagramKind, string>> = {
  cleaning:
    'Przekrój zęba z kamieniem przy dziąśle. Kamień zbiera się tam, gdzie szczoteczka nie sięga, a skaling zdejmuje go bez ścierania szkliwa.',
  filling:
    'Przekrój zęba po leczeniu próchnicy. Ubytek w szkliwie i zębinie jest oczyszczony i odbudowany kompozytem.',
  canal:
    'Przekrój zęba po leczeniu kanałowym. Miazga jest usunięta, kanał wypełniony gutaperką, a koronę odbudowano.',
  whitening:
    'Przekrój zęba z żelem na szkliwie. Żel przenika przez szkliwo do zębiny i zmienia kolor zęba, nie jego kształt.',
  implant:
    'Przekrój w miejscu brakującego zęba. Tytanowy implant tkwi w kości zamiast korzenia, a łącznik trzyma koronę nad dziąsłem.',
  aligner:
    'Trzy zęby przed ruchem. Kontur nakładki leży tam, gdzie ząb ma się znaleźć, i prowadzi go w tym kierunku.',
};
