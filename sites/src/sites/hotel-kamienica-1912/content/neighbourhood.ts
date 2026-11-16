import { hotel, places } from '../data/hotel';
import type { PlaceId } from '../data/hotel';
import { minutesLabel } from '../lib/format';
import type { Lang } from '../i18n/lang';

interface PlaceCopy {
  name: string;
  note: string;
}

const saltMinutes = places.find(item => item.id === 'salt')?.minutes ?? 0;

const pl = {
  metaTitle: 'Okolica. Hotel Kamienica 1912, Wrocław',
  metaDescription: `Co leży blisko hotelu: Rynek ${minutesLabel(hotel.minutesToSquare, 'pl')} pieszo, plac Solny, Opera, Hala Targowa, Uniwersytet i Ostrów Tumski. Dojazd tramwajem i samochodem.`,
  heading: 'Okolica pieszo od bramy',
  lead: `Kamienica stoi ${minutesLabel(hotel.minutesToSquare, 'pl')} od Rynku, więc większość miasta załatwia się na własnych nogach. Poniżej miejsca, do których chodzą nasi goście, od najbliższego.`,
  mapLabel: `Schemat trasy z hotelu na Rynek, ${minutesLabel(hotel.minutesToSquare, 'pl')} pieszo`,
  mapCaption: `Trasa pieszo na Rynek, ${minutesLabel(hotel.minutesToSquare, 'pl')}`,
  market: 'Rynek',
  walksHeading: 'Pieszo z hotelu',
  minutesUnit: 'min',
  minutesSpoken: (count: number) => `${minutesLabel(count, 'pl')} pieszo`,
  transportHeading: 'Tramwajem i samochodem',
  transport: [
    'Tramwaj zatrzymuje się pod bramą kamienicy. Z dworca kolejowego dojedzie się nim albo taksówką.',
    `Samochód można zostawić w garażu przy placu Solnym, ${minutesLabel(saltMinutes, 'pl')} od hotelu. Miejsce w garażu wlicza pakiet Weekend we dwoje, w innych pobytach można je zamówić w recepcji.`,
    'Z lotniska jedzie się taksówką albo autobusem i tramwajem. Przy rezerwacji można zostawić uwagę, a recepcja podpowie dojazd.',
  ],
  ctaContact: 'Kontakt i dojazd',
  ctaRooms: 'Pokoje',
  places: {
    opera: { name: 'Opera', note: 'Wieczorem oświetlony budynek stoi niemal za rogiem.' },
    salt: {
      name: 'Plac Solny',
      note: 'Kwiaciarnie czynne prawie całą dobę, a obok garaż, w którym można zostawić samochód.',
    },
    square: {
      name: 'Rynek',
      note: 'Ratusz, kamienice i kawiarnie. Najkrótsza droga prowadzi przez plac Solny.',
    },
    hall: { name: 'Hala Targowa', note: 'Rano pachnie tu pieczywem, a w południe wędlinami.' },
    university: {
      name: 'Uniwersytet',
      note: 'Barokowy gmach nad Odrą, z salą, do której zaglądają turyści.',
    },
    forum: {
      name: 'Forum Muzyki',
      note: 'Sala koncertowa na wieczór, jeśli wolą Państwo muzykę od spacerów.',
    },
    panorama: {
      name: 'Panorama Racławicka',
      note: 'Wielki obraz w okrągłym budynku. Bilety najlepiej kupić z wyprzedzeniem.',
    },
    cathedral: {
      name: 'Katedra na Ostrowie Tumskim',
      note: 'Najdalszy punkt, za to z mostami i gazowymi latarniami po drodze.',
    },
  } satisfies Record<PlaceId, PlaceCopy>,
};

const en: typeof pl = {
  metaTitle: 'Neighbourhood. Hotel Kamienica 1912, Wrocław',
  metaDescription: `What is close to the hotel: the Market Square ${minutesLabel(hotel.minutesToSquare, 'en')} on foot, Plac Solny, the Opera, the Market Hall, the University and Ostrów Tumski. How to arrive by tram and car.`,
  heading: 'The neighbourhood on foot',
  lead: `The house stands ${minutesLabel(hotel.minutesToSquare, 'en')} from the Market Square, so you can do most of the city on your own feet. Below are the places our guests walk to, starting with the nearest.`,
  mapLabel: `Route map from the hotel to the Market Square, ${minutesLabel(hotel.minutesToSquare, 'en')} on foot`,
  mapCaption: `Walking route to the Market Square, ${minutesLabel(hotel.minutesToSquare, 'en')}`,
  market: 'Market Square',
  walksHeading: 'On foot from the hotel',
  minutesUnit: 'min',
  minutesSpoken: (count: number) => `${minutesLabel(count, 'en')} on foot`,
  transportHeading: 'By tram and by car',
  transport: [
    'The tram stops at the gate of the house. From the railway station you can take it or a taxi.',
    `You can leave a car in the garage by Plac Solny, ${minutesLabel(saltMinutes, 'en')} from the hotel. The Weekend for two package includes a place in the garage, and for other stays you can book one at reception.`,
    'From the airport you can take a taxi, or a bus and a tram. Leave a note with your booking and reception will suggest the way.',
  ],
  ctaContact: 'Contact and directions',
  ctaRooms: 'Rooms',
  places: {
    opera: {
      name: 'The Opera',
      note: 'In the evening the lit building stands almost round the corner.',
    },
    salt: {
      name: 'Plac Solny',
      note: 'Flower stalls open almost around the clock, and next to them the garage where you can leave a car.',
    },
    square: {
      name: 'The Market Square',
      note: 'The town hall, the townhouses and the cafés. The shortest way leads through Plac Solny.',
    },
    hall: {
      name: 'The Market Hall',
      note: 'In the morning it smells of bread, and at noon of cured meats.',
    },
    university: {
      name: 'The University',
      note: 'A baroque building on the Oder, with a hall that visitors look into.',
    },
    forum: {
      name: 'The Music Forum',
      note: 'A concert hall for the evening, if you prefer music to walking.',
    },
    panorama: {
      name: 'The Racławice Panorama',
      note: 'A vast painting in a round building. It is best to buy tickets in advance.',
    },
    cathedral: {
      name: 'The cathedral on Ostrów Tumski',
      note: 'The farthest point, but with bridges and gas lamps on the way.',
    },
  },
};

export const neighbourhoodText: Record<Lang, typeof pl> = { pl, en };

export const sortedPlaces = [...places].sort((a, b) => a.minutes - b.minutes);
