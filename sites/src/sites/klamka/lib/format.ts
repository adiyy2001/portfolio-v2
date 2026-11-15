import type { Offer } from '../data/offers';

const nbsp = '\u00a0';

export const groupThousands = (value: number): string =>
  String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);

export const formatPrice = (zl: number): string => `${groupThousands(zl)}${nbsp}zł`;

export const pricePerM2 = (offer: Pick<Offer, 'priceZl' | 'areaM2'>): number =>
  Math.round(offer.priceZl / offer.areaM2);

export const formatPricePerM2 = (offer: Pick<Offer, 'priceZl' | 'areaM2'>): string =>
  `${groupThousands(pricePerM2(offer))}${nbsp}zł/m²`;

export const roomsLabel = (rooms: number): string => {
  if (rooms === 1) return '1 pokój';
  if (rooms >= 2 && rooms <= 4) return `${rooms} pokoje`;
  return `${rooms} pokoi`;
};

export const floorLabel = (floor: Offer['floor']): string | null => {
  if (floor === undefined) return null;
  return floor === 'parter' ? 'parter' : `${floor} piętro`;
};

export const factsLine = (offer: Offer): string =>
  [
    offer.kind,
    `${offer.areaM2} m²`,
    roomsLabel(offer.rooms),
    floorLabel(offer.floor),
    ...offer.extras,
  ]
    .filter((part): part is string => Boolean(part))
    .join(', ');

export const placeLine = (offer: Offer): string => `${offer.street}, ${offer.district}`;

export const offerPath = (offer: Pick<Offer, 'slug'>): string => `/klamka/oferty/${offer.slug}/`;

export const countLabel = (shown: number, total: number): string =>
  `Pokazano ${shown} z ${total} ofert`;
