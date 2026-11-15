import { business } from './site';

export const ksefCheckedOn = business.stateOn;

export interface KsefStep {
  id: string;
  date: string;
  sortKey: string;
  title: string;
  text: string;
}

export const ksefTimeline: readonly KsefStep[] = [
  {
    id: 'luty-2026',
    date: '1 lutego 2026',
    sortKey: '2026-02-01',
    title: 'Odbieranie faktur w KSeF dla wszystkich',
    text: 'Każdy czynny podatnik VAT odbiera faktury ustrukturyzowane w KSeF. Wystawianie w KSeF zaczęły wtedy firmy, których sprzedaż w 2024 roku przekroczyła 200 mln zł z VAT.',
  },
  {
    id: 'kwiecien-2026',
    date: '1 kwietnia 2026',
    sortKey: '2026-04-01',
    title: 'Wystawianie w KSeF dla pozostałych firm',
    text: 'Pozostali podatnicy wystawiają faktury w KSeF, z wyjątkiem tych objętych ulgą do końca 2026 roku.',
  },
  {
    id: 'koniec-2026',
    date: 'do 31 grudnia 2026',
    sortKey: '2026-12-31',
    title: 'Ulga dla małej sprzedaży',
    text: 'Firmy, których faktury w danym miesiącu nie przekraczają 10 000 zł brutto, mogą jeszcze wystawiać je poza KSeF. Faktury do paragonów z kasy do 450 zł brutto też zostają poza systemem.',
  },
  {
    id: 'styczen-2027',
    date: '1 stycznia 2027',
    sortKey: '2027-01-01',
    title: 'Wszyscy wystawiają w KSeF',
    text: 'Ulga się kończy. Od tego dnia w przelewie za fakturę z KSeF podajesz numer KSeF (art. 108g ustawy o VAT). Paragon z numerem NIP przestaje być fakturą uproszczoną.',
  },
];

export interface KsefMode {
  id: string;
  name: string;
  when: string;
  deadline: string;
}

export const ksefModes: readonly KsefMode[] = [
  {
    id: 'online',
    name: 'Zwykły tryb online',
    when: 'System działa. Wystawiasz fakturę w programie połączonym z KSeF albo w aplikacji Ministerstwa Finansów.',
    deadline: 'Faktura dostaje numer KSeF od razu i od tej chwili jest wystawiona.',
  },
  {
    id: 'offline24',
    name: 'Tryb offline24',
    when: 'Wybierasz go sam, na przykład gdy nie masz internetu u klienta. Wystawiasz fakturę w programie i dajesz kupującemu wydruk z kodem QR.',
    deadline: 'Wysyłasz ją do KSeF najpóźniej w następnym dniu roboczym.',
  },
  {
    id: 'niedostepnosc',
    name: 'Tryb niedostępności',
    when: 'Ministerstwo ogłasza przerwę w działaniu systemu w komunikacie. Wystawiasz fakturę poza KSeF i oznaczasz kodem QR.',
    deadline: 'Wysyłasz ją najpóźniej w następnym dniu roboczym po zakończeniu niedostępności.',
  },
  {
    id: 'awaria',
    name: 'Tryb awarii',
    when: 'Ministerstwo ogłasza awarię całkowitą. Fakturę wystawiasz w formie papierowej albo elektronicznej poza KSeF.',
    deadline: 'Wysyłasz ją do 7 dni roboczych od dnia, w którym awaria się zakończyła.',
  },
];

export interface KsefChecklistItem {
  id: string;
  label: string;
  hint: string;
}

