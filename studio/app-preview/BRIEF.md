# Wzornik: app preview, 6 realizacji

**Tryb pracy:** autonomicznie (Adrian, 2026-10-03: „nie czekaj na nic z moją akceptacją”). Nie zatrzymuj się po fazie 1. Decyzje warte przejrzenia zapisz w PLAN.md i w raporcie końcowym.

## Rola i cel

Pracujesz jako motion designer, product designer i creative technologist w jednej osobie. Budujesz w moim portfolio (repo `portfolio-v2`) sekcję wzornika z 6 przykładowymi realizacjami app preview: animowanymi prezentacjami aplikacji mobilnych dla zmyślonych firm. Każda realizacja ma inny, z góry przypisany styl. Te strony mają sprzedawać moją usługę: startup po obejrzeniu ma wiedzieć, co dostanie, w jakiej jakości i w jakich formatach.

Punkt odniesienia jakości to istniejąca realizacja `wzornik/trzask` (sklep palarni kawy). Zobacz, co ją wyróżnia: realistyczna treść branżowa, kompletne dane, dopracowane detale, interaktywny element z sensem, uczciwa stopka o zmyślonej firmie. Ten poziom to minimum.

Ta sesja jest jedną z trzech (identyfikacja, app preview, ASO). Razem powstaje 18 realizacji w 18 różnych stylach. Twoje 6 stylów jest przypisanych niżej. Pozostałe 12 jest zajętych i nie wolno się do nich zbliżać.

## Repozytorium i konwencje

- Gatsby (JS), yarn, treści w `/content`, komponenty w `/src`. Animacje na stronie: framer-motion.
- Zanim cokolwiek zmienisz, zbadaj, jak zbudowany jest `wzornik/trzask`: gdzie leżą pliki, czy to strony Gatsby czy statyczny HTML, jak działa ścieżka `/portfolio-v2/` na GitHub Pages. Zbadaj też sekcję `#wzornik` na stronie `/dla-klienta/`. Nowe realizacje mają działać tak samo i być podlinkowane w tym samym miejscu.
- Produkcja wideo w osobnym katalogu `studio/` z własnym `package.json`. Nie dodawaj Remotion ani Playwright do zależności strony. `yarn build` strony musi przechodzić bez nich.
- Mastery wideo w `studio/out/` (dodaj do `.gitignore`). Do repo trafiają tylko wersje webowe i plakaty.
- Bez komentarzy w kodzie. Wszystkie teksty interfejsu i treści po polsku.
- Gałąź `wzornik-app-preview`. Commit po każdej ukończonej realizacji.
- Prowadź listę zadań i aktualizuj ją na bieżąco.

## Zasady treści

- Polszczyzna naturalna i konkretna. Zero lorem ipsum. Dane w aplikacjach zmyślone, ale wiarygodne dla branży (kwoty, godziny, nazwy przystanków, ciężary, gatunki roślin).
- Bez myślników em (U+2014) w tekstach.
- Nazwa aplikacji: zaproponuj 3, wybierz 1. Sprawdź w wyszukiwarce, czy nie istnieje znana aplikacja o tej nazwie w tej samej kategorii. Wynik zapisz w planie.
- Żadnych prawdziwych marek, logotypów Apple i Google, oficjalnych renderów urządzeń ani zdjęć. Ramkę telefonu rysujesz sam: generyczną, nowoczesną, w SVG lub CSS.
- Nie używaj SF Pro ani innych krojów systemowych Apple. Kroje tylko OFL (Google Fonts lub Fontsource), lokalnie. Każdy sprawdź na `ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ` we wszystkich użytych wagach. To szczególnie ważne przy krojach pikselowych i display.
- Bez zmyślonych ocen, nagród, opinii użytkowników i liczby pobrań.
- Stopka każdej strony: „Projekt przykładowy. [Aplikacja] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński.” z linkiem do `/dla-klienta/`.

## Przypisane style

