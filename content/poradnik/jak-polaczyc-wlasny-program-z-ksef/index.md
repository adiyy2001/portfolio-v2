---
title: 'Jak połączyć własny program albo sklep z KSeF: API, tokeny, certyfikaty i tryby offline'
description: 'Jak podłączyć własny system do KSeF przez API 2.0: token czy certyfikat, struktura FA(3), środowiska testowe, limity, tryby offline i kody QR. Stan na listopad 2026.'
answer: 'Własny program albo sklep łączy się z KSeF przez publiczne API 2.0. Potrzebujesz tokena albo certyfikatu KSeF, faktur zapisanych w strukturze FA(3) i testów na środowisku testowym. Jeśli system ma wystawiać faktury także bez połączenia z KSeF, dochodzi drugi certyfikat i dwa kody QR.'
date: '2026-11-10T12:30:00+01:00'
slug: 'jak-polaczyc-wlasny-program-z-ksef'
service: 'integ'
tags: ['KSeF', 'integracje', 'API']
faq:
  - q: 'Czy tokeny KSeF przestaną działać z końcem 2026 roku?'
    a: 'Nie. Tokeny miały działać do końca 2026 roku, ale Ministerstwo Finansów zdecydowało, że zostają bezterminowo, i zapowiedziało nowelizację rozporządzenia. Tokeny i certyfikaty działają równolegle. Tak wygląda to w odpowiedziach MF z 10 listopada 2026.'
  - q: 'Czy do integracji z KSeF potrzebny jest podpis kwalifikowany?'
    a: 'Do samej pracy programu nie. Osoba uprawniona loguje się raz podpisem kwalifikowanym albo profilem zaufanym i generuje token albo certyfikat KSeF. Program używa potem tego tokena albo certyfikatu.'
  - q: 'Co się dzieje z fakturami, gdy KSeF nie działa?'
    a: 'Są trzy tryby. W offline24 fakturę dosyłasz najpóźniej następnego dnia roboczego. Gdy Ministerstwo Finansów prowadzi prace serwisowe, masz czas do dnia po zakończeniu przerwy. Po ogłoszonej awarii masz 7 dni roboczych od jej końca.'
  - q: 'Czy stare tokeny z KSeF 1.0 działają w KSeF 2.0?'
    a: 'Nie. Tokeny wygenerowane w KSeF 1.0 nie są zgodne z KSeF 2.0, więc trzeba wygenerować nowe.'
  - q: 'Ile faktur na godzinę można wysłać do KSeF?'
    a: 'W sesji interaktywnej limit na produkcji to 10 faktur na sekundę, 30 na minutę i 180 na godzinę, liczony osobno dla pary NIP i adres IP. Większą liczbę faktur wysyła się sesją wsadową, w paczkach ZIP.'
---

Podłączałem KSeF 2.0 od strony API, więc opisuję kolejne kroki tak, jak wychodzą w projekcie. Fakty o systemie pochodzą z dokumentacji Ministerstwa Finansów sprawdzonej 10 listopada 2026. Lista źródeł jest na końcu.

## Co musi być gotowe po Twojej stronie

Zanim program wyśle pierwszą fakturę, ktoś z firmy musi mieć uprawnienia w KSeF. Spółka z kwalifikowaną pieczęcią z NIP-em ma je od razu. Spółka bez pieczęci składa w urzędzie skarbowym zgłoszenie ZAW-FA i wskazuje w nim osobę, która będzie korzystać z KSeF w jej imieniu.

Ta osoba loguje się podpisem kwalifikowanym albo profilem zaufanym i generuje dla programu token albo certyfikat. Pracownicy, którzy tylko wystawiają faktury w programie, nie potrzebują własnego podpisu kwalifikowanego.

Ja Twojego certyfikatu nie przechowuję. Zostaje na Twoim serwerze.

## Token czy certyfikat KSeF

API przyjmuje dwa sposoby uwierzytelnienia: token KSeF albo podpis XAdES złożony certyfikatem.

Token jest prostszy. Generujesz go po jednorazowym zalogowaniu podpisem i od razu przypisujesz mu uprawnienia, na przykład tylko wystawianie faktur. Uprawnień nie da się potem zmienić, trzeba wygenerować nowy token.

Certyfikat KSeF służy wyłącznie do potwierdzenia tożsamości i jest ważny najwyżej 2 lata. Ma dwa typy, generowane osobno: do uwierzytelnienia i do faktur offline. Jeden certyfikat nie obsłuży obu zadań. Program, który loguje się certyfikatem, musi umieć złożyć podpis XAdES.

W praktyce do samej wysyłki online wystarcza token. Certyfikat typu offline staje się potrzebny, gdy program ma wystawiać faktury bez połączenia z KSeF.

## Struktura FA(3) i mapowanie pól

Od 1 lutego 2026 obowiązuje struktura FA(3). Faktura, która się z nią nie zgadza, na przykład nie ma wymaganego pola, zostaje odrzucona.

Dlatego największa część pracy to mapowanie: każde pole Twojej faktury trzeba przypisać do pola w FA(3). Na tym etapie wychodzą braki w danych kontrahentów i nietypowe dokumenty, takie jak korekty. Spisuję je przed wyceną, żeby nie zaskoczyły nas w trakcie.

