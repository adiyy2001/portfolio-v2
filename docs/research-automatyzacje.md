# Automatyzacje i AI w ofercie: badanie rynku i projekt usług

Stan na 29 października 2026. Raport powstał w dwóch krokach: workflow badawczy (5 kierunków wyszukiwania, 24 pobrane źródła, 92 twierdzenia, 25 zweryfikowanych głosowaniem 3 agentów, 18 potwierdzonych, 7 odrzuconych), a potem trzy uzupełniające przebiegi: mapa konkurencji, koszty i prawo, popyt i bóle klientów. Wolumeny fraz pochodzą z Google Ads API (Keyword Planner, konto 5042805847, Polska, język polski, dane z 29.10.2026), a nie z artykułów.

Oznaczenia przy liczbach:

- **[T]** dana twarda: strona urzędu, cennik producenta, oficjalna statystyka, API Google Ads.
- **[S]** szacunek albo dane sprzedawcy, artykułu branżowego, pojedynczej ankiety.
- **[W]** mój wniosek z powyższych.

Założenia przyjęte bez pytania (do potwierdzenia przez właściciela):

1. Stawka godzinowa w kalkulacjach marży: 140 zł netto, jak w obecnym cenniku.
2. Narzędzia no-code (n8n, Make) stoją u klienta albo na jego koncie. Licencja n8n (Sustainable Use License) pozwala budować przepływy dla klienta i hostować je u niego, ale nie pozwala sprzedawać dostępu do własnej instancji wielu klientom. Przyjmuję model „instancja klienta".
3. Modele językowe: domyślnie OpenAI z rezydencją danych w UE albo Azure OpenAI w regionie Poland Central. Anthropic nie ma opcji UE w API bezpośrednim (tylko AWS Bedrock Frankfurt).
4. Demo we Wzorniku działa bez zaplecza (jak pozostałe strony przykładowe): asystent odpowiada ze scenariusza i bazy wiedzy zmyślonej firmy, zapisy i zdarzenia „w tle" trafiają do localStorage. W wersji dla klienta odpowiada model językowy. To jest napisane na stronie dema.
5. Rynek UK i USA zostaje drugorzędny: podstrony mają wersję angielską, ale ceny i prawo opisuję dla Polski.

## 1. Podsumowanie

Trzy usługi do dodania, w tej kolejności:

**Integracje systemów i KSeF** (`/uslugi/integracje-ksef/`). Najmocniejszy popyt z intencją techniczną i najsłabsza konkurencja ze wszystkich kandydatów. Frazy „ksef api" 1 900 wyszukiwań miesięcznie, „api ksef" 880, „wdrożenie ksef" 320, „integracja z ksef" 320, „ksef integracja" 260, „subiekt gt ksef" 1 600 [T]. Konkurencja w Google Ads niska (indeks 6 do 56 na 100), stawki 2 do 11 zł za klik [T]. Obowiązek wystawiania faktur w KSeF działa od 1 kwietnia 2026 dla większości firm, najmniejsze (do 10 tys. zł sprzedaży miesięcznie) wchodzą 1 stycznia 2027 [T]. Gotowe bramki SaaS (10 do 100 zł miesięcznie) obsługują proste przypadki, ale firma z własnym systemem, sklepem albo ERP potrzebuje programisty. Rynek wycenia to na 4 800 do 12 000 zł za wysyłkę i 7 600 do 20 000 zł za odbiór (Codeport, 200 zł/h, 21.10.2026) [S]. To zadanie dla kogoś z Node.js, Javą, PostgreSQL i doświadczeniem w integracjach, czyli dokładnie profil właściciela.

**Automatyzacja procesów** (`/uslugi/automatyzacja-procesow/`). Faktury, maile, raporty, przepisywanie danych między systemami, w n8n albo własnym kodzie. Popyt umiarkowany: „automatyzacja procesów biznesowych" 590, „automatyzacja procesów" 390, „automatyzacja ai" 590, „n8n" 27 100 (głównie programiści), „automatyzacja n8n" 90 [T]. Rynek jest zatłoczony przez agencje n8n/Make z cenami 900 do 4 000 zł za proces, ale prawie żadna nie ma case'ów z liczbami, umowy powierzenia danych ani hostingu w UE (mapa konkurencji, rozdział 4). Ankieta SW Research dla HP (n=503 właścicieli MŚP, kwiecień 2025) [S]: komunikacja i mail zajmują do 10 godzin tygodniowo, 40 procent właścicieli uważa, że automatyzacja oddałaby im do 10 godzin tygodniowo. Ta usługa ma największą synergię z utrzymaniem (abonament) i z aplikacjami webowymi.