export const ksefChecklist: readonly KsefChecklistItem[] = [
  {
    id: 'program',
    label: 'Program do faktur łączy się z KSeF',
    hint: 'Zapytaj dostawcę programu o integrację i o wzór faktury FA(3).',
  },
  {
    id: 'logowanie',
    label: 'Masz sposób na zalogowanie do KSeF',
    hint: 'Profil Zaufany, podpis kwalifikowany albo pieczęć firmy. Gdy nie masz żadnego, złóż zgłoszenie ZAW-FA w urzędzie skarbowym.',
  },
  {
    id: 'uprawnienia',
    label: 'Biuro ma uprawnienia do Twoich faktur',
    hint: 'Nadajesz je w KSeF po numerze NIP biura. Możemy przeprowadzić Cię przez ten krok w rozmowie.',
  },
  {
    id: 'offline',
    label: 'Wiesz, co robisz, gdy system nie działa',
    hint: 'Ustal z biurem tryb offline24 i kto wysyła faktury następnego dnia roboczego.',
  },
  {
    id: 'kontrahenci',
    label: 'Kontrahenci mają Twój NIP i wiedzą o KSeF',
    hint: 'Faktura trafia do nabywcy po numerze NIP, a nie na adres e-mail.',
  },
  {
    id: 'przelewy',
    label: 'Przelewy za faktury mają numer KSeF',
    hint: 'Od 1 stycznia 2027 wpisujesz go w tytule przelewu. To 35 znaków.',
  },
  {
    id: 'koszty',
    label: 'Faktury kosztowe przychodzą do biura z KSeF',
    hint: 'Biuro pobiera je w dni robocze, więc nie musisz nic przesyłać.',
  },
  {
    id: 'termin',
    label: 'Znasz swoją datę startu',
    hint: 'Sprawdź ją w kalkulatorze powyżej i zapisz w kalendarzu.',
  },
];

export const ksefLimitGross = 10000;
export const ksefCashReceiptLimit = 450;
export const ksefBigSalesMln = 200;

export interface PenaltyStatus {
  title: string;
  text: string;
  checked: string;
}

export const penaltyStatus: PenaltyStatus = {
  title: 'Kary i przesunięcie terminu',
  text: 'Według obecnie obowiązujących przepisów kary za naruszenia w KSeF (do 100% kwoty VAT z faktury, art. 106ni ustawy o VAT) zaczynają się 1 stycznia 2027 roku. Ministerstwo Finansów zapowiedziało 16 września 2026 roku przesunięcie ich o rok, do 31 grudnia 2027. Sejm uchwalił zmianę 6 listopada 2026 roku (druk 3245). W dniu sprawdzenia nie znaleźliśmy jeszcze decyzji Senatu, podpisu Prezydenta ani publikacji w Dzienniku Ustaw. Przesunięcie kar nie znosi obowiązku wystawiania faktur w KSeF ani odpowiedzialności z art. 108 ustawy o VAT i z kodeksu karnego skarbowego.',
  checked: `Sprawdzone ${ksefCheckedOn}.`,
};

export type StartChoice = 'duza' | 'srednia' | 'mala';

export interface StartOption {
  id: StartChoice;
  label: string;
  hint: string;
  verdict: string;
  detail: string;
}

export const startOptions: readonly StartOption[] = [
  {
    id: 'duza',
    label: 'Sprzedaż w 2024 roku powyżej 200 mln zł',
    hint: 'Dotyczy dużych firm.',
    verdict: 'Wystawiasz w KSeF od 1 lutego 2026.',
    detail: 'Ten termin już minął. Jeśli Twoje faktury jeszcze nie wychodzą z KSeF, zrób to od razu.',
  },
  {
    id: 'srednia',
    label: 'Faktury w miesiącu powyżej 10 000 zł brutto',
    hint: 'Typowa firma usługowa lub handlowa.',
    verdict: 'Wystawiasz w KSeF od 1 kwietnia 2026.',
    detail: 'Ten termin już minął. Ulga do końca 2026 roku nie obejmuje firm z wyższą sprzedażą.',
  },
  {
    id: 'mala',
    label: 'Faktury w miesiącu do 10 000 zł brutto',
    hint: 'Mała sprzedaż, na przykład jedna osoba z kilkoma klientami.',
    verdict: 'Wystawiasz w KSeF najpóźniej od 1 stycznia 2027.',
    detail: 'Do 31 grudnia 2026 możesz wystawiać faktury poza KSeF. Zacznij wcześniej, żeby 1 stycznia nie robić tego pierwszy raz.',
  },
];

export const startFor = (choice: string): StartOption | null =>
  startOptions.find(option => option.id === choice) ?? null;