| ID | Styl | Aplikacja | Cechy obowiązkowe | Unikaj |
|---|---|---|---|---|
| A1 | Natywny iOS, jasny i czysty | Bilety komunikacji miejskiej | Wzorce nawigacji iOS (duże tytuły, karty, arkusze od dołu), płynne sprężyny, przejścia elementów współdzielonych, dużo bieli, jeden kolor marki, bilet z kodem, który „ożywa” przy kasowaniu | Ciężkich efektów, neonów, dekoracji |
| A2 | Kinetyczna typografia | Trening siłowy | Ogromna typografia wchodząca w kadr, cięcia na siatce rytmu (np. 120 BPM, czyli co 15 klatek przy 30 fps), czerń plus jeden elektryzujący kolor, liczby (ciężar, serie, rekord) jako bohater | Spokojnych przejść, pasteli |
| A3 | Ciemny neon i cyber | Menedżer haseł z alertami wycieków | Ciemne tło, neonowe obrysy z poświatą, monospace, efekt skanowania, tekst „odszyfrowujący się” (scramble), siatki | Glitchu, który psuje czytelność; tekst nadal co najmniej AA |
| A4 | Claymorphism pastelowy | Pielęgnacja roślin domowych | Miękkie, napompowane kształty (wielowarstwowe cienie CSS albo prosty Three.js), pastele, zaokrąglony krój, sprężyste animacje, maskotka-roślina zbudowana z prostych brył | Ostrych krawędzi, chłodnych barw |
| A5 | Pixel art 8-bit | Tracker nawyków z grywalizacją | Siatka pikseli, ograniczona paleta (np. 16 kolorów), krój pikselowy z polskimi znakami (jeśli żaden OFL nie ma pełnych, zbuduj własny bitmapowy font dla potrzebnych znaków), animacja poklatkowa, XP i poziomy, skalowanie tylko całkowite, `image-rendering: pixelated` | Antyaliasingu na grafice pikselowej, płynnych gradientów |
| A6 | Izometryczny dashboard danych | Domowa fotowoltaika, magazyn energii i zużycie prądu | Izometryczny dom w SVG z animowanym przepływem energii (panele, bateria, dom, sieć), wykresy rysujące się w czasie, wiarygodne liczby (instalacja 6 do 10 kWp, profil dobowy produkcji i zużycia, ceny energii zmyślone, ale realne co do rzędu) | Przeładowania danymi; jedna informacja na ujęcie |

**Zajęte style (nie zbliżaj się):** szwajcarski modernizm, neobrutalizm, organiczny rzemieślniczy, luksusowy edytorial, retro lata 70., generatywna identyfikacja dynamiczna, panorama ilustracyjna, mocne gradienty z przechylonymi urządzeniami, odręczne adnotacje (doodle), memphis i pop-art, ciemne szkło premium, Y2K holograficzny chrom. Nie kopiuj też estetyki Trzaska.

## Specyfikacje, które musisz zweryfikować

Przed eksportem sprawdź aktualne wymagania w oficjalnym źródle (App Store Connect Help: App preview specifications) i zapisz datę sprawdzenia w `NOTES.md`. Stan, od którego zaczynasz:

- iPhone, nowoczesne klasy ekranów: 886×1920 w pionie.
- Długość 15 do 30 sekund, do 30 fps, maksymalnie 500 MB.
- H.264 w `.mov`, `.m4v` lub `.mp4` albo ProRes 422 HQ w `.mov`.
- Apple wymaga, żeby app preview pokazywał rzeczywisty interfejs aplikacji. Dlatego robisz dwie odrębne wersje: sklepową (sam interfejs) i marketingową (dowolna forma).
- Podgląd wideo w Google Play to link do YouTube, więc wersja marketingowa 16:9 pełni tę rolę.

## Co powstaje dla każdej aplikacji

