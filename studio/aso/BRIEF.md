# Wzornik: screenshoty ASO, 6 realizacji

**Tryb pracy:** autonomicznie (Adrian, 2026-10-03: „nie czekaj na nic z moją akceptacją”). Nie zatrzymuj się po fazie 1. Decyzje warte przejrzenia zapisz w PLAN.md i w raporcie końcowym.

## Rola i cel

Pracujesz jako designer ASO (App Store Optimization), product designer i creative technologist w jednej osobie. Budujesz w moim portfolio (repo `portfolio-v2`) sekcję wzornika z 6 przykładowymi realizacjami zestawów screenshotów do App Store i Google Play dla zmyślonych aplikacji. Każda realizacja ma inny, z góry przypisany styl. Te strony mają sprzedawać moją usługę: klient po obejrzeniu ma wiedzieć, co dostanie, w jakiej jakości, i że kolejne wersje językowe i testowe dostanie szybko.

Punkt odniesienia jakości to istniejąca realizacja `wzornik/trzask` (sklep palarni kawy). Zobacz, co ją wyróżnia: realistyczna treść branżowa, kompletne dane, dopracowane detale, interaktywny element z sensem, uczciwa stopka o zmyślonej firmie. Ten poziom to minimum.

Ta sesja jest jedną z trzech (identyfikacja, app preview, ASO). Razem powstaje 18 realizacji w 18 różnych stylach. Twoje 6 stylów jest przypisanych niżej. Pozostałe 12 jest zajętych i nie wolno się do nich zbliżać.

## Repozytorium i konwencje

- Gatsby (JS), yarn, treści w `/content`, komponenty w `/src`. Animacje na stronie: framer-motion.
- Zanim cokolwiek zmienisz, zbadaj, jak zbudowany jest `wzornik/trzask`: gdzie leżą pliki, czy to strony Gatsby czy statyczny HTML, jak działa ścieżka `/portfolio-v2/` na GitHub Pages. Zbadaj też sekcję `#wzornik` na stronie `/dla-klienta/`. Nowe realizacje mają działać tak samo i być podlinkowane w tym samym miejscu.
- Pipeline renderujący w osobnym katalogu `studio/` z własnym `package.json`. Nie dodawaj Playwright ani sharp do zależności strony. `yarn build` strony musi przechodzić bez nich.
- Pełne eksporty w `studio/out/` (dodaj do `.gitignore`). Do repo trafiają wersje dla strony i ZIP-y do pobrania.
- Bez komentarzy w kodzie. Teksty interfejsu po polsku, wersje EN tylko w eksportach.
- Gałąź `wzornik-aso`. Commit po każdej ukończonej realizacji.
- Prowadź listę zadań i aktualizuj ją na bieżąco.

## Zasady treści

- Polszczyzna naturalna i konkretna. Angielski naturalny, pisany od nowa, nie tłumaczony słowo w słowo.
- Bez myślników em (U+2014) w tekstach.
- Nagłówek: jedna korzyść, najwyżej 6 słów, zgodny z tym, co widać na ekranie poniżej.
- Bez „Nr 1”, „najlepsza”, „darmowa”, rankingów, ocen, gwiazdek, nagród, cytatów prasowych, logo mediów, opinii użytkowników, liczby pobrań i cen promocyjnych. Sklepy tego nie lubią, a w portfolio wyglądałoby to na oszustwo.
- Przy aplikacji finansowej żadnych obietnic zysku ani stóp zwrotu. Liczby opisane jako przykładowe.
- Nazwa aplikacji: zaproponuj 3, wybierz 1. Sprawdź w wyszukiwarce, czy nie istnieje znana aplikacja o tej nazwie w tej samej kategorii. Wynik zapisz w planie.
- Żadnych prawdziwych marek, logotypów Apple i Google, oficjalnych renderów urządzeń, zdjęć, prawdziwych artystów ani okładek płyt. Ramkę telefonu rysujesz sam, generyczną.
- Nie używaj SF Pro ani innych krojów systemowych Apple. Kroje tylko OFL (Google Fonts lub Fontsource), lokalnie. Każdy sprawdź na `ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ` we wszystkich użytych wagach. Szczególnie kroje odręczne i display.
- Stopka każdej strony: „Projekt przykładowy. [Aplikacja] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński.” z linkiem do `/dla-klienta/`.

