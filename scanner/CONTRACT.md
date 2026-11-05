# Scanner contract

Form on adrianturbinski.pl/skaner/ posts JSON to https://api.adrianturbinski.pl/scan:
{ url, email, terms: true, marketing: boolean, lang: "pl", consentVersion, consentHash, turnstile, page, startedAt, fillMs }

consentHash = SHA-256 (hex) of JSON.stringify(consent) for the imported consent.json; the worker hashes its own copy and answers 409 on a mismatch, like for consentVersion.
fillMs = milliseconds from the first interaction to submit, measured with performance.now() (monotonic). The worker drops the request quietly (202, nothing stored) only when 0 <= fillMs < 2500. Without a valid fillMs it falls back to startedAt against the server clock, and a negative difference is accepted.

Legal texts live in src/scanner/consent.json: { version, pl: { terms, marketing, info, disclaimer } }.
The worker stores the exact text shown and its SHA-256 next to the consent record.

Flow: POST /scan -> 202, double opt-in mail -> GET /scan/confirm?t=<token> shows a page with a button -> POST /scan/confirm (field t) -> job queued.

Scanner (homeserver) pulls jobs with Authorization: Bearer <SCANNER_TOKEN>:
GET /scan/jobs/next -> 200 { id, url, lang, maxPages? } or 204 (maxPages only for a full scan, capped at 30 by the scanner)
POST /scan/jobs/<id>/result -> body { status: "done" | "failed", error?, summary, html, pdfBytes? } (pdfBytes only after a successful pdf upload)
POST /scan/jobs/<id>/pdf -> raw application/pdf body, up to 6 MB, tagged PDF of the same report, sent before the result. Binary on purpose: decoding base64 in the Worker costs more CPU than its limit allows.
summary = { pages, violations, critical, serious, moderate, minor, incomplete, engine }

Worker stores html in Workers KV under reports/<reportKey>.html and the pdf under pdfs/<scanId>.pdf, serves them at GET /r/<reportKey> and GET /r/<reportKey>?format=pdf
(noindex, 30 days), mails the link and notifies Telegram.
The result is stored as done only after the report mail was accepted; a mail failure answers 502 and the job stays running, so the scanner can post the result again.
When the daily Cloudflare usage guard (80 percent of the free limits) blocks storing the report, the result answers 422 { ok: false, error: "capacity" }, the scan is marked failed with error "capacity" and the user gets the failure mail. POST /scan answers 503 { ok: false, error: "capacity" } under the same guard.

Full scan: GET /r/<reportKey>?pelny=1 shows a value bound to the domain and the requester's e-mail. POST /r/<reportKey>/pelny checks the TXT record _skaner.<domain> over DoH or https://<host>/.well-known/skaner-adrianturbinski.txt and queues a job with max_pages 30, at most one per domain per 7 days, without a new mail sequence. Up to 30 attempts per report.

Booking: GET /scan/book counts booking_click and answers 302 to the BOOKING_URL var, or to the contact section when it is not set.

Funnel: daily aggregate counters in the funnel table, no personal data, capped at 2000 per event per day, not counted by the usage meter so that report views stay read only for the guard.

Stats: GET /scan/stats with Authorization: Bearer <token>, the worker keeps SCAN_STATS_TOKEN_SHA256. Returns totals and byDay for 30 days, scan statuses and the last 20 scans without e-mail addresses.

Deploy order: wrangler d1 execute scans --remote --file migrations/2026-11-05-depth.sql, then wrangler deploy, then rebuild the scanner image. The old scanner keeps working with the new worker, and a new scanner on an old worker gets 404 on the pdf upload and removes the link from the report.
