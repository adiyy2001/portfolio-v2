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

- `yarn lint` przechodzi (naprawiono 6 nieużywanych zmiennych w skryptach studio), `yarn gatsby clean && yarn build`, `yarn --cwd sites run check` (0 błędów), `yarn --cwd sites test` (1281 testów), `yarn --cwd sites build` (185 stron).
- `sites/dist` skopiowane do `public/wzornik`, serwowane na 127.0.0.1:4310: 503 pliki w `wzornik/identyfikacja` (pliki bez HTML: PDF, ZIP, MP4, WebM, PNG, SVG, ICO) odpowiada 200 pod finalnymi ścieżkami. Dwie edycje klienta, indeks i sześć stron: brak błędów w konsoli. Jedyne nieudane requesty: zewnętrzny `gc.zgo.at/count.js` (GoatCounter, błąd certyfikatu w tym środowisku), niezwiązany z tą pracą, oraz przerwane przez Chromium bez kodeka żądania WebM w Cuvée i Wolnobiegu (pliki same odpowiadają 200).
- Rozmiary: największy plik 5,2 MB (limit 50 MB), cały `wzornik` 60 MB, daleko od limitu 300 MB.

## Oceny rubryki (7 kryteriów, 1 do 5), najniższa ocena przed i po poprawkach

| Marka | Rundy | Najniższa po rundzie 1 | Najniższa na końcu | Oceny końcowe |
|---|---|---|---|---|
| Skibka | 2 | 3 (rzemiosło, wartość sprzedażowa lub odrębność) | 4 | 5,4,5,5,4,4,5 |
| Nośna | 4 | 3 | 3 | 5,3,4,5,4,4,4 |
| Rzut | 2 | 3 | 4 | 5,4,5,5,4,4,5 |
| Klamra | 2 | 3 | 4 | 5,4,5,5,4,4,5 |
| Cuvée | 2 | 3 | 4 | 5,4,4,5,4,4,5 |
| Wolnobieg | 4 | 3 | 4 | 5,4,5,4,4,4,5 |

Kolejność kryteriów: wierność stylowi, rzemiosło, spójność systemu, dopasowanie do branży, czytelność i dostępność, wartość sprzedażowa, odrębność. Pełne wyniki rund: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-audits/identyfikacja-b*-r*.json`. Oceny po rundzie 1: B1 4,3,4,5,4,4,3; B2 5,4,4,5,4,4,3; B3 4,3,4,5,4,3,4; B4 5,3,5,5,4,4,4; B5 5,3,4,5,4,3,4; B6 5,3,4,5,3,3,5.

## Czego nie zrobiono i dlaczego

- Definicja ukończenia "wszystkie oceny co najmniej 4" nie jest spełniona tylko dla Nośnej. Punkt R w PLAN.md zostaje otwarty. Nośna po czterech rundach ma 3 z 5 w rzemiośle (Wolnobieg po rundzie 4 ma najniżej 4).
  - Nośna (runda 4): usterki układu na stronach 11, 16 i 26 brand booku oraz poziome przewijanie, szczegóły w decyzji 33 w PLAN.md.
  - Po rundzie 4 sesja sterująca poprawiła sama strony 11, 16 i 26 brand booku oraz poziome przewijanie (Nośna przy 320, 768 i 1024 px, Klamra przy 320 px) bez piątej recenzji, więc ocena 3 pochodzi sprzed poprawek; zostały jednowyrazowe ostatnie wiersze. Szczegóły w decyzji 34 w PLAN.md.
- Rzut: favicon.ico 16 i 32 px to zwykłe pomniejszenia, bez przyciągania do pikseli (ocena 4).
- Nic nie wypchnięto i nie zmergowano do głównego checkoutu. To krok osoby scalającej.

## Decyzje dla Adriana

Pełna lista (34 pozycje, z markami) jest w `studio/identyfikacja/PLAN.md` w "Decisions for Adrian". Najważniejsze:

1. R otwarte: Nośna na 3 w rzemiośle po czterech rundach. Strony 11, 16, 26 brand booku i poziome przewijanie są już poprawione bez ponownej recenzji (decyzja 34). Zdecyduj, czy akceptujesz, czy zlecasz piątą recenzję. Wolnobieg doszedł do 4.
2. Nazwy sprawdzone wyszukiwarką w USA, więc to brak dowodu konfliktu, nie czystka prawna. Odrzucone: Zakwasownia, Zaczyn (Kraków), Grona.
3. Skibka waży 13 MB (budżet 12 MB, limit 16 MB).
4. Rzut ma kobalt zamiast szwajcarskiej czerwieni, bo Rozwaga ma już czerń, biel i czerwień.
5. Nośna ma jasne tło (ciemny neon to zajęty styl), kolor pochodzi tylko z trzech dni festiwalu.
6. Cuvée dostaje 12 cichych piktogramów mimo zakazu ikon w tym stylu, bo brief wymaga 12 ikon dla każdej marki.
7. Animacje przez WAAPI i ffmpeg, bez Remotiona (brak kwestii licencji).
8. Studia przypadku są po polsku i `noindex`, jak Trzask.
9. Dodano `@types/node` do `sites/package.json`.
