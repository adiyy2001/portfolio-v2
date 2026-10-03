export type Floor = 0 | 1 | 2 | 3 | 4;
export type Rooms = 2 | 3 | 4;
export type Status = 'available' | 'reserved' | 'sold';
export type OutdoorKind = 'garden' | 'balcony' | 'terrace';

export interface Outdoor {
  kind: OutdoorKind;
  area: number;
}

export interface Flat {
  floor: Floor;
  column: number;
  rooms: Rooms;
  area: number;
  price: number;
  status: Status;
  outdoor?: Outdoor;
  note: string;
}
