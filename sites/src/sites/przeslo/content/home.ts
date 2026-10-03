import type { Lang } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface HomeText {
  title: string;
  description: string;
  heroTitle: string;
  heroLead: string;
  pickerFallback: string;
  roomsHeading: string;
  roomsLead: string;
  roomsAll: string;
  roomPriceLabel: string;
  directHeading: string;
  directLead: string;
  perks: { title: string; text: string }[];
  breakfastHeading: string;
  breakfastText: string;
  breakfastFacts: string[];
  breakfastLink: string;
  areaHeading: string;
  areaLead: string;
  areaItems: { minutes: string; place: string; note: string }[];
  areaLink: string;
  closingHeading: string;
  closingText: string;
  closingPhone: string;
}

const pl: HomeText = {
  title: 'Przęsło, hotel nad Odrą we Wrocławiu: rezerwacja bezpośrednia',
  description:
    'Dwadzieścia cztery pokoje w odnowionej kamienicy przy ul. Grodzkiej we Wrocławiu. Wybierz dni, zobacz wolne klucze i zarezerwuj bez pośrednika.',
  heroTitle: 'Dwadzieścia cztery klucze nad Odrą.',
  heroLead:
    'Przęsło to hotel w odnowionej kamienicy z 1893 roku, przy Grodzkiej, tuż nad rzeką. Wybierz dni i zobacz, które klucze wiszą jeszcze w recepcji. Rezerwujesz u nas, bez portalu pośrodku.',
  pickerFallback: 'Kalendarz rezerwacji ładuje się. Możesz też zadzwonić do recepcji.',
  roomsHeading: 'Pięć rodzajów pokoi',
  roomsLead:
    'Od siedemnastu metrów na podwórzu po czterdzieści sześć pod dachem. Każdy rodzaj ma własną stronę z planem w skali i pełną listą wyposażenia.',
  roomsAll: 'Wszystkie pokoje i plany',
  roomPriceLabel: 'za noc, od',
  directHeading: 'Rezerwacja bezpośrednia',
  directLead:
    'Nie obiecujemy cudów. Dajemy kilka konkretnych rzeczy, które portal rezerwacyjny zabrałby albo policzył osobno.',
  perks: [
    {
      title: 'Niższa cena bez sztuczek',
      text: 'Taryfa bezzwrotna jest o 10 procent tańsza od elastycznej. Od pięciu nocy dostajesz 10 procent zniżki na nocleg, od ośmiu nocy 15 procent. Formularz liczy to sam i pokazuje w podsumowaniu.',
    },
    {
      title: 'Odwołasz bez opłaty',
      text: 'Rezerwację w taryfie elastycznej odwołasz za darmo do 48 godzin przed przyjazdem. Dodatki zmienisz sam na stronie Moja rezerwacja, termin zmienimy w recepcji.',
    },
    {
      title: 'Bagaż i łóżeczko bez dopłaty',
      text: 'Bagażownia przed zameldowaniem i po wymeldowaniu jest bezpłatna. Łóżeczko dla dziecka też, wystarczy zaznaczyć je w rezerwacji.',
    },
    {
      title: 'Numer pokoju od razu',
      text: 'W potwierdzeniu widzisz numer klucza, nie tylko nazwę rodzaju pokoju. Do recepcji dzwonisz bezpośrednio i odbiera osoba, która zna dom.',
    },
  ],
  breakfastHeading: 'Śniadanie przy dużym stole',
  breakfastText:
    'Śniadanie jest w sali na parterze, przy jednym długim stole. Chleb z piekarni z sąsiedniej ulicy, jajka na ciepło, sery, wędliny, owsianka, owoce i kawa z ekspresu ciśnieniowego.',
  breakfastFacts: [
    `Pon-pt ${hotel.breakfastWeekdayFrom}-${hotel.breakfastWeekdayTo}`,
    `Sob-nd ${hotel.breakfastWeekendFrom}-${hotel.breakfastWeekendTo}`,
    '55 zł od osoby za dobę',
  ],
  breakfastLink: 'Co jest na stole',
  areaHeading: 'Na piechotę z Grodzkiej',
  areaLead:
    'Dom stoi przy ulicy biegnącej wzdłuż południowego ramienia Odry. Starówka i Ostrów Tumski są po sąsiedzku, więc samochód zostaje na parkingu.',
  areaItems: [
    {
      minutes: '5 min',
      place: 'Hala Targowa',
      note: 'Hala z 1908 roku, łuki o rozpiętości ponad 20 metrów',
    },
    { minutes: '8 min', place: 'Rynek', note: 'Plac o wymiarach 213 na 178 metrów' },
    { minutes: '10 min', place: 'Ostrów Tumski', note: 'Gazowe latarnie zapalane ręcznie' },
    { minutes: '20 min', place: 'Panorama Racławicka', note: 'Rotunda przy ul. Purkyniego' },
  ],
  areaLink: 'Spacer po okolicy',
  closingHeading: 'Wolisz zapytać?',
  closingText: `Recepcja jest czynna od ${hotel.receptionOpens} do ${hotel.receptionCloses}. Zadzwoń albo napisz, a odpowiemy tego samego dnia.`,
  closingPhone: 'Zadzwoń do recepcji',
};

