---
title: 'Dostępność stron firm z pięciu miast: wyniki skanu 120 stron (listopad 2026)'
description: 'Wyniki własnego skanu dostępności 120 stron głównych firm lokalnych z pięciu miast: ile stron ma błędy WCAG, jakie są najczęstsze i ile ma deklarację dostępności. Metoda i ograniczenia.'
answer: 'Przeskanowałem strony główne 120 firm lokalnych z pięciu dużych miast. Automat wykrył błędy dostępności na 117 z nich, czyli 97,5 procent, a mediana to 3 naruszone reguły na stronę. Najczęściej zawodzi kontrast tekstu (83,3 procent stron) i nazwy linków dla czytnika ekranu (66,7 procent). Deklarację dostępności znalazłem na 1 stronie.'
date: '2026-11-10T18:00:00+01:00'
slug: 'dostepnosc-stron-firm-wyniki-skanu-120-stron'
service: 'wcag'
tags: ['dostępność', 'WCAG', 'badanie']
faq:
  - q: 'Czy brak błędów w skanie oznacza, że strona spełnia WCAG?'
    a: 'Nie. Automat wykrywa tylko część problemów. W tej próbie 3 strony ze 120 nie miały wykrytych naruszeń, ale nie sprawdzałem ich klawiaturą ani czytnikiem ekranu, więc nie uznaję ich za zgodne z WCAG.'
  - q: 'Jakie błędy dostępności były najczęstsze w tej próbie?'
    a: 'Najczęściej zawodził kontrast tekstu z tłem (83,3 procent stron), potem linki bez nazwy dla czytnika ekranu (66,7 procent), obrazy bez opisu (22,5 procent) i ramki bez tytułu (18,3 procent).'
  - q: 'Ile stron miało deklarację dostępności?'
    a: 'Deklarację dostępności znalazłem na 1 stronie ze 120. Trzy strony miały link ze słowem „dostępność”, ale tylko jeden prowadził do deklaracji. Drugi prowadził do strony kancelarii o przepisach, a trzeci otwierał pasek narzędzi z ustawieniami dostępności. Czy firma musi taką deklarację mieć, zależy od tego, czy obejmują ją przepisy o dostępności.'
  - q: 'Czy wyniki dotyczą wszystkich firm w Polsce?'
    a: 'Nie. To próba 120 stron firm z pięciu miast, które wyszukiwarka pokazała jako pierwsze dla zapytania o branżę i miasto, sprawdzonych jednego dnia. Wyniki opisują tę próbę.'
---

Sprawdziłem tym samym automatem strony główne 120 firm z sześciu branż i pięciu miast. Liczby dotyczą tej próby z 10 listopada 2026. Błędy znalazłem na 117 stronach, a 3 strony nie miały wykrytych naruszeń.

## Jak zebrałem próbę i jak skanowałem

Dla każdej z 30 par branża i miasto wziąłem cztery pierwsze strony firm z wyników Brave Search dla Polski. Pomijałem katalogi, marketplace i portale, media społecznościowe, dostawców oprogramowania, izby i instytucje oraz firmy spoza branży z zapytania. Poza próbą zostały ogólnopolskie sieci, franczyzy i firmy z biurami w kilku miastach. W próbie zostały firmy z kilkoma oddziałami w jednym mieście lub regionie. Branże to gabinety stomatologiczne, kancelarie prawne, biura rachunkowe, firmy budowlane i remontowe, warsztaty samochodowe i salony kosmetyczne. Miasta to Warszawa, Kraków, Wrocław, Poznań i Gdańsk. Wyszło po 20 stron w branży i po 24 w mieście.

Każdą stronę główną otworzyłem raz w Chromium 156, w oknie 1366 na 900 pikseli. Limit 30 sekund dotyczył załadowania strony, a potem czekałem jeszcze chwilę, aż sieć się uspokoi. Następnie sprawdzałem stronę biblioteką axe-core 4.14.0 z regułami WCAG 2.1 na poziomach A i AA. Nie klikałem zgód na cookies, nie wypełniałem formularzy i nie wchodziłem na podstrony. Skanowałem po dwie strony naraz.

Żadna strona nie zablokowała skanu. Trzynaście stron wyłączyłem po skanie, bo po bliższym obejrzeniu nie spełniały reguły doboru: porównywarka (1), serwis z nagrodami (1), ogólnopolskie sieci i franczyzy (4), firmy z biurami w kilku miastach (2), firmy spoza branży (2), firma z innego miasta (1), strona z wstrzykniętą obcą treścią (1) i druga strona tego samego operatora (1). Zastąpiłem je kolejnymi stronami z tych samych wyników, po sprawdzeniu tytułu, opisu i treści strony głównej.