1. **Koncepcja:** problem, użytkownik, 3 kluczowe funkcje, nazwa, ikona 1024×1024.
2. **Interfejs:** 5 do 7 ekranów jako komponenty React z mini design systemem (tokeny koloru, typografia, odstępy, komponenty). Projektuj w kanwie 443×960 px i renderuj w skali 2, co daje dokładnie 886×1920.
3. **System ruchu:** presety sprężyn lub krzywe `cubic-bezier`, czasy trwania, zasady przejść i stopniowania. Zapisane w tokenach i opisane na stronie.
4. **Storyboard:** tabela ujęć z czasem w klatkach (30 fps) oraz plansza klatek kluczowych w PNG. Struktura: hak w pierwszych 1 do 2 sekundach (wideo startuje bez dźwięku, pierwsza klatka musi sprzedawać), 2 do 3 kluczowe funkcje, zakończenie z ikoną i nazwą. Docelowa długość 20 do 25 sekund.
5. **Wersja sklepowa:** 886×1920, 30 fps, H.264, `yuv420p`, `.mp4`. Tylko interfejs na pełnym ekranie, bez ramki urządzenia i bez dłoni. Nakładki tekstowe oszczędnie, maksymalnie 6 słów, każda widoczna co najmniej 1,5 sekundy. Wskaż klatkę plakatu.
6. **Wersja marketingowa:** 1080×1920 (Reels, TikTok, Shorts), 1080×1080 i 1920×1080. Własna ramka telefonu, typografia i tło w stylu marki, ruch kamery. Jedna kompozycja Remotion z wariantami formatu, nie trzy osobne projekty.
7. **Wersja webowa:** WebM (VP9) i MP4, każda do 4 MB, pętla bez widocznego szwu, plakat JPG. Na stronie `autoplay muted loop playsinline`, a przy `prefers-reduced-motion` sam plakat.
8. **Dźwięk:** domyślnie brak. Wszystko musi działać bez dźwięku.

## Narzędzia

- Remotion jako główny silnik. Najpierw sprawdź aktualne warunki licencji Remotion dla jednoosobowej działalności. Jeśli wymagają płatnej licencji, zatrzymaj się i powiedz mi o tym. Plan awaryjny: Playwright renderujący klatki plus ffmpeg.
- Kroje w Remotion ładowane lokalnie, z oczekiwaniem na załadowanie przed renderem.
- ffprobe i ffmpeg do walidacji i plansz klatek.

## Strona case study (szablon wspólny, wygląd w stylu aplikacji)

1. Hero z wersją marketingową odtwarzaną w pętli.
2. Klient i zadanie: fikcyjny brief w 3 do 4 zdaniach.
3. Kierunek: dlaczego ten styl dla tej aplikacji i tych użytkowników.
4. Storyboard: plansza klatek kluczowych z czasami.
5. Zasady ruchu: krzywe i czasy pokazane na żywo (np. kulka na krzywej, porównanie dwóch presetów).
6. Ekrany: galeria interfejsu.
7. Wersja sklepowa i formaty social obok siebie.
8. Co dostaje klient: lista plików z wymiarami, kodekami i długością.
9. CTA do `/dla-klienta/` i stopka.

Plus strona indeksu kategorii: 6 kafli, każdy z krótką pętlą wideo uruchamianą po najechaniu (na telefonie po przewinięciu do widoku).

## Fazy

**Faza 0, rekonesans.** Repo, struktura Trzaska, sekcja `#wzornik`, `yarn build`, Node, Chromium, ffmpeg, licencja Remotion, aktualne specyfikacje Apple. Ustalenia w `studio/app-preview/NOTES.md`.

**Faza 1, plan.** Plik `studio/app-preview/PLAN.md`. Dla każdej aplikacji: nazwa z wynikiem sprawdzenia, koncepcja, paleta w HEX, kroje z potwierdzeniem polskich znaków, lista ekranów, storyboard słowny z czasami, presety ruchu. Dla każdej osobny akapit „czym wizualnie i ruchowo różni się od pozostałych pięciu”. Na końcu struktura katalogów i URL. Tu checkpoint według trybu pracy.

