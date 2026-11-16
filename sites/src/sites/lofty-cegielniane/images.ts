import { type TypeKey } from './data';
import { asset } from './site';

export interface Photo {
  id: string;
  src: string;
  tall?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const img = (name: string) => asset(`img/${name}.webp`);

export const photos: Record<string, Photo> = {
  hero: {
    id: 'hero',
    src: img('hero'),
    tall: img('hero-tall'),
    width: 2400,
    height: 1350,
    alt: 'Ceglana ściana hali z oknami zamkniętymi łukami, w ciemnych barwach',
    caption: 'Ceglana elewacja hali, kadr ilustracyjny.',
  },
  history: {
    id: 'history',
    src: img('history'),
    width: 2000,
    height: 1126,
    alt: 'Komin i skośny dach ceglanej hali na tle zachmurzonego nieba, nad dachem drzewko',
    caption: 'Komin i dach hali, kadr ilustracyjny.',
  },
  piec: {
    id: 'piec',
    src: img('piec'),
    tall: img('piec-tall'),
    width: 1920,
    height: 1080,
    alt: 'Okno z ceglanym łukiem i stalową ramą w ceglanym murze',
    caption: 'Okno z łukiem w ceglanym murze, kadr ilustracyjny.',
  },
  komin: {
    id: 'komin',
    src: img('komin'),
    tall: img('komin-tall'),
    width: 1920,
    height: 1080,
    alt: 'Ceglany komin z młodymi drzewami na tle ciemnego nieba',
    caption: 'Komin z drzewami, kadr ilustracyjny.',
  },
  suszarnia: {
    id: 'suszarnia',
    src: img('suszarnia'),
    tall: img('suszarnia-tall'),
    width: 1920,
    height: 1080,
    alt: 'Ceglany szczyt hali o zmierzchu z okrągłym oknem i oknami zamkniętymi łukami',
    caption: 'Szczyt hali o zmierzchu, kadr ilustracyjny.',
  },
  hala: {
    id: 'hala',
    src: img('hala'),
    tall: img('hala-tall'),
    width: 1920,
    height: 1080,
    alt: 'Boczna ściana ceglanej hali z oknami zamkniętymi łukami',
    caption: 'Boczna ściana hali z oknami w arkadach, kadr ilustracyjny.',
  },
  adres: {
    id: 'adres',
    src: img('adres'),
    width: 1920,
    height: 1080,
    alt: 'Okno z ceglanym łukiem i kratą szyb, obok fragment drugiego okna',
    caption: 'Okno z łukiem, kadr ilustracyjny.',
  },
  sunDark: {
    id: 'sunDark',
    src: img('sun-dark'),
    width: 2000,
    height: 1126,
    alt: '',
    caption: '',
  },
  sunLit: {
    id: 'sunLit',
    src: img('sun-lit'),
    width: 2000,
    height: 1126,
    alt: 'Okno z ceglanym łukiem i arkady bocznej ściany hali, oświetlone słońcem',
    caption: 'Okno z łukiem i arkady oświetlone słońcem, kadr ilustracyjny.',
  },
};

export const frameOf = (key: TypeKey) => {
  const frames: Record<TypeKey, Photo> = {
    '37': photos.piec,
    '52': photos.komin,
    '64': photos.suszarnia,
    '112': photos.hala,
  };
  return frames[key];
};

export const interiorSrc = (key: TypeKey) => asset(`drawings/interior-${key}.svg`);
