import { capitalize, formatPrice } from './format';

export const site = {
  name: 'Otoczak',
  tagline: 'Psychoterapia na Biskupinie',
  practice: 'Gabinet Zofii Olszewskiej',
  owner: 'Zofia Olszewska',
  street: 'ul. Mickiewicza 77',
  postalCity: '51-685 Wrocław',
  district: 'Biskupin',
  phone: '+48 71 555 01 72',
  phoneHref: 'tel:+48715550172',
  email: 'kontakt@otoczak.example',
  home: '/otoczak/',
  privacy: '/otoczak/prywatnosc/',
  crisis: '/otoczak/w-kryzysie/',
  credits: '/otoczak/credits/',
  contact: '/otoczak/kontakt/',
  checkedOn: '15 listopada 2026',
  practiceYears: 'siedemnastu',
  replyDays: 'dwóch dni roboczych',
  entrance: 'Wejście od ulicy, drugie piętro, w budynku jest winda.',
} as const;

export const hours = {
  prose: 'Od poniedziałku do piątku, od dziewiątej do dziewiętnastej.',
  inline: 'w dni robocze od dziewiątej do dziewiętnastej',
  lastStart: '17:30',
} as const;

export const cancellation = {
  freeUntil: 'dwóch dni',
  freeProse: 'najpóźniej dwa dni przed spotkaniem',
} as const;

export const payment = {
  methods: 'gotówką, kartą albo BLIK-iem',
  online: 'przelewem albo BLIK-iem, najpóźniej w dniu spotkania',
} as const;

export type ServiceId = 'indywidualna' | 'pary' | 'mlodziez' | 'rodzice';
export type TherapistId = 'zofia' | 'pawel';

export interface Service {
  id: ServiceId;
  name: string;
  audience: string;
  summary: string;
  minutes: number;
  minutesWords: string;
  price: number;
  therapists: readonly TherapistId[];
}

export const services: readonly Service[] = [
  {
    id: 'indywidualna',
    name: 'Terapia indywidualna',
    audience: 'dorośli, jedna osoba',
    summary:
      'Jedna osoba i spokojne tempo. Praca nad tym, co wraca, męczy albo nie pozwala odpocząć.',
    minutes: 50,
    minutesWords: 'pięćdziesiąt minut',
    price: 230,
    therapists: ['zofia', 'pawel'],
  },
  {
    id: 'pary',
    name: 'Terapia dla par',
    audience: 'dwie osoby, razem',
    summary: 'Rozmowa we dwoje przy moim udziale. Uczymy się słuchać, zanim zaczniemy się spierać.',
    minutes: 80,
    minutesWords: 'osiemdziesiąt minut',
    price: 320,
    therapists: ['zofia'],
  },
  {
    id: 'mlodziez',
    name: 'Terapia dla młodzieży',
    audience: 'od piętnastego roku życia',
    summary:
      'Spotkania z nastolatkiem, w jego tempie, od piętnastego roku życia. Rodzic wie, jak pracujemy, ale nie wie, o czym rozmawiamy.',
    minutes: 50,
    minutesWords: 'pięćdziesiąt minut',
    price: 200,
    therapists: ['zofia', 'pawel'],
  },
  {
    id: 'rodzice',
    name: 'Konsultacje dla rodziców',
    audience: 'rodzice i opiekunowie',
    summary:
      'Wsparcie, gdy w domu jest trudno. Szukamy tego, co da się zmienić w codziennych sprawach.',
    minutes: 50,
    minutesWords: 'pięćdziesiąt minut',
    price: 230,
    therapists: ['zofia'],
  },
];

export const serviceById = (id: ServiceId): Service => {
  const found = services.find(service => service.id === id);
  if (!found) throw new Error(`Unknown service ${id}`);
  return found;
};

export const durationSentence = (service: Service) => `${capitalize(service.minutesWords)}.`;

export const meetingLine = (service: Service) =>
  `${service.minutesWords}, ${formatPrice(service.price)}`;

export const lateFee = (service: Service) => service.price / 2;

export const individual = serviceById('indywidualna');

export interface Therapist {
  id: TherapistId;
  name: string;
  role: string;
  paragraphs: readonly string[];
  days: string;
  services: readonly ServiceId[];
}

export const therapists: readonly Therapist[] = [
  {
    id: 'zofia',
    name: 'Zofia Olszewska',
    role: 'psycholożka i psychoterapeutka, właścicielka gabinetu',
    paragraphs: [
      'Jest magistrem psychologii. Ukończyła czteroletnie Studium Psychoterapii Integracyjnej we Wrocławiu i ma certyfikat psychoterapeuty. Pracuje w nurcie integracyjnym, z dorosłymi, parami i młodzieżą, pod stałą superwizją.',
      `Gabinet na Biskupinie prowadzi od ${site.practiceYears} lat. Zaczynała w nim sama, od trzech lat pracuje tu też Paweł Gajewski.`,
    ],
    days: 'od poniedziałku do czwartku',
    services: ['indywidualna', 'pary', 'mlodziez', 'rodzice'],
  },
  {
    id: 'pawel',
    name: 'Paweł Gajewski',
    role: 'psycholog i psychoterapeuta',
    paragraphs: [
      'Jest magistrem psychologii. Ukończył czteroletnie szkolenie w nurcie poznawczo-behawioralnym i ma certyfikat psychoterapeuty. Pracuje z dorosłymi i młodzieżą od piętnastego roku życia, pod stałą superwizją.',
      'W Otoczaku przyjmuje od trzech lat. Pary i konsultacje dla rodziców zostają u Zofii.',
    ],
    days: 'we wtorki, czwartki i piątki',
    services: ['indywidualna', 'mlodziez'],
  },
];

