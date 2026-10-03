import { rentListings } from './listings-rent';
import { saleListings } from './listings-sale';
import type { AgentId, DistrictId, Listing, ListingCard, Transaction } from './types';

export const listings: readonly Listing[] = [...saleListings, ...rentListings];

export const toCard = (listing: Listing): ListingCard => ({
  slug: listing.slug,
  transaction: listing.transaction,
  type: listing.type,
  district: listing.district,
  street: listing.street,
  price: listing.price,
  area: listing.area,
  rooms: listing.rooms,
  floor: listing.floor,
  floorsTotal: listing.floorsTotal,
  plotArea: listing.plotArea,
  market: listing.market,
  extras: listing.extras,
  published: listing.published,
  agent: listing.agent,
  position: listing.position,
  facade: listing.facade,
  headline: listing.headline,
});

export const cards: readonly ListingCard[] = listings.map(toCard);

const bySlug = new Map(listings.map(listing => [listing.slug, listing]));

export const getListing = (slug: string): Listing | undefined => bySlug.get(slug);

export const listingsOfAgent = (agent: AgentId): Listing[] =>
  listings.filter(listing => listing.agent === agent);

export const listingsInDistrict = (district: DistrictId): Listing[] =>
  listings.filter(listing => listing.district === district);

export const listingsOfTransaction = (transaction: Transaction): Listing[] =>
  listings.filter(listing => listing.transaction === transaction);

export const similarListings = (
  source: Pick<Listing, 'slug' | 'transaction' | 'type' | 'price' | 'area'>,
  pool: readonly Listing[] = listings,
  count = 3,
): Listing[] =>
  pool
    .filter(
      candidate => candidate.slug !== source.slug && candidate.transaction === source.transaction,
    )
    .map(candidate => ({
      candidate,
      distance:
        Math.abs(Math.log(candidate.price / source.price)) +
        Math.abs(Math.log(candidate.area / source.area)) * 0.6 +
        (candidate.type === source.type ? 0 : 0.5),
    }))
    .sort((a, b) => a.distance - b.distance || a.candidate.slug.localeCompare(b.candidate.slug))
    .slice(0, count)
    .map(entry => entry.candidate);