## Przypisane style

| ID | Styl | Aplikacja | Cechy obowiązkowe | Unikaj |
|---|---|---|---|---|
| S1 | Panorama ilustracyjna | Szlaki górskie w Sudetach | Jeden ciągły krajobraz we flat vector przez wszystkie 6 screenshotów: warstwy gór dające głębię, szlak przechodzący z kadru do kadru, urządzenia osadzone w krajobrazie. Tło projektowane jako jedna grafika o szerokości 6 kadrów i cięte dokładnie; elementy na łączeniach zgadzają się co do piksela | Zdjęć, przypadkowych łączeń |
| S2 | Mocne gradienty z przechylonymi urządzeniami | Zakupy w lokalnych sklepach z odbiorem osobistym | Duże bezszeryfowe nagłówki, duotonowe gradienty z ziarnem (szum SVG), urządzenia w perspektywie 3D (CSS transform) wychodzące poza kadr, energia i ruch | Fioletowo-niebieskiego gradientu „z AI”; dobierz nieoczywistą parę kolorów |
| S3 | Odręczne adnotacje (doodle) | Fiszki do nauki języków | Tło papieru w kratkę, strzałki, podkreślenia i obwódki jak flamastrem (SVG z nierównym obrysem, rough.js dozwolony), nagłówki krojem odręcznym, naklejki | Chaosu; każda adnotacja wskazuje konkretny element interfejsu |
| S4 | Memphis i pop-art | Przepisy i planowanie posiłków | Wzory memphis (zygzaki, kropki, trójkąty), mocne płaskie kolory, grube kontury, komiksowe dymki z nagłówkami, jedzenie zbudowane z prostych kształtów | Dekoracji zasłaniających interfejs, zdjęć jedzenia |
| S5 | Ciemne szkło premium | Budżet osobisty i inwestowanie | Głęboki granat lub grafit, matowe szkło, subtelna poświata, elegancki szeryf lub grotesk, wykres jako bohater | Neonu, krzykliwości, obietnic zysku |
| S6 | Y2K holograficzny chrom | Odkrywanie muzyki i koncertów | Iryzujące gradienty, chromowane litery (gradienty SVG z odblaskami), gwiazdki i błyski, bąbelkowy krój, naklejki; zmyśleni wykonawcy i własne „okładki” z kształtów | Prawdziwych artystów, okładek i logo serwisów |

**Zajęte style (nie zbliżaj się):** szwajcarski modernizm, neobrutalizm, organiczny rzemieślniczy, luksusowy edytorial, retro lata 70., generatywna identyfikacja dynamiczna, natywny iOS jasny, kinetyczna typografia, ciemny neon i cyber, claymorphism pastelowy, pixel art 8-bit, izometryczny dashboard danych. Nie kopiuj też estetyki Trzaska.

## Specyfikacje, które musisz zweryfikować

Przed eksportem sprawdź aktualne wymagania w oficjalnych źródłach (App Store Connect Help: Screenshot specifications; Play Console Help: Add preview assets) i zapisz datę sprawdzenia w `NOTES.md`. Stan, od którego zaczynasz:

- **App Store, iPhone 6,9″:** 1320×2868 w pionie, PNG lub JPEG, RGB, bez przezroczystości, 1 do 10 sztuk. W wynikach wyszukiwania widać zwykle pierwsze 3.
- **App Store, ikona:** 1024×1024 PNG bez kanału alfa i bez zaokrąglonych rogów (system nakłada maskę).
- **Google Play, telefon:** 1080×1920 (9:16), JPEG lub 24-bitowy PNG bez alfy, boki od 320 do 3840 px, dłuższy bok najwyżej 2 razy dłuższy od krótszego, do 8 MB, 2 do 8 sztuk.
- **Google Play, feature graphic:** 1024×500, JPEG lub 24-bitowy PNG bez alfy. Kluczowa treść w centralnych 80%, bo bywa przycinana i przykrywana przyciskiem odtwarzania.
- **Google Play, ikona:** 512×512, 32-bitowy PNG, do 1024 KB.

