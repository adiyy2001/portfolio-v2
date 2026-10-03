import { describe, expect, it } from 'vitest';
import { totalPlanArea } from '../plan/build';
import { mapShapes } from './map-data';
import { agents } from './agents';
import { districts } from './districts';
import { getListing, listings, similarListings, toCard } from './listings';

describe('listings data', () => {
  it('has twenty four listings with unique slugs', () => {
    expect(listings).toHaveLength(24);
    expect(new Set(listings.map(listing => listing.slug)).size).toBe(24);
  });

  it('splits into fourteen sales and ten rentals', () => {
    expect(listings.filter(listing => listing.transaction === 'sprzedaz')).toHaveLength(14);
    expect(listings.filter(listing => listing.transaction === 'wynajem')).toHaveLength(10);
  });

  it('references known districts, agents and map shapes', () => {
    const shapeNames = new Set(mapShapes.map(shape => shape.name));
    for (const district of districts) expect(shapeNames.has(district.shape)).toBe(true);
    const districtIds = new Set(districts.map(district => district.id));
    const agentIds = new Set(agents.map(agent => agent.id));
    for (const listing of listings) {
      expect(districtIds.has(listing.district)).toBe(true);
      expect(agentIds.has(listing.agent)).toBe(true);
    }
  });

  it('draws floor plans whose rooms add up to the listed area', () => {
    for (const listing of listings) {
      const total = totalPlanArea(listing.plan.map(floor => floor.root));
      expect(Math.abs(total - listing.area)).toBeLessThan(0.06);
    }
  });

  it('keeps pins inside the map and the marked flat inside the building', () => {
    for (const listing of listings) {
      expect(listing.position.x).toBeGreaterThan(40);
      expect(listing.position.x).toBeLessThan(920);
      expect(listing.position.y).toBeGreaterThan(90);
      expect(listing.position.y).toBeLessThan(970);
      const { facade } = listing;
      if (facade.mark) {
        expect(facade.mark.bays[1]).toBeLessThan(facade.bays);
        expect(facade.mark.floors[1]).toBeLessThanOrEqual(facade.floors);
      }
    }
  });

  it('gives sales an ownership form and rentals a lease type', () => {
    for (const listing of listings) {
      if (listing.transaction === 'sprzedaz') expect(listing.ownership).toBeDefined();
      else expect(listing.lease).toBeDefined();
    }
  });

  it('looks listings up and builds cards without the long fields', () => {
    const first = listings[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(getListing(first.slug)).toBe(first);
    expect(getListing('nie-ma')).toBeUndefined();
    expect('description' in toCard(first)).toBe(false);
  });

  it('suggests similar offers of the same transaction, never the listing itself', () => {
    const first = listings[0];
    if (!first) return;
    const similar = similarListings(first);
    expect(similar).toHaveLength(3);
    expect(
      similar.every(item => item.slug !== first.slug && item.transaction === first.transaction),
    ).toBe(true);
  });
});
