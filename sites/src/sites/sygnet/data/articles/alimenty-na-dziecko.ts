import type { Article } from './types';

export const alimentyNaDziecko: Article = {
  slug: 'alimenty-na-dziecko',
  title: 'Alimenty na dziecko: od czego zależy kwota i jak wygląda sprawa w sądzie',
  metaTitle: 'Alimenty na dziecko: kwota i przebieg sprawy',
  description:
    'Od czego zależy wysokość alimentów na dziecko, do kiedy się je płaci, jakie dokumenty zebrać przed pozwem i jak wygląda sprawa w sądzie rejonowym.',
  lead: 'Nie ma tabeli, z której można odczytać kwotę alimentów. Sąd bierze pod uwagę potrzeby dziecka i możliwości rodzica, a my pokazujemy, co z tego da się udokumentować przed pozwem.',
  published: '2026-11-07',
  authorSlug: 'anna-wierzbicka',
  areaSlug: 'rodzina',
  blocks: [
    {
      type: 'note',
      title: 'Stan prawny: listopad 2026',
      text: 'Tekst jest ogólną informacją o Kodeksie rodzinnym i opiekuńczym oraz o postępowaniu przed sądem. Nie zastępuje porady w konkretnej sprawie.',
    },
    { type: 'h2', text: 'Kto i do kiedy płaci alimenty' },
    {
      type: 'p',
      text: 'Rodzice mają obowiązek utrzymywać dziecko, które nie jest jeszcze w stanie utrzymać się samodzielnie. Wiek nie jest tu granicą. Pełnoletnie dziecko, które się uczy albo nie może pracować z powodu choroby, nadal może mieć prawo do alimentów. Rodzice mogą jednak odmówić świadczeń dorosłemu dziecku, jeśli są one dla nich połączone z nadmiernym uszczerbkiem albo jeśli dziecko nie dokłada starań, żeby się usamodzielnić.',
    },
    {
      type: 'p',
      text: 'Gdy rodzice mieszkają osobno, rodzic, z którym dziecko mieszka, wypełnia swój obowiązek także przez codzienną opiekę i wychowanie. Ustawa wprost zalicza te starania do świadczeń. Dlatego pieniądze płaci zwykle drugi rodzic.',
    },
    { type: 'h2', text: 'Od czego zależy kwota' },
    {
      type: 'p',
      text: 'Sąd patrzy na dwie rzeczy jednocześnie: usprawiedliwione potrzeby dziecka oraz zarobkowe i majątkowe możliwości rodzica, który ma płacić. Żadna z nich nie ma pierwszeństwa. Sąd nie liczy tylko tego, ile rodzic zarabia dziś. Jeśli zarabia mało, a mógłby zarabiać więcej, bierze pod uwagę także to, co mógłby zarobić.',
    },
    {
      type: 'p',
      text: 'Usprawiedliwione potrzeby obejmują jedzenie i ubranie, ale też część czynszu przypadającą na dziecko, szkołę, przedszkole albo żłobek, leki, dojazdy, zajęcia dodatkowe i wypoczynek, o ile mieszczą się w standardzie, w którym dziecko żyło przed rozstaniem rodziców. Świadczenia z pomocy państwa na dziecko nie obniżają alimentów.',
    },
    { type: 'h2', text: 'Co zebrać przed pozwem' },
    {
      type: 'ul',
      items: [
        'Odpis aktu urodzenia dziecka.',
        'Rachunki i potwierdzenia opłat: szkoła, przedszkole, zajęcia, leki, okulary, dojazdy, ubrania.',
        'Zaświadczenia o Twoich dochodach i, jeśli je masz, o dochodach drugiego rodzica.',
        'Informacje o tym, gdzie i jak pracuje drugi rodzic, jaki ma majątek i ile płaci za mieszkanie.',
        'Wcześniejsze ustalenia na piśmie, na przykład wiadomości o tym, ile i kiedy ktoś dokłada na dziecko.',
      ],
    },
    {
      type: 'p',
      text: 'Przed pozwem zrób zestawienie miesięcznych wydatków na dziecko. Kwotę popartą rachunkami łatwiej obronić niż okrągłą sumę wziętą z głowy.',
    },
    { type: 'h2', text: 'Jak wygląda sprawa' },
    {
      type: 'p',
      text: 'Pozew o alimenty składa się do sądu rejonowego. Można go wnieść do sądu, w którego okręgu mieszka dziecko, więc nie trzeba jechać do miasta drugiego rodzica. Sąd doręcza pozew pozwanemu, wyznacza rozprawę i przesłuchuje strony. Zwykle prosi też o zaświadczenia o dochodach.',
    },
    {
      type: 'p',
      text: 'Postępowanie trwa, a dziecko potrzebuje pieniędzy od razu. Dlatego razem z pozwem można złożyć wniosek o zabezpieczenie: sąd może wtedy na czas procesu przyznać tymczasową kwotę. Jej wysokość bywa niższa od tej, o którą prosisz w pozwie.',
    },
    {
      type: 'table',
      caption: 'Koszty sądowe w sprawie o alimenty',
      head: ['Rodzaj kosztu', 'Kto go zwykle ponosi'],
      rows: [
        ['Opłata od pozwu', 'Powód jest zwolniony z opłaty sądowej'],
        ['Zwrot kosztów przeciwnika, jeśli sprawę przegrasz', 'Powód, mimo zwolnienia z opłat'],
        ['Opłata za pomoc prawnika', 'Strona, która z niej korzysta, według umowy'],
      ],
    },
    {
      type: 'p',
      text: 'Zwolnienie z opłaty od pozwu dotyczy powoda w sprawach o alimenty. Nie oznacza zwolnienia z obowiązku zwrotu kosztów przeciwnika, jeśli sąd tak postanowi. Koszt zastępstwa prawnego, który zasądza sąd, liczy się według stawek minimalnych z rozporządzenia, więc może być niższy od honorarium, które umówisz z prawnikiem. Jak liczymy honorarium, opisaliśmy na stronie [honorarium](/sygnet/honorarium/).',
    },
    { type: 'h2', text: 'Podwyższenie, obniżenie i uchylenie' },
    {
      type: 'p',
      text: 'Wyrok o alimentach nie jest ostateczny na zawsze. Jeśli zmieniły się stosunki, każda ze stron może żądać zmiany orzeczenia: podwyższenia, obniżenia albo uchylenia obowiązku. Zmiana oznacza coś konkretnego, na przykład dziecko poszło do szkoły i koszty wzrosły, rodzic stracił pracę albo urodziło mu się kolejne dziecko. Samo upływanie lat nie wystarcza, trzeba pokazać, co się zmieniło.',
    },
    { type: 'h2', text: 'Gdy rodzic nie płaci' },
    {
      type: 'p',
      text: 'Z prawomocnym wyrokiem albo ugodą zatwierdzoną przez sąd można zgłosić się do komornika, który prowadzi egzekucję: zajmuje wynagrodzenie, rachunek lub inny majątek dłużnika. Zaległe raty nie czekają bez końca, bo przedawniają się, więc nie warto z egzekucją zwlekać.',
    },
    { type: 'h2', text: 'Kiedy zadzwonić do prawnika' },
    {
      type: 'p',
      text: 'Do prostej sprawy, w której rodzice się zgadzają, wystarczy ugoda spisana przed sądem. Pomoc prawnika ma sens, gdy druga strona ukrywa dochody, gdy jest kilkoro dzieci, gdy rodzic mieszka za granicą albo gdy sprawa o alimenty toczy się razem z rozwodem. Alimenty prowadzimy w ramach [spraw rodzinnych](/sygnet/specjalizacje/rodzina/). Jeśli chcesz najpierw porozmawiać, napisz przez [formularz](/sygnet/kontakt/) albo zadzwoń. Pierwsza rozmowa jest bez opłaty.',
    },
  ],
};
