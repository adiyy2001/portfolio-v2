import { hotel, packageById, packages, roomTypeById } from '../data/hotel';
import type { PackageId, StayPackage } from '../data/hotel';
import type { Lang } from '../i18n/lang';
import { formatMoney, guestsGenitive, guestsLabel, nightsLabel } from '../lib/format';

interface PackageCopy {
  name: string;
  tagline: string;
  text: string;
  includes: string[];
}

const pl: Record<PackageId, PackageCopy> = {
  weekend: {
    name: 'Weekend we dwoje',
    tagline: 'Dwie doby i dwa śniadania przy długim stole.',
    text: 'Dla dwojga na dwie noce. Pakiet kosztuje tyle, co śniadania dla dwóch osób przez dwa poranki. Miejsce w garażu przy placu Solnym i butelkę wina dokładamy.',
    includes: [
      'Śniadanie dla dwóch osób w obie doby',
      'Miejsce w garażu przy placu Solnym',
      'Butelka wina w pokoju na powitanie',
    ],
  },
  evening: {
    name: 'Wieczór w salonie',
    tagline: 'Kolacja przy stole w salonie na parterze.',
    text: 'Raz w czasie pobytu, o godzinie dziewiętnastej, nakrywamy w salonie stół dla całej grupy. Pakiet można dodać do pobytu od jednej doby do tygodnia, dla najwyżej czterech osób.',
    includes: [
      'Deska serów i wędlin z pieczywem',
      'Butelka wina albo dzbanek soku',
      'Stół w salonie na parterze o 19:00',
    ],
  },
  week: {
    name: 'Tydzień w mieście',
    tagline: 'Od pięciu do siedmiu dób, śniadanie każdego ranka.',
    text: 'Dla tych, którzy wolą poznawać miasto powoli. Śniadanie dla dwóch osób czeka każdego ranka, a rzeczy do prania wracają w ciągu doby. Pakiet kosztuje mniej niż osobne śniadania za cały pobyt.',
    includes: [
      'Śniadanie dla dwóch osób każdego ranka',
      'Jeden kosz prania, zwrot w ciągu doby',
      'Mapa spacerów z zaznaczonymi kawiarniami',
    ],
  },
};

const en: typeof pl = {
  weekend: {
    name: 'Weekend for two',
    tagline: 'Two nights and two breakfasts at the long table.',
    text: 'For two people, for two nights. The package costs the same as breakfast for two on both mornings. The parking place in the Plac Solny garage and a bottle of wine are on us.',
    includes: [
      'Breakfast for two on both mornings',
      'A parking place in the Plac Solny garage',
      'A bottle of wine in the room on arrival',
    ],
  },
  evening: {
    name: 'An evening in the salon',
    tagline: 'Supper at the table in the ground floor salon.',
    text: 'Once during the stay, at seven in the evening, we lay the salon table for your whole group. You can add the package to a stay of one night up to a week, for up to four people.',
    includes: [
      'A board of cheese and cold cuts with bread',
      'A bottle of wine or a jug of juice',
      'A table in the ground floor salon at 19:00',
    ],
  },
  week: {
    name: 'A week in the city',
    tagline: 'Five to seven nights, breakfast every morning.',
    text: 'For those who prefer to see the city slowly. Breakfast for two waits every morning, and your laundry comes back within a day. The package costs less than buying the breakfasts separately for the whole stay.',
    includes: [
      'Breakfast for two every morning',
      'One bag of laundry, returned within a day',
      'A walking map with cafés marked',
    ],
  },
};

export const packageCopy: Record<Lang, Record<PackageId, PackageCopy>> = { pl, en };

const nightsRange = (item: StayPackage, lang: Lang): string => {
  if (item.minNights === item.maxNights) return nightsLabel(item.minNights, lang);
  return lang === 'pl'
    ? `od ${item.minNights} do ${item.maxNights} dób`
    : `${item.minNights} to ${item.maxNights} nights`;
};

