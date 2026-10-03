import type { ShadeName } from '../lib/shades';
import { closeUpView, type ToothAdjustments } from '../lib/smile';

export type SceneId = 'whitening' | 'aligners' | 'implant';

export interface SceneSide {
  shade: ShadeName;
  upper?: ToothAdjustments;
  lower?: ToothAdjustments;
  missing?: readonly number[];
  highlight?: readonly number[];
}

export interface Scene {
  id: SceneId;
  view: string;
  title: string;
  before: SceneSide;
  after: SceneSide;
  beforeLabel: string;
  afterLabel: string;
  caption: string;
}

export const whiteningShades = { before: 'A3', after: 'A2' } as const satisfies Record<
  'before' | 'after',
  ShadeName
>;

const crowdedUpper: ToothAdjustments = {
  1: { dx: -5, dy: 0, rotate: 7 },
  [-1]: { dx: 5, dy: 4, rotate: -4 },
  2: { dx: 9, dy: -10, rotate: 24 },
  [-2]: { dx: -7, dy: 3, rotate: -17 },
  3: { dx: 16, dy: -24, rotate: 13 },
  [-3]: { dx: -9, dy: -12, rotate: -9 },
};

const crowdedLower: ToothAdjustments = {
  1: { dx: -4, dy: 0, rotate: 14 },
  [-1]: { dx: 6, dy: -2, rotate: -18 },
  2: { dx: 5, dy: 3, rotate: -10 },
  [-2]: { dx: -6, dy: 2, rotate: 12 },
};

const driftingNeighbours: ToothAdjustments = {
  [-1]: { dx: -3, dy: 0, rotate: 3 },
  [-3]: { dx: 7, dy: -2, rotate: -6 },
};

export const scenes: Readonly<Record<SceneId, Scene>> = {
  whitening: {
    id: 'whitening',
    view: closeUpView,
    title: 'Wybielanie',
    before: { shade: whiteningShades.before },
    after: { shade: whiteningShades.after },
    beforeLabel: 'Przed',
    afterLabel: 'Po',
    caption:
      'Rysunek typowego wyniku wybielania: cztery stopnie w skali jasności kolornika, z A3 do A2. To ilustracja, nie zdjęcie pacjenta.',
  },
  aligners: {
    id: 'aligners',
    view: '150 135 500 257',
    title: 'Ortodoncja nakładkowa',
    before: { shade: 'A2', upper: crowdedUpper, lower: crowdedLower },
    after: { shade: 'A2' },
    beforeLabel: 'Przed',
    afterLabel: 'Po',
    caption:
      'Rysunek stłoczonych zębów przed leczeniem i po nim. To ilustracja typowej korekty, nie zdjęcie pacjenta.',
  },
  implant: {
    id: 'implant',
    view: '160 150 420 216',
    title: 'Implant',
    before: { shade: 'A2', upper: driftingNeighbours, missing: [-2] },
    after: { shade: 'A2', highlight: [-2] },
    beforeLabel: 'Przed',
    afterLabel: 'Po',
    caption:
      'Rysunek braku bocznego górnego siekacza i korony na implancie w tym miejscu (zaznaczona). To ilustracja, nie zdjęcie pacjenta.',
  },
};
