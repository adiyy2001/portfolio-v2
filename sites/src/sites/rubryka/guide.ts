export interface Comparison {
  topic: string;
  before: string;
  now: string;
}

export interface Mode {
  name: string;
  when: string;
  rule: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Source {
  label: string;
  href: string;
  note: string;
}

export const tableOfContents = [
  { id: 'czym-jest', label: 'Czym jest KSeF' },
  { id: 'daty', label: 'Od kiedy i kogo dotyczy' },
  { id: 'czy-dotyczy', label: 'Czy dotyczy mnie' },
  { id: 'na-co-dzien', label: 'Co zmienia się na co dzień' },
  { id: 'dostep', label: 'Dostęp i uprawnienia' },
  { id: 'lista', label: 'Lista kontrolna' },
  { id: 'pomoc', label: 'Jak pomagamy' },
  { id: 'zrodla', label: 'Źródła' },
] as const;

export const comparisons: readonly Comparison[] = [
  {
    topic: 'Wystawienie',
    before: 'Program do faktur, arkusz albo papier.',
    now: 'Plik XML w Aplikacji Podatnika KSeF albo w programie do faktur z obsługą KSeF.',
  },
  {
    topic: 'Wysyłka do kupującego',
    before: 'E-mail, poczta albo wręczenie.',
    now: 'System udostępnia fakturę kupującemu. Wizualizację z kodem QR możesz dodatkowo wysłać sam.',
  },
  {
    topic: 'Data otrzymania faktury',
    before: 'Dzień, w którym faktura dotarła do kupującego.',
    now: 'Dzień nadania numeru KSeF.',
  },
  {
    topic: 'Błąd na fakturze',
    before: 'Poprawiony dokument albo faktura korygująca.',
    now: 'Faktura korygująca. Wystawionej faktury nie edytujesz i nie usuwasz.',
  },
  {
    topic: 'Faktury kosztowe',
    before: 'Przychodzą mailem albo pocztą.',
    now: 'Czekają w KSeF. System nie wysyła powiadomień, więc ktoś musi do niego zaglądać.',
  },
  {
    topic: 'Archiwum',
    before: 'Segregator albo dysk, za który odpowiadasz sam.',
    now: 'System przechowuje faktury 10 lat od końca roku wystawienia.',
  },
];

export const modes: readonly Mode[] = [
  {
    name: 'Online',
    when: 'Zwykły dzień pracy systemu.',
    rule: 'Fakturę wysyłasz do KSeF od razu, tego samego dnia.',
  },
  {
    name: 'Offline24',
    when: 'Wystawiasz bez połączenia z KSeF, z dowolnego powodu.',
    rule: 'Wystawiasz fakturę poza systemem i dosyłasz ją do KSeF najpóźniej następnego dnia roboczego.',
  },
  {
    name: 'Niedostępność',
    when: 'Ministerstwo ogłasza przerwę w działaniu systemu.',
    rule: 'Dosyłasz fakturę najpóźniej następnego dnia roboczego po zakończeniu przerwy.',
  },
  {
    name: 'Awaria',
    when: 'System ma awarię ogłoszoną w komunikacie.',
    rule: 'Dosyłasz fakturę w ciągu 7 dni roboczych od końca awarii.',
  },
];

export const accessSteps: readonly string[] = [
  'Zaloguj się do Aplikacji Podatnika KSeF (ap.ksef.mf.gov.pl) Profilem Zaufanym albo podpisem kwalifikowanym.',
  'Wejdź w Uprawnienia, potem Nadaj uprawnienie.',
  'Wybierz uprawnienie dla podmiotu do wystawiania i przeglądania faktur.',
  'Wpisz NIP i pełną nazwę biura rachunkowego. Zaznacz prawo dalszego przekazywania tylko wtedy, gdy biuro ma je mieć.',
  'Zatwierdź. Nadane uprawnienia możesz później przejrzeć i cofnąć w tym samym miejscu.',
];

export const checklistItems: readonly ChecklistItem[] = [
  {
    id: 'obligation',
    text: 'Sprawdź, od kiedy KSeF obowiązuje Twoją firmę i czy mieścisz się w ulgę do 10 000 zł brutto miesięcznie.',
  },
  {
    id: 'login',
    text: 'Zaloguj się raz do Aplikacji Podatnika KSeF. Jednoosobowa firma robi to Profilem Zaufanym lub podpisem kwalifikowanym.',
  },
  {
    id: 'company-access',
    text: 'Spółka bez pieczęci kwalifikowanej: złóż w urzędzie skarbowym wniosek ZAW-FA o dostęp.',
  },
  {
    id: 'permissions',
    text: 'Nadaj biuru rachunkowemu uprawnienie do wystawiania i przeglądania faktur.',
  },
  {
    id: 'tool',
    text: 'Wybierz, czym wystawiasz faktury: Aplikacja Podatnika, Aplikacja Mobilna, e-mikrofirma albo program do faktur z obsługą KSeF.',
  },
  {
    id: 'incoming',
    text: 'Ustal, kto i jak często sprawdza faktury kosztowe w KSeF, bo system nie wysyła powiadomień.',
  },
  {
    id: 'customers',
    text: 'Powiedz stałym kontrahentom, że faktury od Ciebie przyjdą z KSeF, i sprawdź ich numery NIP.',
  },
  {
    id: 'transfers',
    text: 'Przed 1 stycznia 2027 r. zaplanuj numer KSeF w tytule przelewu przy płatnościach za faktury między czynnymi podatnikami VAT.',
  },
];

export const sources: readonly Source[] = [
  {
    label: 'Portal KSeF',
    href: 'https://ksef.podatki.gov.pl/',
    note: 'Zasady obowiązywania, pytania i odpowiedzi, materiały dla podatników.',
  },
  {
    label: 'Aplikacja Podatnika KSeF',
    href: 'https://ap.ksef.mf.gov.pl/',
    note: 'Bezpłatne narzędzie Ministerstwa Finansów do wystawiania i odbierania faktur.',
  },
  {
    label: 'Podatki.gov.pl',
    href: 'https://www.podatki.gov.pl/',
    note: 'Serwis Krajowej Administracji Skarbowej z terminami JPK_V7 i VAT.',
  },
  {
    label: 'Ustawa o podatku od towarów i usług (Dz.U. 2004 nr 54 poz. 535)',
    href: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20040540535',
    note: 'Art. 106i (termin wystawienia faktury), art. 106ni (kary) i art. 108g (numer KSeF w przelewie).',
  },
];
