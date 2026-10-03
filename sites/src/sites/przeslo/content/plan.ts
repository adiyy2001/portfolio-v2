import type { FurnitureKind, SpaceKind } from '../data/floorplans';
import type { Lang } from '../i18n/lang';

export interface PlanText {
  spaces: Record<SpaceKind, string>;
  furniture: Record<FurnitureKind, string>;
  slope: string;
  childrenLabel: string;
  door: string;
  window: string;
  legendHeading: string;
  furnitureLine: (name: string, width: number, depth: number) => string;
  describe: (name: string, width: number, depth: number, spaces: string[]) => string;
  meters: (centimetres: number) => string;
}

const decimalComma = (value: number): string => value.toFixed(2).replace('.', ',');
const decimalPoint = (value: number): string => value.toFixed(2);

export const planText: Record<Lang, PlanText> = {
  pl: {
    childrenLabel: 'dzieci',
    spaces: {
      room: 'pokój',
      bath: 'łazienka',
      hall: 'przedpokój',
      sitting: 'część dzienna',
      bedroom: 'sypialnia',
      children: 'pokój dzieci',
    },
    furniture: {
      doubleBed: 'Łóżko podwójne',
      singleBed: 'Łóżko pojedyncze',
      sofaBed: 'Sofa rozkładana',
      desk: 'Biurko',
      wardrobe: 'Szafa',
      armchair: 'Fotel',
      table: 'Stolik',
      shower: 'Prysznic',
      bathtub: 'Wanna',
      basin: 'Umywalka',
      toilet: 'Toaleta',
    },
    slope: 'skos',
    door: 'drzwi',
    window: 'okno',
    legendHeading: 'Na planie',
    furnitureLine: (name, width, depth) => `${name}, ${width} x ${depth} cm`,
    describe: (name, width, depth, spaces) =>
      `Plan pokoju ${name}: prostokąt ${decimalComma(width / 100)} na ${decimalComma(depth / 100)} metra. Pomieszczenia: ${spaces.join(', ')}.`,
    meters: centimetres => `${decimalComma(centimetres / 100)} m`,
  },
  en: {
    childrenLabel: 'children',
    spaces: {
      room: 'room',
      bath: 'bathroom',
      hall: 'hall',
      sitting: 'sitting area',
      bedroom: 'bedroom',
      children: 'children’s room',
    },
    furniture: {
      doubleBed: 'Double bed',
      singleBed: 'Single bed',
      sofaBed: 'Sofa bed',
      desk: 'Desk',
      wardrobe: 'Wardrobe',
      armchair: 'Armchair',
      table: 'Small table',
      shower: 'Shower',
      bathtub: 'Bath',
      basin: 'Basin',
      toilet: 'Toilet',
    },
    slope: 'slope',
    door: 'door',
    window: 'window',
    legendHeading: 'On the plan',
    furnitureLine: (name, width, depth) => `${name}, ${width} x ${depth} cm`,
    describe: (name, width, depth, spaces) =>
      `Floor plan of the ${name} room: a rectangle ${decimalPoint(width / 100)} by ${decimalPoint(depth / 100)} metres. Spaces: ${spaces.join(', ')}.`,
    meters: centimetres => `${decimalPoint(centimetres / 100)} m`,
  },
};
