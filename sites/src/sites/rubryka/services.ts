export type ServiceId =
  'kpir-i-ryczalt' | 'pelna-ksiegowosc' | 'kadry-i-place' | 'vat-i-jpk' | 'start-z-ksef';

export interface Service {
  id: ServiceId;
  title: string;
  teaser: string;
  priceShort: string;
  priceLine: string;
  intro: string;
  weDo: readonly string[];
  youDo: readonly string[];
  deadlines: readonly string[];
}

export const services: readonly Service[] = [
  {
    id: 'kpir-i-ryczalt',
    title: 'KPiR i ryczałt',
    teaser: 'Księga przychodów i rozchodów albo ewidencja przychodów, zaliczki i PIT.',
    priceShort: 'od 229 zł',
    priceLine:
      'Ryczałt od 229 zł, KPiR od 299 zł netto miesięcznie, zależnie od liczby dokumentów.',
    intro:
      'Dla jednoosobowych firm, które nie muszą prowadzić ksiąg rachunkowych. Wybieramy z Tobą formę opodatkowania, a potem co miesiąc robimy to samo: księgujemy, liczymy zaliczkę i przypominamy o terminach.',
    weDo: [
      'Księgujemy faktury sprzedaży i kosztowe w księdze przychodów i rozchodów albo w ewidencji przychodów.',
      'Pobieramy faktury z KSeF, więc nie musisz ich do nas przesyłać.',
      'Liczymy miesięczną lub kwartalną zaliczkę na podatek dochodowy.',
      'Rozliczamy składki ZUS właściciela i przygotowujemy deklaracje.',
      'Po roku składamy w Twoim imieniu PIT-28, PIT-36 albo PIT-36L.',
    ],
    youDo: [
      'Wystawiasz faktury, a od 2026 roku dla firm robisz to w KSeF.',
      'Wrzucasz do wspólnego folderu dokumenty, których nie ma w KSeF, i raz w miesiącu wyciąg z rachunku firmowego.',
      'Płacisz zaliczkę i składki przelewami, które dla Ciebie przygotowujemy.',
    ],
    deadlines: [
      'Zaliczka na podatek dochodowy: do 20. dnia następnego miesiąca, a przy rozliczeniu kwartalnym do 20. dnia po kwartale.',
      'PIT-28 (ryczałt): do końca lutego. PIT-36 i PIT-36L: do 30 kwietnia.',
      'Składki ZUS jednoosobowej firmy: do 20. dnia miesiąca.',
    ],
  },
  {
    id: 'pelna-ksiegowosc',
    title: 'Pełna księgowość',
    teaser: 'Księgi rachunkowe, CIT lub PIT i sprawozdanie finansowe dla spółek.',
    priceShort: 'od 690 zł',
    priceLine: 'Od 690 zł netto miesięcznie, zależnie od liczby dokumentów.',
    intro:
      'Obowiązkowa dla spółek z o.o. i akcyjnych, a dla innych firm po przekroczeniu ustawowego progu przychodów albo z wyboru. Prowadzimy księgi rachunkowe, zamykamy miesiące i rok, a Ty dostajesz raport z wynikiem firmy.',
    weDo: [
      'Prowadzimy księgi rachunkowe: zapisy na kontach, amortyzację, rozrachunki z kontrahentami.',
      'Co miesiąc zamykamy księgi i wysyłamy zestawienie przychodów, kosztów i wyniku.',
      'Liczymy zaliczki na CIT albo PIT i rozliczamy VAT.',
      'Przygotowujemy sprawozdanie finansowe: bilans, rachunek zysków i strat, informację dodatkową.',
      'Składamy CIT-8 i przygotowujemy sprawozdanie do podpisu zarządu i złożenia w KRS.',
    ],
    youDo: [
      'Dosyłasz dokumenty i wyciągi do 10. dnia miesiąca.',
      'Odpowiadasz na pytania o niejasne operacje, zanim zamkniemy miesiąc.',
      'Zatwierdzasz sprawozdanie finansowe i podpisujesz je w zarządzie.',
    ],
    deadlines: [
      'Zaliczka na CIT: do 20. dnia następnego miesiąca.',
      'CIT-8: do końca trzeciego miesiąca po roku podatkowym, czyli dla roku kalendarzowego do 31 marca.',
      'Sprawozdanie finansowe: zatwierdzenie do 30 czerwca (rok kalendarzowy), złożenie w KRS do 15 dni po zatwierdzeniu.',
    ],
  },
  {
    id: 'kadry-i-place',
    title: 'Kadry i płace',
    teaser: 'Umowy, listy płac, ZUS i PIT-11 pracowników.',
    priceShort: '59 zł za osobę',
    priceLine: '59 zł netto za osobę miesięcznie, do 20 osób. Większe zespoły wyceniamy osobno.',
    intro:
      'Przy pierwszym pracowniku pojawia się więcej terminów niż w całej reszcie firmy. Przejmujemy listy płac i dokumenty, a Tobie zostają decyzje.',
    weDo: [
      'Przygotowujemy umowy o pracę i zlecenia oraz zgłaszamy pracowników do ZUS.',
      'Liczymy wynagrodzenia, zaliczki na PIT i składki, przygotowujemy listy płac.',
      'Prowadzimy ewidencję urlopów i zwolnień lekarskich.',
      'Wysyłamy deklaracje do ZUS i podajemy kwoty do przelewu.',
      'Po roku wystawiamy PIT-11 dla pracowników i roczne rozliczenie zaliczek dla urzędu.',
    ],
    youDo: [
      'Do 5. dnia miesiąca przekazujesz godziny, premie i nieobecności.',
      'Akceptujesz listę płac.',
      'Wypłacasz wynagrodzenia i płacisz składki przelewami, które przygotowujemy.',
    ],
    deadlines: [
      'Wynagrodzenie dla pracownika: najpóźniej do 10. dnia następnego miesiąca.',
      'Składki ZUS za pracowników: do 20. dla jednoosobowych firm, do 15. dla spółek.',
      'PIT-11 dla pracownika: do końca lutego.',
    ],
  },
  {
    id: 'vat-i-jpk',
    title: 'VAT i JPK',
    teaser: 'Rozliczenie VAT i miesięczny plik JPK_V7.',
    priceShort: 'od 69 zł',
    priceLine:
      'Dopłata do pakietu: 69 zł (ryczałt), 89 zł (KPiR) albo 149 zł (pełna księgowość) netto miesięcznie.',
    intro:
      'VAT to termin, który nie wybacza spóźnień. Liczymy go z faktur w KSeF i z dokumentów, które dostajemy od Ciebie, a plik JPK_V7 wysyłamy, zanim zdążysz o nim pomyśleć.',
    weDo: [
      'Rejestrujemy sprzedaż i zakupy z VAT.',
      'Przygotowujemy i wysyłamy plik JPK_V7M (miesięczny) albo JPK_V7K (kwartalny, dla małych podatników).',
      'Zgłaszamy VAT-UE, gdy kupujesz lub sprzedajesz usługi w Unii Europejskiej.',
      'Podajemy kwotę VAT do zapłaty albo do zwrotu.',
      'Przed większymi przelewami sprawdzamy kontrahentów na białej liście podatników VAT.',
    ],
    youDo: [
      'Wystawiasz faktury w KSeF i przekazujesz nam dokumenty zakupu spoza KSeF.',
      'Zgłaszasz nam sprzedaż i zakupy za granicą.',
      'Akceptujesz kwotę i płacisz VAT do 25. dnia.',
    ],
    deadlines: [
      'JPK_V7M i wpłata VAT: do 25. dnia następnego miesiąca.',
      'JPK_V7K: część ewidencyjna co miesiąc do 25., deklaracja raz na kwartał do 25. dnia po kwartale.',
      'Gdy 25. to sobota, niedziela albo święto: pierwszy dzień roboczy po nim.',
    ],
  },
  {
    id: 'start-z-ksef',
    title: 'Start z KSeF',
    teaser: 'Dostęp, uprawnienia i pierwsza faktura w KSeF.',
    priceShort: '0 zł dla klientów',
    priceLine: '0 zł dla klientów księgowości. Dla pozostałych 390 zł netto jednorazowo.',
    intro:
      'KSeF obowiązuje już większość firm, a od 1 stycznia 2027 r. także te najmniejsze, bez ulgi. Wdrażamy go w jeden dzień roboczy, a pierwszą fakturę wystawiasz z nami przy telefonie.',
    weDo: [
      'Sprawdzamy, od kiedy KSeF obowiązuje Twoją firmę i czy korzystasz z ulgi do 10 000 zł brutto miesięcznie.',
      'Zakładamy dostęp w Aplikacji Podatnika KSeF i nadajemy naszemu biuru uprawnienie do wystawiania i przeglądania faktur.',
      'Wybieramy z Tobą narzędzie do wystawiania: bezpłatną Aplikację Podatnika albo program do faktur z obsługą KSeF.',
      'Wystawiamy z Tobą pierwszą fakturę i sprawdzamy jej numer KSeF oraz UPO.',
      'Ustalamy, kto i jak często pobiera faktury kosztowe, bo KSeF nie wysyła powiadomień.',
    ],
    youDo: [
      'Jednoosobowa firma: logujesz się Profilem Zaufanym lub podpisem kwalifikowanym.',
      'Spółka bez pieczęci kwalifikowanej: składa wniosek ZAW-FA w urzędzie skarbowym.',
      'Potwierdzasz uprawnienia nadane biuru.',
    ],
    deadlines: [
      '1 kwietnia 2026: obowiązek dla większości firm, z ulgą do 10 000 zł brutto miesięcznie do końca 2026.',
      '1 stycznia 2027: koniec ulgi i początek kar za naruszenia.',
      'Faktura za sprzedaż z danego miesiąca: najpóźniej do 15. dnia następnego miesiąca.',
    ],
  },
];

export const findService = (id: ServiceId): Service => {
  const found = services.find(service => service.id === id);
  if (!found) throw new Error(`Unknown service ${id}`);
  return found;
};
