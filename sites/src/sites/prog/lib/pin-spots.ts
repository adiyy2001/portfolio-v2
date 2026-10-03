import { cards } from '../data/listings';
import type { MapPoint } from '../data/types';
import { spreadPins } from './map-view';

const pinGapX = 70;
const pinGapY = 84;

const spots = spreadPins(
  cards.map(card => ({ id: card.slug, x: card.position.x, y: card.position.y })),
  pinGapX,
  pinGapY,
);

export const pinSpot = (slug: string, fallback: MapPoint): MapPoint => spots.get(slug) ?? fallback;
