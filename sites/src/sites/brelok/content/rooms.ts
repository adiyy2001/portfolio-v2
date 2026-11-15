import type { RoomId } from '../data/hotel';
import type { Lang } from '../i18n/lang';

interface RoomCopy {
  name: string;
  card: string;
  view: string;
  alt: string;
  bed: (width: number) => string;
  intro: string;
  paragraphs: string[];
  features: string[];
  metaTitle: string;
  metaDescription: string;
}

const pl: Record<RoomId, RoomCopy> = {
  cichy: {
    name: 'Cichy',
    card: 'Okna na oficynę, grube mury i łóżko na 160 cm. Do spania bez budzika.',
    view: 'Oficyna, cisza',
    alt: 'Pokój Cichy: drewniane łóżko, lampa podłogowa i biurko pod jasną ścianą',
    bed: width => `Jedno łóżko, ${width} cm`,
    intro: 'Cztery pokoje od strony oficyny, z murami grubymi na pół metra.',
    paragraphs: [
      'Okna wychodzą na zamknięte podwórko, więc z ulicy nie dochodzi tu nic. Rano słychać gołębie, po deszczu rynnę.',
      'Przy łóżku stoi lampa, przy oknie fotel, a pod ścianą biurko z lampką do pracy wieczorem. Łazienka z prysznicem ma kafle z lat dwudziestych, które przetrwały remont.',
    ],
    features: ['Prysznic', 'Biurko z lampką', 'Fotel przy oknie', 'Okna na oficynę'],
    metaTitle: 'Pokój Cichy. Brelok 1912, hotel butikowy we Wrocławiu',
    metaDescription:
      'Pokój Cichy w hotelu Brelok: 18 m², łóżko 160 cm, okna na oficynę i grube mury. Doba 410 zł, pokoje 1 do 4.',
  },
  dziedziniec: {
    name: 'Dziedziniec',
    card: 'Widok na kasztan w podwórku i poranne światło od wschodu.',
    view: 'Kasztan w podwórku',
    alt: 'Pokój Dziedziniec: dwa łóżka pod wezgłowiem z jasnego drewna i firanka w oknie',
    bed: width => `Dwa łóżka, po ${width} cm`,
    intro: 'Pięć pokoi od podwórka, z kasztanem pod oknami.',
    paragraphs: [
      'Rano słońce wchodzi tu pierwsze, bo okna patrzą na wschód. Wieczorem w kasztanie pali się lampion, który powiesiła pani Halina z recepcji.',
      'Dwa łóżka można przysunąć do siebie albo zostawić osobno. W pokoju jest stolik, dwa krzesła i szafa z prawdziwymi wieszakami, nie hakami przy drzwiach.',
    ],
    features: ['Dwa łóżka, do złączenia', 'Prysznic', 'Stolik i dwa krzesła', 'Okna na wschód'],
    metaTitle: 'Pokój Dziedziniec. Brelok 1912, hotel butikowy we Wrocławiu',
    metaDescription:
      'Pokój Dziedziniec w hotelu Brelok: 24 m², dwa łóżka, widok na kasztan i poranne słońce. Doba 430 zł, pokoje 5 do 9.',
  },
  poddasze: {
    name: 'Poddasze',
    card: 'Najwyżej w kamienicy, z ciężką zasłoną w oknie i stolikiem do śniadania.',
    view: 'Okno z ciężką zasłoną',
    alt: 'Pokój Poddasze: łóżko, okrągły stolik z krzesłami i ciężka zasłona w oknie',
    bed: width => `Łóżko ${width} cm i rozkładana sofa`,
    intro: 'Cztery pokoje pod dachem, z skosami i ciężką zasłoną w oknie.',
    paragraphs: [
      'Skosy sprawiają, że przy ścianie trzeba uważać na głowę, ale środek pokoju jest wysoki i widny. Ciężka zasłona zamyka okno do końca, więc można spać do południa.',
      'Przy oknie stoi okrągły stolik. Jeśli zamówią Państwo śniadanie do pokoju, podamy je właśnie tam. Sofa rozkłada się dla trzeciej osoby.',
    ],
    features: ['Łóżko i rozkładana sofa', 'Prysznic', 'Okrągły stolik', 'Ciężka zasłona'],
    metaTitle: 'Pokój Poddasze. Brelok 1912, hotel butikowy we Wrocławiu',
    metaDescription:
      'Pokój Poddasze w hotelu Brelok: 28 m² pod dachem, łóżko 160 cm i sofa dla trzeciej osoby. Doba 520 zł, pokoje 10, 11, 12 i 14.',
  },
  apartament: {
    name: 'Apartament',
    card: 'Dwa pokoje, wysokie okna i widok na wieże kościołów.',
    view: 'Wieże kościołów',
    alt: 'Pokój Apartament: sala z dwoma wysokimi oknami, żyrandolem i łóżkiem w głębi',
    bed: width => `Łóżko ${width} cm i sofa w salonie`,
    intro: 'Jedyny taki w kamienicy: salon i sypialnia, razem 75 metrów.',
    paragraphs: [
      'Salon ma dwa wysokie okna, żyrandol i stół, przy którym zmieści się cztery osoby. Z okien widać wieże kościołów, a po południu na ścianie leży światło odbite od dachów.',
      'Sypialnia jest osobno, za drzwiami z szybą. Sofa w salonie rozkłada się dla trzeciej osoby, a dla czwartej jest dostawka.',
    ],
    features: ['Salon i sypialnia', 'Łazienka z wanną', 'Stół na cztery osoby', 'Dwa wysokie okna'],
    metaTitle: 'Apartament. Brelok 1912, hotel butikowy we Wrocławiu',
    metaDescription:
      'Apartament w hotelu Brelok: 75 m², salon i sypialnia, łóżko 180 cm i widok na wieże kościołów. Doba 740 zł, pokój 15.',
  },
};

