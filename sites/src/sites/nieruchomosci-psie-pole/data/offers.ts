import type { AgentId } from './agents';

export type District = 'Psie Pole' | 'Leśnica' | 'Karłowice' | 'Dąbie';

export interface OfferImage {
  key: string;
  widths: number[];
  width: number;
  height: number;
  alt: string;
  position?: string;
}

export interface OfferDetail {
  label: string;
  value: string;
}

export interface Offer {
  slug: string;
  number: string;
  street: string;
  streetLocative: string;
  district: District;
  kind?: string;
  areaM2: number;
  rooms: number;
  floor?: number | 'parter';
  extras: string[];
  priceZl: number;
  agent: AgentId;
  image: OfferImage;
  lead: string;
  description: string[];
  features: string[];
  details: OfferDetail[];
}

export const offers: Offer[] = [
  {
    slug: 'czajkowskiego',
    number: '01',
    street: 'ul. Czajkowskiego',
    streetLocative: 'ul. Czajkowskiego',
    district: 'Karłowice',
    areaM2: 86,
    rooms: 4,
    floor: 5,
    extras: ['balkon'],
    priceZl: 1089000,
    agent: 'adam',
    image: {
      key: 'czajkowskiego',
      widths: [480, 960, 1600],
      width: 1600,
      height: 1000,
      alt: 'Salon z zieloną sofą, drewnianą podłogą i wysokim oknem',
    },
    lead: 'Cztery pokoje na piątym piętrze, z balkonem i salonem, do którego światło wchodzi przez wysokie okno.',
    description: [
      'Największe mieszkanie w tym numerze. Salon ma wysokie okno i drewnianą podłogę, a z pokoju dziennego wychodzi się na balkon. Trzy pozostałe pokoje są osobne, więc rodzina z dziećmi albo dwie osoby pracujące z domu nie wchodzą sobie w drogę.',
      'Budynek stoi w Karłowicach, kilka minut od zieleni i szybkiej drogi do centrum. Księgę wieczystą Adam Wolny sprawdził przed wystawieniem oferty.',
    ],
    features: [
      'Balkon od strony salonu',
      'Drewniana podłoga w salonie',
      'Cztery osobne pokoje',
      'Winda w budynku',
    ],
    details: [
      { label: 'Rok budowy', value: '2012' },
      { label: 'Ogrzewanie', value: 'miejskie' },
      { label: 'Czynsz do wspólnoty', value: '640 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
  {
    slug: 'kielczowska',
    number: '02',
    street: 'ul. Kiełczowska',
    streetLocative: 'ul. Kiełczowskiej',
    district: 'Psie Pole',
    kind: 'Nowy blok',
    areaM2: 39,
    rooms: 2,
    floor: 3,
    extras: [],
    priceZl: 439000,
    agent: 'karolina',
    image: {
      key: 'kielczowska',
      widths: [480, 800],
      width: 800,
      height: 534,
      alt: 'Aneks z drewnianym stołem i czarną ścianą, w głębi sypialnia',
    },
    lead: 'Dwa pokoje w nowym bloku na Psim Polu, z aneksem kuchennym i osobną sypialnią.',
    description: [
      'Aneks kuchenny z drewnianym stołem stoi przy ciemnej ścianie, a za nim jest osobna sypialnia. Mieszkanie jest małe, ale ma sensowny podział: nie przechodzi się przez sypialnię, żeby dojść do łazienki.',
      'To nowy blok przy Kiełczowskiej, cicho i blisko obwodnicy. Dobry wybór na pierwsze własne mieszkanie albo na wynajem.',
    ],
    features: [
      'Osobna sypialnia',
      'Aneks kuchenny z miejscem na stół',
      'Blok oddany do użytku niedawno',
      'Winda w budynku',
    ],
    details: [
      { label: 'Rok budowy', value: '2023' },
      { label: 'Ogrzewanie', value: 'miejskie' },
      { label: 'Czynsz do wspólnoty', value: '410 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
  {
    slug: 'wroblewskiego',
    number: '03',
    street: 'ul. Wróblewskiego',
    streetLocative: 'ul. Wróblewskiego',
    district: 'Dąbie',
    kind: 'Kamienica',
    areaM2: 57,
    rooms: 2,
    floor: 'parter',
    extras: [],
    priceZl: 749000,
    agent: 'adam',
    image: {
      key: 'wroblewskiego',
      widths: [480, 800],
      width: 800,
      height: 1200,
      alt: 'Białe szafki kuchenne, niebieskie płytki i szyba z wzorem widziane przez otwarte drzwi',
      position: '50% 40%',
    },
    lead: 'Parter starej kamienicy na Dąbiu. Kuchnia zachowała niebieskie płytki z dawnych lat.',
    description: [
      'Zdjęcie pokazuje kuchnię widzianą przez otwarte drzwi z przeszkloną szybą. Płytki, szafki i okno są zachowane w stanie sprzed lat, więc mieszkanie wymaga remontu, ale kupujący dostaje wysokie pomieszczenia i grube ściany kamienicy.',
      'Dwa pokoje na parterze, z oknami na zieleń. Adam Wolny sprawdził księgę wieczystą i uchwały wspólnoty. Kamienica ma niewielki fundusz remontowy i niski czynsz.',
    ],
    features: [
      'Wysokie pomieszczenia',
      'Kuchnia z oryginalnymi płytkami',
      'Drzwi z szybą z wzorem',
      'Zieleń za oknami',
    ],
    details: [
      { label: 'Rok budowy', value: '1912' },
      { label: 'Ogrzewanie', value: 'piec gazowy w mieszkaniu' },
      { label: 'Czynsz do wspólnoty', value: '360 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
  {
    slug: 'sredzka',
    number: '04',
    street: 'ul. Średzka',
    streetLocative: 'ul. Średzkiej',
    district: 'Leśnica',
    kind: 'Po remoncie',
    areaM2: 41,
    rooms: 2,
    floor: 2,
    extras: [],
    priceZl: 429000,
    agent: 'karolina',
    image: {
      key: 'sredzka',
      widths: [480, 800],
      width: 800,
      height: 1066,
      alt: 'Pokój z ceglaną ścianą, oknem z widokiem na drzewa i ciemną sofą',
    },
    lead: 'Dwa pokoje po remoncie w Leśnicy. Ceglana ściana, okno na drzewa i wszystko gotowe do wprowadzenia.',
    description: [
      'Właściciel odnowił mieszkanie od podłogi po instalacje. W pokoju dziennym została odsłonięta ceglana ściana, a okno wychodzi na drzewa. Wystarczy przynieść meble.',
      'Blok stoi blisko dworca Wrocław Leśnica, więc do centrum dojeżdża się pociągiem. Karolina Mazur przygotowała komplet dokumentów dla kupującego.',
    ],
    features: [
      'Nowe instalacje i podłogi',
      'Odsłonięta ceglana ściana',
      'Okno na drzewa',
      'Blisko dworca Wrocław Leśnica',
    ],
    details: [
      { label: 'Rok budowy', value: '1998' },
      { label: 'Ogrzewanie', value: 'miejskie' },
      { label: 'Czynsz do wspólnoty', value: '470 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
  {
    slug: 'gorlicka',
    number: '05',
    street: 'ul. Gorlicka',
    streetLocative: 'ul. Gorlickiej',
    district: 'Psie Pole',
    kind: 'Szeregówka',
    areaM2: 61,
    rooms: 3,
    extras: ['ogródek'],
    priceZl: 569000,
    agent: 'karolina',
    image: {
      key: 'gorlicka',
      widths: [480, 800],
      width: 800,
      height: 534,
      alt: 'Kuchnia w jasnym drewnie z jadalnią',
    },
    lead: 'Trzy pokoje w szeregówce na Psim Polu, z jasną kuchnią w drewnie i własnym ogródkiem.',
    description: [
      'Kuchnia w jasnym drewnie łączy się z jadalnią, a z jadalni wychodzi się do ogródka. Dom ma trzy pokoje na dwóch kondygnacjach i własne wejście od ulicy.',
      'Szeregówka stoi przy Gorlickiej, w cichej części Psiego Pola. Najbliższa okolica to domy i szeregówki, a do obwodnicy jest kilka minut.',
    ],
    features: [
      'Własny ogródek',
      'Wejście bez klatki schodowej',
      'Kuchnia w jasnym drewnie z jadalnią',
      'Trzy pokoje na dwóch kondygnacjach',
    ],
    details: [
      { label: 'Rok budowy', value: '2019' },
      { label: 'Ogrzewanie', value: 'gazowe, własny piec' },
      { label: 'Czynsz do wspólnoty', value: '290 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
  {
    slug: 'soltysowicka',
    number: '06',
    street: 'ul. Sołtysowicka',
    streetLocative: 'ul. Sołtysowickiej',
    district: 'Karłowice',
    kind: 'Kawalerka',
    areaM2: 29,
    rooms: 1,
    floor: 1,
    extras: [],
    priceZl: 359000,
    agent: 'adam',
    image: {
      key: 'soltysowicka',
      widths: [480, 800],
      width: 800,
      height: 534,
      alt: 'Puste wnętrze ze skośnym sufitem, szarymi ścianami, jasną podłogą i oknem balkonowym',
    },
    lead: 'Kawalerka pod skosem na piętrze niskiego budynku w Karłowicach, z oknem balkonowym i widokiem na pola.',
    description: [
      'Jedno duże pomieszczenie ze skośnym sufitem, szarymi ścianami i jasną podłogą. Przez okno balkonowe wpada dużo światła, a z balkonu widać pola. Na zdjęciu mieszkanie jest puste, żeby dało się ocenić jego proporcje.',
      'Niski budynek w Karłowicach, mieszkanie na piętrze pod dachem. Dobre dla jednej osoby albo jako lokal na wynajem. Adam Wolny sprawdził stan prawny.',
    ],
    features: [
      'Okno balkonowe z widokiem na pola',
      'Skośny sufit',
      'Jasna podłoga i szare ściany',
      'Pusty lokal, gotowy do aranżacji',
    ],
    details: [
      { label: 'Rok budowy', value: '2016' },
      { label: 'Ogrzewanie', value: 'miejskie' },
      { label: 'Czynsz do wspólnoty', value: '250 zł miesięcznie' },
      { label: 'Stan prawny', value: 'księga wieczysta bez obciążeń' },
      { label: 'Wolne od', value: 'dnia aktu notarialnego' },
    ],
  },
];

export const districts: Array<{ name: District; averageZlPerM2: number; text: string }> = [
  {
    name: 'Psie Pole',
    averageZlPerM2: 9400,
    text: 'Nowe bloki i szeregówki przy Kiełczowskiej i Gorlickiej. Cicho, blisko obwodnicy.',
  },
  {
    name: 'Leśnica',
    averageZlPerM2: 10500,
    text: 'Mieszkania po remoncie, blisko dworca Wrocław Leśnica.',
  },
  {
    name: 'Karłowice',
    averageZlPerM2: 12600,
    text: 'Nowsze bloki, dużo zieleni i szybki dojazd do centrum.',
  },
  {
    name: 'Dąbie',
    averageZlPerM2: 14100,
    text: 'Stare kamienice i zieleń, najdroższy metr w naszej kartotece.',
  },
];

export const offerBySlug = (slug: string): Offer | undefined =>
  offers.find(offer => offer.slug === slug);
