# Blog

Status on 2026-10-03: the site side is built (blog pages, feed, SEO, navigation, counter hook) and waits for the first article from Command Center. The plan is shared with Command Center and lives in `~/root/side_projects/command-center/docs/content-engine.md` (generation, schedule, publishing, metrics). This file holds what the site needs. Keep both files consistent: a change here updates that file and the other way round.

## Decisions (Adrian, 2026-10-03)

- The blog on this site is the source of truth. Every article has its canonical URL here (`https://adrianturbinski.pl/blog/<slug>/`) and is cross-posted to dev.to with that canonical URL.
- Articles are published automatically by Command Center, without Adrian's confirmation. Full automation from the first run, with no approval and no draft stage. Quality gates and a one-tap rollback replace the approval (see the plan).
- Articles are in English, like the LinkedIn posts and the CV. Polish articles for the client edition are a later step, with no cross-posts.
- Cadence: one article a week, published on Tuesday at 8:00 Europe/Warsaw. Up to four derived LinkedIn items per article (posts and a carousel), with 5 LinkedIn posts a week in total. Only three places: this blog, dev.to and LinkedIn.
- Every text is cleaned with the humanizer before it is committed. Nothing is written by hand into `content/blog`.
- Adrian's global rules apply to articles and to code samples in them: no code comments, no em or en dashes.

## How the site does it (built 2026-10-03)

1. Content: one folder per article, `content/blog/<slug>/index.md` and `content/blog/<slug>/og.png` (1200 by 630). Frontmatter: `title`, `description`, `date` (ISO with offset), `slug` (lowercase words joined with hyphens, equal to the folder name), `tags`, `ogImage: ./og.png`, optional `updated` and `draft`. The canonical URL comes from the slug, so it is not stored. The build stops when a post breaks these rules (`blogProblems` in `gatsby-node.js`), so a bad article never deploys. A title must not contain `|`.
2. Pages: `createPages` in `gatsby-node.js` makes `/blog/` (`src/templates/blog.js`) and `/blog/<slug>/` (`src/templates/post.js`) only when at least one article exists. Until then the site has no blog pages, no links and no feed. Blog pages are English only, so the PL and EN switch is hidden there.
3. SEO: canonical, Open Graph `article` with the post image, `article:published_time` and tags, JSON-LD `BlogPosting` linked to the `Person` node, RSS 2.0 with full content at `/blog/rss.xml` and the `llms.txt` "Blog" section, both written in `onPostBuild`. The sitemap picks the pages up by itself.
4. Navigation: a "Blog" link in the header and the footer of both editions and the latest three articles on both recruiter pages (`src/components/writing.js`), all shown only when articles exist. Styles in `src/styles/blog.css`; the same `.prose` styles serve the privacy page.
5. Analytics: GoatCounter (no cookies). Set `siteMetadata.goatcounter` in `gatsby-config.js` to the site code; `gatsby-ssr.js` then adds the script and `gatsby-browser.js` counts client side navigation. Empty means no counter. When it is switched on, the privacy page sentence about a counter changes from "if" to a fact.
6. Safety: articles are written by a model, so the local remark plugin `plugins/gatsby-remark-safe-blog` drops every raw HTML node from blog posts and turns any link or image address that is not `https:`, `http:`, `mailto:`, `#` or a site path into `#`. It runs first in the remark plugin list, works on the parsed tree (so no regex can be fooled by tricky Markdown) and covers the page and the RSS feed. Command Center gates the same things before publishing, but this plugin is the boundary. Checked on 2026-10-03 with a probe article (raw `<img onerror>`, `<div onclick>`, `javascript:` links, autolinks and reference links): none reached the HTML or the feed.
7. Checked on 2026-10-03 with a test article (removed before the commit): clean build, axe with no violations and no horizontal scroll at 1440 and 375 on the blog list, the article, both recruiter pages and the privacy page.

## How Command Center publishes

