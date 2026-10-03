import type { Floor } from './types';

export const columnCount = 10;
export const floors: readonly Floor[] = [0, 1, 2, 3, 4];
export const gateColumns: readonly number[] = [5, 6];

export const reservationFee = 5000;
export const parkingPrice = 52000;
export const storageFrom = 9000;

export const floorName = (floor: Floor) => (floor === 0 ? 'parter' : `piętro ${floor}`);

export const ceilingText = (floor: Floor) => {
  if (floor === 0) return '3,9 m';
  if (floor === 1) return '3,5 m';
  if (floor === 4) return 'od 3,6 do 5,2 m';
  return '3,4 m';
};

export const exposureText = (column: number) => {
  if (column === 1) return 'wschód, zachód i południe';
  if (column === columnCount) return 'wschód, zachód i północ';
  return 'wschód i zachód';
};

const ironColumnFlats: readonly string[] = ['0-02', '0-07', '0-09', '1-03', '1-08'];

export const hasIronColumn = (flat: { floor: number; column: number }) =>
  ironColumnFlats.includes(`${flat.floor}-${flat.column.toString().padStart(2, '0')}`);
