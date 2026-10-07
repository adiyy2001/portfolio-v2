import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji z lokalnymi sklepami',
  description:
    'Mocne gradienty z przechylonymi urządzeniami w praktyce: sześć screenshotów aplikacji Szyld, która zbiera zamówienia z piekarni, warzywniaka i kwiaciarni z jednej ulicy. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B.',
  kicker: 'Screenshoty do sklepów',
  lead: 'Chleb z piekarni, pomidory z warzywniaka, tulipany od kwiaciarki. Jedno zamówienie, odbiór po drodze z pracy. Sześć kadrów, które mają tyle energii co ulica o 17:30.',
  facts: [
    ['Kategoria', 'Zakupy'],
    ['Dla kogo', 'mieszkańcy Jeżyc i Łazarza, 25 do 45 lat'],
    ['Zakres', '6 kadrów w 2 sklepach i 2 językach, wariant B, feature graphic, ikony'],
    ['Pliki', 'JPEG bez kanału alfa, 1320×2868 i 1080×1920'],
  ] as [string, string][],
  client: {
    title: 'Sklepy z ulicy kontra dostawa pod drzwi',
    paragraphs: [
      'Szyld to aplikacja dla małych sklepów z sąsiedztwa: piekarni, warzywniaka, sklepu żelaznego, kwiaciarni i księgarni. Klient składa jedno zamówienie w kilku sklepach naraz, wybiera godzinę i odbiera wszystko po drodze do domu, pokazując kod przy ladzie.',
      'Zespół startuje na poznańskich Jeżycach i potrzebował zestawu screenshotów na premierę w obu sklepach, po polsku i po angielsku, plus drugiej wersji pierwszego kadru do testu. Konkurencją są wielkie platformy z dostawą, więc zestaw musiał być głośniejszy od nich, a nie grzeczniejszy.',
    ],
    brief: [
      [
        'Problem',
        'ludzie chcą kupować lokalnie, ale nie chcą stać w kolejce ani trafić na pustą półkę',
      ],
      ['Obietnica', 'jeden koszyk w kilku sklepach i odbiór o wybranej godzinie'],
      ['Ton', 'szybki, uliczny, pewny siebie, bez rabatów i wykrzykników'],
    ] as [string, string][],
  },
  direction: {
    title: 'Ruch, perspektywa i dwa gradienty',
    paragraphs: [
      'Zakupy po drodze to ruch: z pracy, rowerem, między ladami. Dlatego telefony nie stoją grzecznie na środku. Przechylają się w trzech wymiarach, wychodzą poza kadr, a etykiety sklepów wylatują z ekranu jak z witryny.',
      'Nagłówki są większe od telefonów, złożone szerokim, ciężkim groteskiem Mona Sans w szerokości 125. W miniaturze wyników wyszukiwania czyta się je pierwsze, zanim ktokolwiek przyjrzy się interfejsowi.',
      'Tło to dwa gradienty z ziarnem, które naprzemiennie biegną przez zestaw: butelkowa zieleń w limonkę i grejpfrut w limonkę. Żadnego fioletu ani niebieskiego. Ziarno nadaje kolorom fakturę druku i przy okazji usuwa pasy na przejściach.',
    ],
    keywords: ['perspektywa 3D', 'telefon poza kadrem', 'ziarno', 'nagłówek większy od telefonu'],
    duotones: [
      { name: 'Butelka w Limonkę', from: '#0B4A3D', to: '#D5F25C', frames: 'kadry 1, 3 i 5' },
      { name: 'Grejpfrut w Limonkę', from: '#FF5A36', to: '#D5F25C', frames: 'kadry 2, 4 i 6' },
    ],
    type: 'Mona Sans: szerokość 125 i grubość 800 lub 900 w nagłówkach, szerokość 100 i grubość 400, 600 i 700 w interfejsie',
  },
  sequence: {
    title: 'Od zamówienia do sobotniego nawyku',
    intro:
      'Kadry pierwszy, drugi i trzeci mówią, czym jest Szyld. Czwarty i piąty zdejmują dwie obawy: czy zdążę i czy postoję w kolejce. Szósty zamienia jednorazowe zakupy w zwyczaj.',
    firstThree:
      'W wynikach wyszukiwania widać tylko trzy pierwsze kadry. Razem odpowiadają na pytanie, co to za aplikacja: zamawiasz z ulicy, widzisz sklepy z okolicy na mapie i łączysz kilka sklepów w jedną trasę.',
    roles: [
      'Obietnica w jednym zdaniu. Trzy sklepy na jednej trasie, a telefon wjeżdża w kadr z prawej, jakby ktoś szedł z nim ulicą.',
      'Telefon leży jak na stole, a pinezki sklepów wstają nad mapą. Widać, że to sklepy z sąsiedztwa, a nie magazyn.',
      'Jeden koszyk, trzy sklepy. Etykiety wylatują z ekranu, a nagłówek biegnie pionowo wzdłuż krawędzi.',
      'Godzina odbioru, którą wybiera klient. Ogromne 17:30 w konturze stoi za telefonem jak cyfry na zegarze dworcowym.',
      'Kod przy ladzie. Karta z kodem wysuwa się przed telefon, a na ekranie zostaje po niej puste miejsce.',
      'Stałe zamówienie na sobotę. Telefon wyrasta z dolnej krawędzi, za nim słowo SOBOTA na całą szerokość.',
    ],
  },
  search: {
    title: 'Trzy kadry w miniaturze',
    query: 'zakupy lokalne odbiór',
    subtitle: 'Zamów z ulicy, odbierz po drodze',
    note: 'Neutralna makieta wyników wyszukiwania w obu sklepach. Przy szerokości około 100 pikseli nagłówek dalej czyta się jako pierwszy, a ciemny i jasny gradient na zmianę odróżniają kadry od siebie.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język i sklep. W App Store telefon jest narysowany razem z obudową, w Google Play ekran przechyla się bez obudowy, bo tak zaleca Google.',
  ab: {
    title: 'Trasa czy pewność, że towar będzie',
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. W App Store można go puścić jako test strony produktu, w Google Play jako eksperyment na karcie aplikacji.',
    hypothesis:
      'Obawa, że świeży chleb albo kwiaty się wyprzedadzą, przekonuje mocniej niż wygoda jednej trasy. Obietnica odłożenia towaru powinna dać więcej instalacji niż obietnica odbioru po drodze.',
  },
  feature: {
    title: 'Szyld bez telefonu',
    caption:
      'Feature graphic do Google Play: ten sam gradient z ziarnem, nazwa i hasło po lewej, trzy etykiety sklepów w perspektywie po prawej. Wszystko ważne mieści się w środkowych 80 procentach, a środek obrazu zostaje wolny pod przycisk odtwarzania.',
    icons:
      'Ikona to szyld nad drzwiami: limonkowa tablica na wysięgniku z wyciętą torbą na zakupy. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. Zaokrąglenie dokłada system, a w paczce są też osobne warstwy do Icon Composer.',
  },
  deliverables: {
    title: 'Paczka gotowa do wysłania',
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka oraz plik z nagłówkami i tekstami alternatywnymi. Pliki są w formacie JPEG, bo ziarno w formacie PNG ważyłoby kilka razy więcej. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar i liczba sztuk w zestawie.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    text: 'Nagłówki, teksty alternatywne i wszystkie dane w interfejsie, od nazw produktów po godziny odbioru, leżą w jednym pliku na język. Wersja angielska ma ten sam świat, ale pisany od nowa: ceny z kropką, godziny w formacie 5:30 pm, kajzerka jako kaiser roll. Kolejny język to tłumaczenie jednego pliku i ponowny eksport.',
  },
  cta: {
    title: 'Twoja aplikacja też zasługuje na głośny start',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
