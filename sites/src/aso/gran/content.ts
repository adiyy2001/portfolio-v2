import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji turystycznej',
  description:
    'Panorama ilustracyjna w praktyce: sześć screenshotów aplikacji Grań, które razem tworzą jeden krajobraz Sudetów. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B.',
  lead: 'Sześć screenshotów, które razem tworzą jeden krajobraz: od doliny o świcie, przez szczyt, po zejście o zachodzie. Zestaw do App Store i Google Play, po polsku i po angielsku.',
  facts: [
    ['Kategoria', 'Mapy i nawigacja'],
    ['Dla kogo', 'turyści weekendowi w Sudetach, 25 do 55 lat'],
    ['Zakres', '6 kadrów w 2 sklepach i 2 językach, wariant B, feature graphic, ikony'],
    ['Pliki', 'PNG bez kanału alfa, 1320×2868 i 1080×1920'],
  ] as [string, string][],
  client: [
    'Grań to aplikacja dla turystów, którzy w weekend jadą w Sudety z Wrocławia, Poznania i Opola. Liczy czas przejścia tak jak tabliczki na szlaku, ale w tempie użytkownika, działa bez zasięgu i pilnuje, żeby zejść przed zmrokiem.',
    'Zespół potrzebował zestawu screenshotów na premierę w obu sklepach, po polsku i po angielsku, oraz drugiej wersji pierwszego kadru do testu. Warunek był jeden: pierwsze trzy obrazy mają same wyjaśnić, po co jest ta aplikacja.',
  ],
  direction: {
    title: 'Jeden krajobraz, sześć okien',
    paragraphs: [
      'W wynikach wyszukiwania pierwsze trzy screenshoty stoją obok siebie. Ciągły krajobraz zamienia ten rząd w jedną scenę, więc Grań wyróżnia się wśród zrzutów ekranu na białym tle, zanim ktoś przeczyta choć jedno słowo.',
      'Turyści znają z Sudetów ten widok: kolejne grzbiety bledną w oddali. Płaska ilustracja wektorowa oddaje go kilkoma warstwami koloru i zostawia ekranom pełną czytelność. Telefony stoją w krajobrazie, za pagórkami i na skale, a nie unoszą się nad tłem.',
      'Paleta jest powściągliwa: chłodne szarozielone grzbiety, kremowe niebo i jedna czerwień, zarezerwowana dla szlaku. Krój Overpass wywodzi się z liter na znakach drogowych, więc nagłówki czyta się jak tabliczkę na rozstaju.',
    ],
    keywords: ['panorama 6 kadrów', 'warstwy grzbietów', 'jedna czerwień', 'krój z tabliczek'],
  },
  sequence: {
    intro:
      'Zestaw to jeden dzień na szlaku. Czerwona linia wchodzi w kadr pierwszy od dołu, wspina się przez drugi i trzeci, sięga szczytu w czwartym, idzie granią w piątym i schodzi w szóstym.',
    firstThree:
      'Pierwsze trzy kadry odpowiadają na pytanie, które turysta zadaje sobie w wynikach wyszukiwania: co to jest i czy mi się przyda. Szlaki z czasem przejścia, mapa bez zasięgu, bezpieczny powrót. Kolejne trzy pokazują głębię aplikacji w trakcie wyjścia.',
    roles: [
      'Czym jest Grań: mapa z czasem przejścia między skrzyżowaniami. Szlak z krajobrazu wchodzi prosto w szlak na mapie.',
      'Najczęstsza obawa w górach, czyli brak zasięgu. Mapy offline pokazane konkretnie, z pasmami i rozmiarami plików.',
      'Bezpieczeństwo bez straszenia: godzina, o której trzeba zawrócić, i słońce nisko nad zboczem.',
      'Szczyt. Profil trasy w poziomie, a za telefonem grań o dokładnie tym samym kształcie.',
      'Warunki na grani. Chmury przepływają przez łączenia kadrów, a nagłówek siedzi na ciemnym paśmie kosodrzewiny.',
      'Pamiątka z całego sezonu: dziennik zdobytych szczytów, na zejściu w świetle zachodu.',
    ],
  },
  search: {
    query: 'szlaki sudety',
    subtitle: 'Szlaki z czasem przejścia',
    note: 'Neutralna makieta wyników wyszukiwania. Tak zestaw wygląda w miniaturze: nagłówki czytelne przy szerokości około 100 pikseli, a panorama łączy trzy kadry w jeden widok.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język, sklep, a przy panoramie także sposób oglądania. Po połączeniu kadrów widać, że to jedna grafika pocięta co do piksela.',
  ab: {
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. Można go puścić jako test strony produktu w App Store i jako eksperyment w Google Play.',
    hypothesis:
      'Osoby, które pierwszy raz jadą w Sudety i nie są pewne swojej kondycji, chętniej zainstalują aplikację, gdy pierwszy kadr obiecuje trasę dopasowaną do nich, niż gdy obiecuje dokładne czasy.',
  },
  feature: {
    caption:
      'Feature graphic do Google Play: szeroki kadr grani o zachodzie, bez telefonu. Nazwa i hasło stoją w środkowych 80 procentach, a środek obrazu zostaje wolny pod przycisk odtwarzania.',
    icons:
      'Ta sama grafika w obu sklepach: trzy warstwy grzbietów i odcinek szlaku. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. Zaokrąglenie dokłada system, a w paczce są też osobne warstwy tła i pierwszego planu do Icon Composer.',
  },
  deliverables: {
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka oraz plik z nagłówkami, podtytułami i tekstami alternatywnymi. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar i liczba sztuk w zestawie.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    text: 'Nagłówki, teksty alternatywne i wszystkie dane w interfejsie leżą w jednym pliku na język. Kompozycje, ekrany i eksport są wspólne, więc wersja niemiecka czy czeska to tłumaczenie jednego pliku i ponowne uruchomienie eksportu.',
  },
  cta: {
    title: 'Potrzebujesz screenshotów do swojej aplikacji?',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
