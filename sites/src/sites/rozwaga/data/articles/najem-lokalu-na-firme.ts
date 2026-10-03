import type { Article } from './types';

export const najemLokaluNaFirme: Article = {
  slug: 'najem-lokalu-na-firme',
  title: 'Wynajem lokalu na firmę: co sprawdzić w umowie przed podpisaniem',
  metaTitle: 'Najem lokalu na firmę: na co uważać w umowie',
  description:
    'Czas najmu, wypowiedzenie, czynsz, kaucja, remont i zwrot lokalu: co w umowie najmu lokalu użytkowego ważne jest dla firmy. Stan na październik 2026.',
  lead: 'Umowa najmu lokalu na biuro, sklep albo pracownię jest długa i wygląda podobnie u każdego wynajmującego. Różnice kryją się w kilku zapisach, które decydują o tym, ile naprawdę zapłacisz i jak łatwo wyjdziesz.',
  published: '2026-09-18',
  authorSlug: 'rafal-dzierzanowski',
  areaSlug: 'nieruchomosci',
  blocks: [
    {
      type: 'p',
      text: 'Wynajmujący zwykle przysyła swój wzór i mówi, że wszyscy go podpisują. Nie ma w tym złej woli, ale wzór jest pisany z jego punktu widzenia. Przed podpisem warto go przeczytać tak, jak będziesz go czytać za dwa lata, gdy coś pójdzie nie tak: z pytaniem, co wolno mi zrobić.',
    },
    {
      type: 'note',
      title: 'W skrócie',
      text: 'Sprawdź, kto podpisuje po stronie wynajmującego, jak długo trwa najem i kiedy można go wypowiedzieć. Zapisz, jak rośnie czynsz, kto płaci za remont i co się dzieje z kaucją. Spisz protokół zdawczo-odbiorczy z każdą usterką. Roszczenia za uszkodzenia lokalu przedawniają się po roku od zwrotu.',
    },
    { type: 'h2', text: 'Z kim podpisujesz' },
    {
      type: 'p',
      text: 'Zacznij od księgi wieczystej. Możesz ją sprawdzić online w elektronicznych księgach wieczystych, znając numer. Zobaczysz, kto jest właścicielem, czy lokal albo budynek ma współwłaścicieli i czy obciążają go hipoteki lub inne wpisy.',
    },
    {
      type: 'p',
      text: 'Jeśli umowę podpisuje ktoś inny niż właściciel, poproś o pełnomocnictwo albo o umowę, z której wynika jego prawo do podnajmowania. Zwłaszcza gdy lokal pochodzi od dużego najemcy, który wynajmuje go dalej. Umowa z osobą bez prawa do lokalu jest dla ciebie ryzykiem, nawet jeśli czynsz płacisz regularnie.',
    },
    { type: 'h2', text: 'Czas najmu i wypowiedzenie' },
    {
      type: 'p',
      text: 'Umowa najmu zawarta na dłużej niż rok powinna mieć formę pisemną. Jeśli jej nie zachowano, uważa się ją za zawartą na czas nieoznaczony (art. 660 KC). Czas nieoznaczony daje swobodę obu stronom, więc wynajmujący też może cię z niego wyprowadzić: najem lokalu płatny miesięcznie można wypowiedzieć najpóźniej na trzy miesiące naprzód, na koniec miesiąca kalendarzowego (art. 688 KC).',
    },
    {
      type: 'p',
      text: 'Najem na czas oznaczony działa inaczej. Można go wypowiedzieć tylko w wypadkach, które wymienia umowa (art. 673 § 3 KC). Jeśli myślisz, że za rok możesz potrzebować mniejszego lokalu albo zamknąć firmę, wpisz wprost prawo do wcześniejszego wypowiedzenia, razem z okresem i ewentualną opłatą. Bez takiego zapisu zostajesz z czynszem do końca terminu.',
    },
    {
      type: 'p',
      text: 'Sprawdź też, co stanie się, gdy wynajmujący sprzeda budynek. Nabywca wchodzi w umowę, ale może ją wypowiedzieć z ustawowym terminem, chyba że najem był zawarty na czas oznaczony, na piśmie z datą pewną, a lokal został ci wydany (art. 678 KC). Data pewna to na przykład poświadczenie notarialne albo urzędowe. Dla firmy, która zainwestowała w wyposażenie, ten drobiazg może decydować o przyszłości.',
    },
    { type: 'h2', text: 'Czynsz, opłaty i kaucja' },
    {
      type: 'p',
      text: 'Upewnij się, czy czynsz jest podany netto, czy brutto, i czy VAT jest doliczany. Dla firmy rozliczającej VAT to zwykle bez znaczenia, dla firmy, która go nie odlicza, to różnica 23 procent.',
    },
    {
      type: 'ul',
      items: [
        'Podwyżka: zapytaj, czy umowa mówi o waloryzacji, według jakiego wskaźnika i od kiedy. Jeśli nie, wynajmujący lokalu może podwyższyć czynsz, wypowiadając dotychczasową wysokość najpóźniej na miesiąc naprzód, na koniec miesiąca kalendarzowego (art. 685¹ KC). Lepiej mieć w umowie limit.',
        'Opłaty dodatkowe: ogrzewanie, woda, śmieci, sprzątanie części wspólnych i ubezpieczenie budynku. Zapisz, jak są rozliczane: ryczałtem czy według zużycia, i czy wynajmujący ma obowiązek pokazać rozliczenie.',
        'Kaucja: przepisy nie ograniczają jej wysokości w najmie lokali użytkowych (limit dwunastokrotności czynszu dotyczy lokali mieszkalnych). Wpisz termin zwrotu, na przykład 30 dni od odbioru lokalu, i warunki, w jakich wynajmujący może z niej potrącać.',
      ],
    },
    { type: 'h2', text: 'Stan lokalu, remont i nakłady' },
    {
      type: 'p',
      text: 'Wynajmujący ma obowiązek oddać lokal w stanie przydatnym do umówionego użytku i utrzymywać go w takim stanie przez czas najmu. Drobne nakłady związane ze zwykłym używaniem ponosi najemca (art. 662 KC). Granica między jednym a drugim bywa sporna, dlatego opisz ją w umowie: kto wymienia żarówki, kto naprawia instalację, kto odpowiada za dach i okna.',
    },
    {
      type: 'p',
      text: 'Przy odbiorze spisz protokół. Kodeks zakłada, że rzecz wydano w stanie dobrym i przydatnym do użytku (art. 675 § 3 KC), więc usterki, których nie spisałeś, możesz potem mieć trudność udowodnić. Zrób zdjęcia, spisz stany liczników i ustal, które elementy już były zniszczone.',
    },
    {
      type: 'p',
      text: 'Jeśli planujesz remont albo przebudowę, ustal to przed podpisem. Bez odmiennych ustaleń wynajmujący może zatrzymać ulepszenia i zapłacić ci ich wartość z chwili zwrotu albo zażądać przywrócenia lokalu do poprzedniego stanu (art. 676 KC). Wpisz, czy potrzebujesz jego zgody na prace, kto płaci i co z wyposażeniem zamontowanym na stałe.',
    },
    { type: 'h2', text: 'Kary umowne i zaległości w czynszu' },
    {
      type: 'p',
      text: 'W umowach często spotyka się karę umowną za spóźnienie z czynszem. Kara umowna może jednak zabezpieczać tylko niewykonanie zobowiązań niepieniężnych (art. 483 § 1 KC). Za spóźnioną płatność wynajmującemu należą się odsetki, a nie kara. Sąd może też zmniejszyć karę rażąco wygórowaną (art. 484 § 2 KC), ale lepiej nie liczyć na to z góry.',
    },
    {
      type: 'p',
      text: 'Jeśli zalegasz z czynszem co najmniej za dwa pełne okresy płatności, wynajmujący, który chce wypowiedzieć najem bez zachowania terminów, powinien cię najpierw uprzedzić na piśmie i dać dodatkowy miesiąc na zapłatę (art. 687 KC). To ważne zabezpieczenie, więc sprawdź, czy umowa go nie wyłącza.',
    },
    {
      type: 'p',
      text: 'Pamiętaj też o ustawowym prawie zastawu wynajmującego na rzeczach wniesionych do lokalu, za czynsz i opłaty niezalegające dłużej niż rok (art. 670 KC). Ma ono znaczenie, jeśli przy zaległościach zechcesz wyprowadzić sprzęt albo towar. Dobra umowa określa, jak wygląda wtedy odbiór rzeczy.',
    },
    { type: 'h2', text: 'Podnajem i zwrot lokalu' },
    {
      type: 'p',
      text: 'Najemca lokalu nie może oddać go w podnajem ani użyczyć, w całości lub w części, bez zgody wynajmującego (art. 688² KC). Jeśli planujesz podnajmować część biura innej firmie, uzyskaj zgodę w umowie od razu, zamiast prosić o nią później.',
    },
    {
      type: 'p',
      text: 'Przy zwrocie lokalu spisz drugi protokół i zachowaj go. Roszczenia o naprawienie szkody za uszkodzenie lokalu i o zwrot nakładów przedawniają się z upływem roku od dnia zwrotu (art. 677 KC). To krótki termin, który działa w obie strony: wynajmujący musi zgłosić żądanie w ciągu roku, a ty możesz się zabezpieczyć, trzymając protokół i zdjęcia przynajmniej tak długo.',
    },
    { type: 'h2', text: 'Lista do sprawdzenia przed podpisem' },
    {
      type: 'ol',
      items: [
        'Księga wieczysta i prawo osoby podpisującej do rozporządzania lokalem.',
        'Czas najmu, forma pisemna i prawo wcześniejszego wypowiedzenia.',
        'Czynsz netto czy brutto, waloryzacja i limit podwyżek.',
        'Opłaty dodatkowe i sposób rozliczenia.',
        'Kaucja: wysokość, termin zwrotu, warunki potrąceń.',
        'Podział remontów, zgoda na prace, los nakładów.',
        'Protokół zdawczo-odbiorczy ze zdjęciami.',
        'Podnajem i przeniesienie umowy przy sprzedaży firmy.',
      ],
    },
    {
      type: 'p',
      text: 'Przegląd takiej umowy zajmuje nam zwykle dwa do czterech dni roboczych. Dostajesz listę zmian z uzasadnieniem, a o tym, które z nich chcesz zgłosić wynajmującemu, decydujesz sam.',
    },
    {
      type: 'note',
      title: 'Uwaga',
      text: 'Tekst jest ogólnym omówieniem przepisów Kodeksu cywilnego, według stanu na październik 2026. Konkretna umowa może wprowadzać odmienne zasady, dlatego zawsze czytaj ją w całości.',
    },
  ],
};
