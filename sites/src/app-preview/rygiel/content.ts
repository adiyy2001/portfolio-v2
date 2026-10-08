export const content = {
  kicker: 'Wzornik, app preview. A3, ciemny neon i cyber',
  lead: 'Podgląd menedżera haseł z alertami wycieków: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Światło jest tu materiałem: obrysy świecą, tekst się odszyfrowuje, a linia skanu odsłania kolejne ekrany.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '24 s, 886×1920, 30 kl./s'],
    ['Ruch', 'odszyfrowanie, skan, puls poświaty'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Dźwięk', 'brak, napisy czytelne bez niego'],
  ] as [string, string][],
  client: {
    title: 'O wycieku dowiadujesz się pierwszy',
    paragraphs: [
      'Rygiel to menedżer haseł dla osób, które mają 150 do 250 kont i wiedzą, że powinny o nie dbać, ale nie mają na to czasu. Ludzie powtarzają hasła i dowiadują się o wycieku po miesiącach, z wiadomości. Rygiel sprawdza wycieki na bieżąco i mówi, co zrobić, zanim ktoś skorzysta z hasła.',
      'Zadanie: podgląd do App Store, który w pierwszej klatce pokaże alert o wycieku, a potem całą drogę od alertu do nowego hasła i zdrowego sejfu. Do tego trzy formaty na kampanię w mediach społecznościowych i pętle na stronę. Bez dźwięku, z napisami, które da się przeczytać.',
    ],
    facts: [
      ['Użytkownik', 'dorośli z 150 do 250 kontami, ostrożni, ale zabiegani'],
      [
        'Dane w historii',
        'sejf 214 wpisów, wyciek z Forum Wędkarskie Mazury 2.10.2026, wykryty 6.10.2026 o 07:12',
      ],
      [
        'Trzy funkcje',
        'alert o wycieku z tym, co wyciekło, generator, który od razu zmienia hasło, zdrowie sejfu z listą do poprawy',
      ],
      ['Ton', 'spokojny i rzeczowy, alarm tylko tam, gdzie naprawdę jest wyciek'],
    ] as [string, string][],
    alert: {
      label: 'Alert wycieku',
      title: 'Twój adres e-mail pojawił się w\u00a0wycieku',
      rows: [
        ['Serwis', 'Forum Wędkarskie Mazury'],
        ['Wyciek', '2.10.2026'],
        ['Wykryty', '6.10.2026, 07:12'],
        ['Wyciekło', 'e-mail, nick, skrót hasła'],
      ] as [string, string][],
      note: 'Serwis, wyciek i adresy są zmyślone. Domeny kończą się na .example.',
    },
  },
  direction: {
    title: 'Światło jako materiał, kolor jako znaczenie',
    paragraphs: [
      'Menedżer haseł musi wyglądać na bezpieczny i nie może straszyć. Dlatego tło jest prawie czarne, z cienką siatką jak na ekranie monitoringu, a wszystko, co ważne, ma neonowy obrys. Cyjan znaczy „bezpiecznie” i „tu stuknij”. Różowa czerwień pojawia się tylko przy wycieku, bursztyn tylko przy słabych i powtórzonych hasłach.',
      'Tekst jest w kroju o stałej szerokości, bo hasło trzeba umieć przepisać znak po znaku, a odszyfrowanie nie może przesuwać liter. Panele są pełne i matowe, bez szkła i rozmycia. Poświata jest zawsze kopią obrysu w tym samym kolorze i nigdy nie leży pod tekstem.',
    ],
    keywords: ['Siatka', 'Neonowy obrys', 'Krój o stałej szerokości', 'Alarm tylko przy wycieku'],
  },
  storyboard: {
    title: '24 sekundy od alertu do zdrowego sejfu',
    intro:
      'Sześć ujęć w 720 klatkach. Hak to alert czytelny od pierwszej klatki, z linią skanu, która przez niego przechodzi. Potem szczegóły wycieku, nowe hasło, odblokowanie sejfu, wieczorne porządki i ekran startowy z ryglem.',
    alt: 'Plansza sześciu klatek kluczowych wersji sklepowej z czasami i osią czasu napisów i skanów',
    rules: [
      'Każda zmiana ekranu to skan z góry na dół w 20 klatek, odblokowanie sejfu w 30. Żadnych przesunięć ani przenikań.',
      'Trzy napisy, każdy najwyżej sześć słów i co najmniej 2,4 s na ekranie, w pasie między kartą a przyciskiem.',
      'Plakat sklepowy to klatka 30: alert zaraz po przejściu skanu. Domyślna klatka z piątej sekundy pokazuje gotowe szczegóły wycieku.',
    ],
  },
  motion: {
    title: 'Tekst, który się odszyfrowuje, ale nie miga',
    intro:
      'Każdy ruch ma nazwę i wartość w tokenach projektu. Laboratorium poniżej używa tych samych liczb co wideo: porównaj czytelne odszyfrowanie z takim, które tylko miga.',
    rules: [
      ['Z góry na dół', 'skan odsłania ekran, wiersze listy odszyfrowują się od pierwszego'],
      ['Znak po znaku', 'od lewej, 2 klatki odstępu na znak, gotowy tekst stoi co najmniej 1,5 s'],
      ['Puls zamiast błysku', 'poświata oddycha co 1,2 s między 35 a 60% krycia'],
      ['Jedyny ruch liniowy', 'siatka w tle płynie stałym tempem, interfejs nigdy'],
    ] as [string, string][],
  },
  screens: {
    title: 'Sześć ekranów, jeden krój',
    intro:
      'Sześć ekranów z jednego mini design systemu: dziewięć kolorów, dwa kroje, obrys 1,5 piksela, siatka co 24 piksele i przyciski o wysokości 56 pikseli. Projekt w kanwie 443×960, render w skali 2, czyli dokładnie 886×1920.',
  },
  formats: {
    title: 'Sklep pokazuje aplikację, social opowiada historię',
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, więc wersja sklepowa to sam ekran aplikacji. Wersja marketingowa ma telefon narysowany neonową linią, dwie warstwy siatki, które płyną z różną prędkością, i nagłówki odszyfrowujące się obok telefonu.',
    store: 'Wersja sklepowa, sam interfejs',
    portrait: 'Reels, TikTok, Shorts, 9:16',
    square: 'Post w kanale, 1:1',
    wide: 'YouTube i link w Google Play, 16:9',
  },
  deliverables: {
    title: 'Pliki gotowe do wgrania',
    intro:
      'Klient dostaje pliki gotowe do wgrania, z parametrami sprawdzonymi przez ffprobe. Wersje pełnej jakości są za duże na stronę, dlatego tutaj odtwarzają się lekkie pętle bez dźwięku, w formacie WebM i MP4.',
    extras: [
      ['Ikona', '1024×1024 PNG bez przezroczystości i podgląd z zaokrągleniem'],
      ['Storyboard', 'tabela ujęć z klatkami i plansza klatek kluczowych z osią czasu'],
      ['Ekrany', 'sześć ekranów interfejsu w 886×1920'],
      [
        'Projekt ruchu',
        'odszyfrowanie, skan, puls i siatka zapisane w tokenach, opisane jak tutaj',
      ],
    ] as [string, string][],
  },
  cta: {
    title: 'Twoja aplikacja chroni coś ważnego?',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard i styl ruchu, a potem dowiozę komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla\u00a0klientów',
  },
};
