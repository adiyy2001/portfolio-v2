# Verify case-psipawer 09.11

Build: npx gatsby build exit 0. Lint: eslint . exit 0. check-seo-tags: 0 of 60 pages fail.
Gates (gates/GATES.md) against gates-before:
- Lighthouse PASS: mobile 97/100/96/69, desktop 100/100/96/69. SEO 69 only from is-crawlable, intentional noindex.
- axe: 0 violations. under24px 13 and h1 1 are counters equal to the site baseline (tailorcloth), host debt.
- JSON-LD PASS, stage 5/6 PASS, pixel contrast PASS.
- Console ERR_CONNECTION_REFUSED: host analytics on localhost, same in baseline.
- Legal interstitial: host cookie banner, same in baseline.
- SEO crawl og tags missing: Seo component drops og tags when noindex, intentional until consent.
Jury (sonnet): 7.56 PASS, world fit 8.2. Shots in shots/jury.
Baseline for the new route: gates-sibling = gates-before of /archive/tailorcloth/ rewritten to the new route, plus the intentional og row. Gate verdict PASS.
Independent reviewer (sonnet, fresh context) 09.11: PASS, no defects; sitemap and links verified in public/.
