import type { PlanTable } from '../data/plan';
import { barStools, planTables, sharedTableSeats } from '../data/plan';

export interface Point {
  x: number;
  y: number;
}

const seatOffsets: Record<PlanTable['kind'], readonly Point[]> = {
  four: [
    { x: -16, y: -38 },
    { x: 16, y: -38 },
    { x: -16, y: 38 },
    { x: 16, y: 38 },
  ],
  two: [
    { x: -36, y: 0 },
    { x: 36, y: 0 },
  ],
};

export const seatPositions = (table: PlanTable): Point[] =>
  seatOffsets[table.kind].map(offset => ({ x: table.x + offset.x, y: table.y + offset.y }));

export const seatsAtTables = () =>
  planTables.reduce((sum, table) => sum + seatOffsets[table.kind].length, 0);

export const totalSeats = () => seatsAtTables() + barStools + sharedTableSeats;