export const therapistById = (id: TherapistId): Therapist => {
  const found = therapists.find(therapist => therapist.id === id);
  if (!found) throw new Error(`Unknown therapist ${id}`);
  return found;
};

export interface Question {
  question: string;
  answer: string;
}

export const firstMeetingQuestions: readonly Question[] = [
  {
    question: 'Czy muszę od razu opowiedzieć wszystko?',
    answer:
      'Nie. Zaczynasz od tego, co jest teraz najważniejsze, i kończysz, kiedy masz dość. Reszta może poczekać na kolejne spotkania.',
  },
  {
    question: 'Co, jeśli się rozpłaczę?',
    answer:
      'Wtedy płaczesz, a chusteczki stoją w zasięgu ręki. Nikt nie przyspiesza z kolejnym pytaniem.',
  },
  {
    question: 'Czy mogę przyjść z kimś bliskim?',
    answer:
      'Na terapię dla par przychodzicie razem. Na terapię indywidualną przychodzisz sam lub sama, ale bliska osoba może poczekać w pobliżu.',
  },
  {
    question: 'Czy rodzic dowie się, o czym rozmawiamy?',
    answer:
      'Rodzic młodego człowieka wie, jak pracujemy, ale nie wie, o czym rozmawiamy. Wyjątkiem jest sytuacja, w której ktoś jest w niebezpieczeństwie. Wtedy najpierw mówimy o tym młodej osobie.',
  },
  {
    question: 'Czy dostanę diagnozę?',
    answer:
      'Nie. Pierwsze spotkanie służy poznaniu się. Jeśli uznamy, że potrzebujesz lekarza, powiemy to wprost.',
  },
  {
    question: 'Czy potrzebuję skierowania?',
    answer: 'Nie. Gabinet jest prywatny i nie ma umowy z NFZ.',
  },
  {
    question: 'Czy mogę spotkać się online?',
    answer: 'W wybranych terminach tak. Czas i cena są takie same jak w gabinecie.',
  },
];

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
    detail: 'Gdy ktoś jest w bezpośrednim niebezpieczeństwie albo już zrobił sobie krzywdę.',
    hours: 'Całą dobę, bezpłatnie.',
  },
  {
    number: '800 70 2222',
    dial: '800702222',
    name: 'Centrum Wsparcia dla osób dorosłych w kryzysie psychicznym',
    detail: 'Rozmowa z doradcą. Prowadzi ją Fundacja ITAKA.',
    hours: 'Całą dobę, bezpłatnie.',
  },
  {
    number: '116 123',
    dial: '116123',
    name: 'Kryzysowy Telefon Zaufania dla dorosłych',
    detail: 'Dla dorosłych w kryzysie emocjonalnym. Rozmowa jest anonimowa.',
    hours: 'Codziennie od 14:00 do 22:00, bezpłatnie.',
  },
  {
    number: '116 111',
    dial: '116111',
    name: 'Telefon zaufania dla dzieci i młodzieży',
    detail: 'Dla dzieci i nastolatków. Rozmowa jest anonimowa.',
    hours: 'Całą dobę, bezpłatnie.',
  },
];

export const otherHelplines: readonly Helpline[] = [
  {
    number: '800 12 12 12',
    dial: '800121212',
    name: 'Dziecięcy Telefon Zaufania Rzecznika Praw Dziecka',
    detail: 'Dla dzieci i nastolatków, które potrzebują pomocy albo rozmowy.',
    hours: 'Całą dobę, bezpłatnie.',
  },
  {
    number: '800 120 002',
    dial: '800120002',
    name: 'Niebieska Linia',
    detail: 'Dla osób, wobec których ktoś w domu stosuje przemoc, i dla jej świadków.',
    hours: 'Całą dobę, bezpłatnie.',
  },
  {
    number: '800 190 590',
    dial: '800190590',
    name: 'Telefoniczna Informacja Pacjenta NFZ',
    detail:
      'Podpowie, gdzie jest najbliższe Centrum Zdrowia Psychicznego i jak się do niego zapisać.',
    hours: 'Całą dobę, bezpłatnie.',
  },
  {
    number: '999',
    dial: '999',
    name: 'Pogotowie ratunkowe',
    detail: 'Gdy trzeba szybko jechać do szpitala.',
    hours: 'Całą dobę, bezpłatnie.',
  },
];

export interface NavItem {
  label: string;
  path: string;
}

export const navItems: readonly NavItem[] = [
  { label: 'Terapia', path: '/otoczak/terapia/' },
  { label: 'Terapeuci', path: '/otoczak/terapeuci/' },
  { label: 'Cennik', path: '/otoczak/cennik/' },
  { label: 'Pierwsza wizyta', path: '/otoczak/pierwsza-wizyta/' },
  { label: 'W kryzysie', path: site.crisis },
  { label: 'Kontakt', path: site.contact },
];

export const footerItems: readonly NavItem[] = [
  ...navItems,
  { label: 'Prywatność', path: site.privacy },
  { label: 'Skąd kamień i litery', path: site.credits },
];

export const contactWho = [
  { value: 'dla-mnie', label: 'Dla mnie' },
  { value: 'dla-pary', label: 'Dla nas, we dwoje' },
  { value: 'dla-nastolatka', label: 'Dla nastolatka' },
  { value: 'dla-rodzica', label: 'Jestem rodzicem' },
] as const;

export const contactPlaces = [
  { value: 'gabinet', label: 'W gabinecie na Biskupinie' },
  { value: 'online', label: 'Online' },
] as const;
