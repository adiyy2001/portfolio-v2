import { plural } from './format';

export type ShadeGroup = 'A' | 'B' | 'C' | 'D';

export type ShadeName =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A3.5'
  | 'A4'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'D2'
  | 'D3'
  | 'D4';

export interface Shade {
  name: ShadeName;
  group: ShadeGroup;
  color: string;
}

export const valueOrder: readonly ShadeName[] = [
  'B1',
  'A1',
  'B2',
  'D2',
  'A2',
  'C1',
  'C2',
  'D4',
  'A3',
  'D3',
  'B3',
  'A3.5',
  'B4',
  'C3',
  'A4',
  'C4',
];

const colors: Record<ShadeName, string> = {
  A1: '#f7eddf',
  A2: '#f1e1c9',
  A3: '#e8d1af',
  'A3.5': '#e1c59b',
  A4: '#dab985',
  B1: '#f7f2e4',
  B2: '#f4ebcf',
  B3: '#dacca2',
  B4: '#d7c58e',
  C1: '#e1e0d6',
  C2: '#deddcb',
  C3: '#c5c4a8',
  C4: '#bfbd99',
  D2: '#f1e4da',
  D3: '#e2ccbb',
  D4: '#eed2bb',
};

export const guideOrder: readonly ShadeName[] = [
  'A1',
  'A2',
  'A3',
  'A3.5',
  'A4',
  'B1',
  'B2',
  'B3',
  'B4',
  'C1',
  'C2',
  'C3',
  'C4',
  'D2',
  'D3',
  'D4',
];

export const heroShades: readonly ShadeName[] = ['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'D2'];

export const shadeCount = valueOrder.length;

export const getShade = (name: ShadeName): Shade => ({
  name,
  group: name.charAt(0) as ShadeGroup,
  color: colors[name],
});

export const shadeRank = (name: ShadeName) => valueOrder.indexOf(name) + 1;

export const stepsBetween = (from: ShadeName, to: ShadeName) => shadeRank(from) - shadeRank(to);

const groupTone: Record<ShadeGroup, string> = {
  A: 'z czerwonobrązowym odcieniem',
  B: 'z żółtawym odcieniem',
  C: 'szarawy',
  D: 'z czerwonoszarym odcieniem',
};

export const lightnessLabel = (rank: number) => {
  if (rank <= 3) return 'Bardzo jasny';
  if (rank <= 7) return 'Jasny';
  if (rank <= 11) return 'Średni';
  if (rank <= 14) return 'Ciemniejszy';
  return 'Ciemny';
};

export const describeShade = (name: ShadeName) => {
  const { group } = getShade(name);
  return `${lightnessLabel(shadeRank(name))} odcień z grupy ${group}, ${groupTone[group]}.`;
};

const stepForms = ['stopień', 'stopnie', 'stopni'] as const;

export const describeChange = (from: ShadeName, to: ShadeName) => {
  const steps = stepsBetween(from, to);
  if (steps === 0) return 'To ten sam odcień, więc nic by się nie zmieniło.';
  if (steps < 0) return 'Ten cel jest ciemniejszy niż obecny odcień. Wybierz jaśniejszy.';
  const distance = `${steps} ${plural(steps, stepForms)} w skali jasności`;
  if (steps <= 2) {
    return `Niewielka zmiana: ${distance}. Często wystarcza higienizacja i jeden krótki cykl wybielania.`;
  }
  if (steps <= 5) {
    return `Typowy wynik wybielania: ${distance}. To realny cel.`;
  }
  return `Więcej niż zwykle daje samo wybielanie: ${distance}. Omówimy to na konsultacji, bo czasem potrzebne są dwa cykle albo licówki.`;
};