Naruszenie to jedna reguła axe, która nie przeszła na danej stronie. Strona z dwustu obrazami bez opisu i strona z jednym mają więc po jednym naruszeniu reguły o opisach obrazów. Osobno liczę elementy, na których reguły zawiodły.

Ten sam silnik w tej samej wersji działa w darmowym skanerze na tej stronie. Skaner sprawdza więcej: kilka podstron, widok na telefonie, stronę także po zaakceptowaniu banera cookies i dodatkowe reguły, więc jego wynik dla tej samej strony może się różnić.

## Wyniki

Mediana to 3 naruszone reguły na stronę, kwartyle wyniosły 2 i 4, a największy wynik to 11. Mediana liczby elementów, na których reguły zawiodły, to 13 na stronę.

| Miara                                               | Strony | Udział |
| --------------------------------------------------- | ------ | ------ |
| Co najmniej jedno naruszenie                        | 117    | 97,5%  |
| Zero wykrytych naruszeń                             | 3      | 2,5%   |
| Co najmniej jedna reguła o wpływie krytycznym       | 54     | 45,0%  |
| Niewystarczający kontrast tekstu                    | 100    | 83,3%  |
| Linki lub przyciski bez nazwy dla czytnika ekranu   | 84     | 70,0%  |
| Obrazy bez opisu alternatywnego                     | 27     | 22,5%  |
| Pola formularza bez etykiety                        | 7      | 5,8%   |
| Blokada powiększania na telefonie                   | 16     | 13,3%  |
| Link „pomiń nawigację” wśród pierwszych linków      | 35     | 29,2%  |
| Dokładnie jeden nagłówek h1                         | 95     | 79,2%  |
| Brak nagłówka h1                                    | 9      | 7,5%   |
| Więcej niż jeden nagłówek h1                        | 16     | 13,3%  |
| Link do deklaracji dostępności (sprawdzony ręcznie) | 1      | 0,8%   |

Wszystkie 120 stron miało tytuł, a 119 miało zadeklarowany język. Strona bez żadnego wykrytego naruszenia to w tej próbie wyjątek, ale taki wynik nie dowodzi zgodności z WCAG, bo automat nie sprawdza obsługi klawiaturą ani tego, czy opisy mają sens. Poza kontrastem problem miało 105 stron (87,5%), a poza kontrastem i nazwami linków 85 (70,8%).

### Dziesięć najczęstszych reguł

| Reguła axe                  | Strony | Udział | Co to znaczy                                                                                                                      |
| --------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| color-contrast              | 100    | 83,3%  | Tekst za mało odróżnia się od tła, więc trudno go przeczytać osobie słabowidzącej albo w słońcu.                                  |
| link-name                   | 80     | 66,7%  | Link nie ma tekstu, który odczyta czytnik ekranu, na przykład sama ikona bez opisu.                                               |
| image-alt                   | 27     | 22,5%  | Obraz nie ma opisu alternatywnego, więc osoba niewidoma nie wie, co przedstawia.                                                  |
| link-in-text-block          | 24     | 20,0%  | Link w akapicie wyróżnia się od otaczającego tekstu tylko kolorem, a ten kolor różni się od niego zbyt słabo.                     |
| frame-title                 | 22     | 18,3%  | Osadzona ramka, na przykład mapa albo wideo, nie ma tytułu mówiącego, co zawiera.                                                 |
| button-name                 | 18     | 15,0%  | Przycisk nie ma nazwy, na przykład jest samą ikoną.                                                                               |
| meta-viewport               | 16     | 13,3%  | Strona blokuje powiększanie na telefonie.                                                                                         |
| label-content-name-mismatch | 15     | 12,5%  | Nazwa dla czytnika nie zawiera tekstu widocznego na przycisku albo linku, co utrudnia sterowanie głosem.                          |
| aria-required-children      | 13     | 10,8%  | Element z rolą ARIA nie ma elementów potomnych, których ta rola wymaga.                                                           |
| aria-prohibited-attr        | 11     | 9,2%   | Atrybut nadający nazwę, na przykład aria-label, użyty na elemencie, który nie może mieć nazwy, na przykład zwykłym span albo div. |

