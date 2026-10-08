# Wzornik, app preview: raport końcowy

Gałąź `wzornik-app-preview`, stan na 2026-10-08. Praca autonomiczna według `BRIEF.md`, `RUN.md` i `PLAN.md`. Nic nie zostało scalone z `main`; strony będą publiczne po scaleniu (GitHub Pages wdraża każdy push do `main`).

## Co powstało i pod jakimi adresami

| Aplikacja | Styl | Branża | Adres |
|---|---|---|---|
| Indeks | sześć kafli z pętlą wideo po najechaniu lub przewinięciu | | https://adrianturbinski.pl/wzornik/app-preview/ |
| Kasownik | A1 natywny iOS, jasny i czysty | bilety komunikacji miejskiej, Poznań | https://adrianturbinski.pl/wzornik/app-preview/kasownik/ |
| Sztanga | A2 kinetyczna typografia | dziennik treningu siłowego | https://adrianturbinski.pl/wzornik/app-preview/sztanga/ |
| Rygiel | A3 ciemny neon i cyber | menedżer haseł z alertami wycieków | https://adrianturbinski.pl/wzornik/app-preview/rygiel/ |
| Kiełek | A4 claymorphism pastelowy | pielęgnacja roślin domowych | https://adrianturbinski.pl/wzornik/app-preview/kielek/ |
| Poziomka | A5 pixel art 8-bit | tracker nawyków z grywalizacją | https://adrianturbinski.pl/wzornik/app-preview/poziomka/ |
| Południe | A6 izometryczny dashboard danych | domowa fotowoltaika z magazynem energii | https://adrianturbinski.pl/wzornik/app-preview/poludnie/ |

