import { column, room, row } from './build';
import type { PlanFloor, PlanNode, Side } from './types';

export interface FlatOptions {
  balcony?: number;
  balconySide?: 'top' | 'bottom';
  mirror?: boolean;
}

const maybe = (node: PlanNode | null): PlanNode[] => (node ? [node] : []);

const ordered = (nodes: PlanNode[], mirror: boolean | undefined): PlanNode[] =>
  mirror ? [...nodes].reverse() : nodes;

const flatFloor = (
  root: PlanNode,
  ratio: number,
  windowSides: readonly Side[],
  balconyRoom: string,
  options: FlatOptions,
): PlanFloor => ({
  name: 'Mieszkanie',
  ratio,
  root,
  windowSides,
  entrance: 'bottom',
  balcony: options.balcony
    ? { room: balconyRoom, side: options.balconySide ?? 'top', area: options.balcony }
    : undefined,
});

export interface StudioAreas {
  salon: number;
  lazienka: number;
  przedpokoj: number;
}

export const studioPlan = (areas: StudioAreas, options: FlatOptions = {}): PlanFloor[] => [
  flatFloor(
    row(
      ...ordered(
        [
          column(room('Łazienka', areas.lazienka), room('Przedpokój', areas.przedpokoj)),
          room('Salon z aneksem', areas.salon),
        ],
        options.mirror,
      ),
    ),
    1.2,
    ['top', 'left', 'right'],
    'Salon z aneksem',
    { ...options, balconySide: 'top' },
  ),
];

export interface TwoRoomsAreas {
  salon: number;
  sypialnia: number;
  kuchnia: number;
  przedpokoj: number;
  lazienka: number;
}

export const twoRoomsPlan = (areas: TwoRoomsAreas, options: FlatOptions = {}): PlanFloor[] => [
  flatFloor(
    column(
      row(
        ...ordered(
          [room('Salon', areas.salon), room('Sypialnia', areas.sypialnia)],
          options.mirror,
        ),
      ),
      row(
        ...ordered(
          [
            room('Kuchnia', areas.kuchnia),
            room('Przedpokój', areas.przedpokoj),
            room('Łazienka', areas.lazienka),
          ],
          options.mirror,
        ),
      ),
    ),
    1.1,
    ['top', 'bottom'],
    options.balconySide === 'bottom' ? 'Kuchnia' : 'Salon',
    options,
  ),
];

export interface OpenTwoRoomsAreas {
  salon: number;
  sypialnia: number;
  lazienka: number;
  przedpokoj: number;
  garderoba: number;
}

export const openTwoRoomsPlan = (
  areas: OpenTwoRoomsAreas,
  options: FlatOptions = {},
): PlanFloor[] => [
  flatFloor(
    row(
      ...ordered(
        [
          room('Salon z aneksem', areas.salon),
          column(
            room('Sypialnia', areas.sypialnia),
            row(
              column(room('Łazienka', areas.lazienka), room('Garderoba', areas.garderoba)),
              room('Przedpokój', areas.przedpokoj),
            ),
          ),
        ],
        options.mirror,
      ),
    ),
    1.1,
    ['top', 'left', 'right'],
    'Salon z aneksem',
    { ...options, balconySide: 'top' },
  ),
];

export interface ThreeRoomsAreas {
  salon: number;
  pokoj: number;
  sypialnia: number;
  kuchnia: number;
  lazienka: number;
  przedpokoj: number;
  spizarnia?: number;
}

export const threeRoomsPlan = (areas: ThreeRoomsAreas, options: FlatOptions = {}): PlanFloor[] => [
  flatFloor(
    column(
      row(...ordered([room('Salon', areas.salon), room('Pokój', areas.pokoj)], options.mirror)),
      row(
        ...ordered(
          [
            room('Sypialnia', areas.sypialnia),
            room('Przedpokój', areas.przedpokoj),
            column(
              room('Kuchnia', areas.kuchnia),
              areas.spizarnia
                ? row(room('Łazienka', areas.lazienka), room('Spiżarnia', areas.spizarnia))
                : room('Łazienka', areas.lazienka),
            ),
          ],
          options.mirror,
        ),
      ),
    ),
    1.25,
    ['top', 'bottom'],
    options.balconySide === 'bottom' ? 'Sypialnia' : 'Salon',
    options,
  ),
];