**Asystent AI na stronę** (`/uslugi/asystent-ai/`). Popyt w Polsce po stronie firm jest mały („chatbot na stronę" 40, „chatbot dla firm" 30, „wdrożenie chatbota" 10) [T], a w USA i UK duży („ai chatbot for website" 880, „ai receptionist" 74 000) [T]. Konkurencja to tanie SaaS (Tidio od 24 USD, FastBot 1 990 zł plus 190 zł miesięcznie) [T]. Wchodzi do oferty z trzech powodów: AI Act od 2 sierpnia 2026 wymaga, żeby bot przedstawiał się jako AI, a mało kto to na stronach ma [T]; asystent z zapisami i przekazaniem do człowieka jest naturalnym dodatkiem do stron i aplikacji, które właściciel już sprzedaje; da się go pokazać w działającym demie we Wzorniku. Cena musi stać między SaaS a agencją: od 4 500 zł plus abonament od 290 zł.

Nie dodajemy teraz: AI recepcji głosowej (rozdział 5), botów na Messengera, konsultingu „wdrożenie AI", szkoleń, wdrożeń CRM. Odoo zostaje jako przykład w integracjach, nie jako osobna usługa.

Zasady pakowania wspólne dla trzech usług, wyprowadzone z rynku: trzy pakiety z ceną „od" netto, płatny przegląd procesów (900 zł, zaliczany na wdrożenie) zamiast darmowego audytu, 30 dni poprawek w cenie, opieka miesięczna jako osobna linia (od 300 zł, spójna z utrzymaniem), umowa powierzenia danych i hosting w UE w standardzie, każdy pakiet z jedną miarą efektu uzgodnioną na starcie.

## 2. Ocena kandydatów

Skala 1 do 5. Przy „konkurencji" i „ryzyku" 5 oznacza sytuację korzystną (mała konkurencja, małe ryzyko). Wagi: popyt 2, gotowość do płacenia 2, dopasowanie do umiejętności 2 (jedna osoba bez zespołu musi robić to, co umie), ryzyko prawne i techniczne 1,5 (jedna osoba nie udźwignie sporu z KRiBSI ani UODO), synergia z ofertą 1,5 (nowa usługa ma sprzedawać się razem ze stronami, aplikacjami i utrzymaniem), konkurencja 1, powtarzalność 1, przychód cykliczny 1. Suma wag 12, wynik to średnia ważona.

| Kandydat | Popyt | Płacą | Konk. | Dopas. | Powt. | Cykl. | Ryzyko | Synergia | Wynik |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Integracja KSeF z własnym systemem, sklepem, ERP | 5 | 4 | 5 | 5 | 4 | 3 | 4 | 4 | **4,38** |
| Integracje systemów (sklep, ERP, księgowość, CRM, BaseLinker) | 3 | 4 | 4 | 5 | 3 | 4 | 4 | 5 | **4,08** |
| Automatyzacja procesów (n8n, własny kod) | 3 | 3 | 2 | 4 | 4 | 4 | 4 | 5 | **3,67** |
| Asystent AI na stronę (baza wiedzy, zapisy, przekazanie) | 2 | 3 | 2 | 4 | 5 | 5 | 3 | 5 | **3,54** |
| Obsługa maili i dokumentów AI (OCR faktur, klasyfikacja) | 2 | 3 | 3 | 4 | 3 | 4 | 3 | 4 | **3,25** |
| Opieka nad automatyzacjami (abonament) | 2 | 3 | 3 | 5 | 5 | 5 | 4 | 5 | **3,92** |
| Raporty i dashboardy automatyczne | 2 | 3 | 3 | 5 | 3 | 3 | 5 | 4 | **3,50** |
| Rezerwacje online z przypomnieniami | 2 | 2 | 2 | 5 | 4 | 3 | 4 | 4 | **3,29** |
| Wdrożenie CRM (HubSpot, Pipedrive) z automatyzacją | 2 | 3 | 2 | 3 | 3 | 3 | 4 | 3 | **2,83** |
| Wdrożenie Odoo dla małej firmy | 1 | 4 | 3 | 4 | 2 | 3 | 3 | 3 | **2,96** |
| AI recepcja głosowa, sekretarka AI | 3 | 3 | 1 | 2 | 4 | 5 | 1 | 2 | **2,46** |
| Bot na Messengera i WhatsApp | 2 | 1 | 1 | 3 | 4 | 3 | 3 | 2 | **2,04** |
| Audyt i konsulting „wdrożenie AI w firmie" | 2 | 2 | 2 | 3 | 2 | 1 | 4 | 3 | **2,46** |
| Agent AI do wycen i ofert | 1 | 3 | 4 | 4 | 2 | 3 | 3 | 4 | **2,96** |
| Szkolenia z AI dla zespołu | 2 | 2 | 1 | 2 | 3 | 1 | 5 | 1 | **2,08** |

Jak czytać wynik: pierwsze dwa wiersze łączę w jedną usługę „Integracje systemów i KSeF" (KSeF to najczęstszy powód integracji w 2026, a integracja to to samo rzemiosło). Opieka nad automatyzacjami (3,92) nie jest osobną stroną, tylko linią abonamentu w każdej z trzech usług, bo sama w sobie nie generuje pierwszego kontaktu. Obsługa maili i dokumentów oraz raporty wchodzą jako przykłady procesów do „Automatyzacji procesów". Rezerwacje z przypomnieniami są przykładem w asystencie i w automatyzacji.

Uzasadnienie ocen skrajnych:

- Popyt 5 dla KSeF: jedyna grupa fraz z intencją „szukam wykonawcy", gdzie suma wolumenu przekracza 5 000 miesięcznie przy niskiej konkurencji reklamowej [T].
- Popyt 2 dla asystenta: frazy B2B po polsku mają 10 do 40 wyszukiwań; „chatbot ai" (22 200) to szukanie darmowego czatu, nie wykonawcy [T].
- Konkurencja 1 dla voice: dziewięciu polskich dostawców z abonamentem od 99 do 899 zł miesięcznie i wdrożeniem za 0 zł (BizVoice, Smart Asystenci, sekretarkaai.pl, ai-sekretarka.pl, InteliWISE, Hellobot, CallPage, Apifonica, KODA) [T].
- Ryzyko 1 dla voice: nagrywanie rozmów bez oficjalnej wytycznej UODO dla voicebotów, głos jako dana biometryczna, AI Act art. 50, 71 procent klientów woli człowieka (Armatis 2024) [S], opóźnienie 500 do 900 ms i wiarygodność scenariuszy tylko do 3 lub 4 tur (Retell, blog) [S]. Do tego telefonia i numery z weryfikacją adresu (Twilio) [T].
- Dopasowanie 5 dla integracji: Node.js, Java, PostgreSQL, Oracle, Odoo i wdrożenie TailorCloth z automatyzacją magazynu i faktur.

## 3. Wybrane usługi

### 3.1 Integracje systemów i KSeF

**Jedno zdanie.** Łączę systemy, których firma już używa (sklep, ERP, księgowość, CRM, własna aplikacja), z KSeF i między sobą, tak żeby faktury i zamówienia nie były przepisywane ręcznie.

**Dla kogo.** Firmy od 5 do 100 osób, które mają własny system albo sklep i nie mieszczą się w gotowej bramce KSeF: hurtownie na BaseLinkerze i Subiekcie, sklepy na WooCommerce i PrestaShop, firmy produkcyjne i usługowe na Odoo albo własnym panelu, biura rachunkowe obsługujące klientów z nietypowymi systemami. Problem: faktury wystawiane w jednym miejscu, numerowane w drugim, wysyłane do KSeF w trzecim, z ręcznym przepisywaniem i błędami. Od 1 kwietnia 2026 obowiązek wystawiania w KSeF dotyczy prawie wszystkich czynnych podatników VAT, od 1 stycznia 2027 także najmniejszych [T]. Kary (do 100 procent VAT z faktury wystawionej poza KSeF) mają obowiązywać od 1 stycznia 2027; rządowy projekt z 20 października 2026 przesuwa je na 1 stycznia 2028, ale nie zmienia terminu obowiązku [S].

**Pakiety.**

| Pakiet | Cena od, netto | Czas | Zakres |
| --- | --- | --- | --- |
| Start | 4 900 zł | 2 do 3 tygodnie | Jedno połączenie w jednym kierunku: wysyłka faktur z jednego systemu do KSeF (uwierzytelnienie, FA(3), numer KSeF z powrotem w systemie, kody QR, tryb offline24) albo przepływ zamówień z jednego systemu do drugiego. |
| Standard | 9 900 zł | 4 do 6 tygodni | KSeF w obie strony (wysyłka, odbiór faktur kosztowych, powiadomienia, obsługa błędów i awarii) albo trzy systemy w jednym przepływie, na przykład sklep, magazyn, księgowość. |
| Rozszerzony | 18 000 zł | 6 do 10 tygodni | ERP (w tym Odoo) z kilkoma systemami, kolejki i ponawianie, panel błędów dla pracownika, monitoring, dokumentacja i przekazanie zespołowi. |
| Opieka | 300 zł / miesiąc | | Monitoring, aktualizacja po zmianach API KSeF i systemów, dwie godziny prac w cenie, kolejne 140 zł. |

Uzasadnienie cenami konkurencji: Codeport liczy 200 zł/h i podaje widełki 4 800 do 12 000 zł za wysyłkę, 7 600 do 20 000 zł za odbiór [T, 21.10.2026]. KC Mobile: integracja od 7 900 zł, KSeF w sklepie od 2 999 zł [T]. aiport.pl: integracja systemów 15 000 do 60 000 zł, KSeF dodaje 5 000 do 20 000 zł [S]. Docway: integracja KSeF z ERP w małej firmie 4 do 6 tygodni [S]. Start za 4 900 zł jest poniżej mediany wysyłki u Codeport i powyżej „KSeF w sklepie" KC Mobile, co odpowiada zakresowi z trybem offline24 i kodami QR, których tańsze oferty nie wymieniają.

**W cenie:** przegląd systemów i spisany zakres, konto testowe KSeF (środowisko TEST i DEMO), uwierzytelnienie tokenem albo certyfikatem KSeF, mapowanie pól do FA(3), obsługa błędów z powiadomieniem do wskazanej osoby, test na fakturach klienta, 30 dni poprawek po starcie, kod i dostępy u klienta.

**Poza ceną:** licencje systemów klienta, zmiany w samym ERP poza integracją, prace księgowe (poprawność merytoryczna faktur), certyfikat kwalifikowany, hosting (zwykle serwer klienta).

**Jak mierzyć efekt:** liczba faktur wystawionych bez ręcznego przepisywania w miesiącu, liczba błędów odrzuconych przez KSeF (cel: 0 po pierwszym miesiącu), czas od zamówienia do faktury, godziny zaoszczędzone (liczone z próbki przed wdrożeniem: ile minut zajmuje jedna faktura ręcznie).

**Koszty po mojej stronie i marża [S].** Start: 24 do 30 godzin (uwierzytelnienie i certyfikaty 4 h, mapowanie FA(3) 8 h, kody QR i offline24 4 h, testy 6 h, wdrożenie i dokumentacja 4 h) przy 4 900 zł daje 163 do 204 zł/h. Standard: 50 do 60 godzin przy 9 900 zł, 165 do 198 zł/h. Narzędzia: API KSeF bezpłatne [T], oficjalny klient Java (CIRFMF/ksef-client-java, MIT) i społecznościowy klient TypeScript (smekcio/ksef-client, v0.9.0 z 8.10.2026) [T]. Opieka 300 zł przy około jednej godzinie pracy miesięcznie i zerowych kosztach narzędzi: marża około 55 procent liczona stawką 140 zł, powyżej 80 procent przy braku zgłoszeń. Ryzyko przekroczenia godzin przy pierwszych dwóch wdrożeniach: wysokie, bo uwierzytelnienie XAdES i konteksty uprawnień mają wiele przypadków brzegowych.

**Ryzyka i ograniczenia.** Zmiany API KSeF 2.0 (dokumentacja z 2026 nadal jest aktualizowana, tokeny mają działać do końca 2026 z zapowiedzianym przedłużeniem) [T]: opieka miesięczna i klauzula o zmianach regulacyjnych w umowie. Integrator działa w kontekście uprawnień nadanych przez podatnika (brak osobnej roli „integrator") [S]: klient nadaje uprawnienia w Module Certyfikatów i Uprawnień, ja nie przechowuję jego certyfikatu. Odpowiedzialność za treść faktury zostaje po stronie klienta i księgowej: zapis w umowie. Środowisko TEST nie izoluje danych między integratorami [T]: żadnych prawdziwych danych w testach.

**Demo we Wzorniku.** W tej rundzie bez osobnego dema; na stronie usługi jest opisany przebieg i przykład z TailorCloth (Odoo, magazyn i faktury). Pomysł na później: zmyślona hurtownia „Sztaba" z panelem, w którym zamówienie ze sklepu zamienia się w fakturę z numerem KSeF i kodem QR, z dziennikiem zdarzeń.

**Frazy (Google Ads API, Polska, 29.10.2026, wolumen miesięczny, indeks konkurencji 0 do 100) [T]:**

| Fraza | Wolumen | Konkurencja |
| --- | --- | --- |
| ksef api | 1 900 | 9 |
| subiekt gt ksef | 1 600 | 38 |
| api ksef | 880 | 6 |
| ksef subiekt gt | 590 | 18 |
| wdrożenie ksef | 320 | 48 |
| integracja z ksef | 320 | 56 |
| ksef integracja | 260 | 41 |
| integracja systemów | 170 | 41 |
| ksef 2.0 api | 140 | 18 |
| integracja ksef | 140 | 52 |
| integracja baselinker | 110 | 70 |
| ksef baselinker | 110 | 11 |
| integracja systemów informatycznych | 110 | 28 |
| wdrożenie crm | 110 | 54 |
| integracja api | 90 | 46 |
| ksef allegro | 70 | 43 |
| ksef integrator | 40 | 78 |
| ksef woocommerce | 30 | 70 |

### 3.2 Automatyzacja procesów

**Jedno zdanie.** Zabieram z biurka to, co powtarza się co dzień: faktury z maila do księgowości, zapytania do CRM, raporty z kilku systemów w jednym arkuszu, przypomnienia dla klientów, w n8n na serwerze klienta albo we własnym kodzie.

**Dla kogo.** Firmy od 3 do 50 osób, w których właściciel albo jedna osoba z biura „jest systemem": przepisuje dane z maili, arkuszy i PDF-ów. Najczęściej usługi B2B, hurtownie i sklepy, biura rachunkowe, firmy budowlane i instalacyjne, gabinety z telefonicznymi zapisami. Problemy z ankiety SW Research dla HP (2025) [S]: komunikacja i mail do 10 godzin tygodniowo, administracja i finanse jako najbardziej uciążliwe. Z opinii na Clutch o agencji n8n (jedna anegdota) [S]: 15 godzin tygodniowo mniej przepisywania PDF-ów.

**Pakiety.**

| Pakiet | Cena od, netto | Czas | Zakres |
| --- | --- | --- | --- |
| Przegląd procesów | 900 zł | 1 tydzień | Dwugodzinna rozmowa i lista procesów z szacunkiem godzin do odzyskania. Kwota zaliczana na wdrożenie. |
| Start | 3 500 zł | 1 do 2 tygodnie | Jeden proces od początku do końca, na przykład faktury z maila do systemu księgowego, albo lead z formularza do CRM z odpowiedzią do klienta. Do trzech systemów. |
| Standard | 9 000 zł | 3 do 5 tygodni | Trzy procesy, w tym jeden z modelem językowym (klasyfikacja maili, wyciąganie danych z dokumentów, streszczenia), panel z historią uruchomień, powiadomienia o błędach. |
| Rozszerzony | 15 000 zł | 5 do 8 tygodni | Procesy we własnym kodzie tam, gdzie n8n nie wystarcza: kolejki, duże wolumeny, własny panel dla pracowników, integracje bez gotowych wtyczek. |
| Opieka | 300 zł / miesiąc | | Monitoring, poprawki po zmianach w systemach, dwie godziny prac w cenie. |

Uzasadnienie cenami konkurencji: mediana za jeden proces z 33 cenników to około 2 500 zł (Mankasoft, 24.10.2026) [S]; Tantor Starter 4 000 zł za 1 do 2 automatyzacji, Business 10 000 zł za 3 do 5 [T]; Wdrażaj.AI 4 000 zł za 1 proces, 9 000 zł za 3 [T]; UXU od 3 900 zł z hostingiem [T]; Nicommerce od 900 zł, opieka od 200 zł [T]; KC Mobile analiza 990 zł zaliczana, moduł od 4 900 zł [T]; Lendzion audyt 1 490 zł zaliczany, 3 procesy z AI 6 990 zł [S]. Opieka na rynku: 190 do 700 zł miesięcznie [T]. Start za 3 500 zł siedzi między medianą freelancerów a progiem agencji i jest spójny z obecną ceną stron (3 500 zł).

**W cenie:** spisany przebieg procesu „przed" i „po", n8n zainstalowane na serwerze klienta (albo jego konto n8n cloud) z kopią zapasową, testy równoległe z dotychczasowym procesem przez tydzień, instrukcja dla pracownika, 30 dni poprawek, dostępy u klienta.

**Poza ceną:** abonamenty narzędzi (n8n cloud od 20 EUR miesięcznie, Make, Zapier Professional od 49 USD) [T], tokeny modeli językowych (rozliczane po koszcie, zwykle kilkadziesiąt złotych miesięcznie przy setkach dokumentów) [S], serwer (Hetzner CPX22 19,99 EUR miesięcznie) [T], zmiany w systemach źródłowych.

**Jak mierzyć efekt:** godziny ręcznej pracy tygodniowo przed i po (mierzone na próbce 20 operacji ze stoperem), liczba operacji wykonanych automatycznie w miesiącu (z dziennika n8n), liczba błędów wymagających ręcznej interwencji, czas reakcji na zapytanie klienta.

**Koszty po mojej stronie i marża [S].** Start: 16 do 22 godzin (przegląd 2 h, budowa 8 do 12 h, testy równoległe i poprawki 4 h, instrukcja 2 h) przy 3 500 zł daje 160 do 220 zł/h. Standard: 45 do 55 godzin przy 9 000 zł, 165 do 200 zł/h. Narzędzia po mojej stronie: zero (n8n self-hosted bez opłat licencyjnych dla pracy na rzecz klienta w jego instancji) [T]. Opieka 300 zł: około godziny miesięcznie przy stabilnym procesie, marża jak w utrzymaniu. Tantor szacuje przychodzące licencje klienta na 50 do 300 zł miesięcznie [S].

**Ryzyka i ograniczenia.** Zatłoczony rynek i presja cenowa (Fiverr od 25 USD, Upwork mediana budżetu 150 USD) [T]: nie konkuruję ceną, tylko zakresem (własny kod, umowa powierzenia, monitoring). Licencja n8n: brak white-label i brak sprzedaży dostępu do wspólnej instancji; każdy klient ma własną instancję [T]. Procesy z modelem językowym: dane osobowe w promptach wymagają umowy powierzenia z dostawcą modelu (OpenAI DPA, rezydencja UE z ZDR) i wpisu w rejestrze czynności klienta [S]. Kruchość: zmiany w interfejsach systemów źródłowych psują przepływy, stąd opieka i alerty.

**Demo we Wzorniku.** W demie asystenta (3.3) jest panel „Co dzieje się w tle": każda rozmowa pokazuje zdarzenia automatyzacji (zapis w kalendarzu, SMS do klienta, mail do właściciela, wpis w CRM). To jedno demo pokazuje obie usługi. Osobny pomysł na później: zmyślone biuro rachunkowe z „skrzynką", do której wpadają faktury PDF i same trafiają do tabeli z kategorią i terminem płatności.

**Frazy [T]:**

| Fraza | Wolumen | Konkurencja |
| --- | --- | --- |
| n8n | 27 100 | 48 |
| zapier | 8 100 | 27 |
| automatyzacja procesów biznesowych | 590 | 70 |
| automatyzacja ai | 590 | 43 |
| automatyzacja procesów | 390 | 48 |
| automatyzacja procesów w firmie | 140 | 30 |
| ai dla firm | 140 | 72 |
| automatyzacja magazynu | 140 | 46 |
| wdrożenie ai w firmie | 110 | 64 |
| ocr faktur | 110 | 60 |
| automatyzacja obsługi klienta | 110 | 29 |
| automatyzacja sprzedaży | 110 | 45 |
| automatyzacja n8n | 90 | 56 |
| automatyzacja biznesu | 90 | 71 |
| automatyzacja księgowości | 70 | 39 |
| automatyzacja firmy | 50 | 31 |

### 3.3 Asystent AI na stronę

**Jedno zdanie.** Asystent, który na stronie firmy odpowiada z jej bazy wiedzy, zapisuje na termin albo zbiera zapytanie, przedstawia się jako AI i przekazuje rozmowę człowiekowi, kiedy trzeba.

**Dla kogo.** Firmy usługowe z powtarzalnymi pytaniami i zapisami: gabinety i kliniki, serwisy samochodowe, warsztaty, salony, szkoły językowe, hotele i pensjonaty, sklepy z pytaniami o dostawę i zwroty. Problem: te same pytania przez telefon i mail, zapytania po godzinach bez odpowiedzi, nieodebrane telefony (w gabinetach 20 do 35 procent według danych sprzedawców, 33 procent według ZnanyLekarz 2023) [S]. Ostrzeżenie z badań: 71 procent klientów woli czekać na człowieka niż rozmawiać z botem (Armatis 2024) [S], 67,9 procent woli człowieka, 59 procent zrezygnowało z zakupu po nieudanym kontakcie z automatem (badanie cytowane przez media, 2026) [S]. Dlatego asystent ma zawsze widoczną ścieżkę do człowieka i nie udaje człowieka.

**Pakiety.**

| Pakiet | Cena od, netto | Abonament od, netto | Czas | Zakres |
| --- | --- | --- | --- | --- |
| Start | 4 500 zł | 290 zł / miesiąc | 1 do 2 tygodnie | Asystent na bazie treści strony i dokumentów klienta (do 50 stron), widget zgodny z WCAG 2.1 AA, komunikat „rozmawiasz z asystentem AI", przekazanie zapytania mailem do człowieka, do 500 rozmów miesięcznie. |
| Standard | 8 500 zł | 490 zł / miesiąc | 3 do 4 tygodnie | Do tego: zapisy na termin (kalendarz Google albo system klienta), formularz zapytania z zapisem do CRM lub arkusza, dwa języki, raport miesięczny z pytaniami bez odpowiedzi, do 2 000 rozmów. |
| Rozszerzony | 15 000 zł | 790 zł / miesiąc | 5 do 8 tygodni | Do tego: integracje z systemem rezerwacji, sklepem albo panelem klienta (status zamówienia, dostępność), własny panel do poprawiania odpowiedzi, do 5 000 rozmów. |

Uzasadnienie cenami konkurencji: chatbot FAQ u polskich agencji 1 990 do 5 000 zł plus 190 do 500 zł miesięcznie (FastBot 1 990 plus 190, Mankasoft od 4 500 plus 199, Zwolenik od 4 500 plus 200) [T]; RAG 5 000 do 15 000 zł (PixelAgency, mediana 5 000 zł z 16 cenników u Mankasoft) [S]; agent z bazą wiedzy 8 000 do 35 000 zł, opieka 600 do 3 000 zł (aiport) [S]; SaaS: Tidio Starter 24,17 USD, InteliWISE chatbot od 359 zł miesięcznie, Botpress Plus 150 USD [T]. Start za 4 500 zł plus 290 zł jest na poziomie Mankasoft i Zwolenika, ale z WCAG, AI Act i hostingiem w UE w standardzie.

**W cenie:** baza wiedzy z treści klienta i jej aktualizacja raz w miesiącu, hosting w UE (Cloudflare Workers, Hetzner, modele z rezydencją w UE), umowa powierzenia danych, tokeny modeli do limitu rozmów w pakiecie, log rozmów dostępny dla klienta, komunikat zgodny z AI Act art. 50, 30 dni poprawek.

**Poza ceną:** rozmowy ponad limit (rozliczane po koszcie plus 20 procent), treści, których klient nie ma (napisanie FAQ od zera to osobna praca), kanały poza stroną (Messenger, WhatsApp), głos.

**Jak mierzyć efekt:** liczba rozmów poza godzinami pracy, odsetek pytań zakończonych odpowiedzią bez przekazania do człowieka (cel po miesiącu: 60 procent, dane Tantora „70 procent" są deklaracją sprzedawcy) [S], liczba zapisów i zapytań zebranych przez asystenta, liczba telefonów w tygodniu przed i po (z logu centralki albo zliczane ręcznie przez tydzień).

**Koszty po mojej stronie i marża [S].** Start: 24 do 30 godzin (baza wiedzy i chunkowanie 6 h, widget z dostępnością 8 h, przekazanie i mail 3 h, testy 4 h, wdrożenie i instrukcja 3 h) przy 4 500 zł: 150 do 190 zł/h. Pierwszy widget powstaje raz i potem jest konfigurowany, więc od trzeciego wdrożenia godziny spadają do około 16. Abonament 290 zł: Cloudflare Workers Paid 5 USD miesięcznie na wszystkich klientów, baza wektorów Qdrant Cloud w darmowym progu albo pgvector na Hetznerze (19,99 EUR), modele: 500 rozmów po około 6 000 tokenów wejścia i 800 wyjścia na gpt-5-mini (0,25 i 2,00 USD za milion) to około 2 USD, na gpt-5 około 20 USD [T]. Koszt zmienny poniżej 60 zł, godzina opieki 140 zł, marża na abonamencie 30 do 60 procent przy jednej godzinie, wyżej przy braku zgłoszeń. Przy dziesięciu klientach to 2 900 zł miesięcznie przychodu cyklicznego.

**Ryzyka i ograniczenia.** AI Act art. 50 ust. 1 obowiązuje od 2 sierpnia 2026: osoba musi wiedzieć, że rozmawia z AI, najpóźniej przy pierwszej interakcji [T]; wdrażający pod własną marką może przejąć obowiązki dostawcy [S], więc komunikat jest wbudowany i niewyłączalny. RODO: dane z rozmów to dane osobowe, potrzebna umowa powierzenia z klientem i z dostawcą modelu (OpenAI ma DPA i rezydencję UE z zero data retention; Anthropic nie ma rezydencji UE w API, tylko przez AWS Bedrock Frankfurt) [T]; retencja logów 30 dni domyślnie. Błędne odpowiedzi: sprawa Moffatt v. Air Canada (2024) pokazuje, że firma odpowiada za słowa chatbota [S]; asystent odpowiada tylko z bazy klienta, cytuje źródło, a przy braku odpowiedzi przekazuje do człowieka. Niechęć klientów do botów: widoczny przycisk „wolę człowieka" od pierwszej wiadomości. Podmiana przez SaaS: Tidio i FastBot wygrywają poniżej 50 rozmów miesięcznie, co jest napisane w FAQ usługi („kiedy się nie opłaca").

**Demo we Wzorniku.** Zmyślony serwis samochodowy i opon „Docisk" we Wrocławiu (nazwa sprawdzona 29.10.2026: w Google tylko część zamienna, żadnej firmy o tej nazwie). Strona jednoekranowa w stylu warsztatu: usługi z cenami, godziny, sezon na opony. Asystent w rogu: przedstawia się jako AI, odpowiada na pytania o ceny i godziny z bazy wiedzy, zapisuje na wymianę opon (usługa, dzień, godzina, telefon), po godzinach zbiera prośbę o kontakt, na „wolę rozmawiać z człowiekiem" zostawia numer i zapisuje callback. Obok panel „Co dzieje się w tle" z dziennikiem zdarzeń: termin zablokowany w kalendarzu, SMS z potwierdzeniem w kolejce, mail do właściciela, wpis w CRM. Wszystko w localStorage, bez zaplecza, z notą, że odpowiedzi w demie pochodzą ze scenariusza, a w wersji dla klienta odpowiada model językowy.

**Frazy [T]:**

| Fraza | Wolumen | Konkurencja | Uwaga |
| --- | --- | --- | --- |
| chatbot ai | 22 200 | 48 | konsumenci szukający czatu |
| agent ai | 6 600 | 41 | mieszana intencja |
| chatbot messenger | 140 | 11 | |
| ai dla firm | 140 | 72 | |
| wdrożenie ai w firmie | 110 | 64 | |
| automatyzacja obsługi klienta | 110 | 29 | |
| chatbot na stronę | 40 | 55 | |
| chatbot dla firm | 30 | 64 | |
| sztuczna inteligencja dla firm | 30 | 73 | |
| asystent ai dla firm | 10 | 38 | |
| wdrożenie chatbota | 10 | 17 | |
| ai chatbot for website (US, UK) | 880 | 47 | stawki 35 do 180 zł za klik |
| ai receptionist (US, UK) | 74 000 | 1 | rynek SaaS, nie dla freelancera |

## 4. Mapa konkurencji

Źródło: strony oferentów otwarte 29.10.2026, chyba że zaznaczono [S]. Ceny netto, „b.d." oznacza brak daty na stronie.

| Firma | Typ | Co sprzedaje | Ceny | Branże | Dowód efektu | Gwarancje | Słabe punkty | Budowa strony |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Tantor](https://tantor.pl) (Białystok) | agencja n8n, Make, AI | automatyzacje, chatboty, KSeF, e-commerce | Starter od 4 000, Business od 10 000, Enterprise od 20 000 zł, 50/50; licencje 50 do 300 zł/mies. u klienta | e-commerce, usługi | 3 case'y z liczbami (40 h/tydz., 15 h/tydz.), bez metodologii | ROI w 90 dni albo praca do zwrotu, 10 procent zwrotu za spóźnienie, hosting UE | jeden klient z nazwy, liczby niezweryfikowane | kalkulator ROI w hero, 3 progi, gwarancje, FAQ, lead magnet, kalendarz |
| [KC Mobile](https://kcmobile.pl/wdrozenia-ai/) | software house | moduły automatyzacji, konektory Subiekt, Optima, enova, KSeF | rozmowa 0, analiza 990 (zaliczana), moduł od 4 900, integracja od 7 900, system od 14 900, KSeF w sklepie od 2 999 zł | MŚP, sklepy | brak case'ów | brak | brak dema i klientów z nazwy | cena w hero, porównanie trzech dróg, RODO art. 28 i AI Act, FAQ |
| [Nicommerce](https://www.nicommerce.pl/uslugi/automatyzacje) | freelancer Make, n8n | automatyzacje dla usług lokalnych | od 900 zł, opieka od 200 zł/mies., narzędzie od 1 399 zł (13.10.2026) | 14 branż | case'y z liczbami (wycena PDF 45 min do 1 min) | 2 tygodnie wsparcia | brak gwarancji zwrotu | cena w tytule, ROI 60 zł/h, „kiedy się nie opłaca", FAQ 9 |
| [UXU](https://uxu.pl/service/page/wdrozenie-n8n) | firma IT | wdrożenie n8n z hostingiem | od 3 900 zł, instalacja 1 900, opieka 700 zł/mies. za proces (31.07.2026) | ogólne | brak | brak | brak case'ów | cena w hero, hosting, bezpieczeństwo, FAQ 8 |
| [Wdrażaj.AI](https://www.wdrazaj.ai/cennik) | agencja | automatyzacja, asystenci | Essential 4 000 (1 proces, 30 dni), Professional 9 000 (3 procesy, 90 dni), Premium wycena | ogólne | referencje Polsat Media, PEMA, Biuro TAX, bez liczb | stała cena, odrzuca projekty bez zwrotu | mało liczb | cennik jako strona startowa, logotypy, FAQ 7, widget czatu |
| [Klinweb](https://klinweb.pl/oferta-automatyzacja) | agencja n8n, AI | automatyzacje | od 3 000 zł | ogólne | brak | brak | brak kalkulatora i case'ów | hero, korzyści, proces, FAQ 6 |
| [Mankasoft](https://mankasoft.com/automatyzacja-ai/) | dev | n8n, Make, chatbot, KSeF | proces od 2 000, chatbot od 4 500, opieka 199 zł/mies.; [cennik 33 firm](https://mankasoft.com/poradniki/ceny-chatbotow-i-automatyzacji-ai/) (24.10.2026) | ogólne | brak | brak | brak AI Act | kalkulator kosztu modeli, wybór przepływu, FAQ 5 |
| [PixelAgency](https://pixelagency.pl) (Katowice) | agencja marketingowa | automatyzacje jako jedna z 7 usług | brak cennika; blog [S]: proces 2 do 8 tys., agent 15 do 45 tys. zł | ogólne | brak | brak | AI jako dodatek | siatka usług, formularz |
| [Lendzion Studio](https://lendzionstudio.pl/automatyzacje/) [S] | solo studio | Make, n8n, AI | audyt 1 490 (zaliczany), proces od 2 990, 3 procesy z AI od 6 990, abonament 490 zł/mies. | ogólne | nieznane | nieznane | strona nie otworzyła się | nieznana |
| [Efektywniej](https://efektywniej.com/) | solo studio | audyt AI, agenci | audyt 1 500, agenci od 2 000 zł (5 do 7 dni) | lokalne | portfolio bez liczb | 1 runda poprawek | brak gwarancji | pakiety, porównanie, kalkulator, FAQ |
| [FastBot](https://fastlanding.io/blog/ile-kosztuje-chatbot-ai) | chatbot jako usługa | chatbot na stronę | 1 990 zł plus 190 zł/mies., Pro 3 490 plus 290 (29.10.2026) | małe firmy | brak | 30 dni, 2 do 3 rundy poprawek, bez lock-in | brak case'ów | artykuł z ceną, demo, 4 kroki |
| [KODA](https://usekoda.com/pl) (Wrocław) | chatbot, voicebot enterprise | boty | brak cen, demo | duże firmy | 5 case'ów (Żabka 140 h/mies.) | brak | poza zasięgiem MŚP | hero, produkty, case'y |
| [InteliWISE](https://inteliwise.com/pl/cennik/) | platforma | chatbot, voicebot, contact center | voicebot od 899 zł/mies. (1 000 min), chatbot od 359, live chat 109 za stanowisko, 14 dni próby | ogólne | brak | próba | bez RODO na stronie | tabela cen PLN, USD, EUR |
| [SentiOne](https://www.sentione.com/pl) | platforma | boty, social listening | brak cen | duże firmy | AirHelp minus 65 procent czasu, Alior | brak | tylko demo | hero, logotypy, nagrody |
| [Hellobot](https://hellobot.cx/) | voicebot | zdrowie, motoryzacja, windykacja | Start 1 500 zł/mies. (3 000 min) [S] | zdrowie, moto | opinie bez liczb | brak | hasła bez źródeł | 3 dema scenariuszy |
| [Smart Asystenci](https://smart-asystenci.pl/ai-recepcjonistka) | AI recepcjonistka | voice | Starter od 499 zł/mies. (500 min), Pro 899, Pro+ 1 499 [S], minuta 0,75 zł | gabinety, usługi | brak | 14 dni albo 200 min próby | bez AI Act | problem, rozwiązanie, kalendarz, FAQ |
| [BizVoice](https://www.bizvoice.pl/sekretarka-ai) | sekretarka AI z CRM | voice | 99 zł/mies. za 100 min, bez wdrożenia | małe firmy | przykładowe rozmowy | test 7 dni | brak RODO | flow 7 kroków, linia demo, kalkulator, AI Act w FAQ |
| [sekretarkaai.pl](https://sekretarkaai.pl/) | reseller Fonio | voice | DIY 399 zł/mies. (1 000 min), pod klucz od 597 (30.09.2026) | małe firmy | Trustpilot 4,8 | 30 dni | afiliacja, statystyki bez źródeł | kalkulator, „nie dla Ciebie", FAQ 25 |
| [ai-sekretarka.pl](https://ai-sekretarka.pl/) | solo | voice | 0,79 zł/min albo od 149 zł/mies. | małe firmy | brak („nie wstawiamy zmyślonych recenzji") | demo w minutę | brak case'ów | demo-telefon, porównanie, FAQ |
| [KSeF Service](https://ksefservice.pl/pricing.php) | bramka SaaS | KSeF | START 10, PLUS 30, STANDARD z API 60 zł/mies., e-commerce 15 zł za sklep, 7 dni próby | wszyscy | brak | próba | dedykowane wdrożenia osobno | tabela planów, kalkulator |
| [integracja-ksef.pl](https://www.integracja-ksef.pl/) (BinSoft) | bramka SaaS | KSeF | Green 49,99 (50 faktur), Silver 79,99, Gold 99,99 zł/mies., 30 dni próby | wszyscy | brak | próba | cena schowana | kroki, scenariusze, FAQ |
| [Codeport](https://codeport.pl/integracje) | integrator | API, KSeF | 200 zł/h; wysyłka 4 800 do 12 000, odbiór 7 600 do 20 000, pełny 15 600 do 40 400 zł; utrzymanie 5 do 15 h/mies. (21.10.2026) | firmy z własnymi systemami | 1 case | brief w 1 dzień, wycena w 2 do 3 dni | godzinówka odstrasza małe firmy | kalkulator, widełki, proces, FAQ |
| [Marcin Zwolenik](https://mzwolenik.pl/cennik) | freelancer | chatbot, strony, AI | chatbot od 4 500 (abonament 200), AI w projekcie od 6 500 zł | ogólne | brak | brak | sam cennik | cennik |
| [Tidio](https://www.tidio.com/pricing/) | SaaS | chatbot, Lyro AI | Starter 24,17 USD, Growth od 49,17, Lyro od 32,50, Plus od 300 USD | wszyscy | duża baza | 7 dni próby | bez PLN | tabela planów |
| [ChatBot.com](https://www.chatbot.com/pricing/) (Wrocław) | SaaS | chatbot | Essential 19 USD za użytkownika, Growth 79 USD, 14 dni próby | wszyscy | duża baza | próba | niespójne limity w FAQ | tabela planów |
| Apifonica, Smartcall, Botwise, CallPage, Talkie.ai | voicebot | voice | wycena indywidualna; CallPage Starter 399 zł [S] | contact center | case'y enterprise | brak | poza MŚP | demo na zapytanie |

Zagranica (wzorce):

| Firma | Typ | Pakiety i ceny | Co warto przejąć |
| --- | --- | --- | --- |
| [Tenaxity](https://tenaxity.ai/n8n-automation-agency/) (UK) | agencja n8n | 750 GBP start, 1 500 GBP z AI, od 6 000 GBP system, opieka od 195 GBP/mies. | uczciwe „estimated, not measured" przy case'ach; porównanie freelancer vs agencja |
| [Zaps Studio](https://zapsstudio.com/workflow-automation-agency/) (UK, US) | agencja n8n, Make | Sprint 1 do 3 tys. USD, Revenue System 3 do 12 tys. USD, Partner 0,5 do 3,5 tys. USD/mies. | własność poświadczeń u klienta, 30 dni wsparcia, 6 najczęstszych przepływów jako sekcja |
| [flow.digital](https://flow.digital/zapier-consultant) (US) | partner Zapier | sesja 297 USD (75 min), pakiety godzin od 1 950 USD | płatna sesja wstępna jako produkt |
| [Goodcall](https://www.goodcall.com/pricing) (US) | AI recepcja | 79, 129, 299 USD za unikalnych klientów | rozliczenie za klienta, nie za minutę; demo bez karty |
| [Smith.ai](https://smith.ai/pricing) (US) | AI plus człowiek | 300 USD za 30 połączeń, 810, 2 100 | hybryda AI i człowiek jako odpowiedź na niechęć do botów |
| [Dialzara](https://www.dialzara.com/pricing) | AI recepcja | 29 do 349 USD, Done-for-You od 1 500 USD (21.10.2026) | wariant „zrób sam" i „zrobimy za ciebie" |
| [My AI Front Desk](https://myaifrontdesk.com/pricing) | platforma, white label | 99 USD za 200 min, white label od 500 USD/mies. | model resellera voice, którego nie polecam |

Wzorce z 32 stron: audyt (0 do 1 500 zł, często zaliczany), potem trzy progi i opieka 190 do 700 zł; cena na stronie u mniej niż połowy agencji; gwarancje rzadkie (Tantor ROI 90 dni jest wyjątkiem); umowa powierzenia tylko u KC Mobile, AI Act u czterech, hosting UE u dwóch; prawie żadnych case'ów z nazwą i metodą; dema tylko u voicebotów.

## 5. Czego nie robić i dlaczego

- **AI recepcja głosowa jako własna usługa.** Dziewięciu polskich dostawców sprzedaje abonament od 99 do 899 zł miesięcznie z wdrożeniem za 0 zł [T]. Koszt techniczny minuty 0,07 do 0,31 USD (Retell), 0,08 USD u ElevenLabs plus LLM, telefonia Twilio z weryfikacją adresu [T]. Brak oficjalnej wytycznej UODO dla nagrywania przez voiceboty, głos jako dana biometryczna, 71 procent klientów woli człowieka [S]. Jedna osoba nie utrzyma jakości rozmów głosowych po polsku przy opóźnieniach 500 do 900 ms i scenariuszach wiarygodnych do 3 lub 4 tur [S]. Jeśli klient zapyta: polecić gotowy SaaS i zintegrować go z jego systemami w ramach automatyzacji.
- **Boty na Messengera i WhatsApp.** Popyt to „jak zrobić bota na messengerze" (70 do 170 wyszukiwań, intencja „zrobię sam") [T], ceny na Fiverr od 20 do 30 USD [S]. Kanał zostaje jako dopłata do asystenta w przyszłości.
- **Konsulting „wdrożenie AI w firmie", audyty AI, szkolenia.** 110 wyszukiwań, agencje sprzedają audyt za 8 000 zł i więcej (mojafirma.ai) [S], ale to praca bez kodu, bez abonamentu i bez synergii z portfolio. Przegląd procesów za 900 zł zostaje jako wejście do automatyzacji, nie jako produkt.
- **Wdrożenia CRM.** 110 wyszukiwań „wdrożenie crm" przy stawkach 17 do 61 zł za klik [T]: rynek partnerów HubSpot i Pipedrive z własnymi programami certyfikacji. Integracja z CRM zostaje elementem automatyzacji.
- **Odoo jako osobna usługa.** „odoo polska" 110, „odoo wdrożenie" 20 wyszukiwań [T]; projekty wielomiesięczne, często dla zespołu. TailorCloth służy jako dowód w integracjach.
- **Konkurowanie ceną na Fiverr i Upwork.** Mediana budżetu zlecenia AI automation na Upworku: 150 USD, tylko 5 procent zleceń od 5 000 USD (Upwatcher, maj 2026, n=1 266) [T]; Fiverr n8n od 25 USD [S].
- **Własna instancja n8n dla wielu klientów i white-label.** Sustainable Use License tego zabrania [T]; każdy klient dostaje własną instancję albo konto cloud.
- **Anthropic jako domyślny model przy danych osobowych klientów z Polski.** Brak rezydencji UE w API bezpośrednim [T]; dopuszczalne przez AWS Bedrock we Frankfurcie.
- **Obiecywanie procentów.** Dane „70 procent pytań bez człowieka" i „40 h tygodniowo" to deklaracje sprzedawców bez metody. Na stronie podaję, co mierzymy, nie wynik z góry.

## 6. Luki w danych

- Wolumeny fraz są z Google Ads API i są twarde, ale nie ma liczb z Senuto ani Google Trends dla Polski (Trends nie dał się pobrać bez przeglądarki).
- Biblioteka reklam Meta i Google Ads Transparency Center zwróciły 403; aktywne kampanie polskich dostawców nie są policzone.
- Głosy właścicieli MŚP o konkretnych procesach: tylko jedna ankieta (SW Research dla HP, 2025) i pojedyncze anegdoty; wątki z Reddita i grup na Facebooku nie dały się pobrać.
- Cennik Make z oficjalnej strony (tylko kredyty), DPA OpenAI (strona 403), oficjalne stanowisko UODO o voicebotach: brak.
- Liczby o czasie wdrożeń pochodzą z blogów agencji; moje szacunki godzin w rozdziale 3 to [S] i wymagają sprawdzenia na pierwszych dwóch projektach.

## 7. Źródła

Statystyki i popyt:

- GUS, Społeczeństwo informacyjne w Polsce w 2026 r., 21.10.2026: https://stat.gov.pl/obszary-tematyczne/nauka-i-technika-spoleczenstwo-informacyjne/spoleczenstwo-informacyjne/spoleczenstwo-informacyjne-w-polsce-w-2026-r-,2,16.html (39,8 procent osób używa AI, przedsiębiorstwa 8,7 procent w 2025 i 17,8 procent w 2026)
- Eurostat, Use of artificial intelligence in enterprises, dane z grudnia 2025: https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Use_of_artificial_intelligence_in_enterprises (Polska 8,36 procent, UE 19,95 procent, małe firmy 17 procent)
- wnp.pl za PIE, 2025: https://www.wnp.pl/rynki/pie-w-2025-r-8-7-proc-duzych-srednich-i-malych-przedsiębiorstw-w-polsce-stosowalo-ai,1017687.html
- Google Ads API, generateKeywordIdeas, Polska, 29.10.2026 (skill google-search-analytics-kit, `gsa kw`)
- Google Trends: https://trends.google.pl/trends/explore?geo=PL
- SW Research dla HP Inc Polska, n=503, 9.05.2025: https://www.isbtech.pl/2025/05/przedsiebiorcy-w-polsce-traca-czas-na-rutynowych-zadaniach/
- PARP i UJ, bariery AI, 28.05.2026: https://crn.pl/aktualnosci/obawy-o-bezpieczenstwo-glowna-bariera-wdrozen-ai-w-polskich-firmach
- Barometr AI EFL: https://marketingprzykawie.pl/espresso/prawie-co-druga-polska-firma-nie-jest-gotowa-na-ai-badanie-efl/ i https://managerplus.pl/firmy-lepiej-oceniaja-przygotowanie-do-ai-wysoka-gotowosc-deklaruje-tylko-12-proc-2026
- Armatis, boty w obsłudze, 3.06.2024: https://reporterzy.info/4662,klienci-podrywaja-boty-z-obslugi-co-mowia-badania-contact-center
- eGospodarka, ocena voicebotów: https://www.egospodarka.pl/198779,AI-na-infolinii-nie-zastapi-czlowieka-Klienci-ocenili-boty-i-konsultantow,1,39,1.html
- Wykop, chatboty w obsłudze, 17.10.2026: https://wykop.pl/link/8031687/chatboty-w-obsludze-klienta-zawodza-wiekszosc-polakow-czeka-na-konsultanta
- recepcja.ai za ZnanyLekarz 2023: https://recepcja.ai/system-rejestracji-pacjentow-online
- Upwatcher, Upwork AI automation, 30.06.2026: https://www.upwatcher.io/market/ai-automation/
- Fiverr kategorie: https://www.fiverr.com/gigs/n8n-automation, https://www.fiverr.com/gigs/make-com, https://www.fiverr.com/gigs/chatbot-ai, https://www.fiverr.com/gigs/voice-agent
- Upwork: https://www.upwork.com/freelance-jobs/n8n/, https://www.upwork.com/freelance-jobs/ai-chatbot/
- Useme, tag n8n: https://useme.com/en/tags/jobs/n8n/
- Clutch, n8n Lab: https://clutch.co/profile/n8n-lab

Ceny rynkowe i konkurencja:

- aiport.pl, cennik automatyzacji 2026, 7.08.2026: https://aiport.pl/poradniki-ai/ile-kosztuje-automatyzacja-procesow-w-firmie-cennik-2026-i-widelki-ktorych-wykonawcy-nie-chca-podawac/
- aiport.pl, chatbot i voicebot 2026: https://aiport.pl/poradniki-ai/ile-kosztuje-chatbot-ai-i-voicebot-w-2026-cennik-polskiego-rynku-ukryte-koszty-i-progi-oplacalnosci/
- PixelAgency, ile kosztuje wdrożenie AI, 18.07.2026: https://pixelagency.pl/blog/ile-kosztuje-wdrozenie-ai
- Mankasoft, ceny chatbotów i automatyzacji, 24.10.2026: https://mankasoft.com/poradniki/ceny-chatbotow-i-automatyzacji-ai/
- mojafirma.ai, 15.03.2026: https://mojafirma.ai/blog/ile-kosztuje-wdrozenie-ai-w-firmie
- afaktury.pl, koszt wdrożenia KSeF: https://afaktury.pl/ile-kosztuje-wdrozenie-ksef-w-firmie,0,61,11,366/
- Docway, integracja KSeF z ERP: https://docway.pl/integracja-ksef-z-erp-5-scenariuszy-wdrozeniowych-i-ich-rzeczywiste-koszty/
- Strony oferentów z tabeli w rozdziale 4 (linki w tabeli)
- Ciela, saturacja agencji AI: https://ciela.ai/blogs/is-ai-automation-agency-saturated-2026
- Ringlyn, koszty voice: https://www.ringlyn.com/blog/ai-voice-agent-pricing

Koszty narzędzi:

- n8n cennik: https://n8n.io/pricing/; licencja: https://github.com/n8n-io/n8n/blob/master/LICENSE.md i https://docs.n8n.io/privacy-and-security/sustainable-use-license
- Zapier: https://zapier.com/pricing; Make: https://www.make.com/en/pricing
- Botpress: https://botpress.com/pricing; Voiceflow: https://www.voiceflow.com/pricing
- Retell: https://retellai.com/pricing; Vapi: https://vapi.ai/pricing; Bland: https://www.bland.ai/pricing; Synthflow: https://synthflow.ai/pricing
- ElevenLabs agenci: https://elevenlabs.io/pricing/agents; języki: https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- OpenAI ceny: https://developers.openai.com/api/docs/pricing; dane i rezydencja: https://developers.openai.com/api/docs/guides/your-data
- Anthropic ceny: https://platform.claude.com/docs/en/about-claude/pricing; rezydencja: https://platform.claude.com/docs/en/manage-claude/data-residency; DPA: https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa
- Azure OpenAI regiony: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure-region-availability
- Mistral: https://mistral.ai/pricing
- Twilio Polska: https://www.twilio.com/en-us/voice/pricing/pl; wymogi: https://www.twilio.com/en-us/guidelines/pl/regulatory
- Datera SIP, cennik od 1.09.2025: https://www.datera.pl/wp-content/uploads/2025/08/202509_Cennik_SIP_Trunk_NK.pdf; EasyCall: https://easycall.pl/en/sip-trunk-en/
- Hetzner: https://www.hetzner.com/cloud/regular-performance/; Cloudflare Workers: https://developers.cloudflare.com/workers/platform/pricing/; Supabase: https://supabase.com/pricing; Neon: https://neon.com/pricing; Qdrant: https://qdrant.tech/pricing/
- KSeF SDK: https://github.com/CIRFMF/ksef-client-java, https://github.com/smekcio/ksef-client-typescript; środowiska: https://github.com/CIRFMF/ksef-docs/blob/main/srodowiska.md; uwierzytelnianie: https://github.com/CIRFMF/ksef-docs/blob/main/uwierzytelnianie.md; tryby offline: https://github.com/CIRFMF/ksef-docs/blob/main/tryby-offline.md; MCU: https://ksef.podatki.gov.pl/media/0iafuqe5/podrecznik-uzytkownika-modulu-certyfikatow-i-uprawnien-mcu.pdf
- Czasy wdrożeń (blogi agencji): https://soluvide.com/blog/how-long-ai-implementation-takes, https://lomray.com/blog/how-long-does-it-take-to-build-a-chatbot, https://www.360automation.ai/ai-learning-center/ai-implementation-timeline-for-businesses

Prawo:

- AI Act art. 50, komentarze: https://www.morganlewis.com/blogs/sourcingatmorganlewis/2026/08/eu-ai-acts-transparency-rules-what-went-into-effect-on-2-august, https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html, https://aktzgodny.pl/baza-wiedzy/digital-omnibus-ai-act/, https://www.traple.pl/co-grozi-za-brak-przejrzystosci-kary-za-naruszenie-obowiazkow-z-art-50-ai-act/, https://promptowy.com/ai-act-kary/
- Ustawa z 3.07.2026 o systemach sztucznej inteligencji, Dz.U. 2026 poz. 1003: https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20260001003/T/D20261003L.pdf; https://www.prawo.pl/biznes/ustawa-o-systemach-ai-przyjeta-przez-sejm,1541891.html; https://bezprawnik.pl/shadow-ai-w-firmie/
- UODO, poradnik AI, 6.08.2026: https://uodo.gov.pl/pl/138/4533; omówienie: https://www.bankier.pl/wiadomosc/Nowy-poradnik-UODO-Jak-bezpiecznie-i-zgodnie-z-RODO-wdrazac-narzedzia-AI-9183101.html
- EDPB Opinion 28/2024, omówienie: https://cms.law/en/gbr/legal-updates/edpb-opinion-28-2024-key-takeaways-on-processing-personal-data-in-the-context-of-ai-models
- Nagrywanie rozmów: https://cheeloo.net/klauzula-informacyjna-rodo-dot-nagrywania-rozmow-telefonicznych/, https://edpo.pl/nagrywanie-rozmow-telefonicznych-przez-urzedy/
- KSeF harmonogram, MF, 29.05.2026: http://ksef.podatki.gov.pl/etapy-wdrozenia-ksef/; zakres: https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/zakres-obowiazkowego-ksef/; https://ksef.pl/ksef-od-kiedy; kary 2028, projekt z 20.10.2026: https://www.biznesinfo.pl/kary-za-ksef-dopiero-od-2028-roku-rzad-przyjal-projekt-pp-wzk-211026
- Moffatt v. Air Canada, 2024 BCCRT 149: https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot; Polska, odpowiedzialność za chatbota: https://ccnews.pl/2025/08/04/chatbot-na-stronie-odpowiedzialnosc-za-jego-slowa-spoczywa-na-przedsiebiorcy/

## 8. Faza 2: co zbudowano i jakimi skillami

Gałąź: `services-automation`. Data wdrożenia: 29.10.2026.

### 8.1 Co powstało

- Trzy podstrony usług w dwóch językach, z danych w `src/services.js` (blok `automation`): `/uslugi/automatyzacja-procesow/`, `/uslugi/integracje-ksef/`, `/uslugi/asystent-ai/` oraz `/en/services/process-automation/`, `/en/services/integrations-ksef/`, `/en/services/ai-assistant/`. Każda ma: problem (lead), co dostajesz, pakiety z cenami „od", co poza ceną, dla kogo, przebieg współpracy, co mierzymy, FAQ i formularz wyceny (wspólny komponent `Close`).
- Komponent `Service` dostał trzy warunkowe sekcje: `Pakiety.` (karty, środkowa oznaczona tekstem „Najczęściej"), `Poza ceną` i `Co mierzymy.`. Stare strony usług renderują się bez zmian.
- Strona zbiorcza: nie powstała osobna. Wieszak `/uslugi/` i kafelki na stronie głównej biorą listę z `serviceKeys`, więc trzy nowe usługi pojawiły się tam same, podobnie jak opcje w formularzu „Co szyjemy?", nawigacja językowa, sitemap i katalog ofert w JSON-LD. Dane strukturalne usługi dostały dodatkowo `hasOfferCatalog` z pakietami.
- Demo: dziesiąta strona Wzornika `/wzornik/docisk/`, zmyślony serwis samochodowy z asystentem AI. Odpowiedzi są zapisane w scenariuszu (cennik, godziny, adres, faktury, zapis na wymianę opon z wyborem dnia i godziny, przekazanie do człowieka, komunikat o AI w pierwszej wiadomości), obok panel „Co dzieje się w tle". Dane zostają w localStorage, nic nie jest wysyłane. Logika w `assistant.ts` ma 55 testów. Do wachlarza na stronie głównej i w `/wzornik/` doszła makieta `car.js` z czcionką Barlow Condensed.
- `static/llms.txt` opisuje nowe usługi i dziesięć stron przykładowych.

### 8.2 Skille i uzasadnienie

- `design-taste-frontend` nie był wywołany jako osobny skill. Brief kazał zostać w istniejącym systemie wizualnym strony, więc specyfikacje dla subagentów wskazywały istniejące komponenty (`Hero`, `Split`, `Reveal`, `Tag`, `Steps`) i tokeny z `global.css`. Nowe sekcje kopiują język kart `.care` i list `.who`.
- `web-design-guidelines`: przegląd trzech gotowych stron przez subagenta Sonnet. Wynik: nagłówki, landmarki, kontrasty (najniższy 6,81), cele dotyku i JSON-LD w porządku, brak przepełnienia przy 360 px. Jedna uwaga: globalny `list-style: none` sprawia, że Safari i VoiceOver nie czytają list jako list. Dodanie `role="list"` blokuje lint (`jsx-a11y/no-redundant-roles`), a istniejące listy też go nie mają, więc zostawione do osobnej decyzji (opis niżej).
- `humanizer-plus`, tryb polski: przeszedł po polskich tekstach trzech usług. Zmienił trzy ciągi (jedna odpowiedź FAQ przy automatyzacji, `body` i jedna odpowiedź FAQ przy asystencie). Reszta była już prosta.
- `staggered-word-reveal`: nie użyty. Nagłówki sekcji animuje już komponent `Split` z repo, dokładanie drugiej biblioteki nie miało sensu.

### 8.3 Podział pracy między modele

| Zadanie | Model |
|---|---|
| Research, ocena, wybór usług, ceny, teksty PL i EN, specyfikacje, odbiór diffów i zrzutów, ten raport | Fable |
| Sekcje pakietów, „Poza ceną" i „Co mierzymy" w `Service` oraz CSS | Sonnet |
| Demo Docisk w `sites/` (Astro, wyspa Preact, testy, czcionki) | Sonnet |
| Makieta `car.js`, wpis w `wzornik.js`, CSS wachlarza | Sonnet |
| Przegląd web-design-guidelines | Sonnet |
| Przejście humanizer-plus po polskich tekstach | Sonnet |
| Trasy w `i18n.js`, sześć plików stron, `seo.js` (pakiety w JSON-LD), `llms.txt`, liczniki „dziesięć", wpis Docisk w `work.js` | Haiku |
| Czcionka Barlow Condensed w `static/fonts` i `fonts.js` | Haiku |

Dwie poprawki po przeglądzie: `role="list"` (cofnięte przez lint, patrz wyżej) i gramatyka „1 do 2 tygodni" (poprawiona przeze mnie w moich własnych tekstach, nie w kodzie subagenta). Eskalacji do mocniejszego modelu nie było.

### 8.4 Weryfikacja

- `yarn lint`: przechodzi.
- `yarn build`: przechodzi (43 s). Ostrzeżenie `postcss-calc` o `calc(100% - 1.4cqw)` istniało wcześniej na `main`.
- `yarn --cwd sites run check`, `test`, `build`: 0 błędów, 1466 testów, 200 stron.
- Zrzuty desktop (1440 px) i telefon (390 px) wszystkich nowych stron, strony głównej, `/uslugi/`, `/wzornik/` i dema: `~/tmp/shots-automatyzacje/`. Przebieg rezerwacji w demie przeszedł do numeru D-1042 bez błędów w konsoli.

### 8.5 Do decyzji właściciela przed publikacją

1. Ceny i progi pakietów (rozdział 3). Są oparte o 32 strony konkurencji, ale to moja propozycja pozycjonowania, nie dana.
2. Nazwy usług na kafelkach: „Automatyzacja procesów", „Integracje i KSeF", „Asystent AI na stronę". Alternatywy: „Automatyzacje", „KSeF i integracje", „Asystent AI".
3. Założenia bez potwierdzenia w danych: stawka 140 zł/h jako podstawa marży, n8n zawsze na instancji klienta, OpenAI EU albo Azure Poland Central jako domyślny model przy danych osobowych, limity rozmów w pakietach asystenta (500, 2 000, 5 000).
4. Deklaracja w FAQ KSeF o projekcie przesunięcia kar na 2028 (stan na październik 2026). Do sprawdzenia przed publikacją, bo rząd może zmienić termin.
5. Case TailorCloth jest podpięty pod stronę integracji (`proof: true`). Jeśli ma zostać tylko przy aplikacjach, wystarczy usunąć flagę.
6. Listy w nowych sekcjach i Safari: globalny `list-style: none` w `global.css`. Rozwiązanie zgodne z lintem to zmiana resetu na `list-style-type: ''` dla całej strony, co wykracza poza ten zakres.
7. Demo Docisk ma w stopce notkę, że firma jest zmyślona, a w sekcji asystenta, że odpowiedzi są ze scenariusza. Jeśli ma stanąć prawdziwy model w demie, trzeba backendu (Cloudflare Worker) i klucza, czego brief nie obejmował.
