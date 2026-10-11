# Wzornik ASO: raport końcowy

Data: 2026-10-08. Gałąź `wzornik-aso`, jeszcze nie scalona z `main`.

## Co powstało i pod jakimi adresami

Sześć zestawów screenshotów do App Store i Google Play dla zmyślonych aplikacji, każdy w przypisanym stylu, oraz indeks:

- https://adrianturbinski.pl/wzornik/aso/ (sześć kafli z pierwszymi trzema screenshotami)
- https://adrianturbinski.pl/wzornik/aso/gran/ Grań, szlaki w Sudetach, panorama ilustracyjna
- https://adrianturbinski.pl/wzornik/aso/szyld/ Szyld, lokalne sklepy z odbiorem, gradienty i przechylone urządzenia
- https://adrianturbinski.pl/wzornik/aso/margines/ Margines, fiszki, odręczne adnotacje
- https://adrianturbinski.pl/wzornik/aso/chochla/ Chochla, przepisy i plan posiłków, memphis i pop-art
- https://adrianturbinski.pl/wzornik/aso/kruszec/ Kruszec, budżet i inwestowanie, ciemne szkło premium, plus zestaw iPad 13″
- https://adrianturbinski.pl/wzornik/aso/bis/ Bis, muzyka i koncerty, Y2K holograficzny chrom

Linki prowadzą z https://adrianturbinski.pl/dla-klienta/#wzornik (blok „Screenshoty do sklepów”) i z https://adrianturbinski.pl/en/for-clients/ (blok „App store screenshots”). Na https://adrianturbinski.pl/wzornik/ jest link „Screenshoty do sklepów: sześć realizacji”. Adresy zaczną działać po scaleniu z `main` i wdrożeniu.

Każda aplikacja ma:

- 6 screenshotów App Store 1320×2868 i 6 osobnych kompozycji Google Play 1080×1920, po polsku i po angielsku
- wariant B z hipotezą w obu sklepach i obu językach
- feature graphic 1024×500
- ikony 1024 i 512 z warstwami
- ZIP z folderami według sklepu i języka, z tekstami (pl.json, en.json, CSV)

Kruszec ma dodatkowo 12 plików iPad 2064×2752.

## Wynik walidatora

0 błędów we wszystkich sześciu zestawach: Grań 38 plików, Szyld 38, Margines 38, Chochla 38, Kruszec 50, Bis 38. Łącznie opublikowane 73,0 MB (po rundzie 3). Łączenia panoramy Grani: 24 z 24 zgodne.

## Oceny z rubryki

Kolejność kolumn: Grań, Szyld, Margines, Chochla, Kruszec, Bis.

Runda 1 (`REVIEW-1.md`):

| Kryterium | Grań | Szyld | Margines | Chochla | Kruszec | Bis |
|---|---|---|---|---|---|---|
| czytelność w miniaturze | 5 | 4 | 4 | 4 | 4 | 3 |
| jasność korzyści w pierwszych 3 | 5 | 4 | 4 | 5 | 5 | 4 |
| opowieść całej sekwencji | 5 | 5 | 5 | 5 | 5 | 5 |
| wierność stylowi | 5 | 5 | 5 | 5 | 5 | 5 |
| jakość interfejsu | 4 | 4 | 5 | 5 | 4 | 5 |
| zgodność ze specyfikacjami | 5 | 5 | 5 | 5 | 5 | 4 |
| jakość wersji EN | 5 | 4 | 5 | 5 | 4 | 4 |
| wartość sprzedażowa strony | 4 | 5 | 5 | 4 | 5 | 4 |
| odrębność od pozostałych | 5 | 4 | 4 | 5 | 4 | 4 |

Jedna ocena poniżej 4 (Bis, miniatura). Poprawki są opisane w `NOTES.md` w sekcji „Review round 1 fixes”.

Runda 2 (`REVIEW-2.md`, drugi niezależny recenzent, który nie widział pierwszej recenzji):

| Kryterium | Grań | Szyld | Margines | Chochla | Kruszec | Bis |
|---|---|---|---|---|---|---|
| czytelność w miniaturze | 5 | 5 | 4 | 5 | 4 | 4 |
| jasność korzyści w pierwszych 3 | 5 | 5 | 4 | 5 | 5 | 5 |
| opowieść całej sekwencji | 5 | 5 | 5 | 5 | 4 | 5 |
| wierność stylowi | 5 | 5 | 5 | 5 | 4 | 5 |
| jakość interfejsu | 4 | 4 | 4 | 5 | 5 | 5 |
| zgodność ze specyfikacjami | 5 | 5 | 5 | 5 | 5 | 5 |
| jakość wersji EN | 4 | 5 | 5 | 4 | 5 | 4 |
| wartość sprzedażowa strony | 4 | 4 | 5 | 5 | 4 | 5 |
| odrębność od pozostałych | 5 | 4 | 5 | 5 | 5 | 5 |

