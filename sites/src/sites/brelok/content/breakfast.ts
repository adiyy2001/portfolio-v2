import { hotel } from '../data/hotel';
import type { Lang } from '../i18n/lang';

const pl = {
  metaTitle: 'Śniadanie. Brelok 1912, hotel butikowy we Wrocławiu',
  metaDescription: `Śniadanie w hotelu Brelok podajemy codziennie od ${hotel.breakfastFrom} do ${hotel.breakfastTo} przy długim stole w dawnej sieni. ${hotel.breakfastPrice} zł od osoby, w dwóch pakietach wliczone.`,
  heading: 'Śniadanie przy długim stole',
  lead: 'Stół stoi w dawnej sieni kamienicy, tam gdzie kiedyś wjeżdżały wozy. Pachnie chlebem i kawą, a okno wychodzi na podwórko z kasztanem.',
  leaders: {
    hours: 'Godziny',
    price: 'Cena',
    place: 'Miejsce',
  },
  hoursValue: `${hotel.breakfastFrom} do ${hotel.breakfastTo}`,
  priceValue: `${hotel.breakfastPrice} zł od osoby`,
  placeValue: 'Dawna sień, parter',
  menuHeading: 'Co jest na stole',
  menu: [
    { dish: 'Pieczywo', note: 'chleb na zakwasie i bułki, pieczone rano w piekarni za rogiem' },
    { dish: 'Jajka', note: 'na miękko, na twardo albo jajecznica na maśle' },
    { dish: 'Sery i wędliny', note: 'kilka rodzajów, z domowym ogórkiem i musztardą' },
    { dish: 'Kasza jaglana', note: 'z duszonym jabłkiem i cynamonem' },
    { dish: 'Dżemy', note: 'domowe, ze śliwek i z czarnej porzeczki' },
    { dish: 'Kawa i herbata', note: 'bez ograniczeń, kawę parzymy w dzbankach' },
    { dish: 'Sok', note: 'wyciskany z pomarańczy po zamówieniu' },
  ],
  menuNote: 'Karta zmienia się z porami roku, ale chleb, jajka i kasza są zawsze.',
  roomHeading: 'Do pokoju',
  roomText:
    'W pokoju Poddasze stoi okrągły stolik przy oknie, a w Apartamencie stół w salonie. Śniadanie do pokoju podajemy w tych samych godzinach, jeśli zamówią je Państwo wieczorem w recepcji. Dopłaty nie ma.',
  dietHeading: 'Dla gości z wymaganiami',
  dietText:
    'Bez glutenu, bez laktozy, wegetariańsko albo bez jajek: prosimy o wzmiankę w uwagach do rezerwacji, a kuchnia przygotuje osobny talerz. Szczegóły ustalamy przy zameldowaniu.',
  includedHeading: 'W pakietach',
  includedText:
    'Śniadanie wliczamy w pakiety Weekend we dwoje i Tydzień w mieście. Do innych pobytów można je dodać w rezerwacji, osobno za każdą osobę i każdą dobę.',
  ctaPackages: 'Pakiety',
  ctaBooking: 'Rezerwacja ze śniadaniem',
};

const en: typeof pl = {
  metaTitle: 'Breakfast. Brelok 1912, boutique hotel in Wrocław',
  metaDescription: `Breakfast at Brelok is served every day from ${hotel.breakfastFrom} to ${hotel.breakfastTo} at the long table in the old entrance hall. PLN ${hotel.breakfastPrice} a person, included in two packages.`,
  heading: 'Breakfast at the long table',
  lead: 'The table stands in the old entrance hall of the townhouse, where wagons once drove in. It smells of bread and coffee, and the window looks onto the yard with the chestnut tree.',
  leaders: {
    hours: 'Hours',
    price: 'Price',
    place: 'Place',
  },
  hoursValue: `${hotel.breakfastFrom} to ${hotel.breakfastTo}`,
  priceValue: `PLN ${hotel.breakfastPrice} a person`,
  placeValue: 'Old entrance hall, ground floor',
  menuHeading: 'What is on the table',
  menu: [
    {
      dish: 'Bread',
      note: 'sourdough loaves and rolls, baked in the morning at the bakery round the corner',
    },
    { dish: 'Eggs', note: 'soft, hard or scrambled in butter' },
    { dish: 'Cheese and cold cuts', note: 'several kinds, with home pickled cucumber and mustard' },
    { dish: 'Millet porridge', note: 'with stewed apple and cinnamon' },
    { dish: 'Jams', note: 'made in the house, plum and blackcurrant' },
    { dish: 'Coffee and tea', note: 'as much as you like, the coffee brewed in pots' },
    { dish: 'Juice', note: 'squeezed from oranges to order' },
  ],
  menuNote: 'The menu changes with the seasons, but bread, eggs and porridge are always there.',
  roomHeading: 'To your room',
  roomText:
    'The Attic room has a round table by the window, and the Apartment has a table in the salon. We serve breakfast to the room at the same hours if you order it at reception the evening before. There is no extra charge.',
  dietHeading: 'For guests with requirements',
  dietText:
    'Gluten free, lactose free, vegetarian or egg free: please mention it in the notes to your booking, and the kitchen will prepare a separate plate. We settle the details at check-in.',
  includedHeading: 'In the packages',
  includedText:
    'Breakfast is included in the Weekend for two and A week in the city packages. For other stays you can add it in the booking, charged per person and per night.',
  ctaPackages: 'Packages',
  ctaBooking: 'Book with breakfast',
};

export const breakfastText: Record<Lang, typeof pl> = { pl, en };
