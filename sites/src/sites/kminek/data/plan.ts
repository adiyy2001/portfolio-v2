export type TableKind = 'two' | 'four';

export interface PlanTable {
  id: string;
  kind: TableKind;
  x: number;
  y: number;
}

export const planTables: readonly PlanTable[] = [
  { id: 'a', kind: 'four', x: 170, y: 190 },
  { id: 'b', kind: 'four', x: 320, y: 190 },
  { id: 'c', kind: 'four', x: 470, y: 190 },
  { id: 'd', kind: 'two', x: 170, y: 290 },
  { id: 'e', kind: 'two', x: 320, y: 290 },
  { id: 'f', kind: 'two', x: 470, y: 290 },
];

export const barStools = 6;
export const sharedTableSeats = 10;
