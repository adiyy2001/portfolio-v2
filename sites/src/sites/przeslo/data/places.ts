export type PlaceId =
  'hotel' | 'hala-targowa' | 'rynek' | 'ostrow-tumski' | 'panorama' | 'papa-krasnal';

export type WalkId = Exclude<PlaceId, 'hotel'>;

export interface MapPoint {
  x: number;
  y: number;
}

export interface Place {
  id: PlaceId;
  position: MapPoint;
  walkingMinutes: number | null;
  labelAnchor?: 'start' | 'end';
  labelDy?: number;
}

export const places: readonly Place[] = [
  { id: 'hotel', position: { x: 300, y: 128 }, walkingMinutes: null },
  { id: 'hala-targowa', position: { x: 252, y: 206 }, walkingMinutes: 5 },
  { id: 'rynek', position: { x: 214, y: 302 }, walkingMinutes: 8, labelDy: 48 },
  { id: 'ostrow-tumski', position: { x: 486, y: 190 }, walkingMinutes: 10 },
  { id: 'papa-krasnal', position: { x: 92, y: 268 }, walkingMinutes: 13 },
  { id: 'panorama', position: { x: 556, y: 324 }, walkingMinutes: 20, labelAnchor: 'end' },
];

export const walkingRoutes: readonly [PlaceId, PlaceId][] = [
  ['hotel', 'hala-targowa'],
  ['hala-targowa', 'rynek'],
  ['rynek', 'papa-krasnal'],
  ['hotel', 'ostrow-tumski'],
  ['ostrow-tumski', 'panorama'],
];

export const placeById = (id: PlaceId): Place => {
  const found = places.find(place => place.id === id);
  if (!found) throw new Error(`Unknown place ${id}`);
  return found;
};