## Co powstaje dla każdej aplikacji

1. **Koncepcja:** problem, użytkownik, 3 kluczowe funkcje, nazwa, ikony w obu specyfikacjach.
2. **Interfejs:** 5 do 8 ekranów jako komponenty HTML lub React z mini design systemem. Realistyczne, zmyślone dane po polsku i osobno po angielsku.
3. **Strategia sekwencji:** 6 screenshotów, każdy z jedną korzyścią. Pierwsze 3 muszą same opowiedzieć, po co jest aplikacja. Kolejność opisana w planie jako historia.
4. **Wariant B** pierwszego screenshotu z inną obietnicą, do testu A/B, z jednym zdaniem hipotezy.
5. **Eksporty:**
   - App Store 6,9″: 6 sztuk, PL i EN.
   - Google Play telefon: 6 sztuk, PL i EN. Nie skaluj plików Apple; to osobne kompozycje dopasowane do proporcji.
   - Feature graphic: PL i EN.
   - Ikony: App Store i Google Play.
   - Dla jednej wybranej aplikacji dodatkowo zestaw iPad 13″ (2064×2752) jako pokaz.
6. **Paczka dla klienta:** ZIP z folderami według sklepu i języka oraz plikiem z tekstami nagłówków.

## Pipeline

1. Jedna definicja treści na aplikację (JSON lub TS): nagłówki, podtytuły, dane w interfejsie, osobno dla `pl` i `en`.
2. Szablony kompozycji w HTML/CSS, jedna kompozycja na screenshot, parametryzowana językiem i formatem.
3. Render w Playwright: App Store w kanwie 440×956 ze skalą 3 (daje 1320×2868), Google Play w kanwie 360×640 ze skalą 3 (daje 1080×1920), feature graphic w 512×250 ze skalą 2. Czekaj na załadowanie krojów przed zrzutem.
4. Spłaszczenie i usunięcie alfy w sharp (`flatten`, `removeAlpha`).
5. Walidator: dokładne wymiary, 3 kanały bez alfy, rozmiar pliku, proporcje, liczba plików na zestaw. Błąd przerywa build.
6. Plansza: wszystkie screenshoty zestawu obok siebie, w kolejności sklepu.

Projektuj najpierw po polsku, bo polskie słowa są dłuższe. Sprawdź najdłuższy nagłówek w obu językach. Nadpisania układu per język są dozwolone, ale opisane.

Nowy język ma oznaczać tylko nowy plik z tekstami. Pokaż to na stronie jako argument sprzedażowy.

## Strona case study (szablon wspólny, wygląd w stylu aplikacji)

1. Hero z zestawem screenshotów w poziomym pasku, jak w sklepie.
2. Klient i zadanie: fikcyjny brief w 3 do 4 zdaniach.
3. Kierunek: dlaczego ten styl dla tej aplikacji i tych użytkowników.
4. Historia sekwencji: dlaczego taka kolejność, co mówią pierwsze 3.
5. Neutralna makieta wyników wyszukiwania (bez logo Apple i Google) pokazująca, jak zestaw wygląda w miniaturze.
6. Przełącznik PL i EN podmieniający cały zestaw.
7. Wariant A i B obok siebie z hipotezą.
8. Feature graphic i ikony.
9. Co dostaje klient: lista plików z wymiarami, ZIP do pobrania.
10. CTA do `/dla-klienta/` i stopka.

Plus strona indeksu kategorii: 6 kafli, każdy z pierwszymi 3 screenshotami swojego zestawu.

## Fazy

**Faza 0, rekonesans.** Repo, struktura Trzaska, sekcja `#wzornik`, `yarn build`, Node, Chromium, aktualne specyfikacje obu sklepów. Ustalenia w `studio/aso/NOTES.md`.

