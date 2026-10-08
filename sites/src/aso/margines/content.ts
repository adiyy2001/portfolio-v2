import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji z fiszkami',
  description:
    'Odręczne adnotacje w praktyce: sześć screenshotów aplikacji Margines, w której fiszka zapamiętuje zdanie, z którego pochodzi słowo. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B.',
  kicker: 'Screenshoty do sklepów',
  lead: 'Słówko z książki, serialu albo wyjazdu, zapisane razem ze zdaniem, w którym je spotkałeś. Sześć kadrów wygląda jak strona z zeszytu ucznia, który właśnie zrozumiał, jak się uczyć.',
  facts: [
    ['Kategoria', 'Edukacja'],
    ['Dla kogo', 'dorośli, którzy uczą się języka sami, 20 do 45 lat'],
    ['Zakres', '6 kadrów w 2 sklepach i 2 językach, wariant B, feature graphic, ikony'],
    ['Pliki', 'PNG bez kanału alfa, 1320×2868 i 1080×1920'],
  ] as [string, string][],
  client: {
    title: 'Słowa giną, bo tracą zdanie',
    note: 'kontekst zamiast listy',
    paragraphs: [
      'Margines to aplikacja z fiszkami dla ludzi, którzy uczą się języka na własną rękę: czytają po angielsku, oglądają seriale z napisami, jadą na tydzień do Walencji. Każda fiszka zapamiętuje zdanie, z którego pochodzi słowo, a powtórki przychodzą wtedy, gdy słowo zaczyna uciekać.',
      'Zespół potrzebował zestawu screenshotów na premierę w obu sklepach, po polsku i po angielsku, oraz drugiej wersji pierwszego kadru do testu. Kategoria jest zatłoczona, a większość konkurentów pokazuje to samo: kolorowe karty i licznik dni. Zestaw miał pokazać metodę, a nie tylko ekran.',
    ],
    brief: [
      ['Problem', 'słówka zapisane w zeszycie bez kontekstu wylatują z głowy po tygodniu'],
      ['Obietnica', 'słowo razem ze zdaniem, powtórka w porę i własne skojarzenie'],
      ['Ton', 'spokojny, rzeczowy, z przymrużeniem oka, jak notatki dobrego nauczyciela'],
    ] as [string, string][],
  },
  direction: {
    title: 'Notatki na marginesie interfejsu',
    note: 'tu nic nie jest ozdobą',
    paragraphs: [
      'Każdy, kto uczył się języka, zna ten widok: kartka w kratkę, czerwony margines, słowo obwiedzione flamastrem i strzałka do dopisku. Zestaw wygląda jak strona z takiego zeszytu, tylko że notatki opisują aplikację.',
      'Adnotacje mają jedną zasadę: każda wskazuje konkretny element interfejsu. Obwódka łapie zdanie z książki, zakreślacz liczbę kart na dziś, podwójne podkreślenie zaznaczone słowo. W kadrze są najwyżej trzy, a żadna nie zasłania tekstu w aplikacji.',
      'Nagłówki są pisane ręcznie krojem Caveat, interfejs składa Lexend, krój projektowany z myślą o łatwości czytania. Kreski flamastra są rysowane z ustalonym ziarnem losowości, więc każdy eksport, także w nowym języku, wygląda tak samo.',
    ],
    keywords: ['papier w kratkę', 'obwódka flamastrem', 'zakreślacz', 'taśma i naklejki'],
    type: 'Caveat w grubościach 500, 600 i 700 w nagłówkach i notatkach, Lexend w grubościach 400, 500 i 700 w interfejsie',
    tools: [
      ['Obwódka', 'zdanie, które zostaje na karcie'],
      ['Zakreślacz', 'liczba kart i minut na dziś'],
      ['Podwójna kreska', 'słowo zaznaczone w tekście'],
      ['Taśma', 'rysunek wyjęty z telefonu'],
    ] as [string, string][],
  },
  sequence: {
    title: 'Metoda, wejście, nawyk',
    note: 'czytaj od lewej',
    intro:
      'Kadry pierwszy, drugi i trzeci tłumaczą metodę: słowo ze zdaniem, powtórka w porę i własny rysunek. Czwarty pokazuje, jak słowa trafiają do aplikacji, piąty, ile to zajmuje czasu, szósty, z czego można się uczyć.',
    firstThree:
      'W wynikach wyszukiwania widać tylko trzy pierwsze kadry. Razem odpowiadają na pytanie, czym Margines różni się od innych fiszek: pamięta zdanie, pilnuje terminu powtórki i zostawia miejsce na twoje skojarzenie.',
    roles: [
      'Obietnica w jednym kadrze. Zdanie z książki obwiedzione flamastrem, a notatka na marginesie mówi, że zostaje na karcie.',
      'Zakreślacz na 18 kartach i 6 minutach, a obok krzywa zapominania z kropką w miejscu, w którym przychodzi powtórka.',
      'Rysunek z tyłu fiszki wychodzi z telefonu i ląduje na kartce, przyklejony taśmą. Strzałka prowadzi z powrotem na pusty ekran.',
      'Jedyny kadr z telefonem na środku. Słowo podkreślone dwa razy, naklejka z plusem na przycisku dodawania.',
      'Wynik z ekranu postępu obwiedziony na zielono, a na marginesie ołówkowa wersja tego samego wykresu.',
      'Trzy talie wysuwają się zza telefonu jak karty z pudełka: książka, serial i podróż, każda z własnym rysunkiem.',
    ],
  },
  search: {
    title: 'Trzy kadry w miniaturze',
    note: 'czytelne przy 100 px',
    query: 'fiszki angielski',
    subtitle: 'Słówka zapamiętane razem ze zdaniem',
    text: 'Neutralna makieta wyników wyszukiwania w obu sklepach. W miniaturze ręczne pismo dalej czyta się jako pierwsze, a czerwona obwódka i żółty zakreślacz od razu mówią, na co patrzeć.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język i sklep. W wersji angielskiej uczeń jest Anglikiem, który uczy się polskiego, więc na kartach są słowa takie jak spóźnić się i szczęśliwa, z polskimi znakami w pełnej krasie.',
  ab: {
    title: 'Metoda czy twój zeszyt',
    note: 'jedna zmiana naraz',
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. W App Store można go puścić jako test strony produktu, w Google Play jako eksperyment na karcie aplikacji.',
    hypothesis:
      'Ludzie, którzy już prowadzą zeszyt ze słówkami, mocniej zareagują na obietnicę fiszek z ich własnych notatek niż na obietnicę kontekstu. Wariant B powinien dać więcej instalacji w tej grupie.',
  },
  feature: {
    title: 'Margines bez telefonu',
    note: 'środek zostaje wolny',
    caption:
      'Feature graphic do Google Play: ta sama kratka, nazwa napisana ręcznie i podkreślona flamastrem, a obok fiszka z rysunkiem przyklejona taśmą. Wszystko ważne mieści się w środkowych 80 procentach obrazu.',
    icons:
      'Ikona to fiszka z czerwonym marginesem i gwiazdką narysowaną atramentem, jak w zeszycie przy słowie do zapamiętania. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. Zaokrąglenie dokłada system, a w paczce są też osobne warstwy do Icon Composer.',
  },
  deliverables: {
    title: 'Paczka gotowa do wysłania',
    note: 'sprawdzone walidatorem',
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka oraz plik z nagłówkami i tekstami alternatywnymi. Pliki są w formacie PNG, bo papier, kreski i tekst kompresują się w nim bez strat i bez rozmytych krawędzi. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar i liczba sztuk w zestawie.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    note: 'tłumaczysz plik, nie obrazki',
    text: 'Nagłówki, notatki na marginesie, teksty alternatywne i wszystkie dane w interfejsie leżą w jednym pliku na język. Adnotacje same znajdują swoje miejsce: obwódka mierzy zdanie po złożeniu tekstu, więc dłuższe zdanie w innym języku dostaje większe kółko. Kolejny język to tłumaczenie jednego pliku i ponowny eksport.',
  },
  cta: {
    title: 'Twoja aplikacja też ma metodę, którą warto pokazać',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