export const packageRule = (item: StayPackage, lang: Lang): string =>
  lang === 'pl'
    ? `${nightsRange(item, lang)}, do ${guestsGenitive(item.maxGuests, lang)}`
    : `${nightsRange(item, lang)}, up to ${guestsLabel(item.maxGuests, lang)}`;

const exampleRoom = roomTypeById('dziedziniec').rate * 2;
const weekendPrice = packageById('weekend').price;
const lowestPrice = Math.min(...packages.map(item => item.price));

const plText = {
  metaTitle: 'Pakiety. Hotel Kamienica 1912, Wrocław',
  metaDescription: `Trzy pakiety do pobytu w hotelu: Weekend we dwoje, Wieczór w salonie i Tydzień w mieście. Ceny od ${formatMoney(lowestPrice, 'pl')}, śniadania w dwóch z nich.`,
  heading: 'Pakiety do pobytu',
  lead: 'Pakiet dokłada się do ceny pokoju. Można wybrać go przy rezerwacji, a rezerwacja sama pilnuje, czy liczba dób i osób się zgadza.',
  priceUnit: 'za pakiet',
  leaders: { stay: 'Pobyt', breakfast: 'Śniadanie', price: 'Cena pakietu' },
  breakfastIncluded: 'wliczone',
  breakfastNot: `osobno, ${hotel.breakfastPrice} zł od osoby`,
  book: 'Zarezerwuj z pakietem',
  howHeading: 'Jak liczymy',
  how: [
    `Cena pakietu jest stała i dochodzi do ceny pokoju za wszystkie doby. Pokój Dziedziniec na dwie doby z pakietem Weekend we dwoje kosztuje więc ${formatMoney(exampleRoom, 'pl')} za pokój i ${formatMoney(weekendPrice, 'pl')} za pakiet.`,
    'Gdy pakiet zawiera śniadanie, nie liczymy go drugi raz. Pakiet Wieczór w salonie śniadania nie obejmuje, a można je dokupić osobno.',
    'Pakietów nie łączymy ze sobą. Jeden pobyt ma jeden pakiet.',
  ],
  ctaBreakfast: 'Co jest na śniadanie',
  ctaBooking: 'Rezerwacja',
};

const enText: typeof plText = {
  metaTitle: 'Packages. Hotel Kamienica 1912, Wrocław',
  metaDescription: `Three packages for a stay at the hotel: Weekend for two, An evening in the salon and A week in the city. Prices from ${formatMoney(lowestPrice, 'en')}, breakfast in two of them.`,
  heading: 'Packages for your stay',
  lead: 'A package is added to the price of the room. You can choose it when you book, and the booking itself checks that the number of nights and guests fits.',
  priceUnit: 'per package',
  leaders: { stay: 'Stay', breakfast: 'Breakfast', price: 'Package price' },
  breakfastIncluded: 'included',
  breakfastNot: `separately, PLN ${hotel.breakfastPrice} a person`,
  book: 'Book with this package',
  howHeading: 'How we count',
  how: [
    `The package price is fixed and comes on top of the room price for all the nights. A Courtyard room for two nights with the Weekend for two package costs ${formatMoney(exampleRoom, 'en')} for the room and ${formatMoney(weekendPrice, 'en')} for the package.`,
    'When a package includes breakfast, we do not count it a second time. An evening in the salon does not include breakfast, which you can add separately.',
    'Packages cannot be combined. One stay has one package.',
  ],
  ctaBreakfast: 'What is for breakfast',
  ctaBooking: 'Booking',
};

export const packagesText: Record<Lang, typeof plText> = { pl: plText, en: enText };

export const packagePriceLine = (item: StayPackage, lang: Lang): string =>
  formatMoney(item.price, lang);

export const breakfastPriceLine = (lang: Lang): string =>
  lang === 'pl' ? `${hotel.breakfastPrice} zł od osoby` : `PLN ${hotel.breakfastPrice} a person`;
