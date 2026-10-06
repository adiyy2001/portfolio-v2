# Raport końcowy: identyfikacja wizualna, 6 realizacji

Gałąź `wzornik-identyfikacja`. Nic nie jest wypchnięte, push uruchomiłby deploy publicznej strony.

## Co powstało i pod jakimi adresami

Sześć studiów przypadku plus indeks, w stylu Trzaska budowane w projekcie Astro `sites/`, na produkcji pod `https://adrianturbinski.pl/wzornik/identyfikacja/`.

| Marka | Styl | Branża | Adres | Opublikowane |
|---|---|---|---|---|
| Skibka | organiczny rzemieślniczy (I3) | piekarnia na zakwasie, Kraków | `/wzornik/identyfikacja/skibka/` | 13 MB |
| Nośna | generatywna identyfikacja (I6) | festiwal sztuki nowych mediów, Łódź | `/wzornik/identyfikacja/nosna/` | 11 MB |
| Rzut | szwajcarski modernizm (I1) | pracownia architektoniczna, Wrocław | `/wzornik/identyfikacja/rzut/` | 6 MB |
| Klamra | neobrutalizm (I2) | szkoła programowania online | `/wzornik/identyfikacja/klamra/` | 5 MB |
| Cuvée | luksusowy edytorial (I4) | hotel z winnicą, Dolny Śląsk | `/wzornik/identyfikacja/cuvee/` | 6 MB |
| Wolnobieg | retro lata 70. (I5) | serwis i sklep rowerowy, Gdańsk | `/wzornik/identyfikacja/wolnobieg/` | 8 MB |

Indeks: `/wzornik/identyfikacja/`. Każda marka ma w swoim katalogu: logo (SVG bez `<text>`, PNG 512, 1024 i 2048, PDF), favicon (SVG, ICO, apple-touch), kolory z tabelą kontrastu, kroje z licencjami, wzór i 12 ikon, makiety (wizytówka 91x61 mm ze spadem, papier firmowy, social, zastosowanie branżowe, podpis e-mail), animację MP4 i WebM 1080x1080, brand book PDF 16:9 (27 do 29 stron), ZIP do pobrania i manifest.

Linki: blok "Identyfikacja wizualna" z sześcioma linkami i indeksem w `#wzornik` na `/dla-klienta/` oraz w `#swatch-book` na `/en/for-clients/` (z informacją, że strony są po polsku), plus jeden link z indeksu `/wzornik/`.

## Weryfikacja publikacji

- `yarn lint` przechodzi (naprawiono 6 nieużywanych zmiennych w skryptach studio), `yarn gatsby clean && yarn build`, `yarn --cwd sites run check` (0 błędów), `yarn --cwd sites test` (1275 testów), `yarn --cwd sites build` (185 stron).
- `sites/dist` skopiowane do `public/wzornik`, serwowane na 127.0.0.1:4310: 515 plików w `wzornik/identyfikacja` (54 PDF, 6 ZIP, 6 MP4, 6 WebM, 144 PNG, 177 SVG, 6 ICO) odpowiada 200 pod finalnymi ścieżkami. Dwie edycje klienta, indeks i sześć stron: brak błędów w konsoli. Jedyny nieudany request to zewnętrzny `gc.zgo.at/count.js` (GoatCounter, błąd certyfikatu w tym środowisku), niezwiązany z tą pracą.
- Rozmiary: największy plik poniżej 50 MB, całość identyfikacji 47 MB, cały `wzornik` 59 MB, daleko od limitu 300 MB.

## Oceny rubryki (7 kryteriów, 1 do 5), najniższa ocena przed i po poprawkach

| Marka | Rundy | Najniższa po rundzie 1 | Najniższa na końcu | Oceny końcowe |
|---|---|---|---|---|
| Skibka | 2 | 3 (rzemiosło, wartość sprzedażowa lub odrębność) | 4 | 5,4,5,5,4,4,5 |
| Nośna | 3 | 3 | 3 | 5,3,4,5,4,4,5 |
| Rzut | 2 | 3 | 4 | 5,4,5,5,4,4,5 |
| Klamra | 2 | 3 | 4 | 5,4,5,5,4,4,5 |
| Cuvée | 2 | 3 | 4 | 5,4,4,5,4,4,5 |
| Wolnobieg | 3 | 3 | 3 | 5,3,4,5,4,4,5 |

Kolejność kryteriów: wierność stylowi, rzemiosło, spójność systemu, dopasowanie do branży, czytelność i dostępność, wartość sprzedażowa, odrębność. Pełne wyniki rund: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-audits/identyfikacja-b*-r*.json`. Oceny po rundzie 1: B1 4,3,4,5,4,4,3; B2 5,4,4,5,4,4,3; B3 4,3,4,5,4,3,4; B4 5,3,5,5,4,4,4; B5 5,3,4,5,4,3,4; B6 5,3,4,5,3,3,5.

## Czego nie zrobiono i dlaczego

- Definicja ukończenia "wszystkie oceny co najmniej 4" nie jest spełniona. Punkt R w PLAN.md zostaje otwarty. Nośna i Wolnobieg po trzech rundach mają 3 z 5 w rzemiośle.
  - Nośna: wiszące jednoliterowe spójniki na końcach wierszy (33 przy 1440 px, 36 przy 390 px) i w tekście zostały zwykłe spacje po jednoliterowych słowach.
  - Wolnobieg: nakładanie się ostatniej linii body copy na stopkę na stronie 4 brand booku, zetknięcie descendera z kartą w poście 3, stopka posta 2 dotykająca zębów koła, widoczne proste pasy w klatkach animacji 0,5 do 1,5 s.
- Rzut: favicon.ico 16 i 32 px to zwykłe pomniejszenia, bez przyciągania do pikseli (ocena 4).
- Nic nie wypchnięto i nie zmergowano do głównego checkoutu. To krok osoby scalającej.

## Decyzje dla Adriana

Pełna lista (32 pozycje, z markami) jest w `studio/identyfikacja/PLAN.md` w "Decisions for Adrian". Najważniejsze:

1. R otwarte: Nośna i Wolnobieg na 3 w rzemiośle po trzech rundach. Zdecyduj, czy akceptujesz, czy zlecasz czwartą rundę (poprawki wdów w Nośnej, strona 4 brand booku i klatki animacji Wolnobiegu).
2. Nazwy sprawdzone wyszukiwarką w USA, więc to brak dowodu konfliktu, nie czystka prawna. Odrzucone: Zakwasownia, Zaczyn (Kraków), Grona.
3. Skibka waży 13 MB (budżet 12 MB, limit 16 MB).
4. Rzut ma kobalt zamiast szwajcarskiej czerwieni, bo Rozwaga ma już czerń, biel i czerwień.
5. Nośna ma jasne tło (ciemny neon to zajęty styl), kolor pochodzi tylko z trzech dni festiwalu.
6. Cuvée dostaje 12 cichych piktogramów mimo zakazu ikon w tym stylu, bo brief wymaga 12 ikon dla każdej marki.
7. Animacje przez WAAPI i ffmpeg, bez Remotiona (brak kwestii licencji).
8. Studia przypadku są po polsku i `noindex`, jak Trzask.
9. Dodano `@types/node` do `sites/package.json`.
