import { glueDeep } from '../shared/typography';

export const content = glueDeep({
  title: 'Screenshoty do sklepów dla aplikacji z przepisami',
  description:
    'Memphis i pop-art w praktyce: sześć screenshotów aplikacji Chochla, która planuje obiady na tydzień i sama pisze listę zakupów. Zestaw do App Store i Google Play, po polsku i po angielsku, z wariantem do testu A/B.',
  kicker: 'Screenshoty do sklepów',
  lead: 'Plan obiadów na cały tydzień, lista zakupów, która pisze się sama, i przepisy z tego, co już leży w lodówce. Sześć kadrów opowiada to jak komiks, w którym mówią pomidor, pieróg i patelnia.',
  facts: [
    ['Kategoria', 'Jedzenie i picie'],
    ['Dla kogo', 'pary i rodziny, które gotują w domu 4 do 6 razy w tygodniu'],
    ['Zakres', '6 kadrów w 2 sklepach i 2 językach, wariant B, feature graphic, ikony'],
    ['Pliki', 'PNG bez kanału alfa, 1320×2868 i 1080×1920'],
  ] as [string, string][],
  client: {
    title: 'Codziennie to samo pytanie',
    caption: 'Rozdział 1: klient i zadanie',
    paragraphs: [
      'Chochla to aplikacja do planowania obiadów dla domów, w których gotuje się prawie codziennie. Przepisy przeciąga się na dni tygodnia, a z planu powstaje lista zakupów pogrupowana według działów sklepu. Kiedy plan się sypie, aplikacja podpowiada obiad z tego, co zostało w lodówce.',
      'Zespół potrzebował zestawu screenshotów do obu sklepów, po polsku i po angielsku, i drugiej wersji pierwszego kadru do testu. Kategoria jest pełna zdjęć jedzenia, które wyglądają tak samo. Zestaw miał się od nich odróżniać już w wynikach wyszukiwania i pokazać, że to narzędzie do planowania, a nie kolejna książka kucharska.',
    ],
    brief: [
      ['Problem', 'obiad wymyślany codziennie o 17, zakupy bez listy, jedzenie w koszu'],
      ['Obietnica', 'tydzień obiadów z głowy, lista zakupów gotowa, obiad z tego, co jest'],
      ['Ton', 'ciepły, zabawny, rodzinny, bez kuchennego patosu'],
    ] as [string, string][],
  },
  direction: {
    title: 'Komiks zamiast zdjęć jedzenia',
    caption: 'Rozdział 2: kierunek',
    paragraphs: [
      'Planowanie obiadów to rodzinna codzienność, a nie restauracyjna sesja zdjęciowa. Dlatego zamiast fotografii talerzy jest komiks: pomidor, jajko, pieróg i patelnia zbudowane z kół, trójkątów i zygzaków mówią nagłówki w dymkach, a wokół fruwa konfetti w duchu Memphis.',
      'Wzory trzymają się krawędzi kadru. Telefon ma wokół siebie pas ciszy i żaden zygzak nie wchodzi na interfejs, co sprawdza skrypt przy każdym eksporcie. Kolory są płaskie, kontury grube, a cieniowanie robi raster z kropek, jak w starym druku.',
      'Nagłówki składa Bangers, krój jak z komiksowego dymka, z wysokimi akcentami nad wielkimi literami, więc dymek ma zapas u góry. Interfejs składa Figtree. Dymki rysują się same wokół tekstu po złożeniu, więc dłuższy nagłówek w innym języku dostaje większy dymek bez ręcznej pracy.',
    ],
    keywords: [
      'płaskie kolory',
      'grube kontury',
      'raster z kropek',
      'konfetti Memphis',
      'dymki i plansze',
    ],
    type: 'Bangers w nagłówkach i dymkach, Figtree w grubościach 500, 700 i 800 w interfejsie',
    tools: [
      ['Dymek', 'nagłówek mówi postać, która pasuje do ekranu'],
      ['Raster', 'cień z kropek zamiast gradientu'],
      ['Konfetti', 'trójkąty, zygzaki i kropki tylko przy krawędzi'],
      ['Plansza', 'kadry dzielone na komiksowe okienka'],
    ] as [string, string][],
  },
  sequence: {
    title: 'Plan, zakupy, garnek',
    caption: 'Rozdział 3: sekwencja',
    intro:
      'Pierwsze trzy kadry rozwiązują wieczorny problem od początku do końca: plan na tydzień, lista zakupów i obiad z tego, co jest. Czwarty i piąty pokazują samo gotowanie, szósty daje powód, żeby zostać z aplikacją na dłużej.',
    firstThree:
      'W wynikach wyszukiwania widać trzy pierwsze kadry. Razem mówią, czym jest Chochla: planuje obiady, pisze listę zakupów i ratuje dzień, w którym planu nie było.',
    roles: [
      'Obietnica w jednym zdaniu. Pomidor mówi o całym tygodniu, a na ekranie dorsz właśnie wjeżdża na wolny piątek.',
      'Dwie plansze: kartka z listą mówi nagłówek, a niżej lista zakupów pogrupowana według działów, z odhaczonymi produktami.',
      'Jedyny kadr z telefonem na środku. Jajko, cukinia, ser i cebula wskazują ekran, na którym pasują trzy przepisy.',
      'Przepis przeliczony na pięć osób, a obok dwa rastrowe koła: dla dwojga i dla piątki. Mówi pieróg.',
      'Tryb gotowania z minutnikiem. Za telefonem wybucha pop-artowa gwiazda, a patelnia robi dzyń.',
      'Komiksowa strona z dwiema kartami przepisów od babci i mamy oraz telefonem z rodzinnymi kolekcjami.',
    ],
  },
  search: {
    title: 'Trzy kadry w miniaturze',
    caption: 'Rozdział 4: wyniki wyszukiwania',
    query: 'plan obiadów',
    subtitle: 'Obiady na cały tydzień zaplanowane',
    text: 'Neutralna makieta wyników wyszukiwania w obu sklepach. Biały dymek z czarnym konturem czyta się nawet przy szerokości stu pikseli, a ciepłe kolory odróżniają zestaw od zdjęć talerzy, które zwykle stoją obok.',
  },
  switchNote:
    'Przełącznik podmienia cały zestaw: język i sklep. Wersja angielska to inna kuchnia, nie tłumaczenie: zamiast leczo jest lentil chilli, zamiast placków z cukinii courgette fritters, a babcia Halina zostaje babcią Rose.',
  ab: {
    title: 'Funkcja czy ból',
    caption: 'Rozdział 6: test A/B',
    intro:
      'Wariant B zmienia tylko pierwszy kadr, w obu sklepach i obu językach. W App Store można go puścić jako test strony produktu, w Google Play jako eksperyment na karcie aplikacji.',
    hypothesis:
      'Nazwanie codziennego problemu w pierwszym kadrze przyciąga mocniej niż nazwa funkcji planowania. Ludzie, którzy co wieczór pytają, co na obiad, powinni częściej instalować aplikację po zobaczeniu wariantu B.',
  },
  feature: {
    title: 'Chochla bez telefonu',
    caption: 'Rozdział 7: grafiki',
    text: 'Feature graphic do Google Play: kremowe tło z konfetti, duży dymek z nazwą i obietnicą, a obok trzech bohaterów. Telefonu nie ma, a środek, w którym sklep może położyć przycisk odtwarzania, zostaje wolny od tekstu.',
    icons:
      'Ikona to kobaltowa chochla z grubym konturem na pomidorowym tle i trzy musztardowe kropki, jak krople zupy. Do App Store kwadrat 1024 px bez przezroczystości, do Google Play 512 px. Zaokrąglenie dokłada system, a w paczce są też osobne warstwy do Icon Composer.',
  },
  deliverables: {
    title: 'Paczka gotowa do wysłania',
    caption: 'Rozdział 8: pliki',
    intro:
      'Klient dostaje jedną paczkę ZIP z folderami według sklepu i języka oraz plik z nagłówkami i tekstami alternatywnymi. Pliki są w formacie PNG, bo płaskie kolory i grube kontury zapisują się w nim bez strat i bez brudu wokół krawędzi. Każdy plik przeszedł walidator: wymiary, brak kanału alfa, RGB, rozmiar i liczba sztuk w zestawie.',
    specs: 'Specyfikacje obu sklepów sprawdzone 7 października 2026.',
  },
  language: {
    title: 'Nowy język to jeden nowy plik',
    caption: 'Rozdział 9: języki',
    text: 'Nagłówki, napisy w dymkach, teksty alternatywne i wszystkie dane w interfejsie leżą w jednym pliku na język. Dymki rysują się wokół tekstu dopiero po złożeniu, a konfetti samo ustępuje im miejsca. Kolejny język to tłumaczenie jednego pliku i ponowny eksport.',
  },
  cta: {
    title: 'Twoja aplikacja też może mówić dymkami',
    text: 'Napisz, co robi twoja aplikacja i do kogo trafia. Zaproponuję historię na sześć kadrów, zaprojektuję zestaw do obu sklepów i przygotuję pliki, które przejdą walidację za pierwszym razem.',
    link: 'Zobacz ofertę dla klientów',
  },
});