- It writes only inside `content/blog/` through the GitHub API, with a fine-grained token limited to this repository. The article and its image go in one commit (Git Data API). The commit message follows the repo style (lowercase, one line, for example `publish the post on ...`).
- The deploy runs from the branch used by `.github/workflows/pages.yml` (`main` since 2026-10-07, when `rebrand-2026` was merged into it). The Command Center setting `content.branch` is `main` too.
- It waits for the page to answer HTTP 200 before cross-posting, so the canonical URL always resolves.
- Rollback removes the article folder with a commit and unpublishes the dev.to copy.
- Local clones: run `git pull` before starting any work on this branch, because article commits arrive from outside.

## Open items

- GoatCounter: done (code `adrianturbinski`, Command Center reads it with an API token).
- Lighthouse on a real article, done 2026-10-07 on `/blog/how-i-test-that-collaborative-edits-converge/`: mobile performance 97 to 98 (one cold first run gave 89), accessibility 100, best practices 96, SEO 100; desktop 100, 100, 96, 100. CLS 0.071 on mobile.
- Domain: the site moves to `https://adrianturbinski.pl/` (registered 2026-10-03, mailbox `contact@adrianturbinski.pl`), so blog canonical URLs are final from the first article. The `/portfolio-v2` prefix is gone. Privacy policy: `/en/privacy/`.

## Planned: two audiences (Adrian, 2026-10-26, not started)

Adrian decided the writing splits by reader. Build it later, on request.

- `/blog/` stays technical and in English, for recruiters and developers. Command Center keeps publishing there and cross-posting to dev.to; nothing changes in `content/blog`.
- A Polish section for clients, working name `/poradnik/`, with content in `content/poradnik/<slug>/index.md`. It is a separate folder so the Command Center publisher (`BLOG_DIR = "content/blog"`) never cross-posts these articles to dev.to. There is no RSS or dev.to for this section.
- Topics: sales, marketing and websites. Each article answers one question that clients ask most often, opens with the short answer, links to the matching service page and carries a `FAQPage` node in the JSON-LD.
- Header link by edition: "Poradnik" in the Polish client views, "Blog" in the recruiter and English views. The client home page and `/uslugi/` show the latest client articles.
- Design goes through the awwwards skill and keeps Lighthouse performance at the level of the service pages. The text goes through the humanizer and never mentions AI.

Question backlog, from the FAQ sections of Polish agency pages in October 2026. Prices and dates must be checked again before writing.

1. How much does a website cost in 2026, and what drives the price (pages, custom design, content, integrations)?
2. How much does it cost each year to keep a site running (domain, hosting, SSL, care plan), and how does a one-off payment compare with a subscription?
3. Who should build the site: a freelancer, an agency or a site builder such as Wix, and who owns the code?
4. How long does a site take, and what should the client prepare first (brief, content, photos)?
5. How to show up in Google Maps locally: the Google Business Profile, reviews and service pages.
6. Does the European Accessibility Act cover my company? The Polish law of 26 April 2024 (Dz.U. 2024 poz. 731) applies from 28 June 2025. Microenterprises that provide services are exempt: fewer than 10 people and turnover up to 2 million euro.
7. One-page site, landing page or company site: which one sells better?
8. How to tell whether the site brings clients: analytics, Search Console, calls and forms.
9. How much does a web application or an MVP cost, and how long does it take?
10. What to check in the contract: rights to the code, accounts in the client's name, terms of care.

### Planned: automatic Poradnik flow (Adrian, 2026-10-26, roadmap only)

After the section and the first two articles are live, Poradnik runs on its own, like the English blog:

- Schedule: the flow plans its own calendar, one article a week, and picks the next topic from the backlog above plus new questions it finds.
- Fresh material: before each article it collects the newest sources (Polish law and EU acts, Google Business Profile and Search changes, current agency price lists, news from the last weeks) and keeps only facts with a date and a URL. Prices and dates in older articles are rechecked and the article gets an `updated` date.
- Text: written in Polish, passed through the humanizer-plus skill, drift-checked against the sources, never mentions AI.
- Publishing: commits to `content/poradnik/` only, so the Command Center publisher never cross-posts it to dev.to. Same quality gates and one-tap rollback as the blog.
