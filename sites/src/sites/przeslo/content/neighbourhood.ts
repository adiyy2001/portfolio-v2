import type { WalkId } from '../data/places';
import type { Lang } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface PlaceText {
  name: string;
  note: string;
}

export interface NeighbourhoodText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  mapHeading: string;
  mapTitle: string;
  mapDescription: string;
  mapNote: string;
  river: string;
  hotelLabel: string;
  walkHeading: string;
  walkLead: string;
  minutes: (count: number) => string;
  places: Record<WalkId, PlaceText>;
  tram: PlaceText;
  gettingHeading: string;
  gettingLead: string;
  getting: { title: string; text: string }[];
  statusNote: string;
  closingHeading: string;
  closingText: string;
  closingLink: string;
}

const pl: NeighbourhoodText = {
  title: 'Okolica: spacer po Wrocławiu z Grodzkiej | Przęsło',
  description:
    'Pieszo z hotelu Przęsło do Hali Targowej, Rynku, Ostrowa Tumskiego i Panoramy Racławickiej. Krótki przewodnik z faktami, schematyczna mapa i dojazd z lotniska.',
  heading: 'Okolica',
  lead: 'Ulica Grodzka ma 735 metrów i biegnie wzdłuż południowego ramienia Odry. Z hotelu do wszystkiego, co warto zobaczyć na starówce, dojdziesz pieszo.',
  mapHeading: 'Mapa spaceru',
  mapTitle: 'Schemat okolicy hotelu Przęsło',
  mapDescription:
    'Schemat bez skali: hotel nad Odrą, która płynie na północ od niego, na południe od hotelu Hala Targowa i Rynek, na wschód Ostrów Tumski i dalej Panorama Racławicka, na zachód od Rynku Papa Krasnal.',
  mapNote: 'Schemat, nie w skali. Numery odpowiadają liście poniżej.',
  river: 'Odra',
  hotelLabel: 'Przęsło',
  walkHeading: 'Na piechotę',
  walkLead: 'Czasy to zwykły spacer z hotelu, bez pośpiechu i bez przystanków na zdjęcia.',
  minutes: count => `${count} min pieszo`,
  places: {
    'hala-targowa': {
      name: 'Hala Targowa',
      note: 'Zbudowana w latach 1906-1908 według projektu Richarda Plüddemanna i Heinricha Küstera. Żelbetowe łuki mają rozpiętość ponad 20 metrów. Do dziś handluje się tu jak sto lat temu: warzywa, ryby, kwiaty.',
    },
    rynek: {
      name: 'Rynek',
      note: 'Plac ma wymiary około 213 na 178 metrów. W środku stoi ratusz, dookoła kamienice z kolorowymi fasadami i ogródki kawiarni.',
    },
    'ostrow-tumski': {
      name: 'Ostrów Tumski',
      note: 'Najstarsza część miasta, kiedyś wyspa na Odrze. Ponad sto gazowych latarni zapala o zmierzchu latarnik, ręcznie.',
    },
    'papa-krasnal': {
      name: 'Papa Krasnal',
      note: 'Pierwszy wrocławski krasnal, odsłonięty w 2001 roku przy ul. Świdnickiej. Dziś miasto ma ich ponad tysiąc, więc patrz pod nogi.',
    },
    panorama: {
      name: 'Panorama Racławicka',
      note: 'Obraz o wymiarach 15 na 114 metrów, namalowany w latach 1893-1894 przez Jana Styka i Wojciecha Kossaka. Rotunda przy ul. Purkyniego 11 stoi od 1985 roku.',
    },
  },
  tram: {
    name: 'Hala Stulecia',
    note: 'Zbudowana w 1913 roku według projektu Maksa Berga, od 2006 roku na liście UNESCO. Żelbetowa kopuła ma średnicę ponad 65 metrów. Leży na wschód od centrum, dojedziesz tam tramwajem.',
  },
  gettingHeading: 'Dojazd',
  gettingLead:
    'Jak do nas dotrzeć, gdzie zostawić samochód i bagaż, i dokąd pojechać dalej tramwajem.',
  getting: [
    {
      title: 'Z lotniska',
      text: 'Lotnisko we Wrocławiu jest około 10 km od hotelu. Jeździ stamtąd autobus 106, w nocy 206. Możemy też podstawić samochód za 140 zł, zaznacz to w dodatkach.',
    },
    {
      title: 'Samochodem',
      text: `Mamy ${hotel.parkingSpaces} miejsc na zamkniętym parkingu przy sąsiedniej ulicy, 60 zł za dobę. Miejsca rezerwujesz razem z pokojem.`,
    },
    {
      title: 'Z bagażem',
      text: 'Bagażownia jest bezpłatna: zostawisz walizki przed zameldowaniem i po wymeldowaniu.',
    },
  ],
  statusNote: 'Numery linii autobusowych: stan na październik 2026.',
  closingHeading: 'Plan na weekend?',
  closingText: 'Sprawdź, które klucze wiszą jeszcze w recepcji w dniach, które Cię interesują.',
  closingLink: 'Wybierz dni',
};

