# Module

## Brief
Page /skaner/: a free accessibility scan for a website. A visitor (owner of a shop or company site, often not technical) types a site address and an e-mail, ticks the required terms, and gets a report by e-mail. The page must make the order obvious, be honest that the automat finds only a part of the barriers, explain what is checked and what is not, mention the act without fines and without scaring, and lead to the paid audit. The site gains leads for the WCAG audit and proof that the owner practises what he sells. Theme from the owner: tailoring ("przymiarka strony u krawca kodu").

## Candidate ideas

### A. Przymiarka (the previous designer's concept, as built)
- Sentence: "Ta, na której wpisujesz adres, a krawiec wypełnia zlecenie i przybija pieczątkę."
- Source: the subject is a free measuring service; order slip is how a tailor starts any job.
- Where: order ticket beside the form that fills live with the client's host and today's date, stamped "Przyjęte do przymiarki" after send; tape measure under the address field counting "znaków miary"; paper pattern ("wykrój strony") with numbered chalk marks against the checklist; machine seam turning into a hand seam before the manual section; a thread linking the three steps.
- The moment: the ticket (and, arguably, the seam, the tape, the pattern and the thread, five moments).
- Refuses: nothing yet, it adds five small mechanics.

### B. Wykrój twojej strony
- Sentence: "Ta, na której twoją stronę rozkłada się na papierowym wykroju i znaczy kredą, co sprawdzam."
- Source: a scan reads a page, a pattern maker cuts a pattern from a body. The nine checks are nine zones of one page.
- Where: the hero is followed by one big paper pattern of a web page (desktop and phone) pinned to the cloth; the typed address labels the pattern; the form is a slip pinned on the pattern; chalk marks 1 to 9 are drawn in order as the visitor scrolls the pattern and each is tied to a line of the checklist.
- The moment: chalk marks drawn one after another on the pattern of the page.
- Refuses: ticket, tape, seam, stamp. Submit has no payoff beyond a message.

### C. Szew maszynowy, szew ręczny
- Sentence: "Ta, na której nić szyje maszyna, aż do miejsca, gdzie maszyna się kończy i zaczyna się ręka."
- Source: the honest limit of the product, automat finds part, a person finds the rest. The tailor's machine stitch versus hand stitch is exactly that.
- Where: a single thread runs down the left edge of the page, even machine stitches beside the form and the checklist, stitches loosen into hand stitches at "Czego automat nie sprawdzi" and end in a knot at the link to the audit.
- The moment: the stitch loses its regularity at the edge of what the automat can do.
- Refuses: ticket, tape, pattern, stamp. Form is a plain stitched sheet.

## Critic's table (Opus, 30.10)
A 41 (Frankenstein, five moments, stamp "Przyjęte" says more than the truth: scan starts only after the confirmation link), B 46 (second mechanic, hard on LCP), C 67. Recommended C.

## Chosen idea
C. "Szew maszynowy, szew ręczny", sharpened. Thread language is already the site's. The form sheet, its button and the three steps are machine stitched (even, red thread on chalk). The nine checks sit on rows of even machine stitch. Between "Co sprawdzam" and "Czego automat nie sprawdzi" a full width seam is sewn while the visitor scrolls (framer-motion useScroll, the engine the site already uses for Skew): stitches start even and fast and loosen into uneven hand stitches. The six manual areas sit on hand stitched rows. The one moment is that loosening, at the exact place where the automat ends.
KEEP: seam (rebuilt on framer-motion), stitched send button, dashed stitched frame of the form sheet (made even), the hero ruler and title, the paper and wool section rhythm, honest sentence in the hero.
CUT: order ticket with stamp (stamp promised acceptance before confirmation), tape measure under the address field, pattern board with chalk marks and its hover sync (hover only coupling, second illustration), the separate thread joining steps, handwritten hint with arrow, the five scroll driven CSS timelines (second mechanic), uppercase label "Jak to działa" (kicker).
ADD (needed by the brief): a real call to action in the hero (the form was below the fold at 390x844), step names borrowed from the WCAG page (Miara, Przymiarka, Oddanie), report link valid 30 days, the machine and hand notes at the seam.
Refuses: a second illustration, a second scroll mechanic, anything that moves the consent texts.

## Content
Heading: "Darmowy skan dostępności." (3 words)
First sentence (13 words): "Wpisz adres strony, a po kilkunastu minutach dostaniesz mailem raport z barierami dostępności."
Second paragraph (unchanged): "W raporcie jest do 10 podstron w wersji na komputer i na telefon: błędy WCAG 2.1 i 2.2 z przykładami poprawek, po polsku. Uczciwie: automat znajduje tylko część barier, reszta wymaga sprawdzenia ręcznego."
Hero CTA: "Zleć skan" (anchor to the form, same label as the submit button, one action, one label).
Form section title: "Zleć skan." Steps title: "Jak to działa."
Steps: "Miara." Podajesz adres strony i e-mail. / "Przymiarka." Klikasz link potwierdzający z maila. Bez tego skan nie rusza. / "Oddanie." Po kilkunastu minutach dostajesz link do raportu. Link jest ważny 30 dni.
Checks title "Co sprawdzam." side "Automat przechodzi po stronie i zgłasza to, co da się zmierzyć." Nine items unchanged.
Seam notes (decorative): machine side "tu szyje automat", hand side "dalej szyję ręcznie, w audycie".
Manual title "Czego automat nie sprawdzi." side "Takie rzeczy wymagają człowieka z klawiaturą i czytnikiem ekranu." six items unchanged.
Law section unchanged (texts, no fines).
States: loading "Wysyłam…", success "Sprawdź skrzynkę i kliknij link potwierdzający. Skan ruszy po potwierdzeniu, raport przyjdzie w ciągu kilkunastu minut.", errors, rate limits, turnstile, version, failed all unchanged from scan-form.js. Empty state: fields empty with labels and hints (no tape, no ticket).
Phone keeps: everything; seam gets fewer, larger stitches, notes sit under the seam.

## Hero detail added in build
The hero aside is a hanging tag with one real entry in the report format (level, WCAG criterion, before and after code), taken from scanner/sample-report.html. Code lines use the blog monospace stack. It is the product artefact, not a second moment. The seam hand note reads "dalej tylko ręcznie".
