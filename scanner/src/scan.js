import { aggregate } from './aggregate.js';
import { captureScreenshots, createScreenshotBudget, runAxe } from './axe-run.js';
import { createViewContext, launchBrowser } from './browser.js';
import { GOTO_TIMEOUT_MS } from './config.js';
import { acceptConsent } from './consent.js';
import { checkDeclaration, checkKeyboard, checkReflow } from './extras.js';
import { createFetcher } from './fetcher.js';
import { canonicalPage, isSameSite, selectPages } from './pages.js';
import { pathWithQuery, policyFromResponse } from './robots.js';
import { buildReport } from './report/index.js';
import { collectSitemapUrls } from './sitemap.js';
import { createUrlValidator } from './ssrf.js';
import { waitForStableDom } from './stabilize.js';

export class ScanFailure extends Error {}

class NavigationBlocked extends Error {
  constructor(block) {
    super(`navigation-blocked:${block.kind}`);
    this.block = block;
  }
}

const ROBOTS_DENIED_MESSAGE = 'Plik robots.txt nie pozwala skanerowi odwiedzić tej strony.';

function withTimeout(promise, ms, onTimeout) {
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => {
      Promise.resolve(onTimeout?.()).catch(() => {});
      reject(new Error('page-timeout'));
    }, ms);
  });
  promise.catch(() => {});
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