const en: Record<RoomId, RoomCopy> = {
  cichy: {
    name: 'Quiet',
    card: 'Windows onto the back wing, thick walls and a 160 cm bed. Made for sleeping without an alarm.',
    view: 'Back wing, silence',
    alt: 'The Quiet room: a wooden bed, a floor lamp and a desk against a pale wall',
    bed: width => `One bed, ${width} cm`,
    intro: 'Four rooms on the back wing, behind walls half a metre thick.',
    paragraphs: [
      'The windows face an enclosed yard, so nothing reaches you from the street. In the morning you hear pigeons, and after rain the gutter.',
      'There is a lamp by the bed, an armchair by the window and a desk with a reading light for the evening. The shower room keeps its tiles from the 1920s, which survived the renovation.',
    ],
    features: ['Shower', 'Desk with a reading light', 'Armchair by the window', 'Windows onto the back wing'],
    metaTitle: 'The Quiet room. Brelok 1912, boutique hotel in Wrocław',
    metaDescription:
      'The Quiet room at Brelok: 18 m², a 160 cm bed, windows onto the back wing and thick walls. PLN 410 a night, rooms 1 to 4.',
  },
  dziedziniec: {
    name: 'Courtyard',
    card: 'A view of the chestnut tree in the yard and early light from the east.',
    view: 'Chestnut in the yard',
    alt: 'The Courtyard room: two beds under a pale wooden headboard and a net curtain at the window',
    bed: width => `Two beds, ${width} cm each`,
    intro: 'Five rooms on the yard side, with a chestnut tree under the windows.',
    paragraphs: [
      'The sun reaches these rooms first, because the windows face east. In the evening a lantern burns in the chestnut tree, hung there by Halina from reception.',
      'The two beds can be pushed together or left apart. The room has a small table, two chairs and a wardrobe with real hangers instead of hooks by the door.',
    ],
    features: ['Two beds, can be joined', 'Shower', 'Table and two chairs', 'East-facing windows'],
    metaTitle: 'The Courtyard room. Brelok 1912, boutique hotel in Wrocław',
    metaDescription:
      'The Courtyard room at Brelok: 24 m², two beds, a view of the chestnut tree and morning sun. PLN 430 a night, rooms 5 to 9.',
  },
  poddasze: {
    name: 'Attic',
    card: 'The highest rooms in the house, with a heavy curtain at the window and a table for breakfast.',
    view: 'Window with a heavy curtain',
    alt: 'The Attic room: a bed, a round table with chairs and a heavy curtain at the window',
    bed: width => `A ${width} cm bed and a sofa bed`,
    intro: 'Four rooms under the roof, with sloping ceilings and a heavy curtain at the window.',
    paragraphs: [
      'The slopes mean you mind your head by the wall, but the middle of the room is tall and bright. The heavy curtain closes the window completely, so sleeping until noon is possible.',
      'A round table stands by the window. If you order breakfast to the room, we serve it there. The sofa opens into a bed for a third guest.',
    ],
    features: ['Bed and sofa bed', 'Shower', 'Round table', 'Heavy curtain'],
    metaTitle: 'The Attic room. Brelok 1912, boutique hotel in Wrocław',
    metaDescription:
      'The Attic room at Brelok: 28 m² under the roof, a 160 cm bed and a sofa bed for a third guest. PLN 520 a night, rooms 10, 11, 12 and 14.',
  },
  apartament: {
    name: 'Apartment',
    card: 'Two rooms, tall windows and a view of the church towers.',
    view: 'Church towers',
    alt: 'The Apartment: a drawing room with two tall windows, a chandelier and a bed in the far corner',
    bed: width => `A ${width} cm bed and a sofa bed in the sitting room`,
    intro: 'The only one of its kind in the house: a sitting room and a bedroom, 75 square metres together.',
    paragraphs: [
      'The sitting room has two tall windows, a chandelier and a table that seats four. You can see the church towers from the windows, and in the afternoon light bounced off the roofs lies on the wall.',
      'The bedroom is separate, behind a glazed door. The sofa in the sitting room opens into a bed for a third guest, and a fourth can have an extra bed.',
    ],
    features: ['Sitting room and bedroom', 'Bathroom with a bath', 'Table for four', 'Two tall windows'],
    metaTitle: 'The Apartment. Brelok 1912, boutique hotel in Wrocław',
    metaDescription:
      'The Apartment at Brelok: 75 m², a sitting room and a bedroom, a 180 cm bed and a view of the church towers. PLN 740 a night, room 15.',
  },
};

