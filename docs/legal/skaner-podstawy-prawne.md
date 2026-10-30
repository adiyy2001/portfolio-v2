# Skaner dostępności: podstawy prawne tekstów

Data weryfikacji: 30 października 2026. Wszystkie źródła sprawdzone w tym dniu w tekstach pierwotnych (api.sejm.gov.pl/eli, ISAP, PDF RODO z uodo.gov.pl, PDF EDPB, API listy DPF). Teksty, do których odnosi się notatka: `src/scanner/consent.json`, `src/pages/regulamin-skanera.js`, `src/pages/polityka-prywatnosci.js` (sekcja `#skaner`), `src/pages/en/privacy.js` (sekcja `#scanner`).

## 1. Prawo komunikacji elektronicznej (PKE)

Źródło: ustawa z 12 lipca 2024 r. (Dz.U. 2024 poz. 1221), tekst ujednolicony Kancelarii Sejmu, https://api.sejm.gov.pl/eli/acts/DU/2024/1221/text.html (plik typu U: D20241221Lj.pdf). Status: obowiązujący, brak tekstu jednolitego ogłoszonego obwieszczeniem (wyszukiwanie w ELI za 2025 i 2026 nie zwraca obwieszczenia).

Nowelizacje do dziś: Dz.U. 2025 poz. 637, 2025 poz. 820, 2026 poz. 252, 2026 poz. 815, 2026 poz. 1296 (wejście w życie 6 listopada 2026). Sprawdziłem teksty wszystkich pięciu: żadna nie zmienia art. 398, 399 ani 400. Nowela 2026/1296 dodaje tylko pkt 24 w art. 419 ust. 1 PKE (zadania koordynatora do spraw usług cyfrowych).

- Art. 398 ust. 1: zakaz używania telekomunikacyjnych urządzeń końcowych do przesyłania informacji handlowej w rozumieniu UŚUDE, w tym marketingu bezpośredniego, do abonenta lub użytkownika końcowego, chyba że uprzednio wyraził zgodę. Skutek: osobny, domyślnie odznaczony checkbox na sekwencję maili; tekst zgody w `consent.json` (`marketing`).
- Art. 398 ust. 2: zgoda może polegać na udostępnieniu adresu elektronicznego w celu przesyłania informacji handlowej. Skutek: sam e-mail wpisany po raport nie jest zgodą na marketing, bo cel jest inny; stąd osobne pole.
- Art. 398 ust. 4: naruszenie to czyn nieuczciwej konkurencji. Skutek: zapis stanu checkboxów i wersji klauzul jako dowód.
- Art. 399: cookies i dostęp do informacji w urządzeniu końcowym. Skaner nie zapisuje własnych ciasteczek; Turnstile działa na podstawie uzasadnionego interesu (bezpieczeństwo), opisanego w polityce. Patrz punkt otwarty 9.3.
- Art. 400: do uzyskania zgody stosuje się odpowiednio przepisy o ochronie danych osobowych. Skutek: warunki z art. 7 RODO (wykazanie zgody, łatwe wycofanie, odróżnienie od innych treści) zastosowane w tekście zgody i w mechanice (link rezygnacji w każdej wiadomości).

## 2. Ustawa o świadczeniu usług drogą elektroniczną (UŚUDE)

Źródło: tekst jednolity Dz.U. 2024 poz. 1513 (obwieszczenie z 10 października 2024), https://api.sejm.gov.pl/eli/acts/DU/2024/1513/text.html. Wyszukiwanie ELI za 2025 i 2026 nie pokazuje nowszego tekstu jednolitego.

