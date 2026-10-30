# Scanner contract

Form on adrianturbinski.pl/skaner/ posts JSON to https://api.adrianturbinski.pl/scan:
{ url, email, terms: true, marketing: boolean, lang: "pl", consentVersion, consentHash, turnstile, page, startedAt, fillMs }

consentHash = SHA-256 (hex) of JSON.stringify(consent) for the imported consent.json; the worker hashes its own copy and answers 409 on a mismatch, like for consentVersion.
fillMs = milliseconds from the first interaction to submit, measured with performance.now() (monotonic). The worker drops the request quietly (202, nothing stored) only when 0 <= fillMs < 2500. Without a valid fillMs it falls back to startedAt against the server clock, and a negative difference is accepted.

Legal texts live in src/scanner/consent.json: { version, pl: { terms, marketing, info, disclaimer } }.
The worker stores the exact text shown and its SHA-256 next to the consent record.

Flow: POST /scan -> 202, double opt-in mail -> GET /scan/confirm?t=<token> shows a page with a button -> POST /scan/confirm (field t) -> job queued.

Scanner (homeserver) pulls jobs with Authorization: Bearer <SCANNER_TOKEN>:
GET /scan/jobs/next -> 200 { id, url, lang } or 204
POST /scan/jobs/<id>/result -> body { status: "done" | "failed", error?, summary, html }
summary = { pages, violations, critical, serious, moderate, minor, incomplete, engine }

Worker stores html in Workers KV under reports/<reportKey>.html, serves it at GET /r/<reportKey>
(noindex, 30 days), mails the link and notifies Telegram.
The result is stored as done only after the report mail was accepted; a mail failure answers 502 and the job stays running, so the scanner can post the result again.
When the daily Cloudflare usage guard (80 percent of the free limits) blocks storing the report, the result answers 422 { ok: false, error: "capacity" }, the scan is marked failed with error "capacity" and the user gets the failure mail. POST /scan answers 503 { ok: false, error: "capacity" } under the same guard.