**Faza 1, plan.** Plik `studio/aso/PLAN.md`. Dla każdej aplikacji: nazwa z wynikiem sprawdzenia, koncepcja, paleta w HEX, kroje z potwierdzeniem polskich znaków, lista ekranów, 6 nagłówków PL i EN, wariant B z hipotezą. Dla każdej osobny akapit „czym wizualnie różni się od pozostałych pięciu”. Na końcu struktura katalogów i URL. Tu checkpoint według trybu pracy.

**Faza 2, fundament.** Pipeline z sekcji wyżej, generyczna ramka telefonu, szablon strony case study, indeks. Cały łańcuch sprawdź najpierw na jednej aplikacji, łącznie z walidatorem i ZIP-em.

**Faza 3, realizacja.** Pozostałe aplikacje kolejno albo równolegle przez podagentów. Każdy dostaje ten prompt, swój fragment `PLAN.md` i gotowy pipeline, pracuje tylko w swoim katalogu. Po każdej: eksporty, walidacja, przegląd, commit.

**Faza 4, kontrola jakości.** Opisana niżej.

**Faza 5, publikacja.** Linki w `#wzornik`, `yarn build`, ścieżki pod `/portfolio-v2/`, raport.

## Kontrola jakości

- **Walidator** przechodzi dla wszystkich plików we wszystkich zestawach.
- **Przegląd wizualny:** obejrzyj naprawdę każdą planszę zestawu. Sprawdź wyrównania, kolizje tekstu z interfejsem, sieroty w nagłówkach, spójność między kadrami.
- **Test miniatury:** wyrenderuj pierwsze 3 screenshoty w szerokości około 200 px i obejrzyj. Nagłówek ma być czytelny, a korzyść zrozumiała w 3 sekundy.
- **S1 osobno:** sprawdź łączenia panoramy na powiększeniu 400%.
- **Języki:** porównaj plansze PL i EN. Żaden tekst nie może być ucięty ani ściśnięty.
- **Strony:** zrzuty przy 390 i 1440 px, oglądasz, poprawiasz, powtarzasz. W konsoli brak błędów.
- **Odrębność:** złóż pierwsze 3 screenshoty z każdej aplikacji w jedną planszę. Jeśli dwie realizacje wyglądają jak ten sam szablon w innych kolorach, przebuduj słabszą.
- **Niezależny recenzent:** osobny podagent bez wiedzy o procesie dostaje plansze, pliki i rubrykę. Wszystko poniżej 4 poprawiasz i oceniasz ponownie.

**Rubryka (1 do 5):** czytelność w miniaturze, jasność korzyści w pierwszych 3, opowieść całej sekwencji, wierność stylowi, jakość interfejsu, zgodność ze specyfikacjami, jakość wersji EN, wartość sprzedażowa strony, odrębność od pozostałych pięciu.

## Czego unikać

- Nagłówków typu „Twoje życie, prościej”. Każdy nagłówek mówi konkretnie, co aplikacja robi.
- Telefonu na środku z podpisem nad nim, sześć razy z rzędu. Kompozycja zmienia się w obrębie zestawu.
- Wyglądu „z AI”: fioletowo-niebieskich gradientów, Inter wszędzie, generycznych ikon.
- Tego samego szkieletu kompozycji w 6 realizacjach.

## Definicja ukończenia

- 6 stron case study plus indeks, podlinkowane w `#wzornik`, działające pod `/portfolio-v2/`.
- Dla każdej aplikacji komplet eksportów PL i EN, wariant B, ikony, feature graphic, ZIP. Dla jednej dodatkowo iPad.
- Walidator bez błędów. Wszystkie oceny w rubryce co najmniej 4, potwierdzone przez niezależnego recenzenta.
- `yarn build` przechodzi.

## Raport końcowy

Krótko, po polsku: co powstało i pod jakimi adresami, wynik walidatora, oceny z rubryki przed i po poprawkach, data weryfikacji specyfikacji, czego nie udało się zrobić, decyzje do mojego przeglądu.
