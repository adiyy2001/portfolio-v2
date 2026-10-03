import type { MapPoint } from '../data/types';

export const metersPerMapUnit = 12;

export const distanceMeters = (a: MapPoint, b: MapPoint): number =>
  Math.hypot(a.x - b.x, a.y - b.y) * metersPerMapUnit;

export const roundDistance = (meters: number): number =>
  meters < 1000 ? Math.round(meters / 50) * 50 : Math.round(meters / 100) * 100;

export const formatDistance = (meters: number): string => {
  const rounded = roundDistance(meters);
  if (rounded < 1000) return `${rounded} m`;
  const kilometers = rounded / 1000;
  return `${kilometers.toFixed(1).replace('.', ',')} km`;
};
