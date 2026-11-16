export interface Service {
  slug: string;
  name: string;
  scope: string;
  lead: string;
  price: number;
  priceNote: string;
  duration: string;
  hours: number;
  torque: { label: string; nm: number };
  torqueNote: string;
  includes: string[];
  separate?: string;
  prepare: string;
  image: string;
  alt: string;
  width: number;
  height: number;
}

export const services: Service[] = [
  {
    slug: 'przeglad',
    name: 'Przegląd',
    scope: 'Kontrola 40 punktów, płyny, światła i zawieszenie. Raport w karcie auta.',
    lead: 'Auto staje na podnośniku i przechodzimy po liście 40 punktów, od opon po akumulator. Na koniec dostajesz raport: co jest w porządku, co zrobić za pół roku, a co od razu.',
    price: 189,
    priceNote: 'za całe auto osobowe',
    duration: '2 godziny',
    hours: 2,
    torque: { label: 'Koła', nm: 110 },
    torqueNote: 'Po zdjęciu kół do oceny hamulców dokręcamy je kluczem do 110 Nm.',
    includes: [
      'Płyny: silnikowy, chłodzący, hamulcowy i do spryskiwaczy',
      'Światła, wycieraczki i klakson',
      'Zawieszenie, układ kierowniczy i luzy na przegubach',
      'Grubość klocków i tarcz oraz stan przewodów hamulcowych',
      'Bieżnik, ciśnienie i data produkcji opon',
      'Akumulator i ładowanie',
      'Raport zapisany w karcie auta',
    ],
    prepare: 'Zabierz książkę serwisową i klucz do śrub zabezpieczających koła, jeśli je masz.',
    image: 'diag',
    alt: 'Samochód uniesiony na podnośniku w warsztacie, obok kolumna z pompą hydrauliczną',
    width: 900,
    height: 674,
  },
  {
    slug: 'olej-i-filtry',
    name: 'Olej i filtry',
    scope: 'Wymiana oleju, filtra oleju i powietrza.',
    lead: 'Zlewamy stary olej, zmieniamy filtry i dolewamy olej o klasie z karty producenta. Korek odpływu dokręcamy do 35 Nm: słabszy cieknie, mocniejszy zrywa gwint w misce.',
    price: 249,
    priceNote: 'z olejem do pięciu litrów',
    duration: '1 godzina',
    hours: 1,
    torque: { label: 'Korek', nm: 35 },
    torqueNote: 'Korek odpływu i nowa uszczelka idą pod klucz nastawiony na 35 Nm.',
    includes: [
      'Olej silnikowy zgodny z normą producenta',
      'Nowy filtr oleju i nowa uszczelka korka',
      'Filtr powietrza',
      'Skasowanie przypomnienia serwisowego',
      'Wpis w książce serwisowej i w karcie auta',
    ],
    prepare: 'Jeśli auto ma przeróbki albo wymaga nietypowego oleju, napisz o tym przy zapisie.',
    image: 'engine-ht',
    alt: 'Dłoń z kluczem płaskim przy silniku',
    width: 900,
    height: 740,
  },
  {
    slug: 'hamulce',
    name: 'Hamulce',
    scope: 'Klocki i tarcze na jednej osi, odpowietrzenie, test na rolkach.',
    lead: 'Wymieniamy klocki i tarcze na jednej osi, czyścimy prowadnice zacisków i odpowietrzamy układ. Po robocie auto jedzie na rolki, gdzie mierzymy siłę hamowania na każdym kole.',
    price: 420,
    priceNote: 'za jedną oś',
    duration: '3 godziny',
    hours: 3,
    torque: { label: 'Zaciski', nm: 35 },
    torqueNote: 'Śruby zacisków dokręcamy do 35 Nm, a potem koła do 110 Nm.',
    includes: [
      'Klocki i tarcze na jednej osi',
      'Czyszczenie i smarowanie prowadnic zacisków',
      'Wymiana płynu hamulcowego i odpowietrzenie',
      'Pomiar siły hamowania na rolkach',
      'Dokręcenie zacisków i kół kluczem',
    ],
    prepare:
      'Jeśli auto ściąga przy hamowaniu albo piszczy, napisz o tym przy zapisie. Przyspieszy to diagnozę.',
    image: 'brakes',
    alt: 'Tarcza hamulcowa z zaciskiem przy kole',
    width: 900,
    height: 743,
  },
  {
    slug: 'opony',
    name: 'Opony',
    scope:
      'Zmiana kompletu, wyważanie i dokręcenie kół kluczem. Sezonowe przechowanie na zapytanie.',
    lead: 'Zmieniamy komplet kół, wyważamy go i dokręcamy kluczem do 110 Nm. Śruby idą po kolei, na krzyż, żeby tarcza siadła równo na piaście.',
    price: 140,
    priceNote: 'za komplet czterech kół',
    duration: '1 godzina',
    hours: 1,
    torque: { label: 'Koła', nm: 110 },
    torqueNote: 'Każda śruba koła idzie pod klucz nastawiony na 110 Nm.',
    includes: [
      'Zdjęcie i założenie kompletu kół',
      'Wyważenie czterech kół',
      'Kontrola ciśnienia i zaworów',
      'Dokręcenie kół kluczem do 110 Nm',
      'Przechowanie sezonowe na zapytanie, cenę podajemy przez telefon',
    ],
    prepare:
      'Przywieź koła z oponami, które chcesz założyć. Napisz, jeśli masz śruby zabezpieczające.',
    image: 'tyres',
    alt: 'Mechanik klęczy przy kole auta w hali',
    width: 1100,
    height: 479,
  },
  {
    slug: 'zawieszenie',
    name: 'Zawieszenie',
    scope:
      'Szukanie luzów i wymiana amortyzatorów na jednej osi. Tuleje, łączniki i zbieżność wyceniamy osobno.',
    lead: 'Najpierw szukamy luzu na podnośniku i wymieniamy amortyzatory na jednej osi. Jeśli luz robią też tuleje wahaczy, łączniki stabilizatora albo sprężyny, mówimy o tym przed pracą i wyceniamy je osobno.',
    price: 380,
    priceNote: 'za amortyzatory na jednej osi',
    duration: '1 dzień roboczy',
    hours: 8,
    torque: { label: 'Koła', nm: 110 },
    torqueNote: 'Śruby wahaczy dokręcamy, gdy koła stoją na ziemi, a koła do 110 Nm.',
    includes: [
      'Szukanie luzów na podnośniku',
      'Wymiana amortyzatorów na jednej osi',
      'Jazda próbna z opisem w karcie auta',
    ],
    separate:
      'Sprężyny, tuleje wahaczy, łączniki stabilizatora i ustawienie zbieżności wyceniamy osobno, po diagnozie i przed rozpoczęciem pracy.',
    prepare:
      'Opisz, kiedy stuka: na progach, na zakręcie czy przy ruszaniu. Wiemy wtedy, gdzie patrzeć najpierw.',
    image: 'suspension',
    alt: 'Kolumna zawieszenia ze sprężyną i amortyzatorem, zdjęta z auta',
    width: 900,
    height: 426,
  },
  {
    slug: 'silnik-i-zaplon',
    name: 'Silnik i zapłon',
    scope: 'Świece, cewki i przewody. Diagnostyka przy nierównej pracy silnika.',
    lead: 'Silnik szarpie, trudno odpala albo pali za dużo? Zaczynamy od zapłonu: świece, cewki i przewody. Świece wkręcamy ręką i dokręcamy kluczem do 25 Nm, bo aluminiowa głowica więcej nie wybaczy.',
    price: 280,
    priceNote: 'za komplet świec z diagnostyką',
    duration: 'do 1 dnia roboczego',
    hours: 8,
    torque: { label: 'Świece', nm: 25 },
    torqueNote: 'Gdy trzeba zdjąć głowicę, dokręcamy ją etapami, a pierwszy stopień to 90 Nm.',
    includes: [
      'Odczyt błędów i ocena pracy silnika',
      'Wymiana kompletu świec zapłonowych',
      'Sprawdzenie cewek i przewodów zapłonowych',
      'Kontrola szczelności i wycieków przy głowicy',
      'Opis usterek w karcie auta',
    ],
    prepare:
      'Zapisz, kiedy silnik pracuje nierówno: na zimno, na ciepło czy pod obciążeniem. To skraca diagnozę.',
    image: 'ignition',
    alt: 'Dłonie przy starym silniku, w kadrze gaźnik i przewody',
    width: 900,
    height: 1088,
  },
];

export const otherRepair = {
  slug: 'inna-naprawa',
  name: 'Inna naprawa',
  note: 'Wycena po diagnozie, przed rozpoczęciem pracy',
} as const;

export const findService = (slug: string): Service | undefined =>
  services.find(service => service.slug === slug);

export const priceRange = {
  min: Math.min(...services.map(service => service.price)),
  max: Math.max(...services.map(service => service.price)),
} as const;
