export type Side = 'top' | 'right' | 'bottom' | 'left';
export type RoomKind =
  'living' | 'kitchen' | 'bedroom' | 'bath' | 'hall' | 'storage' | 'office' | 'garage';

export interface PlanRoom {
  name: string;
  area: number;
}

export interface PlanSplit {
  direction: 'row' | 'column';
  children: readonly PlanNode[];
}

export type PlanNode = PlanRoom | PlanSplit;

export interface PlanBalcony {
  room: string;
  side: Side;
  area: number;
}

export interface PlanFloor {
  name: string;
  ratio: number;
  root: PlanNode;
  windowSides: readonly Side[];
  entrance?: Side;
  stairsIn?: string;
  balcony?: PlanBalcony;
}
