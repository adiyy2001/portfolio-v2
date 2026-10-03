export const site = {
  name: 'Tafla',
  trade: 'gabinet psychoterapii',
  home: '/tafla/',
  privacy: '/tafla/prywatnosc/',
  crisis: '/tafla/w-kryzysie/',
  email: 'kontakt@tafla.example',
  street: 'ul. Sienkiewicza 41/6',
  postalCity: '50-335 Wrocław',
  therapist: 'Aleksandra Wiercińska',
  initials: 'AW',
} as const;

export const navItems = [
  { id: 'o-mnie', label: 'O mnie' },
  { id: 'jak-pracuje', label: 'Jak pracuję' },
  { id: 'cennik', label: 'Cennik' },
  { id: 'pierwsza-wizyta', label: 'Pierwsza wizyta' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

export const prices = {
  consultation: {
    name: 'Konsultacja wstępna',
    minutes: 50,
    amount: 200,
    description: 'Poznajemy się i sprawdzamy, czy mogę Ci pomóc.',
  },
  session: {
    name: 'Sesja psychoterapii',
    minutes: 50,
    amount: 240,
    description: 'W gabinecie albo online, w tej samej cenie.',
  },
  reduced: {
    name: 'Sesja w obniżonej cenie',
    minutes: 50,
    amount: 150,
    description: 'Dla osób w trudnej sytuacji finansowej.',
  },
} as const;

export const monthlyCost = {
  fourSessions: prices.session.amount * 4,
  fiveSessions: prices.session.amount * 5,
};

export const credentials = [
  { term: 'Wykształcenie', detail: 'Psychologia, studia magisterskie ukończone w 2012 roku.' },
  {
    term: 'Szkolenie',
    detail: 'Cztery lata szkoły psychoterapii w nurcie psychodynamicznym, w tym własna terapia.',
  },
  {
    term: 'Doświadczenie',
    detail:
      'Od 2016 roku pracuję z dorosłymi: w poradni zdrowia psychicznego i w szpitalu dziennym, a od 2023 roku we własnym gabinecie.',
  },
  {
    term: 'Superwizja',
    detail:
      'Co miesiąc omawiam swoją pracę z doświadczoną terapeutką. Nie podaję tam Twoich danych.',
  },
  { term: 'Języki', detail: 'Polski i angielski.' },
] as const;

export const hours = [
  { days: 'poniedziałek-czwartek', time: '9:00-19:00' },
  { days: 'piątek', time: '9:00-13:00' },
] as const;

export const paymentNotes = [
  {
    title: 'Płatność',
    text: 'Płacisz po spotkaniu: w gabinecie kartą, BLIKIEM lub gotówką, przy spotkaniu online przelewem lub BLIKIEM. Na życzenie wystawiam rachunek.',
  },
  {
    title: 'Odwołanie spotkania',
    text: 'Spotkanie możesz odwołać lub przełożyć bezpłatnie do 24 godzin przed terminem. Później płacisz za nie w całości, bo ten termin zostaje dla Ciebie zarezerwowany.',
  },
  {
    title: 'Obniżona cena',
    text: 'Mam dwa miejsca w tygodniu w cenie 150 zł, dla osób, które się uczą, mają niskie dochody albo przechodzą trudny moment finansowy. Napisz o tym w wiadomości. Niczego nie musisz udowadniać.',
  },
] as const;

export const places = [
  {
    title: 'W gabinecie',
    text: 'Drugie piętro, bez windy. Domofon: 6. Przyjdź kilka minut wcześniej, żeby usiąść i odetchnąć. Dla osób, które nie wejdą po schodach, proponuję spotkania online.',
  },
  {
    title: 'Online',
    text: 'Spotykamy się przez zwykły link do wideorozmowy, bez instalowania programów. Link wysyłam dzień wcześniej. Potrzebujesz pokoju, w którym nikt nie będzie przeszkadzał, i słuchawek, jeśli mieszkasz z innymi.',
  },
] as const;

export const meetingPlaces = [
  { value: 'gabinet', label: 'W gabinecie' },
  { value: 'online', label: 'Online' },
  { value: 'nie-wiem', label: 'Nie wiem' },
] as const;

export const defaultMeetingPlace = 'nie-wiem';

export const themes = [
  'lęk, napady paniki, ciągłe napięcie',
  'obniżony nastrój i brak chęci do czegokolwiek',
  'wypalenie zawodowe i przeciążenie',
  'trudności w bliskich relacjach',
  'żałoba i inne straty',
  'zmiany, które przestawiają całe życie: rozstanie, przeprowadzka, dziecko, utrata pracy',
  'poczucie, że coś jest nie tak, choć trudno to nazwać',
] as const;

export const notDoing = [
  'terapii par i rodzin',
  'pracy z dziećmi i młodzieżą',
  'diagnoz, opinii dla sądu i zaświadczeń',
  'leczenia lekami: nie wypisuję recept, to zadanie psychiatry',
  'pomocy w nagłym kryzysie',
] as const;

export const sessionPhases = [
  {
    name: 'Przyjście',
    span: 'pierwsze 10 minut',
    text: 'Co się wydarzyło od ostatniego razu i z czym dziś przychodzisz.',
  },
  {
    name: 'Rozmowa',
    span: 'następne 35 minut',
    text: 'To, co jest dla Ciebie najważniejsze tego dnia. Tu jest najwięcej ciszy i najwięcej pracy.',
  },
  {
    name: 'Domknięcie',
    span: 'ostatnie 5 minut',
    text: 'Co zabierasz ze sobą i co chcesz sprawdzić do następnego spotkania.',
  },
] as const;

export const firstVisitSteps = [
  {
    title: 'Piszesz do mnie',
    text: 'Kilka zdań wystarczy: z czym przychodzisz i czy wolisz gabinet, czy spotkanie online. Nie musisz opisywać wszystkiego.',
  },
  {
    title: 'Odpowiadam',
    text: 'W ciągu dwóch dni roboczych, zwykle szybciej. Proponuję dwa lub trzy terminy konsultacji. Jeśli nie mam wolnych miejsc, napiszę o tym od razu i podpowiem, gdzie szukać dalej.',
  },
  {
    title: 'Spotykamy się',
    text: 'Konsultacja trwa 50 minut. Opowiadasz, co Cię do mnie sprowadza, a ja pytam o sen, pracę, bliskich i o to, jak do tej pory radzisz sobie z trudnościami. Mówię też, jak pracuję i czego możesz się spodziewać. Czasem jedno spotkanie nie wystarcza. Wtedy umawiamy drugą konsultację w tej samej cenie.',
  },
  {
    title: 'Decydujesz',
    text: 'Nie musisz odpowiadać na miejscu. Jeśli chcesz kontynuować, ustalamy stały termin. Jeśli nie, nic się nie stało. Na prośbę wskażę inne miejsca i innych terapeutów.',
  },
] as const;

export interface Helpline {
  number: string;
  dial: string;
  name: string;
  detail: string;
  hours: string;
}

export const mainHelplines: readonly Helpline[] = [
  {
    number: '112',
    dial: '112',
    name: 'Numer alarmowy',
    detail: 'Zagrożenie życia lub zdrowia, także gdy ktoś próbuje się zabić.',
    hours: 'całą dobę',
  },
  {
    number: '800 70 2222',
    dial: '800702222',
    name: 'Centrum Wsparcia dla dorosłych w kryzysie psychicznym',
    detail: 'Rozmowa z psychologiem, także gdy nie wiesz, co się z Tobą dzieje.',
    hours: 'całą dobę, bezpłatnie',
  },
  {
    number: '116 123',
    dial: '116123',
    name: 'Telefon wsparcia emocjonalnego dla dorosłych',
    detail: 'Dla osób w kryzysie emocjonalnym, także anonimowo.',
    hours: 'całą dobę, bezpłatnie',
  },
  {
    number: '116 111',
    dial: '116111',
    name: 'Telefon zaufania dla dzieci i młodzieży',
    detail: 'Dla osób poniżej 18 lat, także anonimowo.',
    hours: 'całą dobę, bezpłatnie',
  },
];

export const otherHelplines: readonly Helpline[] = [
  {
    number: '999',
    dial: '999',
    name: 'Pogotowie ratunkowe',
    detail: 'Nagłe zagrożenie zdrowia lub życia. Karetkę wyśle też dyspozytor 112.',
    hours: 'całą dobę',
  },
  {
    number: '800 120 002',
    dial: '800120002',
    name: 'Niebieska Linia',
    detail: 'Pomoc dla osób doświadczających przemocy w rodzinie.',
    hours: 'całą dobę, bezpłatnie',
  },
  {
    number: '800 190 590',
    dial: '800190590',
    name: 'Telefoniczna Informacja Pacjenta (NFZ)',
    detail:
      'Podpowie, gdzie w Twojej okolicy znajdziesz bezpłatną pomoc, także Centra Zdrowia Psychicznego.',
    hours: 'całą dobę',
  },
];