**Faza 2, fundament.** Projekt Remotion z kompozycjami parametryzowanymi formatem, generyczna ramka telefonu, szablon strony case study, indeks, skrypty: render wszystkich wersji, kompresja webowa, walidacja ffprobe, plansze klatek. Cały łańcuch sprawdź najpierw na jednej aplikacji.

**Faza 3, realizacja.** Pozostałe aplikacje kolejno albo równolegle przez podagentów. Każdy dostaje ten prompt, swój fragment `PLAN.md` i gotowe narzędzia, pracuje tylko w swoim katalogu. Po każdej: rendery, walidacja, przegląd, commit.

**Faza 4, kontrola jakości.** Opisana niżej.

**Faza 5, publikacja.** Linki w `#wzornik`, `yarn build`, ścieżki pod `/portfolio-v2/`, raport.

## Kontrola jakości

- **Walidacja techniczna:** ffprobe dla każdego pliku: szerokość, wysokość, fps, długość, kodek, `pix_fmt`. Wersja sklepowa musi spełniać specyfikację co do piksela i sekundy. Wersje webowe do 4 MB.
- **Przegląd ruchu:** plansza klatek co 0,5 sekundy (ffmpeg `fps=2` i `tile`). Obejrzyj ją naprawdę. Sprawdź: czy pierwsza klatka sprzedaje, czy nic nie miga przez 1 do 2 klatek, czy nakładki są czytelne, czy nie rusza się wszystko naraz.
- **Test miniatury:** wyrenderuj 3 klatki w 25% rozmiaru i obejrzyj. Tak wygląda podgląd w sklepie i w feedzie.
- **Pętla:** porównaj pierwszą i ostatnią klatkę wersji webowej, szew ma być niewidoczny.
- **Strony:** zrzuty przy 390 i 1440 px, oglądasz, poprawiasz, powtarzasz. W konsoli brak błędów.
- **Odrębność:** złóż po 3 klatki z każdej aplikacji w jedną planszę. Jeśli dwie realizacje wyglądają lub poruszają się podobnie, przebuduj słabszą.
- **Niezależny recenzent:** osobny podagent bez wiedzy o procesie dostaje plansze klatek, pliki wideo, zrzuty stron i rubrykę. Wszystko poniżej 4 poprawiasz i oceniasz ponownie.

**Rubryka (1 do 5):** siła haka w pierwszych 2 sekundach, czytelność komunikatu bez dźwięku, jakość ruchu (krzywe, rytm, stopniowanie), wierność stylowi, jakość interfejsu, zgodność ze specyfikacją, wartość sprzedażowa strony, odrębność od pozostałych pięciu.

## Czego unikać

- Liniowego easingu w ruchu interfejsu. Wszystkiego, co wjeżdża jednocześnie. Przejść dla samych przejść.
- Tekstu, którego nie da się przeczytać w czasie, w jakim jest na ekranie.
- Wyglądu „z AI”: fioletowo-niebieskich gradientów, Inter wszędzie, generycznych dashboardów.
- Tego samego szkieletu wideo w 6 realizacjach. Każda ma strukturę i rytm wynikające ze stylu.

## Definicja ukończenia

- 6 stron case study plus indeks, podlinkowane w `#wzornik`, działające pod `/portfolio-v2/`.
- Dla każdej aplikacji: wersja sklepowa zgodna ze specyfikacją, 3 formaty marketingowe, wersje webowe, storyboard, ikona.
- Wszystkie oceny w rubryce co najmniej 4, potwierdzone przez niezależnego recenzenta.
- `yarn build` przechodzi, repo bez masterów wideo.

## Raport końcowy

Krótko, po polsku: co powstało i pod jakimi adresami, wyniki ffprobe w tabeli, oceny z rubryki przed i po poprawkach, czas renderów, czego nie udało się zrobić, decyzje do mojego przeglądu.