## Środowiska testowe

Ministerstwo Finansów udostępnia trzy środowiska: testowe, demo i produkcyjne. Demo ma konfigurację zbliżoną do produkcji i służy do końcowego sprawdzenia.

Na środowiskach testowych nie wolno wysyłać prawdziwych faktur ani rzeczywistych danych firm. Dane na środowisku testowym nie są odizolowane i inni integratorzy mogą je zobaczyć. Testuję więc na fakturach o Twoim układzie pól, ale ze zmienionymi danymi.

## Wysyłka: sesja interaktywna albo wsadowa

Pojedyncze faktury idą sesją interaktywną. Sesja żyje 12 godzin, a każdą fakturę program szyfruje przed wysłaniem. Limit na produkcji to 10 faktur na sekundę, 30 na minutę i 180 na godzinę. Liczy się go osobno dla pary NIP i adres IP. Po przekroczeniu API odpowiada kodem 429 i podaje, po jakim czasie spróbować ponownie.

Przy większej liczbie faktur Ministerstwo zaleca sesję wsadową. Faktury pakuje się wtedy do ZIP-a i wysyła w częściach do 100 MB.

Po przyjęciu faktury KSeF nadaje jej numer. Program zapisuje go przy fakturze i drukuje na niej kod QR.

## Odbiór faktur kosztowych

Faktury od dostawców pobiera się przyrostowo: program pyta o to, co przybyło od ostatniego razu. Dokumentacja zaleca, żeby nie robić tego częściej niż co 15 minut dla jednego podmiotu.

## Tryby offline i kody QR

Są trzy tryby i każdy ma inny termin dosłania faktury do KSeF:

| Tryb      | Kiedy                                 | Termin dosłania                 |
| --------- | ------------------------------------- | ------------------------------- |
| offline24 | kiedy chcesz, także bez awarii        | następny dzień roboczy          |
| offline   | prace serwisowe Ministerstwa Finansów | dzień po zakończeniu przerwy    |
| awaryjny  | awaria ogłoszona przez Ministerstwo   | 7 dni roboczych od końca awarii |

Kody QR program generuje sam, lokalnie. Faktura wysłana online ma jeden kod z numerem KSeF. Faktura wystawiona offline i jeszcze niedosłana ma dwa: pierwszy z napisem OFFLINE pozwala sprawdzić dane faktury, drugi z napisem CERTYFIKAT potwierdza tożsamość wystawcy. Do drugiego kodu potrzebny jest certyfikat typu offline. Token ani certyfikat do uwierzytelnienia tu nie wystarczą.

Datą wystawienia faktury offline jest data wpisana na fakturze, a nie dzień, w którym trafiła do KSeF.

## Kiedy integracja nie jest potrzebna

Jeśli wystawiasz kilka faktur w miesiącu, wystarczy bezpłatna Aplikacja Podatnika od Ministerstwa Finansów. Jeśli fakturujesz w popularnym programie, sprawdź najpierw, czy ma już KSeF. Ceny gotowych bramek i integracji na zamówienie porównuję w poradniku [ile kosztuje integracja z KSeF](/poradnik/ile-kosztuje-integracja-z-ksef/).

## Jak wygląda to u mnie

Najpierw oglądam systemy i faktury, spisuję pola do zmapowania i przypadki poza schematem. Wycenę dostajesz na piśmie w dwa dni robocze. Potem buduję połączenie na środowisku testowym i pokazuję, co dzieje się z fakturą po drodze i przy błędzie. Na produkcję przełączamy się razem, przy pierwszych prawdziwych fakturach. Przez 30 dni poprawiam to, co wyjdzie w praktyce.

Wysyłka faktur z jednego systemu kosztuje od 6 000 zł netto. Zakres i etapy są na stronie [integracje i KSeF](/uslugi/integracje-ksef/).

## Źródła

- Uwierzytelnianie, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/uwierzytelnianie.md, stan na 2026-11-10
- Tokeny KSeF, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/tokeny-ksef.md, stan na 2026-11-10
- Certyfikaty KSeF (Ministerstwo Finansów), https://ksef.podatki.gov.pl/informacje-ogolne-ksef-20/certyfikaty-ksef/, stan na 2026-11-10
- Pytania i odpowiedzi KSeF 2.0 (Ministerstwo Finansów), https://ksef.podatki.gov.pl/pytania-i-odpowiedzi-ksef-20/, stan na 2026-11-10
- Integratorzy IT (Ministerstwo Finansów), https://ksef.podatki.gov.pl/integratorzy-it/, stan na 2026-11-10
- Środowiska, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/srodowiska.md, stan na 2026-11-10
- Sesja interaktywna, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/sesja-interaktywna.md, stan na 2026-11-10
- Sesja wsadowa, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/sesja-wsadowa.md, stan na 2026-11-10
- Limity API, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/limity/limity-api.md, stan na 2026-11-10
- Tryby offline, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/tryby-offline.md, stan na 2026-11-10
- Kody QR, KSeF API 2.0 (Ministerstwo Finansów), https://github.com/CIRFMF/ksef-api/blob/main/kody-qr.md, stan na 2026-11-10