Na stronach z niewystarczającym kontrastem takich elementów było zwykle 6,5 (mediana), a łącznie 1888 w całej próbie. Wśród wszystkich 120 stron mediana to 5 elementów z niewystarczającym kontrastem i 2 linki lub przyciski bez nazwy. Blokadę powiększania miało 16 stron, a obrazy bez opisu 27.

### Podział na branże

| Branża                      | Strony | Z naruszeniem | Mediana naruszeń | Z regułą krytyczną |
| --------------------------- | ------ | ------------- | ---------------- | ------------------ |
| Gabinety stomatologiczne    | 20     | 20            | 3                | 14                 |
| Kancelarie prawne           | 20     | 18            | 2                | 7                  |
| Biura rachunkowe            | 20     | 20            | 3                | 7                  |
| Firmy budowlane i remontowe | 20     | 20            | 3,5              | 10                 |
| Warsztaty samochodowe       | 20     | 19            | 3                | 7                  |
| Salony kosmetyczne          | 20     | 20            | 3                | 9                  |

W każdej branży było po 20 stron, za mało, żeby układać z nich ranking, więc podaję same liczby. Co najmniej jedną regułę o wpływie krytycznym miało 14 z 20 gabinetów stomatologicznych i 7 z 20 kancelarii.

## Deklaracja dostępności i przepisy

Link do deklaracji dostępności znalazłem na 1 stronie ze 120. Szukałem linków ze słowem „dostępnoś” w tekście i trafiły 3 strony. Cel każdego linku sprawdziłem ręcznie: jeden prowadził do deklaracji dostępności, jeden do strony kancelarii o przepisach, a jeden otwierał pasek narzędzi z ustawieniami dostępności. Nie wynika z tego, że pozostałe firmy muszą mieć deklarację.

Europejski akt o dostępności określa wymagania funkcjonalne. W praktyce punktem odniesienia jest WCAG 2.1 na poziomie AA, do którego odsyła europejska norma EN 301 549 w wersji 3.2.1. Czy akt obejmuje Twoją firmę, zależy od rodzaju usług i wielkości firmy. Od 28 czerwca 2025 obejmuje między innymi sklepy internetowe, bankowość, transport pasażerski i usługi telekomunikacyjne dla konsumentów w UE. Mikroprzedsiębiorstwa świadczące usługi są z niego zwolnione.

## Ograniczenia

- Testy automatyczne wykrywają tylko część problemów z WCAG. Nie ma tu oceny obsługi klawiaturą ani czytnikiem ekranu.
- Sprawdziłem tylko stronę główną, jeden raz, 10 listopada 2026, w widoku na komputerze. Baner cookies zostawiłem w stanie początkowym i go nie zamykałem.
- Próba nie jest losowa. To pierwsze wyniki jednej wyszukiwarki dla zapytania o branżę i miasto, więc firmy mniej widoczne w wyszukiwarce są w niej niedoreprezentowane.
- Miasto to miasto z zapytania. Nie sprawdzałem adresów firm.
- Pominięcia katalogów, sieci i dużych firm klasyfikowałem ręcznie, więc inna osoba mogłaby zaklasyfikować kilka stron inaczej. Reguły pominięć poprawiałem w trakcie zbierania próby. Kilka stron zeskanowanych przed poprawką wypadło z próby, a miejsce zajęły kolejne z wyników.
- Deklarację dostępności szukałem po tekście linku. Deklaracja pod inną nazwą nie zostałaby znaleziona.
- Reguła kontrastu bywa wrażliwa na animacje i obrazy w tle. Przypadków granicznych nie rozstrzygałem ręcznie.
- W artykule nie podaję nazw firm ani domen.

## Sprawdź swoją stronę

Darmowy [skaner dostępności](/skaner/) na tej stronie używa tego samego silnika axe-core i opisuje wyniki po polsku. Jeśli wynik jest długi i nie wiesz, od czego zacząć, zobacz [audyt WCAG](/uslugi/dostepnosc-wcag/): test automatem, klawiaturą i czytnikiem ekranu oraz raport z poprawkami, od 1 900 zł netto za stronę do 10 podstron.

## Źródła

- Deque Systems, axe-core, https://github.com/dequelabs/axe-core, stan na 2026-11-10
- W3C, Web Content Accessibility Guidelines (WCAG) 2.1, https://www.w3.org/TR/WCAG21/, stan na 2026-11-10
