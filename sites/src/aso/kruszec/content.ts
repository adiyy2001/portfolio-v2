import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji do budżetu i inwestowania',
  description:
    'Ciemne szkło premium w praktyce: sześć screenshotów aplikacji Kruszec, która pokazuje budżet, poduszkę finansową i inwestycje na jednym wykresie majątku. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B i pokazowym zestawem na iPada.',
  kicker: 'Screenshoty do sklepów',
  lead: 'Budżet na co dzień, poduszka finansowa i inwestycje na jednym spokojnym wykresie majątku. Sześć kadrów pokazuje aplikację do finansów osobistych bez obietnic i bez krzyku: granat, matowe szkło i jedna linia, która prowadzi przez cały zestaw.',
  facts: [
    ['Kategoria', 'Finanse'],
    ['Dla kogo', 'osoby od 28 do 50 lat, które co miesiąc odkładają i inwestują pasywnie'],
    [
      'Zakres',
      '6 kadrów w 2 sklepach i 2 językach, wariant B, zestaw na iPada, feature graphic, ikony',
    ],
    ['Pliki', 'JPEG w jakości 90, 1320×2868, 1080×1920 i 2064×2752'],
  ] as [string, string][],
  client: {
    title: 'Budżet w jednej aplikacji, inwestycje w arkuszu',
    caption: 'Klient i zadanie',
    paragraphs: [
      'Kruszec to aplikacja do finansów osobistych dla ludzi, którzy mają konto oszczędnościowe, IKE albo IKZE i kilka funduszy indeksowych. Budżet zwykle prowadzą w jednej aplikacji, a inwestycje w arkuszu, więc nigdy nie widzą całości. Kruszec zbiera konta wpisane ręcznie albo z pliku CSV i rysuje z nich jeden wykres majątku netto.',
      'Zespół potrzebował zestawu do obu sklepów, po polsku i po angielsku, wariantu pierwszego kadru do testu i zestawu na iPada, bo z panelu finansowego ludzie naprawdę korzystają na tablecie. Kategoria finansów jest pełna zielonych strzałek w górę. Ten zestaw miał budzić zaufanie spokojem, a nie obietnicą.',
    ],
    brief: [
      ['Problem', 'budżet w aplikacji, inwestycje w arkuszu, brak obrazu całości'],
      ['Obietnica', 'cały majątek na jednym wykresie, wiesz, ile możesz dziś wydać'],
      ['Granica', 'żadnych stóp zwrotu i obietnic, każda liczba opisana jako przykładowa'],
    ] as [string, string][],
  },
  direction: {
    title: 'Spokój zamiast zielonych strzałek',
    caption: 'Kierunek',
    paragraphs: [
      'Pieniądze to temat, przy którym ludzie chcą czuć się bezpiecznie. Dlatego zestaw jest ciemny i cichy: głęboki granat, karty z matowego szkła ustawione w głębi i jedna linia majątku z delikatną poświatą. Nie ma neonu, nie ma nasyconych kolorów, a jedyny cieplejszy odcień czeka na rzadką wartość ujemną.',
      'Bohaterem nie jest telefon, tylko wykres. W pierwszym kadrze linia majątku wychodzi z ekranu i biegnie przez cały kadr, a skrypt mierzy jej położenie na ekranie przy każdym eksporcie, więc w każdym języku łączy się dokładnie z wykresem w aplikacji.',
      'Nagłówki składa Instrument Serif, wąski i elegancki szeryf, z jednym słowem w kursywie w kolorze linii. Interfejs składa Manrope z cyframi tabelarycznymi, żeby kwoty w kolumnach stały równo. Każdy ekran ma znacznik „Dane przykładowe”.',
    ],
    keywords: [
      'głęboki granat',
      'matowe szkło',
      'jedna linia',
      'szeryf i kursywa',
      'cyfry tabelaryczne',
    ],
    type: 'Instrument Serif w nagłówkach i dużych liczbach, Manrope w grubościach 400, 500, 600 i 700 w interfejsie',
    tools: [
      ['Linia', 'majątek netto jako jedyny bohater, z poświatą zamiast neonu'],
      ['Szkło', 'karty z matowego szkła przed telefonem, w głębi ostrości'],
      ['Głębia', 'rozmyty telefon za kartą, jak przy małej głębi ostrości'],
      ['Znacznik', 'każda liczba podpisana jako przykładowa'],
    ] as [string, string][],
  },
  sequence: {
    title: 'Całość, dzień i bezpieczeństwo',
    caption: 'Sekwencja',
    intro:
      'Pierwsze trzy kadry pokazują całość, codzienność i bezpieczeństwo: majątek na jednym wykresie, kwotę, którą można dziś wydać, i poduszkę liczoną w miesiącach. Czwarty i piąty mówią o inwestowaniu bez obietnic, a szósty zamienia aplikację w miesięczny rytuał.',
    firstThree:
      'W wynikach wyszukiwania widać trzy pierwsze kadry. Razem mówią, czym jest Kruszec: pokazuje cały majątek, pilnuje budżetu na dziś i liczy, na ile miesięcy wystarczy poduszka.',
    roles: [
      'Obietnica w jednym obrazie. Linia majątku z trzech lat wychodzi z telefonu i biegnie w lewo aż do 2021 roku.',
      'Telefon wysoko, a przed nim szklana karta z kwotą na dziś, ostrzejsza niż ekran za nią.',
      'Duży miernik poduszki na szklanej karcie, a za nim rozmyty telefon, jak przy małej głębi ostrości.',
      'Jedyny kadr z telefonem na środku. Pierścień alokacji otacza telefon i pokazuje, jak portfel stoi obok twojego planu.',
      'Szklana oś czasu przecina kadr za telefonem. Wpłaty to kropki, które idą do celu, licząc same wpłaty.',
      'Dwa telefony jeden na drugim: lista kont z tyłu i spokojny raport za wrzesień z przodu.',
    ],
  },
  search: {
    title: 'Ciemny zestaw w miniaturze',
    caption: 'Wyniki wyszukiwania',
    query: 'budżet domowy',
    subtitle: 'Cały majątek na jednym wykresie',
    text: 'Neutralna makieta wyników wyszukiwania w obu sklepach. Ciemny zestaw łatwo zamienia się w błoto w małej miniaturze, więc nagłówki są jasne i duże, a linia wykresu ma poświatę, która trzyma ją przy szerokości stu pikseli.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język i sklep. Wersja angielska to inny świat, nie tłumaczenie: zamiast IKE i IKZE są ISA i emerytura pracownicza, zamiast obligacji skarbowych gilty, a kwoty są w funtach.',
  ipad: {
    title: 'Ten sam zestaw na iPadzie',
    caption: 'iPad 13 cali',
    text: 'Panel finansowy to aplikacja, której ludzie używają na tablecie, więc Kruszec dostał pokazowy zestaw na iPada 13 cali w rozdzielczości 2064×2752. Nagłówki zostają te same, a ekrany zmieniają się w panel z dwiema kolumnami: wykres obok listy kont, budżet obok celu.',
    pl: 'Wersja polska',
    en: 'Wersja angielska',
  },
  ab: {
    title: 'Wykres czy jedno miejsce',
    caption: 'Test A/B',
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. W App Store można go puścić jako test strony produktu, w Google Play jako eksperyment na karcie aplikacji.',
    hypothesis:
      'Ludzie, którzy prowadzą budżet w jednej aplikacji, a inwestycje w arkuszu, mocniej zareagują na obietnicę „wszystko w jednym miejscu” niż na sam wykres. Wariant B pokazuje listę kont zamiast linii majątku.',
  },
  feature: {
    title: 'Linia bez telefonu',
    caption: 'Grafiki',
    text: 'Feature graphic do Google Play: granat, przez który biegnie spokojna linia majątku z poświatą, nazwa w szeryfie i obietnica po lewej. Telefonu nie ma, a środek, w którym sklep może położyć przycisk odtwarzania, zostaje wolny od tekstu.',
    icons:
      'Ikona to kwadrat z matowego szkła na granacie i jedna spokojna linia w kolorze szałwii. Bez strzałki w górę i bez schodów, które obiecywałyby wzrost. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. W paczce są też osobne warstwy do Icon Composer.',
  },
  deliverables: {
    title: 'Paczka gotowa do wysłania',
    caption: 'Pliki',
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka, zestawem na iPada oraz plikiem z nagłówkami i tekstami alternatywnymi. Pliki są w formacie JPEG w jakości 90 bez podpróbkowania koloru: miękkie poświaty i rozmycia w PNG ważyłyby pięć razy więcej, a przy tej jakości krawędzie tekstu zostają czyste. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar, liczba sztuk w zestawie i lista słów, których w aplikacji finansowej nie wolno użyć, jak zysk czy stopa zwrotu.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    caption: 'Języki',
    text: 'Nagłówki, słowo w kursywie, teksty alternatywne i wszystkie dane w interfejsie leżą w jednym pliku na język, razem z walutą. Linia majątku przelicza się z kwot w pliku, a skrypt dopasowuje ją do wykresu na ekranie. Kolejny język to jeden nowy plik i ponowny eksport.',
  },
  cta: {
    title: 'Twoja aplikacja finansowa też może mówić spokojnie',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