Wszystkie 54 oceny wynoszą co najmniej 4. Blokada spoza rubryki z rundy 2, czyli brak linków z `#wzornik` i `/wzornik/`, została usunięta w fazie publikacji. Po rundzie 2 poprawione zostały też:

- chmura na nagłówku w kadrze 5 Google Play Grani (PL i EN)
- „Sudetes” w wersji EN
- Chochla EN kadry 2 i 4 („The list writes itself”, „Serves two or serves five”)
- Bis EN kadr 2 („Bands you don't know, playing nearby”) i podtytuł ekranu
- twarda spacja w „1603 m”
- karty sekwencji Grani, Szyldu i Kruszca układają się w kolumnę poniżej 400 px

## Data weryfikacji specyfikacji

2026-10-07: App Store Connect Help („Screenshot specifications”), HIG „App icons”, App Review Guidelines 2.3, Play Console Help („Add preview assets”, testy A/B listingu) i specyfikacja ikon Google Play. Źródła i szczegóły są w `NOTES.md`, sekcja „Store specifications”.

## Czego nie udało się zrobić

- Scalenia z `main` i wdrożenia (zgodnie z ustaleniem robimy to razem).
- Wpisów w `llms.txt`, `sites/README.md` i `REBRAND.md` (brief identyfikacji też ich nie dodawał).
- Pliku `.icon` z Icon Composera (są warstwy ikon).
- Uwag z rundy 2 zapisanych w `PLAN.md` w punkcie 52: wszystkie wykonane w rundzie 3 (punkt 53), poza tym, co jest niżej.
- Pojedyncze słowa w ostatnim wierszu w części akapitów z `text-wrap: pretty`; w nagłówkach i akapicie CTA indeksu usunięte w poprawce po przeglądzie rundy 3.
- Pełnego budowania Gatsby w układzie wdrożenia nie powtarzano w rundzie 3; użyto statycznego serwera z `sites/dist` pod `/wzornik/` i `static` portfolio w korzeniu.

## Runda 3: poprawki z punktu 52

Gałąź `wzornik-aso-r2` (z `main` 7accb02), dziesięć commitów, bez pusha i bez scalenia. Wszystkie zestawy przerenderowane dla obu sklepów i wszystkich języków, zasoby w `sites/public/aso/` i strony zaktualizowane.

- Kruszec: wykres w kadrze 1 jako bohater całego kadru (linia wydłużona i pochylona, z wypełnieniem i siatką), jaśniejszy ton w kadrach 4 do 6, cięższy szeryf i linia ikony, kryjące etykiety w kadrze 4 EN, „na” przyklejone do akcentu w kadrze 1.
- Margines: nagłówki na jednej zmierzonej, rwanej kartce, „fiszki” w nagłówku kadru 1 (PL i EN), szkic w polu rysunkowym kadru 3, etykieta „Odręczne adnotacje” w osobnym wierszu przy 768 px.
- Szyld: pusty otwór po kodzie w kadrze 5 wypełniony cieniem kodu, bardziej grejpfrutowy kadr 1 (też wariant B).
- Bis: błyski odsunięte od liter w kadrach 4 do 6 (App Store i Play), telefon w kadrze 1 Play 30 px niżej.
- Grań: większy telefon w kadrze 2 (240 px w App Store, 208 px w Play), łączenia 24 z 24.
- Chochla: gładki kontur ogonów dymków, także w feature graphic.
- Indeks: krótszy nagłówek, balans tekstu w nagłówkach i akapitach.

Kontrole: walidator 0 błędów w sześciu zestawach (Bis 38 plików, 12,5 MB opublikowane, całe ASO 73,0 MB), `guard` czysty we wszystkich sześciu, `distinct` bez zmian, testy studia 19 z 19, `astro check` 0 błędów, Prettier czysty, testy witryny 1411 z 1411, build 199 stron, główny `yarn.lock` bez zmian. Wszystkie strony przy 320, 390, 768, 1024 i 1440 px: bez poziomego przewijania, bez błędów konsoli, bez zepsutych obrazków. Wszystkie przerenderowane plansze i zrzuty zmienionych stron obejrzane.


### Poprawka po przeglądzie rundy 3

- Kruszec EN App Store, kadr 1: podpis „since 2021” ustawiany nad linią i poza siatką, już nie dotyka linii ani wypełnienia (ta sama reguła dla wszystkich podpisów wykresu).
- Margines: kartka pod nagłówkiem ma większy margines boczny (kadr 4 EN, kadr 3 PL), adnotacja w kadrze 4 EN 36 px niżej; przerenderowane obie wersje sklepu, ZIP i pliki stron.
- Nagłówki: dwa ostatnie słowa sklejone twardą spacją, na wąskich ekranach (do 360 px) nieco mniejszy krój w Bis, Chochli, Szyldzie i Marginesie; akapit CTA w indeksie ma „pierwszym razem” razem. Brak pojedynczych słów w ostatnim wierszu nagłówków przy 320, 360, 390, 768, 1024 i 1440 px.
- Kontrole: walidator 0 błędów, `guard` czysty, testy studia 19 z 19, `astro check` 0 błędów, Prettier czysty, testy witryny 1411 z 1411, build 199 stron.

## Decyzje do przeglądu (pełne w `PLAN.md`, 53 punkty)

1. Nazwy sprawdzone w wyszukiwarce; to nie jest analiza prawna.
2. Adresy pod `/wzornik/aso/`.
3. Grań jako pierwsza aplikacja; iPad dla Kruszca.
4. Jeden rozmiar iPhone 1320×2868 (Apple skaluje z niego mniejsze sloty).
5. W Google Play ekran bez ramki urządzenia.
6. Nagłówki Google Play zajmują najwyżej 20 procent obrazu.
7. Ikony z warstwami, bez pliku `.icon`.
8. JPEG 90 dla Szyldu, Bis i Kruszca, PNG dla pozostałych.
9. Osobny pakiet `studio/aso` z własnym lockiem.
10. Rejestr aplikacji w `apps.ts`.
11. Jeden plik tekstów na język.
12. Prawdziwa geografia, reszta zmyślona; Kruszec na danych przykładowych.
13. Ceny tylko jako zwykłe ceny towarów w Szyldzie.
14. Margines EN uczy polskiego.
15. Kroje tylko na licencji OFL.
16. Pasek stanu 9:30 bez logo.
17. Wariant B w obu sklepach.
18. Strony po polsku z `noindex`, jak pozostałe strony Wzornika.
19. Publikacja tylko w tej fazie.
20. Grań PL 4: „Każde podejście widać już w domu”.
21. Jedno słońce w panoramie Grani.
22. Liczbowa kontrola łączeń panoramy.
23. Narzędzia w chmurze (Node 22, limit pamięci bez systemd-run).
24. Dodatkowe sekcje stron.
25. Szyld kadr 1 to ekran odbioru w drodze do domu.
26. Szyld: zmienione nagłówki.
27. Szyld: JPEG 90, Poznań także w EN.
28. Rozszerzenia fundamentu (zgodne wstecz).
29. Margines: zmienione nagłówki.
30. Margines: zmienione tytuły książek, wariant B z własnym ekranem.
31. Mierzone adnotacje.
32. Chochla: wariant B „Dziś”.
33. Mierzone dymki i konfetti.
34. Chochla bez cen, EN brytyjska.
35. Kruszec w JPEG.
36. Kruszec EN brytyjski, bez obietnic zysku.
37. Mierzona linia wykresu.
38. Mierzony chrom Bis.
39. Zmienione nazwy w Bis (Hala Pogłos, Zorza i Psy).
40. Bis: wariant B z odsłuchem, układ feature graphic.
41. Pełne pulpity iPad.
42. Etykiety alokacji obok pierścienia.
43. Ciemniejszy chrom.
44. Naklejka zamiast chromu w kadrach 1 do 3 Bis.
45. Nowy kadr 2 w Bis i Kruszcu.
46. Pionowy nagłówek Szyldu na kadrze 4.
47. Teksty po rundzie 1.
48. Grań Google Play bez terenu przed ekranami.
49. iPad kadr 6 bez telefonu.
50. Publikacja według wzoru identyfikacji.
51. Teksty i karty po rundzie 2.
52. Lista poprawek na później.

## Co może dostarczyć tylko Adrian

- Zgodę na scalenie z `main` i wdrożenie.
- Przegląd decyzji z punktu 53 (runda 3).
- Ewentualne sprawdzenie prawne nazw.
- Akceptację decyzji, zwłaszcza 4, 8 i 18.

## Wyniki końcowej weryfikacji

- Walidator: 0 błędów w sześciu zestawach.
- Łączenia Grani: 24 z 24.
- Testy studia: 19 z 19.
- `yarn --cwd sites run check`: 0 błędów, 0 ostrzeżeń, 6 podpowiedzi, Prettier czysty.
- `yarn --cwd sites test`: 127 plików, 1334 testy zaliczone.
- `yarn --cwd sites build`: 192 strony.
- `yarn lint`: najpierw 13 błędów nieużywanych zmiennych w `studio/aso`; poprawione bez zmiany renderów, teraz przechodzi.
- `yarn gatsby clean && yarn build`: kod 0.
- Główny `yarn.lock` bez zmian.
- Układ wdrożenia (`sites/dist` w `public/wzornik`, `gatsby serve` na 127.0.0.1:4330), strony `/dla-klienta/`, `/en/for-clients/`, `/wzornik/`, `/wzornik/aso/` i sześć case studies przy 320, 390, 768, 1024 i 1440 px:
  - brak poziomego przewijania
  - brak błędów konsoli poza zablokowanym w sandboksie skryptem analityki gc.zgo.at
  - wszystkie linki do ASO zwracają 200, og:image 200
  - zrzuty przy 390 i 1440 px obejrzane
- Rozmiar: ASO 72 MB, całe wdrożenie 138 MB, największy plik 13,6 MB.
