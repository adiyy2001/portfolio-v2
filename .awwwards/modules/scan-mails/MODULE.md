# Module

## Brief

Who: a person who ordered a free scan on /skaner/ and meets the worker three times: the mail with the confirmation link, the page after the click, the mail with the report (or the failure mail), sometimes the unsubscribe page and an expired report link. What they do: confirm, understand that the scan started, open the report, withdraw consent. What the site gains: the tailor's shop does not disappear at the moment of the click; trust in a mail that is plainly transactional. Constraints: mails are transactional (no offer, no price, no sales CTA), tables and inline styles, 600 px, readable in dark mode, text part; pages are inline CSS, no JS, no external resources.

## Candidate ideas

### A. Szew zamknięty, szew przerwany
Sentence: "Każda wiadomość to mała metka ze ściegiem, a ścieg mówi, jak poszło: zamknięty szew przy potwierdzeniu i raporcie, szew urwany przy błędzie i wygasłym linku."
Source: the site's thread and seam language and the report's tag; the module's subject is states (success, failure, expired). Where: pages carry the tag (paper card, dashed stitch frame, string), mails carry the card (table, dashed frame). One detail: the seam under the heading. On a page with a good outcome it is sewn left to right once (transform only) and closes; with a bad outcome it is sewn to about 55% and stops, the rest stays as unsewn marks. In mails the same seam is static (full or interrupted).
Refuses: stamp, icons of check and cross, illustrations, tilt and swing, any mail image.

### B. Karta z numerem
Sentence: "Numer karty przymiarki przechodzi z maila potwierdzającego przez stronę do raportu."
Source: report card number. Needs a number in the mail and on the confirm page that the worker does not own today (report numbers are made by the generator), a new fact and a backend change. Rejected on scope and facts.

### C. Stempel statusu
Sentence: "Pieczątka Potwierdzone, Gotowe, Wypisane."
Source: order slip stamp. The earlier critic of /skaner/ cut the stamp (it says more than the truth, the scan starts only after the confirmation). A second graphic mechanic for plain pages.

## Critic table (inline, Opus rubric, 8 = world test)

| Idea | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 world | Total | Verdict |
| A. Szew | 8 | 8 | 9 | 7 | 8 | 9 | 8 | 9 | 66 | GO |
| B. Karta z numerem | 7 | 6 | 7 | 5 | 6 | 6 | 4 | 8 | 49 | REJECT (new fact, backend) |
| C. Stempel | 5 | 6 | 6 | 4 | 5 | 7 | 4 | 4 | 41 | REJECT (second mechanic, overclaims) |
Sharpen A: one detail only (the seam), no swing and no tilt of the tag, the stub with the count only in the report mail, mail states by the seam and the heading, never by colour alone.

## Chosen idea

A, Szew zamknięty, szew przerwany (auto mode, recommended by the table).

## Content (PL, voice of /skaner/ and the report, gender neutral)

Pages (h1 max 6 words, first sentence max 20 words):
| State | h1 | Text | Actions |
| confirm ok | Adres potwierdzony. | Skan ruszył. Raport przyjdzie mailem w ciągu kilkunastu minut. Link do raportu będzie ważny 30 dni. | Wróć na stronę |
| confirm bad or expired | Link jest nieważny. | Ten link jest nieprawidłowy albo wygasł. Wypełnij formularz skanera jeszcze raz. Link z maila jest ważny 24 godziny. | Wróć do formularza, Wróć na stronę |
| unsubscribe ok | Zgoda wycofana. | Nie będziesz dostawać wiadomości marketingowych. | Wróć na stronę |
| unsubscribe bad | Link do wypisu jest nieważny. | Ten link jest nieprawidłowy. Zgodę możesz wycofać, pisząc na contact@adrianturbinski.pl. | Wróć na stronę |
| report expired (410) | Raport wygasł. | Link do raportu jest ważny 30 dni. Wypełnij formularz skanera jeszcze raz. | Wróć do formularza, Wróć na stronę |
| report unknown (404) | Nie ma takiego raportu. | Ten link jest nieprawidłowy albo raport wygasł. Link do raportu jest ważny 30 dni. | Wróć na stronę |
Footer on pages: "Administrator danych: Adrian Turbiński, Adrian Turbiński Software, Wrocław, contact@adrianturbinski.pl. Polityka prywatności."

Mails (subjects unchanged):
| Mail | h1 | Body | Button |
| Potwierdzenie | Potwierdź adres e-mail. | Ktoś, najpewniej Ty, poprosił o skan dostępności strony {domain}. Potwierdź adres e-mail, a skan ruszy. Link jest ważny 24 godziny. Jeśli to nie Ty, zignoruj tę wiadomość, nic się nie wydarzy. | Potwierdź adres e-mail |
| Raport | Raport jest gotowy. | Skan strony {domain} został zakończony. Stub: {N} potwierdzonych błędów (plural), zmierzone, nie oszacowane. Potwierdzone błędy: N, przeskanowane strony: M. Link jest ważny 30 dni, do DD.MM.RRRR. Disclaimer from consent.json. | Otwórz raport |
| Porażka | Skan się nie udał. | Nie udało się przeskanować strony {domain}. Strona mogła być chwilowo niedostępna, blokować automatyczne odwiedziny albo odpowiadać zbyt wolno. Możesz spróbować ponownie później. | none |
Footer in mails: controller line, privacy policy, withdraw link (report mail with marketing consent only). Preheaders: confirm "Link jest ważny 24 godziny.", report "Link do raportu jest ważny 30 dni.", failure "Możesz spróbować ponownie później."
Phone keeps: everything (single column, 600 px max, the button is full width at 390).
Zero commercial content in the two main mails: no offer words, no price, no CTA other than the action of the message.
