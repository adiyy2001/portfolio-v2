# Accessibility scanner worker

Standalone service for adrianturbinski.pl/skaner. It polls the API for jobs, scans the site with Chromium and axe-core, and posts a self contained HTML report back. The job contract is in `CONTRACT.md`.

## Run locally

Node 22 or newer (24 recommended).

```sh
cd scanner
npm ci
npx playwright install chromium
cp .env.example .env
set -a; . ./.env; set +a
node src/main.js
```

| Variable         | Default                          | Meaning                                                                                  |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `SCANNER_TOKEN`  | required                         | Bearer token for `/scan/jobs/*`                                                          |
| `SCAN_API`       | `https://api.adrianturbinski.pl` | API base URL                                                                             |
| `SCAN_PROXY`     | empty                            | Egress proxy for the browser and HTTP fetches, for example `http://smokescreen:4750`     |
| `SCAN_MAX_PAGES` | `10`                             | Page limit per scan, home page included                                                  |
| `CONSENT_FILE`   | auto                             | Path to `consent.json`; defaults to `./consent.json`, then `../src/scanner/consent.json` |

`SCAN_ALLOW_PRIVATE=1` lets the scanner reach loopback and private addresses and any port. It exists only for the tests. Never set it in `.env`.

## Test

```sh
npm test
```

Unit tests cover SSRF validation, robots.txt, page selection, WCAG and EN 301 549 mapping and report escaping. Integration tests start a local fixture site, run a full scan, open the report in Chromium and require zero axe violations, and run the worker loop against a fake API. `SAMPLE_REPORT=/path/report.html npm test` also writes the fixture report to a file.

## Deploy on the homeserver

The image build needs the whole repository, because the disclaimer text is copied from `src/scanner/consent.json` at build time.

```sh
git pull
cd scanner
cp .env.example .env   # first time only, then set SCANNER_TOKEN
docker compose up -d --build
docker compose logs -f scanner
```

Compose runs three services. `scanner` sits only on the internal network `scan-internal` and reaches the internet through `smokescreen` (Stripe smokescreen, private and reserved ranges denied, the rest allowed). `dns` (CoreDNS) is the resolver for the scanner, because an internal Docker network has no upstream DNS. The scanner container is read only, runs as `pwuser` with the Playwright seccomp profile, `init: true`, 2 GB memory, 1.5 CPUs and 512 PIDs.

The subnet `172.29.250.0/24` is fixed so that the scanner can use the resolver by address. Change it in `docker-compose.yml` if it collides with another network.

## How a scan works

1. The URL is validated: http or https, ports 80 and 443, every resolved address must be public. The same check runs for each browser request and each subpage.
2. `robots.txt` is read (RFC 9309, agent `AdrianTurbinskiA11yScanner`, 5xx blocks the scan, 4xx allows everything), then sitemaps (index files supported, up to 2000 URLs, 10 s).
3. Pages are chosen: home page, one page per path template (numeric and digit slugs collapse to `*`), contact, terms, accessibility declaration and cart first, then navigation and footer links, then a seeded random sample from the sitemap.
4. Each page runs in a Desktop Chrome and an iPhone 13 context. The home page gets two axe passes, before and after accepting the cookie banner. The other pages are checked after consent.
5. Extra checks: reflow at 320 px, keyboard walk on the home page, accessibility declaration markers.
6. The report is rendered as one HTML file and posted with a summary.

`summary.violations` counts confirmed findings, where one finding is one axe rule failing on one page.

## Limits

The scan stops at 6 minutes in total and 60 seconds per page. Screenshots are limited to eight per report. Iframe content is checked by axe but not screenshotted. Without a proxy the browser resolves DNS on its own, so the in-code check is not safe against DNS rebinding on its own; production always runs behind smokescreen.
