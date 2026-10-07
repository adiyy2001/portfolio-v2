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

- Choose the GoatCounter code and add it to the site (Adrian creates the account).
- Lighthouse round on a real article after the first publish.
- Domain: the site moves to `https://adrianturbinski.pl/` (registered 2026-10-03, mailbox `contact@adrianturbinski.pl`), so blog canonical URLs are final from the first article. The `/portfolio-v2` prefix is gone. Privacy policy: `/en/privacy/`.
