import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji do odkrywania muzyki i koncertów',
  description:
    'Y2K holograficzny chrom w praktyce: sześć screenshotów aplikacji Bis, która pokazuje koncerty artystów, których słuchasz, i nowych wykonawców grających w twoim mieście. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B.',
  kicker: 'Screenshoty do sklepów',
  lead: 'Koncerty artystów z twojej biblioteki, nowi wykonawcy grający tuż obok i przypomnienie, zanim ruszy sprzedaż biletów. Sześć kadrów w stylu Y2K: chromowane litery, holograficzne naklejki z okładkami z kształtów i srebro, na którym wszystko błyszczy.',
  stickers: [
    ['Muzyka', 'kategoria'],
    ['18 do 35 lat', 'dla kogo'],
    ['2 sklepy, 2 języki', 'zakres'],
    ['JPEG, jakość 90', 'pliki'],
  ] as [string, string][],
  client: {
    title: 'Bilety znikają, zanim się dowiesz',
    caption: 'Klient i zadanie',
    paragraphs: [
      'Bis to aplikacja dla ludzi, którzy chodzą do klubów dwa albo trzy razy w miesiącu. Zbiera koncerty artystów z twojej biblioteki, podsuwa nowych wykonawców, którzy grają w twoim mieście, i przypomina o biletach, zanim ruszy sprzedaż. Pierwsze miasto to Warszawa.',
      'Zespół potrzebował zestawu do obu sklepów, po polsku i po angielsku, i wariantu pierwszego kadru do testu. Kategoria muzyki jest pełna ciemnych ekranów i zdjęć ze sceny. Bis miał wyglądać jak naklejka na futerale gitary: jasno, błyszcząco i trochę z przymrużeniem oka.',
    ],
    brief: [
      ['Problem', 'o koncertach małych wykonawców ludzie dowiadują się po fakcie'],
      ['Obietnica', 'twoi artyści na żywo, nowi tuż obok i nigdy więcej przegapionej sprzedaży'],
      ['Granica', 'zmyśleni wykonawcy i kluby, okładki z kształtów, żadnych cen biletów'],
    ] as [string, string][],
  },
  direction: {
    title: 'Chrom, hologram i naklejki',
    caption: 'Kierunek',
    paragraphs: [
      'Odbiorcy Bis mają od osiemnastu do trzydziestu pięciu lat i właśnie odkrywają estetykę początku wieku: chromowane litery z płyt, holograficzne naklejki, gwiazdki i błyszczące bąbelki. Ten styl pasuje do muzyki, bo pochodzi z okładek i plakatów, a w sklepie z ciemnymi ikonami jasne srebro od razu się wyróżnia.',
      'W kadrach od czwartego kluczowe słowa nagłówków są chromowane. Skrypt mierzy je po załadowaniu fontów i rysuje na nich warstwy: cień, ciemną krawędź i gradient z odbiciem nieba, horyzontu i ciepłej ziemi. W trzech pierwszych kadrach, widocznych w wynikach wyszukiwania, kluczowe słowo zostaje w atramencie na holograficznej naklejce, bo chrom w miniaturze traci kształt liter.',
      'Tło zostaje srebrne, a iryzacja żyje w plamach na brzegach i na naklejkach, dlatego zestaw nie zamienia się w fioletowo niebieski gradient. Telefon ma chromowaną obudowę i przechyla się tylko w płaszczyźnie kadru. Okładki płyt są zbudowane z kół, gwiazd i pasów, bez zdjęć i bez prawdziwych wydawnictw.',
    ],
    keywords: [
      'srebrne tło',
      'chromowane słowa',
      'holograficzne naklejki',
      'gwiazdki',
      'bąbelkowy krój',
    ],
    type: 'Modak w nagłówkach i chromowanych słowach, Quicksand w grubościach 500, 600 i 700 w interfejsie',
    tools: [
      ['Chrom', 'kluczowe słowo nagłówka z odbiciem nieba i ciepłej ziemi'],
      ['Naklejki', 'okładki, dzwonek i bilety jako błyszczące naklejki z białą krawędzią'],
      ['Hologram', 'iryzujące plamy na brzegach kadru i karty wykonawców jak kolekcjonerskie'],
      ['Gwiazdki', 'czteroramienne błyski przy słowach i na tle'],
    ] as [string, string][],
  },
  sequence: {
    title: 'Twoi, nowi i bilety',
    caption: 'Setlista',
    intro:
      'Pierwsze trzy kadry odpowiadają na pytanie, po co jest Bis: koncerty artystów, których słuchasz, nowe brzmienia grające tuż obok i przypomnienie przed sprzedażą biletów. Czwarty i piąty mówią o planowaniu ze znajomymi, a szósty o tym, co zostaje po koncercie.',
    firstThree:
      'W wynikach wyszukiwania widać trzy pierwsze kadry. Razem mówią, czym jest Bis: znajdzie koncerty twoich artystów, pokaże nowych wykonawców w okolicy i nie pozwoli przegapić biletów.',
    roles: [
      'Obietnica w jednym obrazie. Lista koncertów w tym tygodniu, a wokół telefonu błyszczące naklejki z okładkami artystów z biblioteki.',
      'Holograficzne karty wykonawców wiszą nad nagłówkiem jak karty kolekcjonerskie, a pod nim stoi telefon z ekranem Odkrywaj. Każda karta ma gatunek, dzień i klub.',
      'Powiadomienie o biletach wychodzi z ekranu i staje się dużą chromowaną ramką. Obok dzwonek i okładka koncertu jako naklejki.',
      'Jedyny kadr z telefonem na środku. Wokół niego krąży holograficzny pierścień z bąbelkami znajomych, którzy idą albo może pójdą.',
      'Kalendarz w telefonie, a obok holograficzne kafelki z dniami koncertów. Limonkowe to te, na które masz bilet.',
      'Kolaż naklejek z biletami z tego roku nad małym telefonem z kolekcją. Pamiątka, która zostaje po koncercie.',
    ],
  },
  search: {
    title: 'Błysk w miniaturze',
    caption: 'Wyniki wyszukiwania',
    query: 'koncerty warszawa',
    subtitle: 'Koncerty artystów, których słuchasz',
    text: 'Neutralna makieta wyników wyszukiwania w obu sklepach. Chrom łatwo traci czytelność w małej miniaturze, więc w trzech pierwszych kadrach kluczowe słowo jest w atramencie na holograficznej naklejce, a chrom wraca od czwartego kadru. Srebrne tło odcina się od ciemnych ikon konkurencji.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język i sklep. Wersja angielska zostaje w Warszawie, z tymi samymi wykonawcami i klubami, ale teksty są napisane od nowa, z godzinami w zapisie 8 pm i datami po brytyjsku.',
  ab: {
    title: 'Strona A, strona B',
    caption: 'Test A/B',
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. W App Store można go puścić jako test strony produktu, w Google Play jako eksperyment na karcie aplikacji.',
    hypothesis:
      'Słuchacze, którzy szukają nowej muzyki, mocniej zareagują na obietnicę odkrywania niż na koncerty artystów, których już znają. Wariant B pokazuje 30 sekund utworu zespołu, który zagra u ciebie w piątek.',
  },
  feature: {
    title: 'Napis, który błyszczy',
    caption: 'Grafiki',
    text: 'Feature graphic do Google Play: srebro z holograficznymi plamami na brzegach, chromowany napis Bis po lewej i obietnica w atramencie po prawej. Telefonu nie ma, a środek, w którym sklep może położyć przycisk odtwarzania, zajmuje błysk na holograficznym krążku, bez tekstu.',
    icons:
      'Ikona to chromowana czteroramienna gwiazdka na holograficznym krążku i srebrnym tle. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. W paczce są też osobne warstwy tła i gwiazdki do Icon Composer.',
  },
  deliverables: {
    title: 'Bilet na całą paczkę',
    caption: 'Pliki',
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka oraz plikiem z nagłówkami i tekstami alternatywnymi. Pliki są w formacie JPEG w jakości 90 bez podpróbkowania koloru: iryzujące gradienty w PNG ważyłyby kilka razy więcej, a krawędzie liter zostają czyste. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar, liczba sztuk w zestawie i lista słów, których sklepy nie lubią.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    caption: 'Języki',
    text: 'Nagłówki, kluczowe słowo, teksty alternatywne i wszystkie dane w interfejsie leżą w jednym pliku na język. Skrypt sam mierzy, gdzie w nowym języku wypada kluczowe słowo, i rysuje na nim chrom albo holograficzną naklejkę. Kolejny język to jeden nowy plik i ponowny eksport.',
  },
  names: {
    title: 'Wykonawcy, których nie ma',
    text: 'Wszyscy wykonawcy, utwory i kluby są zmyśleni. Każdą nazwę sprawdziłem w wyszukiwarce, a te, które już istniały albo brzmiały jak istniejący zespół czy klub, odpadły.',
  },
  cta: {
    title: 'Twoja aplikacja muzyczna też może błyszczeć',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