function normalizeJobUrl(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return null;
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`;
}

async function extractNavLinks(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('nav a[href], header a[href], footer a[href]')].map(anchor => ({
      url: anchor.href,
      text: (anchor.innerText || anchor.getAttribute('aria-label') || anchor.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 120),
    })),
  );
}

export async function runScan(job, config, { log = () => {} } = {}) {
  const startedAt = new Date();
  const deadline = startedAt.getTime() + config.taskLimitMs;
  const validator = createUrlValidator({ allowPrivate: config.allowPrivate });
  const homeInput = normalizeJobUrl(job.url);
  if (!homeInput) throw new ScanFailure('Brak adresu strony.');
  const homeVerdict = await validator.check(homeInput);
  if (!homeVerdict.ok) {
    throw new ScanFailure(`Adres nie może zostać przeskanowany (${homeVerdict.reason}).`);
  }
  const homeUrl = homeVerdict.url.href;

  const fetcher = await createFetcher({ proxy: config.proxy, validator });
  let browser;
  try {
    const policies = new Map();
    const policyFor = url => {
      const origin = new URL(url).origin;
      if (!policies.has(origin)) {
        policies.set(
          origin,
          fetcher
            .fetchText(new URL('/robots.txt', origin).href)
            .catch(() => null)
            .then(response => policyFromResponse(response)),
        );
      }
      return policies.get(origin);
    };

    const policy = await policyFor(homeUrl);
    if (!policy.isAllowed(pathWithQuery(homeUrl))) {
      throw new ScanFailure(
        policy.unreachable
          ? 'Nie udało się odczytać pliku robots.txt (błąd serwera), więc skan został pominięty.'
          : ROBOTS_DENIED_MESSAGE,
      );
    }

    let siteRoot = homeUrl;
    const navigationGuard = async url => {
      if (!isSameSite(url, siteRoot)) return { kind: 'offsite', host: new URL(url).hostname };
      const targetPolicy = await policyFor(url);
      return targetPolicy.isAllowed(pathWithQuery(url)) ? null : { kind: 'robots' };
    };

    browser = await launchBrowser({ proxy: config.proxy });
    const scaler = await browser.newPage();
    const contexts = {
      desktop: await createViewContext(browser, 'desktop', validator, navigationGuard),
      mobile: await createViewContext(browser, 'mobile', validator, navigationGuard),
    };
    const budget = createScreenshotBudget();
    const records = [];
    const notes = [];
    const extras = { consent: null, keyboard: null, declaration: null };
    const sitemapPromise = (async () => {
      const roots = policy.sitemaps.length
        ? policy.sitemaps
        : [new URL('/sitemap.xml', homeUrl).href];
      return collectSitemapUrls(roots, {
        fetchText: fetcher.fetchText,
        isSameSite: loc => isSameSite(loc, homeUrl),
      }).catch(() => []);
    })();

    const openDeclaration = async (viewName, url, ids) => {
      if (!isSameSite(url, siteRoot) || (await navigationGuard(url))) return null;
      const page = await contexts[viewName].newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: GOTO_TIMEOUT_MS });
        await waitForStableDom(page, { maxMs: 2000 });
        return await page.evaluate(
          list => list.map(id => ({ id, present: !!document.getElementById(id) })),
          ids,
        );
      } catch {
        return null;
      } finally {
        await page.close().catch(() => {});
      }
    };

    const scanOne = async (viewName, url, isHome) => {
      const context = contexts[viewName];
      const record = { url, view: viewName, passes: [], error: null, status: null };
      const page = await context.newPage();
      const remaining = Math.max(deadline - Date.now(), 5000);
      const work = (async () => {
        const resolved = await fetcher.resolveRedirects(url, { guard: navigationGuard });
        if (resolved.block) throw new NavigationBlocked(resolved.block);
        let response;
        try {
          response = await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: GOTO_TIMEOUT_MS,
          });
        } catch (error) {
          const block = context.navigationBlocks.get(page);
          if (block) throw new NavigationBlocked(block);
          throw error;
        }
        const landed = await navigationGuard(page.url());
        if (landed) throw new NavigationBlocked(landed);
        record.status = response?.status() ?? null;
        if (record.status !== null && record.status >= 400)
          throw new Error(`HTTP ${record.status}`);
        record.finalUrl = page.url();
        await waitForStableDom(page);
        const collect = async phase => {
          const result = await runAxe(page);
          record.title = result.title;
          record.engineVersion = result.engineVersion;
          record.passes.push({
            phase,
            violations: result.violations,
            incomplete: result.incomplete,
          });
          if (viewName === 'desktop') {
            await captureScreenshots(page, result.violations, budget, scaler, url);
          }
        };
        if (isHome) {
          record.navLinks = await extractNavLinks(page).catch(() => []);
          await collect('before-consent');
          const consent = await acceptConsent(page);
          record.consent = consent;
          if (consent.accepted) await collect('after-consent');
          if (viewName === 'desktop') {
            record.keyboard = await checkKeyboard(page).catch(() => null);
            record.declaration = await checkDeclaration(page, {
              open: (target, ids) => openDeclaration('desktop', target, ids),
            }).catch(() => null);
          }
        } else {
          await collect('after-consent');
        }
        if (viewName === 'desktop') record.reflow = await checkReflow(page).catch(() => null);
      })();
      try {
        await withTimeout(work, Math.min(config.pageLimitMs, remaining), () => page.close());
      } catch (error) {
        if (error instanceof NavigationBlocked) {
          if (error.block.kind === 'robots') record.skipped = 'robots';
          else if (error.block.kind === 'offsite') {
            record.offsiteHost = error.block.host;
            record.error = 'przekierowanie poza domenę';
          } else record.error = 'nawigacja zablokowana';
        } else {
          record.error =
            error.message === 'page-timeout' ? 'przekroczono limit czasu strony' : error.message;
        }
      } finally {
        await page.close().catch(() => {});
      }
      records.push(record);
      log(`scanned ${viewName} ${url} ${record.error ?? record.skipped ?? 'ok'}`);
      return record;
    };

    const [desktopHome, mobileHome] = await Promise.all([
      scanOne('desktop', homeUrl, true),
      scanOne('mobile', homeUrl, true),
    ]);
    const foreign = [desktopHome, mobileHome].find(record => record.offsiteHost);
    if (foreign) {
      throw new ScanFailure(
        `Strona przekierowuje na inną domenę (${foreign.offsiteHost}). Zleć skan tej domeny.`,
      );
    }
    if (desktopHome.skipped || mobileHome.skipped) throw new ScanFailure(ROBOTS_DENIED_MESSAGE);
    const primary = desktopHome.error ? mobileHome : desktopHome;
    if (desktopHome.error && mobileHome.error) {
      throw new ScanFailure(`Nie udało się otworzyć strony głównej (${desktopHome.error}).`);
    }
    siteRoot =
      primary.finalUrl && isSameSite(primary.finalUrl, homeUrl) ? primary.finalUrl : homeUrl;
    extras.consent = primary.consent ?? null;
    extras.keyboard = desktopHome.keyboard ?? null;
    extras.declaration = desktopHome.declaration ?? null;

    const sitemapUrls = await sitemapPromise;
    const candidateHosts = new Set();
    for (const link of [...(primary.navLinks ?? []), ...sitemapUrls.map(url => ({ url }))]) {
      const page = canonicalPage(link.url, siteRoot);
      if (page) candidateHosts.add(new URL(page).origin);
    }
    const originPolicies = new Map();
    for (const origin of candidateHosts) {
      if ((await validator.check(origin)).ok) originPolicies.set(origin, await policyFor(origin));
    }
    const pages = selectPages({
      home: siteRoot,
      navLinks: primary.navLinks ?? [],
      sitemapUrls,
      seed: job.id ?? siteRoot,
      maxPages: config.maxPages,
      isAllowed: url => originPolicies.get(new URL(url).origin)?.isAllowed(pathWithQuery(url)),
    });
    const subpages = pages.slice(1);

    const runView = async viewName => {
      for (const url of subpages) {
        if (Date.now() + 15_000 > deadline) {
          notes.push('Skan zatrzymał się na limicie czasu, część podstron została pominięta.');
          return;
        }
        await scanOne(viewName, url, false);
      }
    };
    await Promise.all([runView('desktop'), runView('mobile')]);

    const model = aggregate(records, budget.items);
    const engineVersion = records.find(record => record.engineVersion)?.engineVersion ?? '';
    const pageSummaries = pages.map(url => {
      const byView = view => records.find(record => record.url === url && record.view === view);
      const desktop = byView('desktop');
      const mobile = byView('mobile');
      return {
        url,
        title: desktop?.title || mobile?.title || '',
        desktop: desktop ? !desktop.error && !desktop.skipped : false,
        mobile: mobile ? !mobile.error && !mobile.skipped : false,
        error: desktop?.error || mobile?.error || null,
        skipped: desktop?.skipped || mobile?.skipped || null,
        reflow: desktop?.reflow ?? null,
      };
    });
    const html = await buildReport({
      model,
      host: new URL(siteRoot).hostname,
      siteUrl: siteRoot,
      generatedAt: new Date(),
      engineVersion,
      pages: pageSummaries,
      extras,
      notes: [...new Set(notes)],
      blocked: [...contexts.desktop.blockedRequests, ...contexts.mobile.blockedRequests].length,
      consentFile: config.consentFile,
    });
    const summary = {
      pages: pageSummaries.filter(page => page.desktop || page.mobile).length,
      violations: model.totals.findings,
      critical: model.totals.critical,
      serious: model.totals.serious,
      moderate: model.totals.moderate,
      minor: model.totals.minor,
      incomplete: model.totals.incomplete,
      engine: `axe-core ${engineVersion}`,
    };
    return { status: 'done', summary, html, durationMs: Date.now() - startedAt.getTime() };
  } finally {
    await browser?.close().catch(() => {});
    await fetcher.dispose().catch(() => {});
  }
}
