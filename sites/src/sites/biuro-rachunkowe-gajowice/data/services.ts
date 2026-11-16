import { facts } from './site';

export interface Service {
  id: string;
  title: string;
  summary: string;
  covers: readonly string[];
  fromPlan: 'maly' | 'sredni' | 'duzy';
  when: string;
}

export const services: readonly Service[] = [
  {
    id: 'ksiegowosc',
    title: 'Księgowość',
    summary:
      'Prowadzimy księgi tak, jak wymaga tego forma firmy. Ty wysyłasz dokumenty, my je księgujemy i pilnujemy kompletu.',
    covers: [
      'księga przychodów i rozchodów, ryczałt ewidencjonowany',
      'księgi handlowe dla spółek z o.o.',
      'kontrola kompletności faktur i brakujących dokumentów',
      'archiwizacja dokumentów po zamknięciu miesiąca',
    ],
    fromPlan: 'maly',
    when: 'Faktury księgujemy do 5. dnia następnego miesiąca.',
  },
  {
    id: 'vat',
    title: 'VAT i JPK_V7',
    summary: 'Liczymy VAT należny i naliczony, przygotowujemy plik JPK_V7 i wysyłamy go do urzędu.',
    covers: [
      'deklaracje miesięczne i kwartalne w JPK_V7M i JPK_V7K',
      'rozliczenia z fakturami zakupu i sprzedaży z KSeF',
      'informacje podsumowujące VAT-UE, gdy sprzedajesz do innych krajów UE',
      'kwota do zapłaty i numer rachunku urzędu w jednym komunikacie',
    ],
    fromPlan: 'maly',
    when: 'Plik wysyłamy do 25. dnia miesiąca.',
  },
  {
    id: 'zus-podatki',
    title: 'ZUS i zaliczki podatkowe',
    summary:
      'Wyliczamy składki i zaliczki na PIT lub CIT. Dostajesz kwoty, terminy i numery rachunków do przelewów.',
    covers: [
      'składki społeczne i zdrowotna właściciela',
      'zaliczki na PIT według skali, podatku liniowego lub ryczałtu',
      'zaliczki na CIT w spółkach z o.o.',
      'roczne rozliczenie składki zdrowotnej',
    ],
    fromPlan: 'maly',
    when: 'Składki ZUS do 15. lub 20. dnia, zaliczki do 20. dnia.',
  },
  {
    id: 'kadry',
    title: 'Kadry i płace',
    summary:
      'Przygotowujemy listy płac, deklaracje ZUS i dokumenty pracownicze. W planie Mały tej usługi nie ma.',
    covers: [
      'umowy o pracę i umowy zlecenia',
      'listy płac, PIT-11 i PIT-4R',
      'deklaracje ZUS, zwolnienia lekarskie i urlopy',
      'zgłoszenia i wyrejestrowania pracowników',
    ],
    fromPlan: 'sredni',
    when: 'Listy płac gotowe do 10. dnia miesiąca.',
  },
  {
    id: 'raport',
    title: 'Raport miesięczny dla właściciela',
    summary:
      'Jedna strona z przychodami, kosztami, zobowiązaniami i wynikiem firmy, napisana bez żargonu księgowego.',
    covers: [
      'przychody i koszty miesiąca na tle poprzednich',
      'zobowiązania wobec urzędu i ZUS z terminami',
      'należności po terminie od kontrahentów',
      'jedno pytanie, na które warto odpowiedzieć w tym miesiącu',
    ],
    fromPlan: 'sredni',
    when: 'Raport wysyłamy do 10. dnia miesiąca.',
  },
  {
    id: 'sprawozdania',
    title: 'Roczne rozliczenia i sprawozdania',
    summary:
      'Zeznania roczne i sprawozdania finansowe są w abonamencie. Nie dopłacasz za nie w marcu ani w kwietniu.',
    covers: [
      'PIT-36, PIT-36L, PIT-28 i PIT-37 osób fizycznych',
      'CIT-8 i sprawozdanie finansowe spółek z o.o.',
      'informacje roczne dla pracowników i zleceniobiorców',
      'zestawienie terminów na cały rok z góry',
    ],
    fromPlan: 'maly',
    when: 'Terminy roczne podajemy na stronie z terminami.',
  },
  {
    id: 'urzad',
    title: 'Reprezentacja przed urzędem',
    summary:
      'Na podstawie pełnomocnictwa rozmawiamy z urzędem skarbowym i ZUS. W planach Mały i Średni dostajesz gotowe pisma.',
    covers: [
      'pisma, wyjaśnienia i korekty deklaracji',
      'kontakt z urzędem skarbowym i ZUS w Twoim imieniu',
      'odpowiedzi na wezwania i czynności sprawdzające',
    ],
    fromPlan: 'duzy',
    when: 'Odpowiadamy na wezwania w terminach wskazanych przez urząd.',
  },
  {
    id: 'przejecie',
    title: 'Przejęcie ksiąg od innego biura',
    summary: `Przejmujemy księgi w ${facts.onboardingWeeks} tygodnie. Zaczynamy od spisu dokumentów i rozmowy z poprzednim biurem.`,
    covers: [
      'spis dokumentów i kontrola salda otwarcia',
      'rozmowa z poprzednim biurem o brakach',
      'przejęcie bieżącego miesiąca bez przerwy w rozliczeniach',
    ],
    fromPlan: 'maly',
    when: `Przejęcie kosztuje ${facts.takeoverFee} zł netto, w planie Duży jest bez opłaty.`,
  },
];

export interface ProcessStep {
  no: string;
  title: string;
  text: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    no: '01',
    title: 'Wycena',
    text: `Wysyłasz e-mail z formą firmy i liczbą faktur. Odpowiadamy w ciągu ${facts.replyHours} godzin w dni robocze.`,
  },
  {
    no: '02',
    title: 'Rozmowa',
    text: 'Sprawdzamy, jakie masz dokumenty i jaki plan pasuje do firmy. Ustalamy dzień, od którego prowadzimy księgi.',
  },
  {
    no: '03',
    title: 'Przejęcie',
    text: `Zwykle ${facts.onboardingWeeks} tygodnie. Spis dokumentów, kontakt z poprzednim biurem, potem bieżący miesiąc.`,
  },
  {
    no: '04',
    title: 'Co miesiąc to samo',
    text: 'Faktury do 5. dnia, listy płac i raport do 10., terminy ustawowe na czas. W panelu widzisz kwotę, termin i podstawę wyliczenia.',
  },
];

export const outOfScope = [
  'doradztwo prawne i umowy handlowe',
  'badanie sprawozdań i audyt',
  'windykacja należności przed sądem',
] as const;