export const roomCopy: Record<Lang, Record<RoomId, RoomCopy>> = { pl, en };

const listPl = {
  metaTitle: 'Pokoje. Brelok 1912, hotel butikowy we Wrocławiu',
  metaDescription:
    'Cztery rodzaje pokoi w kamienicy z 1912 roku: Cichy, Dziedziniec, Poddasze i Apartament. Czternaście pokoi, numery od 1 do 15 bez trzynastki.',
  heading: 'Prosimy wybrać pokój',
  lead: 'Pokoje są czterech rodzajów. Każdy ma swój numer na tabliczce, a zdjęcie pokazuje jeden pokój danego rodzaju.',
  numbering:
    'W kamienicy jest czternaście pokoi, ponumerowanych od 1 do 15. Numeru 13 nie ma: po dwunastce od razu zaczyna się czternastka, jak w wielu starych hotelach. Dlatego pokoi jest czternaście, choć ostatni ma numer piętnasty.',
  leaders: {
    numbers: 'Numery pokoi',
    area: 'Metraż',
    bed: 'Łóżko',
    guests: 'Osoby',
    rate: 'Doba',
    view: 'Widok',
    floorCount: 'Liczba pokoi',
  },
  details: 'Zobacz pokój',
  book: 'Zarezerwuj ten pokój',
  allRooms: 'Wszystkie pokoje',
  otherRooms: 'Pozostałe pokoje',
  includedHeading: 'W pokoju',
  includedBreakfast: 'Śniadanie nie jest wliczone w cenę doby. Można je dokupić przy rezerwacji albo wybrać pakiet, który je zawiera.',
  photoNote: 'Zdjęcie poglądowe: pokazuje ten rodzaj pokoju, nie konkretny numer.',
  roomHeading: (name: string) => `Pokój ${name}`,
  numbersSentence: (list: string) => `Numery pokoi: ${list}.`,
};

const listEn: typeof listPl = {
  metaTitle: 'Rooms. Brelok 1912, boutique hotel in Wrocław',
  metaDescription:
    'Four kinds of rooms in a 1912 townhouse: Quiet, Courtyard, Attic and Apartment. Fourteen rooms, numbered 1 to 15 with no thirteen.',
  heading: 'Please choose a room',
  lead: 'There are four kinds of rooms. Each has its number on a plate, and the photo shows one room of that kind.',
  numbering:
    'The house has fourteen rooms, numbered from 1 to 15. There is no number 13: after twelve comes fourteen, as in many old hotels. That is why there are fourteen rooms although the last one is numbered fifteen.',
  leaders: {
    numbers: 'Room numbers',
    area: 'Size',
    bed: 'Bed',
    guests: 'Guests',
    rate: 'Per night',
    view: 'View',
    floorCount: 'Rooms of this kind',
  },
  details: 'See the room',
  book: 'Book this room',
  allRooms: 'All rooms',
  otherRooms: 'The other rooms',
  includedHeading: 'In the room',
  includedBreakfast: 'Breakfast is not included in the nightly rate. You can add it when you book, or choose a package that includes it.',
  photoNote: 'Illustrative photo: it shows this kind of room, not a particular number.',
  roomHeading: (name: string) => (name === 'Apartment' ? 'The Apartment' : `The ${name} room`),
  numbersSentence: (list: string) => `Room numbers: ${list}.`,
};

export const roomsText: Record<Lang, typeof listPl> = { pl: listPl, en: listEn };