Linki do indeksu i sześciu stron są w sekcji Wzornik wydania dla klienta po polsku (https://adrianturbinski.pl/dla-klienta/#wzornik) i po angielsku (https://adrianturbinski.pl/en/for-clients/) oraz na https://adrianturbinski.pl/wzornik/ (wiersz „App preview: sześć realizacji”).

Każda aplikacja ma: koncepcję, ikonę 1024×1024, 5 do 7 ekranów z mini design systemem, system ruchu w tokenach, storyboard z tabelą ujęć i planszą klatek, wersję sklepową 886×1920, trzy formaty marketingowe (1080×1920, 1080×1080, 1920×1080) z jednej kompozycji Remotion, pętle WebM i MP4 z plakatami oraz stronę case study w dziewięciu sekcjach z żywym laboratorium krzywych. Mastery zostają w `studio/out/` (poza repo).

## Wynik walidatora

`node scripts/validate.mjs <app>` dla wszystkich sześciu: wszystkie testy zaliczone (46 do 51 testów na aplikację). Wersje sklepowe: 886×1920, 30/1, H.264 High@4.0, yuv420p, zakres ograniczony BT.709, cicha ścieżka AAC stereo 48 kHz, faststart.

| Aplikacja | Wersja sklepowa | Bitrate | Plik sklepowy | Formaty social | Największy plik web | Opublikowane |
|---|---|---|---|---|---|---|
| Kasownik | 690 klatek, 23 s | 11,40 Mb/s | 32,8 MB | 3 formaty, 21 s | 1,59 MB | 10,18 MB |
| Sztanga | 660 klatek, 22 s | 11,40 Mb/s | 31,4 MB | 3 formaty, 20 s | 1,09 MB | 6,21 MB |
| Rygiel | 720 klatek, 24 s | 11,44 Mb/s | 34,4 MB | 3 formaty, 23 s | 2,11 MB | 13,58 MB |
| Kiełek | 630 klatek, 21 s | 11,39 Mb/s | 29,9 MB | 3 formaty, 21 s | 1,08 MB | 8,11 MB |
| Poziomka | 600 klatek, 20 s | 11,39 Mb/s | 28,5 MB | 3 formaty, 20 s | 1,37 MB | 7,43 MB |
| Południe | 750 klatek, 25 s | 11,41 Mb/s | 35,7 MB | 3 formaty, 25 s | 1,63 MB | 9,49 MB |

Każda pętla web mieści się w 4 MB, szwy pętli przechodzą test SSIM, każda aplikacja mieści się w budżecie 14 MB, każdy plik jest poniżej 50 MB.

## Oceny z rubryki

Przed poprawkami (pierwszy niezależny recenzent, `REVIEW-1.md`):

| Kryterium | Kasownik | Sztanga | Rygiel | Kiełek | Poziomka | Południe |
|---|---|---|---|---|---|---|
| Siła haka w pierwszych 2 s | 4 | 5 | 5 | 3 | 5 | 3 |
| Czytelność bez dźwięku | 4 | 4 | 4 | 4 | 5 | 4 |
| Jakość ruchu | 3 | 5 | 4 | 4 | 5 | 4 |
| Wierność stylowi | 5 | 5 | 5 | 5 | 5 | 5 |
| Jakość interfejsu | 5 | 4 | 5 | 4 | 4 | 4 |
| Zgodność ze specyfikacją | 5 | 5 | 5 | 5 | 5 | 4 |
| Wartość sprzedażowa strony | 4 | 4 | 4 | 4 | 4 | 4 |
| Odrębność od pozostałych | 4 | 5 | 5 | 4 | 5 | 4 |

Po poprawkach (drugi niezależny recenzent, który nie widział pierwszej recenzji, `REVIEW-2.md`; wszystkie 48 ocen co najmniej 4):

| Kryterium | Kasownik | Sztanga | Rygiel | Kiełek | Poziomka | Południe |
|---|---|---|---|---|---|---|
| Siła haka w pierwszych 2 s | 4 | 5 | 4 | 4 | 5 | 4 |
| Czytelność bez dźwięku | 4 | 5 | 4 | 4 | 5 | 5 |
| Jakość ruchu | 4 | 5 | 4 | 4 | 4 | 4 |
| Wierność stylowi | 5 | 4 | 5 | 5 | 5 | 5 |
| Jakość interfejsu | 4 | 4 | 4 | 4 | 5 | 4 |
| Zgodność ze specyfikacją | 5 | 5 | 5 | 5 | 5 | 5 |
| Wartość sprzedażowa strony | 4 | 5 | 5 | 4 | 4 | 5 |
| Odrębność od pozostałych | 4 | 5 | 4 | 4 | 5 | 4 |

Po drugiej recenzji poprawione zostały jeszcze tanio i bezpiecznie: kropka nad Ż w szerokim „CIĘŻAR” (Sztanga), dom i słup ucięte przy lewej krawędzi (Południe, ekrany Teraz i Magazyn oraz format 1:1), mały telefon w hero na komputerze (Kasownik i Kiełek pokazują teraz pętlę 1:1), wejście „3/5” ucięte przy lewej krawędzi (Sztanga). Tych poprawek nikt już nie oceniał ponownie.

## Data weryfikacji specyfikacji

Specyfikacja Apple (App Store Connect Help, „App preview specifications”) i licencja Remotion sprawdzone 2026-10-07 (zapis w `NOTES.md`). Remotion jest darmowy dla firm do 3 osób, także w pracy komercyjnej.

## Czas renderów

Na 4 rdzeniach, Remotion z `--concurrency 3`, ostatnie pełne rendery (stills, wersja sklepowa, trzy formaty marketingowe, kafel): Kasownik 15 min, Sztanga 6 min, Rygiel 22 min, Kiełek 50 min, Poziomka 5 min, Południe 34 min.

## Czego nie udało się zrobić

- Większe uwagi z drugiej recenzji (żadna poniżej 4) czekają na kolejną rundę: wspólny szkielet pięciu wersji marketingowych, za mały telefon w formatach 9:16 i 1:1 (Kasownik, Rygiel, Kiełek, Południe), przejścia ekranów przez prawie puste klatki (Kasownik, Kiełek, Południe), pierwsza klatka wersji sklepowej przed stanem docelowym (Kasownik, Rygiel, Poziomka, Południe), jednoczesny scramble trzech linii w marketingu Rygla, drobne etykiety Rygla, kontrast haka Kiełka, pusta dolna część kilku ekranów, pasek XP w haku Poziomki i tekst ciągły krojem pikselowym na jej stronie, rozciągnięte „MARTWY CIĄG” w Sztandze, płaska karta końcowa Południa. Pełna lista: `PLAN.md`, decyzja 79.
- Ścieżka `/portfolio-v2/` z briefu nie dotyczy obecnej strony: serwis działa w katalogu głównym domeny, wzornik pod `/wzornik/`.
- Mastery (wersja sklepowa około 30 MB, formaty social) nie są publikowane; strona pokazuje pętle web i wypisuje pliki mastera z danymi ffprobe. Brak paczki ZIP.
- Indeks app preview nie ma obrazka Open Graph, tak jak indeksy identyfikacji i ASO; każda z sześciu stron ma własny `og.png` 1200×630.
- Scalenie z `main` nie zostało wykonane, zgodnie z poleceniem.

## Decyzje do przeglądu

1. Remotion 4.0.534 na darmowej licencji. Jeśli klient, licząc razem z wykonawcą co najmniej 4 osoby, dostanie sam projekt Remotion, właściciel projektu musi kupić licencję firmową. Domyślna oferta: gotowe pliki.
2. Wersja sklepowa i formaty social mają cichą ścieżkę AAC stereo, bo App Store Connect odrzuca podgląd bez ścieżki audio.
3. Wersja sklepowa ma stały bitrate około 11,4 Mb/s (Apple zaleca 10 do 12), więc ma około 30 MB i nie trafia do repo.
4. Każda wersja sklepowa kończy się ekranem startowym aplikacji z ikoną i nazwą, a nie kartą marketingową.
5. Klatki plakatu wybrane osobno dla każdej aplikacji; domyślna klatka 5 s też jest zaprojektowana.
6. Adres `/wzornik/app-preview/` używa terminu Apple; slugi bez polskich znaków.
7. Nazwy aplikacji sprawdzone wyszukiwarką w swojej kategorii; to nie jest badanie znaków towarowych.
8. Treści zmyślone, ale spójne: prawdziwe przystanki w Poznaniu bez przewoźnika, zmyślony serwis w historii wycieku Rygla, ceny energii w Południu oznaczone jako przykładowe, sumy się zgadzają.
9. Narzędzia app preview mają własny `package.json` i lock, a rejestr aplikacji leży w `sites/src/app-preview/shared/apps.ts`, żeby gałęzie wzornika nie kolidowały.
10. Pętla sklepowa web ma 442×960, a Poziomki 884×1920; plik do App Store ma dokładnie 886×1920.
11. Poziomka używa bitmapowych wersji krojów Jersey 10 i Tiny5 (OFL) pod własnymi nazwami, z tekstami licencji.
12. Kilka wartości z planu zmienionych na rzecz spójności danych: serie i dzień treningu w Sztandze, liczby wycieku w Ryglu, model dnia i plan ładowania magazynu w Południu.
13. Wersje marketingowe trwają 20 do 25 s; Południe skrócone do 25,0 s po pierwszej recenzji.
14. Po pierwszej recenzji: pasek kart Kasownika chowa się jak modal iOS, nowy hak Kiełka i Południa, sprężyste przejścia kart w Kiełku, tekst w Południu bez przyciemniania przezroczystością, wideo w pierwszym widoku telefonu na wszystkich stronach.
15. Po drugiej recenzji: rysowana okrągła kropka nad szerokim Ż w Sztandze (wada kroju Anybody powyżej szerokości 100), oddalona kamera w Południu, pętla 1:1 w hero Kasownika i Kiełka od 960 px.
16. Publikacja: blok app preview w sekcji Wzornik (PL i EN, branża i styl po polsku jak w pozostałych blokach) i jeden wiersz na `/wzornik/`; `static/llms.txt` i `sites/README.md` bez zmian, jak przy identyfikacji i ASO.
17. Przy scalaniu z `main` pojawi się konflikt typu „oba dodały” w `src/components/wzornik.js` i `sites/src/pages/index.astro`: zostawić oba bloki, najpierw ASO, potem app preview.

Pełna lista 79 decyzji: `PLAN.md`, sekcja „Decisions for Adrian”.

## Co może dostarczyć tylko Adrian

- Zgoda na scalenie gałęzi `wzornik-app-preview` z `main`.
- Decyzja o kolejnej rundzie większych poprawek z drugiej recenzji.
- Prawdziwy test wgrania wersji sklepowej do App Store Connect i filmu na YouTube (wymaga jego kont).
- Sprawdzenie nazw pod kątem znaków towarowych, jeśli miałyby żyć dłużej niż jako przykłady.
- Ocena gustu: czy sześć kierunków i ton tekstów sprzedają jego usługę tak, jak chce.

## Wyniki końcowej weryfikacji

Każde polecenie pod blokadą `/tmp/wz-heavy.lock`, 2026-10-08:

- `node scripts/validate.mjs` dla sześciu aplikacji: wszystkie testy zaliczone.
- `yarn --cwd sites run check`: 0 błędów, 0 ostrzeżeń, 6 podpowiedzi, Prettier czysty.
- `yarn --cwd sites test`: 127 plików, 1358 testów zaliczonych.
- `yarn --cwd sites build`: 192 strony.
- `yarn lint` w katalogu głównym: bez błędów.
- `yarn gatsby clean && yarn build`: kod wyjścia 0; znane ostrzeżenie `postcss-calc` i nieaktualne `caniuse-lite` to nie błędy.
- Główny `yarn.lock` bez zmian.
- Układ wdrożeniowy (`sites/dist` w `public/wzornik`, `yarn gatsby serve -H 127.0.0.1 -p 4320`): każda strona 200; brak poziomego przewijania przy 320, 390, 768, 1024 i 1440 px na `/dla-klienta/`, `/en/for-clients/`, `/wzornik/`, indeksie i sześciu stronach. Linki z sekcji Wzornik (PL i EN) prowadzą do indeksu i wszystkich sześciu stron, a `/wzornik/` do indeksu; każdy link zwraca 200. Wszystkie widoczne wideo ładują się (readyState 4). Zrzuty przy 390 i 1440 px obejrzane i poprawione.
- Konsola: brak błędów na stronach wzornika. Na `/dla-klienta/` i `/en/for-clients/` jedyny błąd to zablokowany w tym środowisku zewnętrzny skrypt statystyk (`net::ERR_TUNNEL_CONNECTION_FAILED`); to ograniczenie sieci piaskownicy, nie kod strony.
- Rozmiary: app preview 58,0 MB, cały `/wzornik/` 117,8 MB, cały `public` 123,5 MB (limit 300 MB), największy plik 5,2 MB (limit 50 MB).
- Serwer zatrzymany po PID, `ps` nie pokazuje żadnego serwera ani przeglądarki.