const en: NeighbourhoodText = {
  title: 'Neighbourhood: a walk around Wrocław from Grodzka | Przęsło',
  description:
    'On foot from Przęsło to the Market Hall, the Market Square, Ostrów Tumski and the Racławice Panorama. A short guide with facts, a schematic map and how to get here from the airport.',
  heading: 'Neighbourhood',
  lead: 'Grodzka street is 735 metres long and runs along the southern arm of the Oder. Everything worth seeing in the old town is within walking distance of the hotel.',
  mapHeading: 'Walking map',
  mapTitle: 'Schematic map around Przęsło hotel',
  mapDescription:
    'A schematic map without scale: the hotel by the Oder, which runs to its north, the Market Hall and the Market Square to its south, Ostrów Tumski to the east and the Racławice Panorama beyond it, Papa Krasnal west of the square.',
  mapNote: 'A schematic, not to scale. The numbers match the list below.',
  river: 'Oder',
  hotelLabel: 'Przęsło',
  walkHeading: 'On foot',
  walkLead: 'Times are an ordinary walk from the hotel, with no rush and no stops for photos.',
  minutes: count => `${count} min on foot`,
  places: {
    'hala-targowa': {
      name: 'Market Hall',
      note: 'Built in 1906-1908 to a design by Richard Plüddemann and Heinrich Küster. The reinforced concrete arches span more than 20 metres. People still shop here as they did a hundred years ago: vegetables, fish, flowers.',
    },
    rynek: {
      name: 'Market Square',
      note: 'The square measures about 213 by 178 metres. The town hall stands in the middle, with tenements in bright colours and cafe gardens all around.',
    },
    'ostrow-tumski': {
      name: 'Ostrów Tumski',
      note: 'The oldest part of the city, once an island on the Oder. A lamplighter lights more than a hundred gas lamps by hand at dusk.',
    },
    'papa-krasnal': {
      name: 'Papa Krasnal',
      note: 'The first Wrocław dwarf, unveiled in 2001 on ul. Świdnicka. The city now has more than a thousand, so watch your feet.',
    },
    panorama: {
      name: 'Racławice Panorama',
      note: 'A painting 15 by 114 metres, made in 1893-1894 by Jan Styka and Wojciech Kossak. The rotunda at ul. Purkyniego 11 has stood since 1985.',
    },
  },
  tram: {
    name: 'Centennial Hall',
    note: 'Built in 1913 to a design by Max Berg, on the UNESCO list since 2006. The reinforced concrete dome is more than 65 metres across. It lies east of the centre, and you get there by tram.',
  },
  gettingHeading: 'Getting here',
  gettingLead:
    'How to reach us, where to leave the car and the luggage, and where to go next by tram.',
  getting: [
    {
      title: 'From the airport',
      text: 'Wrocław airport is about 10 km from the hotel. Bus 106 runs from there, and 206 at night. We can also send a car for PLN 140, tick it in the extras.',
    },
    {
      title: 'By car',
      text: `We have ${hotel.parkingSpaces} places in a closed car park on the next street, PLN 60 a night. You book a place together with the room.`,
    },
    {
      title: 'With luggage',
      text: 'The luggage room is free: leave your bags before check-in and after check-out.',
    },
  ],
  statusNote: 'Bus line numbers: as of October 2026.',
  closingHeading: 'A weekend plan?',
  closingText: 'See which keys still hang at reception on the dates you have in mind.',
  closingLink: 'Pick your dates',
};

export const neighbourhoodText: Record<Lang, NeighbourhoodText> = {
  pl: tieDeep(pl),
  en: tieDeep(en),
};
