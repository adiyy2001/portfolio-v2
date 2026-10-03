export type PlaceGroup = 'transport' | 'daily' | 'city';
export type TravelMode = 'walk' | 'bike';
export type LabelSide = 'right' | 'left' | 'above' | 'below';

export interface Place {
  id: string;
  name: string;
  group: PlaceGroup;
  lat: number;
  lon: number;
  mode: TravelMode;
  side: LabelSide;
  closeMap: boolean;
  wideMap: boolean;
}

export const site = { lat: 51.1218, lon: 17.0385 };

export const detourFactor = 1.25;

export const speedMetresPerMinute: Record<TravelMode, number> = { walk: 80, bike: 250 };

export const groupTitle: Record<PlaceGroup, string> = {
  transport: 'Komunikacja',
  daily: 'Codzienne sprawy',
  city: 'Miasto',
};

export const places: readonly Place[] = [
  {
    id: 'paulinska',
    name: 'Przystanek Paulińska',
    group: 'transport',
    lat: 51.12029,
    lon: 17.03527,
    mode: 'walk',
    side: 'left',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'jednosci',
    name: 'Przystanek Jedności Narodowej',
    group: 'transport',
    lat: 51.12104,
    lon: 17.04326,
    mode: 'walk',
    side: 'left',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'dworzec-nadodrze',
    name: 'Dworzec Nadodrze',
    group: 'transport',
    lat: 51.1243,
    lon: 17.035,
    mode: 'walk',
    side: 'left',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'sklep',
    name: 'Sklep spożywczy',
    group: 'daily',
    lat: 51.11996,
    lon: 17.03941,
    mode: 'walk',
    side: 'right',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'apteka',
    name: 'Apteka',
    group: 'daily',
    lat: 51.12054,
    lon: 17.03897,
    mode: 'walk',
    side: 'right',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'przychodnia',
    name: 'Przychodnia',
    group: 'daily',
    lat: 51.12013,
    lon: 17.03685,
    mode: 'walk',
    side: 'below',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'szkola',
    name: 'Szkoła podstawowa',
    group: 'daily',
    lat: 51.12066,
    lon: 17.03407,
    mode: 'walk',
    side: 'above',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'park-staszica',
    name: 'Park Staszica',
    group: 'daily',
    lat: 51.1229,
    lon: 17.0312,
    mode: 'walk',
    side: 'above',
    closeMap: true,
    wideMap: false,
  },
  {
    id: 'hala-targowa',
    name: 'Hala Targowa',
    group: 'city',
    lat: 51.11263,
    lon: 17.0395,
    mode: 'walk',
    side: 'right',
    closeMap: false,
    wideMap: true,
  },
  {
    id: 'rynek',
    name: 'Rynek',
    group: 'city',
    lat: 51.11,
    lon: 17.032,
    mode: 'walk',
    side: 'left',
    closeMap: false,
    wideMap: true,
  },
  {
    id: 'ostrow-tumski',
    name: 'Ostrów Tumski',
    group: 'city',
    lat: 51.11501,
    lon: 17.04649,
    mode: 'walk',
    side: 'right',
    closeMap: false,
    wideMap: true,
  },
  {
    id: 'ogrod-botaniczny',
    name: 'Ogród Botaniczny',
    group: 'city',
    lat: 51.11668,
    lon: 17.0487,
    mode: 'walk',
    side: 'above',
    closeMap: false,
    wideMap: true,
  },
  {
    id: 'plac-grunwaldzki',
    name: 'Plac Grunwaldzki',
    group: 'city',
    lat: 51.1112,
    lon: 17.0612,
    mode: 'bike',
    side: 'above',
    closeMap: false,
    wideMap: true,
  },
  {
    id: 'dworzec-glowny',
    name: 'Dworzec Wrocław Główny',
    group: 'city',
    lat: 51.0989,
    lon: 17.0364,
    mode: 'bike',
    side: 'right',
    closeMap: false,
    wideMap: false,
  },
];

const earthRadius = 6371000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const straightDistance = (
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
};

export const routeDistance = (place: Place) =>
  Math.round(straightDistance(site, place) * detourFactor);

export const travelMinutes = (place: Place) =>
  Math.max(1, Math.round(routeDistance(place) / speedMetresPerMinute[place.mode]));

export const projectToMetres = (point: { lat: number; lon: number }) => ({
  x: (point.lon - site.lon) * 111320 * Math.cos(toRadians(site.lat)),
  y: -(point.lat - site.lat) * 111200,
});

export const placeById = (id: string) => places.find(place => place.id === id);

export const formatRoute = (place: Place) => {
  const distance = routeDistance(place);
  const rounded =
    distance < 1000 ? Math.round(distance / 10) * 10 : Math.round(distance / 100) * 100;
  return distance < 1000 ? `${rounded} m` : `${(rounded / 1000).toFixed(1).replace('.', ',')} km`;
};

export const modeLabel: Record<TravelMode, string> = { walk: 'pieszo', bike: 'rowerem' };

export const placesInGroup = (group: PlaceGroup) =>
  places.filter(place => place.group === group).sort((a, b) => routeDistance(a) - routeDistance(b));

const mapLetters = 'ABCDEFGHIJKLMNOP';

export const onMap = (place: Place) => place.wideMap || place.closeMap;

const groupOrder = Object.keys(groupTitle) as PlaceGroup[];

const lettered = [...places]
  .filter(onMap)
  .sort(
    (a, b) =>
      groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
      routeDistance(a) - routeDistance(b),
  );

export const placeLetter = (place: Place) => {
  const index = lettered.indexOf(place);
  return index < 0 ? undefined : mapLetters[index];
};