const en: HomeText = {
  title: 'Przęsło, a hotel by the Oder in Wrocław: book direct',
  description:
    'Twenty-four rooms in a restored tenement on ul. Grodzka in Wrocław. Pick your dates, see which keys are still free and book without a middleman.',
  heroTitle: 'Twenty-four keys by the Oder.',
  heroLead:
    'Przęsło is a hotel in a restored tenement from 1893, on Grodzka street, right by the river. Pick your dates and see which keys still hang at reception. You book with us, with no portal in between.',
  pickerFallback: 'The booking calendar is loading. You can also call reception.',
  roomsHeading: 'Five kinds of room',
  roomsLead:
    'From seventeen square metres on the courtyard to forty-six under the roof. Each kind has its own page with a scale floor plan and the full list of what is in the room.',
  roomsAll: 'All rooms and floor plans',
  roomPriceLabel: 'per night, from',
  directHeading: 'Booking direct',
  directLead:
    'We do not promise miracles. We give a few concrete things that a booking portal would take away or charge for separately.',
  perks: [
    {
      title: 'A lower price, no tricks',
      text: 'The non-refundable rate is 10 percent cheaper than the flexible one. From five nights you get 10 percent off the room, from eight nights 15 percent. The form works it out and shows it in the summary.',
    },
    {
      title: 'Cancel for free',
      text: 'A flexible booking can be cancelled for free until 48 hours before arrival. You change extras yourself on the My booking page, and we change dates at reception.',
    },
    {
      title: 'Luggage room and cot at no charge',
      text: 'The luggage room before check-in and after check-out is free. So is a cot for a child, just tick it in the booking.',
    },
    {
      title: 'Your room number at once',
      text: 'The confirmation shows your key number, not only the name of the room type. You call reception directly, and the person who answers knows the house.',
    },
  ],
  breakfastHeading: 'Breakfast at the long table',
  breakfastText:
    'Breakfast is served in the ground floor room, at one long table. Bread from a bakery on the next street, soft-boiled eggs, cheese, cold cuts, porridge, fruit and coffee from a pressure machine.',
  breakfastFacts: [
    `Mon-Fri ${hotel.breakfastWeekdayFrom}-${hotel.breakfastWeekdayTo}`,
    `Sat-Sun ${hotel.breakfastWeekendFrom}-${hotel.breakfastWeekendTo}`,
    'PLN 55 per person per day',
  ],
  breakfastLink: 'What is on the table',
  areaHeading: 'On foot from Grodzka',
  areaLead:
    'The house stands on a street that runs along the southern arm of the Oder. The Old Town and Ostrów Tumski are next door, so the car stays in the car park.',
  areaItems: [
    {
      minutes: '5 min',
      place: 'Hala Targowa',
      note: 'A market hall from 1908 with arches over 20 metres wide',
    },
    { minutes: '8 min', place: 'The Market Square', note: 'A square of 213 by 178 metres' },
    { minutes: '10 min', place: 'Ostrów Tumski', note: 'Gas lamps lit by hand' },
    { minutes: '20 min', place: 'Racławice Panorama', note: 'The rotunda on ul. Purkyniego' },
  ],
  areaLink: 'A walk around the area',
  closingHeading: 'Rather ask?',
  closingText: `Reception is open from ${hotel.receptionOpens} to ${hotel.receptionCloses}. Call or write, and we answer the same day.`,
  closingPhone: 'Call reception',
};

export const home: Record<Lang, HomeText> = { pl: tieDeep(pl), en: tieDeep(en) };
