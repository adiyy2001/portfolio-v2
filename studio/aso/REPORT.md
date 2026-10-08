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

0 błędów we wszystkich sześciu zestawach: Grań 38 plików, Szyld 38, Margines 38, Chochla 38, Kruszec 50, Bis 38. Łącznie opublikowane 70,7 MB. Łączenia panoramy Grani: 24 z 24 zgodne.

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
- Uwag z rundy 2 uznanych za ryzykowne przy ocenach już powyżej progu, zapisanych w `PLAN.md` w punkcie 52:
  - kadr 1 i rytm kadrów 4 do 6 w Kruszcu, grubszy szeryf i linia ikony
  - cięższe nagłówki Marginesu, „fiszki” w kadrze 1, szkic w kadrze 3
  - otwór po kodzie w kadrze 5 Szyldu i bardziej grejpfrutowy kadr 1
  - błyski Bis na literach i telefon w kadrze 1 Google Play
  - większy telefon w kadrze 2 Grani
  - kontur dymka w feature graphic Chochli
  - etykiety w kadrze 4 EN Kruszca i „na” na końcu wiersza w kadrze 1
  - etykieta Marginesu przy 768 px
  - krótszy nagłówek indeksu

## Decyzje do przeglądu (pełne w `PLAN.md`, 52 punkty)

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
- Wybór poprawek z listy na później (punkt 52).
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
