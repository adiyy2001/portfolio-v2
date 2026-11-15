import { pricePerM2 } from './format';

export type TypeKey = '37' | '52' | '64' | '112';
export type FloorKey = 'parter' | 'pietro-1' | 'pietro-2' | 'pietro-3';
export type Status = 'dostepny' | 'zarezerwowany' | 'sprzedany';

export interface Room {
  name: string;
  area: number;
}

export interface LoftType {
  key: TypeKey;
  area: number;
  floorKey: FloorKey;
  floor: string;
  floorPlan: string;
  prefix: string;
  rooms: number;
  count: number;
  basePrice: number;
  terrace: number;
  roomList: Room[];
  sold: number[];
  reserved: number[];
  frameId: string;
  headline: string;
  summary: string;
  interiorAlt: string;
}

export interface Unit {
  slug: string;
  code: string;
  type: TypeKey;
  index: number;
  price: number;
  status: Status;
}

export const types: LoftType[] = [
  {
    key: '37',
    area: 37,
    floorKey: 'parter',
    floor: 'Parter',
    floorPlan: 'parteru',
    prefix: 'P',
    rooms: 2,
    count: 28,
    basePrice: 489000,
    terrace: 0,
    roomList: [
      { name: 'Salon z aneksem', area: 21.4 },
      { name: 'Sypialnia', area: 8.6 },
      { name: 'Łazienka', area: 4.2 },
      { name: 'Przedpokój', area: 2.8 },
    ],
    sold: [2, 3, 5, 8, 9, 12, 14, 17, 19, 22, 24, 26],
    reserved: [4, 10, 15, 20, 27],
    frameId: 'piec',
    headline: 'W salonie stoi dawny piec.',
    summary: 'Jedno okno łukowe od południa, sypialnia osobno i ściana, której nikt nie tynkował.',
    interiorAlt:
      'Rysunek perspektywiczny salonu: ceglana ściana z jednym łukowym oknem, piec z rurą do stropu i aneks kuchenny po prawej',
  },
  {
    key: '52',
    area: 52,
    floorKey: 'pietro-1',
    floor: 'I piętro',
    floorPlan: 'pierwszego piętra',
    prefix: 'I',
    rooms: 2,
    count: 19,
    basePrice: 649000,
    terrace: 0,
    roomList: [
      { name: 'Salon z aneksem', area: 26.0 },
      { name: 'Sypialnia', area: 12.4 },
      { name: 'Łazienka', area: 5.2 },
      { name: 'Przedpokój', area: 4.4 },
      { name: 'Garderoba', area: 4.0 },
    ],
    sold: [2, 4, 7, 9, 13, 16],
    reserved: [5, 11, 17],
    frameId: 'komin',
    headline: 'Komin liczy 132 lata.',
    summary: 'Dwa pokoje wokół murowanego trzonu komina i dwa okna łukowe od południa.',
    interiorAlt:
      'Rysunek perspektywiczny salonu: dwa łukowe okna w ceglanej ścianie rozdzielone murowanym trzonem komina',
  },
  {
    key: '64',
    area: 64,
    floorKey: 'pietro-2',
    floor: 'II piętro',
    floorPlan: 'drugiego piętra',
    prefix: 'II',
    rooms: 3,
    count: 14,
    basePrice: 799000,
    terrace: 0,
    roomList: [
      { name: 'Salon z aneksem', area: 30.0 },
      { name: 'Sypialnia', area: 14.2 },
      { name: 'Gabinet', area: 7.8 },
      { name: 'Łazienka', area: 5.6 },
      { name: 'Przedpokój', area: 6.4 },
    ],
    sold: [3, 6, 10],
    reserved: [4, 12],
    frameId: 'suszarnia',
    headline: 'Suszarnię dobudowano w 1946.',
    summary: 'Trzy okna łukowe od południa i kuchnia otwarta na salon.',
    interiorAlt:
      'Rysunek perspektywiczny salonu: trzy łukowe okna w ceglanej ścianie, belki stropowe i wyspa kuchenna z okapem',
  },
  {
    key: '112',
    area: 112,
    floorKey: 'pietro-3',
    floor: 'III piętro',
    floorPlan: 'trzeciego piętra',
    prefix: 'III',
    rooms: 4,
    count: 6,
    basePrice: 1390000,
    terrace: 14,
    roomList: [
      { name: 'Salon z kuchnią', area: 48.0 },
      { name: 'Sypialnia główna', area: 20.0 },
      { name: 'Sypialnia', area: 14.0 },
      { name: 'Sypialnia', area: 12.0 },
      { name: 'Łazienka', area: 8.0 },
      { name: 'Przedpokój', area: 10.0 },
    ],
    sold: [2],
    reserved: [5],
    frameId: 'hala',
    headline: 'Hala dostała okno od zachodu.',
    summary: 'Trzy sypialnie, taras 14 m² od południa i pięć okien łukowych, jedno od zachodu.',
    interiorAlt:
      'Rysunek perspektywiczny salonu: cztery łukowe okna w ceglanej ścianie, piąte z boku, belki stropowe i wyspa kuchenna z okapem',
  },
];

export const typeByKey = (key: TypeKey) => types.find(type => type.key === key) as LoftType;

const pad = (n: number) => String(n).padStart(2, '0');

const statusOf = (type: LoftType, index: number): Status => {
  if (type.sold.includes(index)) return 'sprzedany';
  if (type.reserved.includes(index)) return 'zarezerwowany';
  return 'dostepny';
};

export const unitPrice = (type: LoftType, index: number) =>
  type.basePrice + ((index - 1) % 6) * 5000;

export const units: Unit[] = types.flatMap(type =>
  Array.from({ length: type.count }, (_, i) => {
    const index = i + 1;
    const code = `${type.prefix}-${pad(index)}`;
    return {
      slug: code.toLowerCase(),
      code,
      type: type.key,
      index,
      price: unitPrice(type, index),
      status: statusOf(type, index),
    };
  }),
);

export const unitBySlug = (slug: string) => units.find(unit => unit.slug === slug);

export const totalUnits = units.length;

export const unitsOfType = (key: TypeKey) => units.filter(unit => unit.type === key);

export const countByStatus = (list: Unit[], status: Status) =>
  list.filter(unit => unit.status === status).length;

export const availableOf = (key: TypeKey) => countByStatus(unitsOfType(key), 'dostepny');

export const lowestPrice = (key: TypeKey) =>
  Math.min(
    ...unitsOfType(key)
      .filter(unit => unit.status === 'dostepny')
      .map(unit => unit.price),
  );

export const roomsTotal = (type: LoftType) =>
  Math.round(type.roomList.reduce((sum, room) => sum + room.area, 0) * 10) / 10;

export const basePerM2 = (type: LoftType) => pricePerM2(type.basePrice, type.area);

export const statusLabel: Record<Status, string> = {
  dostepny: 'Dostępny',
  zarezerwowany: 'Zarezerwowany',
  sprzedany: 'Sprzedany',
};

export const roomsLabel = (rooms: number) => (rooms === 1 ? '1 pokój' : `${rooms} pokoje`);

export const floorOptions = types.map(type => ({ key: type.floorKey, label: type.floor }));
