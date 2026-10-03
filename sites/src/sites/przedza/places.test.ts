import { describe, expect, it } from 'vitest';
import {
  detourFactor,
  formatRoute,
  groupTitle,
  onMap,
  placeById,
  placeLetter,
  places,
  placesInGroup,
  projectToMetres,
  routeDistance,
  site,
  straightDistance,
  travelMinutes,
} from './places';
import { insideView, mapViews } from './map-views';

const required = (id: string) => {
  const place = placeById(id);
  if (!place) throw new Error(`missing place ${id}`);
  return place;
};

describe('straightDistance', () => {
  it('is zero for the same point and symmetric', () => {
    expect(straightDistance(site, site)).toBe(0);
    const rynek = required('rynek');
    expect(straightDistance(site, rynek)).toBeCloseTo(straightDistance(rynek, site), 3);
  });

  it('measures one degree of latitude as about 111 km', () => {
    const distance = straightDistance({ lat: 51, lon: 17 }, { lat: 52, lon: 17 });
    expect(distance).toBeGreaterThan(111000);
    expect(distance).toBeLessThan(111400);
  });
});

describe('route distance and time', () => {
  it('adds the detour factor to the straight line', () => {
    const rynek = required('rynek');
    expect(routeDistance(rynek)).toBe(Math.round(straightDistance(site, rynek) * detourFactor));
  });

  it('keeps everyday places within a ten minute walk', () => {
    for (const id of [
      'paulinska',
      'jednosci',
      'dworzec-nadodrze',
      'sklep',
      'apteka',
      'przychodnia',
      'szkola',
    ]) {
      const place = required(id);
      expect(place.mode).toBe('walk');
      expect(travelMinutes(place)).toBeLessThanOrEqual(10);
    }
  });

  it('puts the Market Square roughly twenty minutes away on foot', () => {
    const minutes = travelMinutes(required('rynek'));
    expect(minutes).toBeGreaterThanOrEqual(18);
    expect(minutes).toBeLessThanOrEqual(26);
  });

  it('never returns less than one minute', () => {
    expect(travelMinutes({ ...required('sklep'), lat: site.lat, lon: site.lon })).toBe(1);
  });
});

describe('formatRoute', () => {
  it('rounds metres to ten and switches to kilometres above one thousand', () => {
    for (const place of places) {
      const text = formatRoute(place);
      expect(text).toMatch(/^(\d+ m|\d+,\d km)$/);
    }
    expect(formatRoute({ ...required('sklep'), lat: site.lat + 0.01, lon: site.lon })).toMatch(
      /km$/,
    );
  });
});

describe('projectToMetres', () => {
  it('puts the site at the origin and measures south as positive y', () => {
    const origin = projectToMetres(site);
    expect(origin.x).toBeCloseTo(0, 6);
    expect(origin.y).toBeCloseTo(0, 6);
    const south = projectToMetres({ lat: site.lat - 0.001, lon: site.lon });
    expect(south.y).toBeCloseTo(111.2, 1);
    const east = projectToMetres({ lat: site.lat, lon: site.lon + 0.001 });
    expect(east.x).toBeGreaterThan(60);
    expect(east.x).toBeLessThan(80);
  });
});

describe('places', () => {
  it('has unique ids and every group is used', () => {
    expect(new Set(places.map(place => place.id)).size).toBe(places.length);
    for (const group of Object.keys(groupTitle) as (keyof typeof groupTitle)[]) {
      expect(placesInGroup(group).length).toBeGreaterThan(0);
    }
  });

  it('sorts each group from the nearest place', () => {
    for (const group of Object.keys(groupTitle) as (keyof typeof groupTitle)[]) {
      const distances = placesInGroup(group).map(routeDistance);
      expect(distances).toEqual([...distances].sort((a, b) => a - b));
    }
  });

  it('shows on the close map only places that are near', () => {
    for (const place of places.filter(item => item.closeMap)) {
      expect(routeDistance(place)).toBeLessThan(1500);
    }
  });

  it('keeps every place inside the view it is drawn on', () => {
    for (const place of places.filter(item => item.closeMap)) {
      expect(insideView(mapViews.close, projectToMetres(place))).toBe(true);
    }
    for (const place of places.filter(item => item.wideMap)) {
      const point = projectToMetres(place);
      expect(insideView(mapViews.wide, point)).toBe(true);
      expect(insideView(mapViews.close, point)).toBe(false);
    }
  });

  it('draws every place on one map at most and leaves out only the far station', () => {
    expect(places.filter(item => item.closeMap && item.wideMap)).toEqual([]);
    expect(places.filter(item => !onMap(item)).map(item => item.id)).toEqual(['dworzec-glowny']);
  });

  it('gives a unique letter to every place on a map and none to the others', () => {
    const letters = places.filter(onMap).map(placeLetter);
    expect(new Set(letters).size).toBe(letters.length);
    expect(letters.every(letter => letter !== undefined)).toBe(true);
    for (const place of places.filter(item => !onMap(item))) {
      expect(placeLetter(place)).toBeUndefined();
    }
  });
});