export interface FourRoomsAreas {
  salon: number;
  sypialnia: number;
  pokoj1: number;
  pokoj2: number;
  lazienka: number;
  przedpokoj: number;
  garderoba: number;
}

export const fourRoomsPlan = (areas: FourRoomsAreas, options: FlatOptions = {}): PlanFloor[] => [
  flatFloor(
    column(
      row(
        ...ordered(
          [room('Salon z aneksem', areas.salon), room('Sypialnia', areas.sypialnia)],
          options.mirror,
        ),
      ),
      row(
        ...ordered(
          [
            room('Pokój', areas.pokoj1),
            room('Pokój', areas.pokoj2),
            column(
              row(room('Łazienka', areas.lazienka), room('Garderoba', areas.garderoba)),
              room('Przedpokój', areas.przedpokoj),
            ),
          ],
          options.mirror,
        ),
      ),
    ),
    1.3,
    ['top', 'bottom'],
    'Salon z aneksem',
    { ...options, balconySide: 'top' },
  ),
];

export interface HouseGroundAreas {
  hol: number;
  salon: number;
  kuchnia: number;
  wc: number;
  kotlownia: number;
  pokoj?: number;
}

export interface HouseUpperAreas {
  korytarz: number;
  sypialnia: number;
  garderoba: number;
  lazienka: number;
  pokoj1: number;
  pokoj2: number;
}

export interface HouseOptions {
  narrow?: boolean;
  salonName?: string;
  balcony?: number;
}

const utilityColumn = (areas: HouseGroundAreas): PlanNode =>
  column(room('WC', areas.wc), room('Kotłownia', areas.kotlownia));

export const housePlan = (
  ground: HouseGroundAreas,
  upper: HouseUpperAreas,
  options: HouseOptions = {},
): PlanFloor[] => {
  const salonName = options.salonName ?? 'Salon z jadalnią';
  const groundRoot: PlanNode = options.narrow
    ? column(
        room(salonName, ground.salon),
        room('Kuchnia', ground.kuchnia),
        ...maybe(ground.pokoj ? room('Pokój', ground.pokoj) : null),
        row(room('Hol', ground.hol), utilityColumn(ground)),
      )
    : row(
        column(
          room(salonName, ground.salon),
          ...maybe(ground.pokoj ? room('Pokój', ground.pokoj) : null),
        ),
        column(
          room('Kuchnia', ground.kuchnia),
          row(room('Hol', ground.hol), utilityColumn(ground)),
        ),
      );
  const upperRoot: PlanNode = options.narrow
    ? column(
        room('Sypialnia', upper.sypialnia),
        row(room('Pokój', upper.pokoj1), room('Pokój', upper.pokoj2)),
        row(
          room('Łazienka', upper.lazienka),
          room('Korytarz', upper.korytarz),
          room('Garderoba', upper.garderoba),
        ),
      )
    : column(
        row(
          room('Sypialnia', upper.sypialnia),
          room('Pokój', upper.pokoj1),
          room('Pokój', upper.pokoj2),
        ),
        row(
          room('Garderoba', upper.garderoba),
          room('Korytarz', upper.korytarz),
          room('Łazienka', upper.lazienka),
        ),
      );
  return [
    {
      name: 'Parter',
      ratio: options.narrow ? 0.6 : 1.2,
      root: groundRoot,
      windowSides: options.narrow ? ['top', 'bottom'] : ['top', 'left', 'right'],
      entrance: 'bottom',
      stairsIn: 'Hol',
      balcony: options.balcony
        ? { room: salonName, side: 'top', area: options.balcony }
        : undefined,
    },
    {
      name: 'Piętro',
      ratio: options.narrow ? 0.6 : 1.5,
      root: upperRoot,
      windowSides: options.narrow ? ['top', 'bottom'] : ['top', 'left', 'right'],
      stairsIn: 'Korytarz',
    },
  ];
};
