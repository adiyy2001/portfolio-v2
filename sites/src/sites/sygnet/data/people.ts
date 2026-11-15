export interface Person {
  slug: string;
  name: string;
  monogram: string;
  title: string;
  role: string;
  since: number;
  chamber: string;
  areaSlugs: string[];
  languages: string;
  phone: { display: string; href: string };
  email: string;
  short: string;
  bio: string[];
  workingStyle: string[];
}

export const people: Person[] = [
  {
    slug: 'anna-wierzbicka',
    name: 'Anna Wierzbicka',
    monogram: 'AW',
    title: 'radca prawny',
    role: 'Radca prawny, sprawy rodzinne i spadkowe',
    since: 2012,
    chamber: 'Okręgowa Izba Radców Prawnych we Wrocławiu, wpis WR-1204',
    areaSlugs: ['rodzina', 'spadki'],
    languages: 'polski, angielski',
    phone: { display: '+48 71 555 01 59', href: 'tel:+48715550159' },
    email: 'anna.wierzbicka@sygnet.example',
    short: 'Prowadzi sprawy rodzinne i spadkowe od 2012 roku. Najpierw słucha, potem pisze pisma.',
    bio: [
      'Do Sygnetu dołączyła w 2012 roku i od początku prowadzi tu sprawy rodzinne i spadkowe. Zajmuje się rozwodami, alimentami, kontaktami z dzieckiem, podziałem majątku, potwierdzaniem dziedziczenia i roszczeniami o zachowek.',
      'Pierwszą rozmowę zaczyna od pytań, a dopiero potem od przepisów. Chce wiedzieć, kto z kim mieszka, co jest w mieszkaniu i kto czego się obawia, bo od tego zależy, czy sprawę da się zamknąć ugodą. Jeśli da się bez sądu, mówi o tym na pierwszym spotkaniu.',
    ],
    workingStyle: [
      'Pisma do sądu pisze krótko, z numerowanymi twierdzeniami, żeby klient mógł sprawdzić każde z nich.',
      'Po każdej rozprawie wysyła wiadomość z tym, co się stało i co jest następne.',
      'W sprawach rodzinnych odbiera telefon także wtedy, gdy rozmowa ma trwać pięć minut.',
    ],
  },
  {
    slug: 'marek-zawada',
    name: 'Marek Zawada',
    monogram: 'MZ',
    title: 'adwokat',
    role: 'Adwokat, współzałożyciel, spółki i umowy',
    since: 2009,
    chamber: 'Dolnośląska Izba Adwokacka we Wrocławiu, wpis nr 1318',
    areaSlugs: ['spolki', 'umowy'],
    languages: 'polski, angielski',
    phone: { display: '+48 71 555 01 60', href: 'tel:+48715550160' },
    email: 'marek.zawada@sygnet.example',
    short:
      'Od 2009 roku zakłada spółki, negocjuje umowy i prowadzi spory między firmami. Pisze krótko i konkretnie.',
    bio: [
      'Marek Zawada otworzył kancelarię w 2009 roku i do dziś prowadzi w niej sprawy spółek i umów. Zakłada spółki z ograniczoną odpowiedzialnością, pisze umowy wspólników, zmienia zapisy w rejestrze firm i reprezentuje wspólników w sporach.',
      'Umowy pisze tak, żeby po dwóch latach dało się je przeczytać bez niego. Każdy zapis, który może zadziałać przeciw klientowi, zaznacza w osobnej opinii i mówi, co można zmienić, a z czym trzeba się pogodzić.',
    ],
    workingStyle: [
      'Umowę od drugiej strony czyta w całości, razem z załącznikami i regulaminami, o których klient często zapomina.',
      'Przy zakładaniu spółki prosi wszystkich wspólników o jedno spotkanie, bo zmiany po podpisaniu kosztują więcej niż godzina rozmowy.',
      'Spory między wspólnikami zaczyna od próby spisania, o co naprawdę chodzi, zanim cokolwiek trafi do sądu.',
    ],
  },
];

export const personBySlug = (slug: string): Person | undefined =>
  people.find(person => person.slug === slug);