Nowelizacja: ustawa z 4 września 2026 r. o zmianie ustawy o świadczeniu usług drogą elektroniczną oraz niektórych innych ustaw (Dz.U. 2026 poz. 1296, https://api.sejm.gov.pl/eli/acts/DU/2026/1296/text.pdf), wejście w życie 6 listopada 2026 (art. 8: 30 dni od ogłoszenia 6 października 2026). Wdraża DSA: dodaje definicje w art. 2 (pkt 1a, 1b, 2a do 2e, 5a, 9, 10), uchyla art. 1 pkt 2 i rozdział 3 (wyłączenia odpowiedzialności, zastąpione przez rozporządzenie 2022/2065), dodaje rozdział 3a. Nie zmienia art. 2 pkt 2, art. 5, art. 6 ani art. 8. Teksty skanera nie wymagają zmiany po 6 listopada 2026.

- Art. 2 pkt 2: informacja handlowa to każda informacja przeznaczona bezpośrednio lub pośrednio do promowania towarów, usług lub wizerunku przedsiębiorcy. Skutek: maile o audytach i zaproszenie na rozmowę są informacją handlową; sam mail z linkiem potwierdzającym i mail z raportem służą wykonaniu usługi i nie są informacją handlową, pod warunkiem że nie zawierają treści promocyjnych.
- Art. 5 ust. 1 i 2: usługodawca podaje w sposób wyraźny i bezpośrednio dostępny adresy elektroniczne oraz imię, nazwisko, miejsce zamieszkania i adres albo firmę, siedzibę i adres. Art. 5 ust. 4 odsyła do obowiązku podawania NIP w ofercie (art. 20 ust. 3 Prawa przedsiębiorców). Skutek: sekcja 1 regulaminu ze znacznikami `[adres]` i `[NIP]` do uzupełnienia.
- Art. 6: dostęp do informacji o szczególnych zagrożeniach i o oprogramowaniu wprowadzanym do systemu usługobiorcy. Skutek: regulamin i polityka opisują Turnstile oraz to, że skaner nie loguje się i nie omija zabezpieczeń.
- Art. 8 ust. 1 do 4: obowiązek regulaminu udostępnionego nieodpłatnie przed zawarciem umowy w formie pozwalającej utrwalić treść; elementy: rodzaje i zakres usług, wymagania techniczne, zakaz treści bezprawnych, warunki zawierania i rozwiązywania umów, tryb reklamacyjny. Skutek: struktura `regulamin-skanera.js` (sekcje 3, 4, 5, 6, 9) i zapis wersji regulaminu z sumą SHA-256 przy zleceniu.
- Art. 10 UŚUDE: uchylony przez art. 26 pkt 3 PKE; zakaz niezamówionej informacji handlowej jest teraz w art. 398 PKE.

## 3. RODO

Źródło: rozporządzenie (UE) 2016/679, polski tekst z Dz.Urz. UE L 119 z 4.5.2016 w PDF na uodo.gov.pl: https://uodo.gov.pl/data/filemanager_pl/727.pdf (EUR-Lex odpowiadał w dniu weryfikacji kodem 202 bez treści dla pobrań automatycznych, dlatego użyłem kopii UODO; identyfikator EUR-Lex: CELEX 32016R0679).

- Art. 6 ust. 1 lit. a, b, c, f: podstawy użyte w polityce: b dla wykonania skanu i wysyłki raportu, c razem z art. 7 ust. 1 dla dowodu zgody, f dla obrony roszczeń, bezpieczeństwa, limitów i powiadomienia Telegram, a dla marketingu.
- Art. 7 ust. 1: administrator musi być w stanie wykazać zgodę. Ust. 2: zapytanie o zgodę wyraźnie odróżnione od innych kwestii. Ust. 3: wycofanie w dowolnym momencie, równie łatwe jak wyrażenie, informacja o tym przed wyrażeniem. Ust. 4: wykonanie umowy nie może zależeć od zgody, która nie jest niezbędna. Skutek: osobny checkbox, zdanie o braku wpływu na raport, link rezygnacji w każdej wiadomości, zapis treści i wersji klauzul.
- Art. 12 ust. 1: informacje zwięzłe, przejrzyste, jasnym i prostym językiem. Skutek: styl klauzul.
- Art. 13 ust. 1 i 2: tożsamość i kontakt administratora, cele i podstawy, uzasadnione interesy, odbiorcy, przekazanie do państwa trzeciego i podstawa, okres przechowywania, prawa, prawo cofnięcia zgody, skarga do organu, dobrowolność i konsekwencje niepodania, zautomatyzowane decyzje. Skutek: wszystkie elementy w sekcji `#skaner`, skrót w `consent.json` (`info`) z odesłaniem do polityki (art. 13 ust. 4: informacje, którymi osoba już dysponuje, można pominąć).
- Art. 17 ust. 3 lit. b i e: prawo do usunięcia nie działa, gdy przetwarzanie jest niezbędne do obowiązku prawnego albo do ustalenia, dochodzenia lub obrony roszczeń. Skutek: okres przechowywania dowodu zgody po zakończeniu usługi.
- Art. 21 ust. 1 do 4: sprzeciw wobec przetwarzania na podstawie lit. f; wobec marketingu bezpośredniego w dowolnym momencie, bez przesłanek; informacja o tym prawie jasno i odrębnie najpóźniej przy pierwszej komunikacji. Skutek: akapit o prawach w polityce; każdy mail marketingowy musi zawierać link rezygnacji.
- Art. 22 ust. 1: decyzje oparte wyłącznie na zautomatyzowanym przetwarzaniu. Skutek: zdanie, że skaner ocenia kod strony, nie osobę.
- Art. 45: przekazanie na podstawie decyzji o odpowiednim stopniu ochrony. Skutek: podstawa transferu do Cloudflare i Resend (patrz punkt 6).
- Motyw 32: zgoda przez jednoznaczną czynność, milczenie i domyślnie zaznaczone okienka nie są zgodą. Motyw 42: administrator wykazuje zgodę. Motyw 47: uzasadniony interes wymaga oceny rozsądnych oczekiwań osoby. Motyw 70: sprzeciw wobec marketingu bezpłatny, w każdej chwili.

## 4. EDPB Guidelines 05/2020 on consent

Źródło: wersja 1.1 z 13 maja 2020 (przyjęta 4 maja 2020), https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf.

- Pkt 42 do 44 (granularność): osobna zgoda na każdy cel; łączenie celów oznacza brak dobrowolności. Skutek: zgoda marketingowa oddzielona od akceptacji regulaminu.
- Pkt 64: minimum informacji przy zgodzie: tożsamość administratora, cel każdej operacji, rodzaj danych, prawo wycofania. Skutek: treść `consent.json` (`marketing`).
- Pkt 104 do 108 (dowód zgody): administrator może zachować zapis oświadczeń, kiedy i jak zgoda została uzyskana oraz kopię informacji pokazanej w tym czasie; sama konfiguracja strony nie wystarczy. Pkt 107: po zakończeniu przetwarzania dowód tylko tak długo, jak wymaga obowiązek prawny lub obrona roszczeń. Skutek: zapis treści i SHA-256 klauzul, stanu checkboxów, czasów i IP; okres 3 lat (punkt 7 niżej).
- Pkt 113 do 115 (wycofanie): równie łatwe jak wyrażenie; telefon w godzinach pracy nie wystarcza przy zgodzie jednym kliknięciem. Skutek: link rezygnacji w każdym mailu plus adres e-mail.
- Double opt-in: wytyczne nie wymagają potwierdzenia adresu mailem (słowo nie występuje w dokumencie). Potwierdzenie stosujemy jako środek dowodowy i ochronę przed wpisaniem cudzego adresu, co wspiera pkt 104 do 108.

## 5. Ustawa o zapewnianiu spełniania wymagań dostępności niektórych produktów i usług

Źródło: ustawa z 26 kwietnia 2024 r., Dz.U. 2024 poz. 731, https://api.sejm.gov.pl/eli/acts/DU/2024/731/text.html. Obowiązuje od 28 czerwca 2025 r. (przepis końcowy). Brak nowelizacji w rekordzie ELI, brak tekstu jednolitego.

- Art. 4 pkt 1: przepisów ustawy nie stosuje się do usług oferowanych lub świadczonych przez mikroprzedsiębiorców. Uwaga: art. 4 pkt 1 to wyłączenie, nie definicja. Definicja dostępności jest w art. 5 pkt 4. Skutek: w tekstach publicznych nie ma straszenia; raport odwołuje się do ustawy tylko w zastrzeżeniu, że nie stwierdza zgodności ani niezgodności.
- Art. 73 ust. 1 pkt 4 lit. a: kara pieniężna dla usługodawcy, który nie zapewnia spełniania wymagań dostępności usług z art. 12 do 19; wymiar do dziesięciokrotności przeciętnego wynagrodzenia. Skutek: nie cytujemy kar w tekstach dla użytkownika (zgodnie ze zleceniem bez straszenia); informacja tylko tutaj.

## 6. Transfery do USA: Cloudflare i Resend

Źródło: lista Data Privacy Framework, API publiczne listy (https://dpfapi.azurewebsites.net/api/participants/5666 i /8907, to samo, co strony https://www.dataprivacyframework.gov/participant/5666 i /participant/8907, które są aplikacją JavaScript bez treści w HTML).

- Cloudflare, Inc.: EU-US DPF Active (od 9 listopada 2016, kolejna recertyfikacja do 15 września 2027), UK Extension Active, Swiss-US Active, dane HR i non-HR.
- Resend: podmiot certyfikowany to Plus Five Five, Inc. (nazwa publiczna Resend), 2261 Market Street #5039, San Francisco. EU-US DPF: Active, Re-certification under Review (od 20 lutego 2025, termin recertyfikacji 3 marca 2027), UK Extension tak samo, tylko dane non-HR, weryfikacja: samoocena. Skutek: w polityce nazwa Plus Five Five, Inc. zamiast Resend, Inc.; podstawa transferu: decyzja Komisji o adekwatności (art. 45 RODO). Status „Re-certification under Review” jest statusem aktywnym, ale warto sprawdzić ponownie po 3 marca 2027.
- Cloudflare deklaruje w swojej polityce prywatności SCC jako podstawę zapasową, to deklaracja dostawcy, nie źródło pierwotne, dlatego polityka strony opiera się tylko na DPF.

## 7. Kodeks cywilny

Źródło: tekst jednolity Dz.U. 2026 poz. 795 (obwieszczenie z 27 maja 2026, stan prawny na 19 maja 2026), https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf.

- Art. 22(1): konsument to osoba fizyczna dokonująca z przedsiębiorcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.
- Art. 385(1) § 1: postanowienia nieuzgodnione indywidualnie nie wiążą konsumenta, jeśli kształtują jego prawa sprzecznie z dobrymi obyczajami i rażąco naruszają jego interesy. Art. 385(3) pkt 2: w razie wątpliwości niedozwolone są klauzule wyłączające lub istotnie ograniczające odpowiedzialność za niewykonanie lub nienależyte wykonanie zobowiązania. Skutek: regulamin nie wyłącza odpowiedzialności wobec konsumentów; odpowiada „na zasadach ogólnych”.
- Art. 385(5) § 1: ochronę z art. 385(1) do 385(3) stosuje się do osoby fizycznej zawierającej umowę bezpośrednio związaną z działalnością gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego (według przedmiotu działalności w CEIDG). Przepis nie ogranicza się do umów odpłatnych, więc stosuje się także do bezpłatnego skanu. Skutek: ograniczenie odpowiedzialności do winy umyślnej i rażącego niedbalstwa dotyczy tylko użytkowników bez ochrony konsumenckiej; klauzula wprost wyłącza z niego konsumentów i przedsiębiorców na prawach konsumenta.
- Art. 473 § 2: nieważne jest zastrzeżenie, że dłużnik nie będzie odpowiedzialny za szkodę wyrządzoną umyślnie. Skutek: brak klauzuli „nie ponoszę żadnej odpowiedzialności”.
- Art. 471: odpowiedzialność za nienależyte wykonanie zobowiązania. Art. 415: odpowiedzialność deliktowa. To „zasady ogólne”, do których odsyła regulamin.
- Art. 118: roszczenia związane z prowadzeniem działalności gospodarczej przedawniają się po 3 latach, koniec terminu przypada na ostatni dzień roku kalendarzowego. Skutek: okres przechowywania zlecenia i dowodu zgody do końca trzeciego roku kalendarzowego po roku skanu. Roszczenia konsumenta wobec przedsiębiorcy mogą mieć termin 6 lat (ogólny), ale dowód zgody służy głównie wykazaniu zgody wobec organu i obronie przed zarzutem spamu (art. 398 ust. 4 PKE), dlatego 3 lata uznaję za proporcjonalne (EDPB pkt 107).

## 8. Ustawa o prawach konsumenta (UPK)

Źródło: tekst jednolity Dz.U. 2026 poz. 1244 (23 września 2026), https://api.sejm.gov.pl/eli/acts/DU/2026/1244/text.pdf.

- Art. 7a: odpowiedź na reklamację konsumenta w 14 dni, brak odpowiedzi oznacza uznanie reklamacji, odpowiedź na trwałym nośniku. Skutek: sekcja 9 regulaminu (termin 14 dni, odpowiedź mailem).
- Art. 7aa: ochrona z rozdziałów 4, 5a i 5b także dla osoby fizycznej prowadzącej działalność, gdy umowa nie ma charakteru zawodowego.
- Art. 12 ust. 1 pkt 2 i 3: przy umowie na odległość przedsiębiorca podaje firmę, organ rejestrowy i numer wpisu, adres przedsiębiorstwa, e-mail i telefon. Skutek: potwierdza potrzebę uzupełnienia `[NIP]` i `[adres]`; telefon nie jest podany w regulaminie (patrz punkt 9.2).
- Art. 27: odstąpienie od umowy na odległość w 14 dni bez podawania przyczyny. Art. 38 pkt 1 i 13: wyjątki dotyczą usług i treści cyfrowych, za które konsument płaci cenę, więc nie obejmują bezpłatnego skanu. Skutek: sekcja 5 regulaminu przyznaje konsumentom i osobom z art. 7aa odstąpienie w 14 dni.

## 9. Punkty niepotwierdzone i do decyzji właściciela

1. `[NIP]` i `[adres]` w sekcji 1 regulaminu: w repo nie ma NIP, adresu ani numeru CEIDG (grep po NIP, CEIDG, REGON, Wrocław). Trzeba uzupełnić przed publikacją (art. 5 UŚUDE, art. 12 ust. 1 pkt 2 i 3 UPK, art. 20 ust. 3 Prawa przedsiębiorców).
2. Telefon w regulaminie: art. 12 ust. 1 pkt 3 UPK wymienia numer telefonu. Worker wyceny pokazuje numer +48 731 985 567 na stronie błędu, ale nie wiem, czy ma być publiczny w regulaminie. Decyzja właściciela.
3. Turnstile a art. 399 PKE: nie weryfikowałem, czy Turnstile zapisuje informacje w urządzeniu końcowym (dokumentacja Cloudflare to źródło dostawcy, nie pierwotne). Jeśli zapisuje, trzeba sprawdzić, czy mieści się w wyjątku dla operacji niezbędnych do świadczenia usługi żądanej przez użytkownika (art. 399 ust. 2 PKE); nie cytowałem tego ustępu w tekstach.
4. Zakres stosowania UPK do bezpłatnej usługi cyfrowej „za dane”: dyrektywa 2019/770 (art. 3 ust. 1) obejmuje usługi cyfrowe, za które konsument przekazuje dane osobowe. W tekście jednolitym UPK 2026/1244 nie znalazłem odrębnego przepisu powtarzającego tę regułę (szukałem po frazach o dostarczaniu danych osobowych). Regulamin przyznaje odstąpienie i tryb reklamacji niezależnie od tego, więc ewentualne stosowanie UPK nie tworzy ryzyka. Do potwierdzenia u prawnika.
5. Telegram jako odbiorca: powiadomienie zawiera domenę, liczbę błędów i flagę zgody, bez e-maila i IP. Adres skanowanej strony może sam być daną osobową (np. imię i nazwisko w domenie), dlatego Telegram jest wymieniony jako odbiorca. Nie potwierdziłem w źródle pierwotnym podstawy transferu Telegrama poza EOG (brak decyzji o adekwatności dla ZEA, SCC niedostępne dla użytkownika bota). Minimalizacja treści powiadomienia to środek ograniczający; alternatywą jest powiadomienie bez domeny (tylko liczba błędów i flaga) albo kanał w EOG. Decyzja właściciela.
6. Limity: regulamin i polityka mówią o 3 skanach na dobę z jednego IP (IPv6: prefiks /64) i na jeden ujednolicony e-mail oraz o jednej domenie rejestrowalnej raz na 24 godziny. Kod musi egzekwować dokładnie te wartości.
7. Czas życia niepotwierdzonego zlecenia: 24 godziny na kliknięcie przycisku, usunięcie rekordu najpóźniej 48 godzin po wysłaniu formularza (patrz sekcja 10).
8. Link rezygnacji w każdym mailu marketingowym i brak treści promocyjnych w mailu potwierdzającym i mailu z raportem: wymóg wynikający z art. 7 ust. 3 RODO i art. 2 pkt 2 UŚUDE; do wdrożenia w szablonach maili.
9. Pozasądowe rozwiązywanie sporów: regulamin nie odsyła do unijnej platformy ODR, bo nie weryfikowałem w źródle pierwotnym jej aktualnego statusu po 2025 r.; nie ma też deklaracji udziału w ADR (ustawa o pozasądowym rozwiązywaniu sporów konsumenckich pozwala przedsiębiorcy nie zobowiązywać się do udziału, ale wymaga poinformowania o tym; regulamin informuje). Do potwierdzenia u prawnika.
10. Rekomendacja: konsultacja z prawnikiem przed publikacją skanera, zwłaszcza punkty 3, 4, 5 i 9. Resend: sprawdzić status DPF po 3 marca 2027.

## 10. Dla programisty: okresy retencji i zachowania opisane w tekstach

Teksty publiczne obiecują dokładnie to, co niżej. Cron dobowy ma usuwać dane, których okres minął; polityka mówi „najpóźniej w ciągu doby po upływie okresu”.

| Dane                                                                                                                                           | Okres                                                                                                                 | Zdarzenie startowe                               | Usunięcie                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| Raport HTML w R2 i jego klucz                                                                                                                  | 30 dni                                                                                                                | zapis raportu po skanie                          | cron, najpóźniej dzień 31                    |
| Zlecenie niepotwierdzone (URL, e-mail, IP, UA, klauzule, stan pól)                                                                             | token ważny 24 h                                                                                                      | wysłanie formularza                              | cron, najpóźniej 48 h po wysłaniu formularza |
| Zlecenie potwierdzone i dowód wyborów (URL, e-mail, IP, UA, czas formularza, czas kliknięcia przycisku, treść i SHA-256 klauzul, stan obu pól) | do 31 grudnia trzeciego roku kalendarzowego po roku potwierdzenia (np. potwierdzenie 2026: usunięcie 1 stycznia 2030) | kliknięcie przycisku „Potwierdzam i zlecam skan” | cron, pierwsze uruchomienie po 31 grudnia    |
| Dane do sekwencji marketingowej (e-mail, stan wysyłki)                                                                                         | do wycofania zgody albo do wysłania 4. (ostatniej) wiadomości, najpóźniej 14 dni od zgody                             | zgoda                                            | cron po zdarzeniu                            |
| Dowód zgody marketingowej i jej wycofania (czas zgody, czas wycofania, kanał wycofania)                                                        | do 31 grudnia trzeciego roku kalendarzowego po roku wycofania albo zakończenia sekwencji                              | wycofanie albo koniec sekwencji                  | cron, pierwsze uruchomienie po 31 grudnia    |
| Liczniki limitów (domena rejestrowalna, IP lub prefiks IPv6 /64, ujednolicony e-mail)                                                          | 24 h                                                                                                                  | zlecenie                                         | cron                                         |
| Powiadomienie Telegram (domena, liczba błędów, flaga zgody)                                                                                    | poza kontrolą cronu, czat właściciela                                                                                 | skan                                             | ręcznie                                      |

Zachowania opisane w regulaminie, które kod musi odwzorować:

- potwierdzenie wyłącznie przyciskiem na stronie otwartej z linku; samo GET nie potwierdza;
- limity: 1 skan na domenę rejestrowalną na 24 h (subdomeny platform hostingowych liczone osobno), do 3 skanów na dobę na IP lub prefiks IPv6 /64 oraz na e-mail po normalizacji (bez części po plusie, dla Gmaila bez kropek w nazwie);
- przekierowanie strony głównej na inną domenę: brak skanu, mail z informacją do użytkownika;
- robots.txt respektowany także po przekierowaniu, zakazane podstrony pomijane;
- baner cookies: najpierw skan strony głównej z banerem, potem akceptacja albo zamknięcie banera, profil przeglądarki czyszczony po każdym zadaniu;
- maile potwierdzający, z raportem i z informacją o braku skanu bez treści promocyjnych; każdy mail marketingowy z linkiem rezygnacji;
- odmowa skanu z sekcji 6 regulaminu komunikowana mailem tylko po potwierdzeniu zlecenia.
