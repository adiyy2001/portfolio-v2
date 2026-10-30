# Module

## Brief

Who: an owner or developer of a small shop or company site who ordered a free scan on /skaner/ and opens a link from a mail on a phone or laptop, often forwards it, sometimes prints it. What they do: understand in one screen what was found (counts, not a grade), see the three first fixes with before and after code, find what the machine could not judge, and reach the legal note and the contact. What the site gains: the deliverable behaves like the shop it came from (a tailor's fitting card) and is useful without a sales pitch. Constraints: one standalone HTML file, no JS, no external resources, CSP default-src none, inline CSS, SVG inline, PL, transactional (no price, no offer), no score, no words zgodny or niezgodny, disclaimer from consent.json unchanged, third-party strings escaped.

## Candidate ideas

### A. Karta przymiarki (starting point, previous designer's concept, refined)

Sentence: "Raport przychodzi jak karta przymiarki krawca: metka na sznurku, miara z naniesionymi centymetrami błędów, poprawki jako przypięte skrawki materiału." Source: the site's own ticket "Zlecenie krawieckie" and tape on /skaner/; the report is literally the card the form promised. Where: the masthead is the tag (string, notched edge, dashed stitch, card number, client, date, dimensions), the summary is the chalk tally and the tape with severity lengths on one sheet, fixes are Przed/Po swatches. The one moment: the tag with the chalk tally and the severity tape as the first viewport. Refuses: a score, a gauge, a traffic light, a donut chart.

### B. Miara: the report is one long measuring tape

Sentence: "Cały raport leży na miarce krawieckiej: centymetry na marginesie, sekcje na kolejnych centymetrach." Source: the tape/ruler under every hero on the site. Where: a rail of cm ticks along the left edge of the whole document, sections hung on marks (sticky rail via CSS, printed too). The one moment: the rail with the section marks. Refuses: cards, stamp, tags. Risk: a ruler on 8 screens of dense text is decoration, collides with reading on 320 px, the info it carries (section number) is already in the toc.

### C. Zlecenie poprawek: the report is an alteration order

Sentence: "Raport to zlecenie poprawek: lista, co przeszyć, w jakiej kolejności." Source: tailors' order slips. Where: every finding a numbered slip with stitched Przed and Po cloth. The one moment: the three top fixes as slips pinned in a stack. Refuses: summary theatre. Risk: the slips repeat the site's identical cards pattern, the summary and the legal blocks have no home, order slip is the /skaner/ ticket again (no new moment).

## Critic table

| Idea | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 world | Total | Verdict |
| A. Karta przymiarki | 8 | 8 | 9 | 7 | 7 | 9 | 8 | 9 | 65 | GO |
| B. Miara | 7 | 5 | 7 | 4 | 5 | 6 | 5 | 6 | 45 | REJECT (ruler along 8 screens of text is decoration, steals width at 320 px, repeats the toc numbers) |
| C. Zlecenie poprawek | 7 | 6 | 7 | 5 | 4 | 8 | 4 | 7 | 48 | REJECT (second /skaner/ ticket, no home for summary and legal part) |
Sharpen: (1) one moment, not two: the count is chalked on the card stub, the tape is its measure, both in the first viewport at 1440 and 390; (2) slimmer tag, one sentence for dimensions, scope list demoted and the host appears once; (3) print: wool becomes white with a thread coloured frame, no tilt, no shadow, swatches break-inside avoid.

## Chosen idea

A, Karta przymiarki. One moment: the fitting card hangs on its string with the stub torn along a perforation, and the stub carries the finding count chalked in big numerals. Everything else is the sheet behind it: stitched section seams, one measuring tape for severity, Przed/Po cloth swatches. Built from the site's own ticket (notched stub, dashed stitch, string), tape and seam, not from new motifs.
Decisions beyond the critic: (a) the page switches from warm #f6f3ee to the site's cool chalk/paper tones, #f6f3ee stays only as print paper and card stock for print; (b) amber is not on the site (grep of src, static is empty), the report drops it, measured numerals get a thread-red dotted underline; (c) motion: two CSS-only transforms inside prefers-reduced-motion: no-preference (card settles on its string, tape segments draw once), never in print.

## Content

Heading: h1 is the host of the scanned site (one line, serif). Eyebrow: "Raport ze skanu dostępności". Card line: "Karta przymiarki nr 20261030-88DB".
First sentence (summary lead, 16 words max when there are findings): "Znaleziono 11 potwierdzonych błędów na 7 podstronach, w tym 3 krytycznych." No findings: "Skan nie znalazł potwierdzonych błędów wykrywalnych automatycznie na 7 podstronach."
Card labels: Adres startowy, Data skanu, Wymiary ("komputer 1280 x 800 i telefon (iPhone 13), 7 podstron"), Silnik ("axe-core 4.14.0"). The row "Klient" is removed (h1 is the client).
Stub: chalked count, caption "potwierdzonych błędów" (plural form), hand note "zmierzone, nie oszacowane", second line "na 7 podstronach" is not added (the lead says it).
Scope heading: "Zakres: sprawdzone podstrony". Row: "/kontakt (Kontakt): komputer, telefon". Error row: "/x: pominięto, <powód>".
Section titles unchanged: Podsumowanie, Trzy najważniejsze problemy, Pełna lista błędów według kryteriów, Do sprawdzenia ręcznie, Zalecenia, Deklaracja dostępności, Czego ten skan nie sprawdził, Kontekst prawny. Hand notes unchanged (aria-hidden): "trzy poprawki krawieckie, najpierw te", "szyte ręcznie, bez automatu", "tu miara nie sięga", "zmierzone, nie oszacowane".
Voice: komputer and telefon replace desktop and mobile in running text (the site says "w wersji na komputer i na telefon"). Views column: "komputer, telefon".
States: no findings (calm summary, tape and weights hidden), no top problems, no manual items "Brak pozycji.", no recommendations, no declaration, no keyboard result, page skipped. All exist in the generator and keep their text.
CTA: none. Contact: one neutral sentence in the footer "Jeśli chcesz omówić wyniki, napisz: contact@adrianturbinski.pl". No price, no offer, no score.
Phone keeps: the card with the stub and count, the tape (segments keep numbers), all sections, tables scroll inside a focusable region with 25rem min width, Przed/Po stack.
