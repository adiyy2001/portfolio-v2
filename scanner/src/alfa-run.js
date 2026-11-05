import { Worker } from 'node:worker_threads';
import { Playwright } from '@siteimprove/alfa-playwright';
import { mapCriterion } from './mapping.js';

export const ALFA_PAGE_LIMIT = 3;
const MAX_SNAPSHOT_CHARS = 8 * 1024 * 1024;
const MAX_SNAPSHOT_ELEMENTS = 20_000;
const SNAPSHOT_TIMEOUT_MS = 15 * 1000;
const AUDIT_TIMEOUT_MS = 45 * 1000;
const AUDIT_HEAP_MB = 700;

export function snapshotWithin(page, timeoutMs = SNAPSHOT_TIMEOUT_MS, take = snapshotForAlfa) {
  let timer;
  const expired = new Promise(resolve => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([take(page).catch(() => null), expired]).finally(() => clearTimeout(timer));
}

export async function snapshotForAlfa(page) {
  const elements = await page.evaluate(() => document.getElementsByTagName('*').length);
  if (elements > MAX_SNAPSHOT_ELEMENTS) return null;
  const handle = await page.evaluateHandle(() => window.document);
  try {
    const alfaPage = await Playwright.toPage(handle);
    const snapshot = JSON.stringify(alfaPage.toJSON());
    return snapshot.length > MAX_SNAPSHOT_CHARS ? null : snapshot;
  } finally {
    await handle.dispose().catch(() => {});
  }
}

export function auditSnapshot(snapshot, { timeoutMs = AUDIT_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./alfa-worker.js', import.meta.url), {
      workerData: { snapshot },
      resourceLimits: { maxOldGenerationSizeMb: AUDIT_HEAP_MB },
    });
    const timer = setTimeout(() => {
      worker.terminate().catch(() => {});
      reject(new Error('alfa-timeout'));
    }, timeoutMs);
    const finish = settle => value => {
      clearTimeout(timer);
      settle(value);
    };
    worker.once('message', finish(resolve));
    worker.once('error', finish(reject));
  });
}

export async function runAlfaAudits(snapshots, { deadline, audit = auditSnapshot }) {
  const pages = [];
  for (const { url, snapshot } of snapshots) {
    if (!snapshot) {
      pages.push({ url, status: 'too-large', findings: [] });
    } else if (Date.now() >= deadline) {
      pages.push({ url, status: 'out-of-time', findings: [] });
    } else {
      try {
        pages.push({ url, status: 'ok', findings: await audit(snapshot) });
      } catch {
        pages.push({ url, status: 'failed', findings: [] });
      }
    }
  }
  return pages;
}

export function summarizeAlfa(pages, model) {
  const axeCriteriaByPage = new Map();
  for (const entry of model.errors) {
    for (const page of entry.pages) {
      if (!axeCriteriaByPage.has(page.url)) axeCriteriaByPage.set(page.url, new Set());
      for (const criterion of entry.criteria) axeCriteriaByPage.get(page.url).add(criterion.id);
    }
  }
  const byCriterion = new Map();
  for (const page of pages) {
    for (const finding of page.findings) {
      for (const id of finding.criteria) {
        const row = byCriterion.get(id) ?? {
          criterion: mapCriterion(id),
          occurrences: 0,
          pages: new Set(),
          confirmedPages: new Set(),
          rules: new Set(),
        };
        row.occurrences += finding.count;
        row.pages.add(page.url);
        row.rules.add(finding.rule);
        if (axeCriteriaByPage.get(page.url)?.has(id)) row.confirmedPages.add(page.url);
        byCriterion.set(id, row);
      }
    }
  }
  const rows = [...byCriterion.values()]
    .map(row => ({
      criterion: row.criterion,
      occurrences: row.occurrences,
      pages: row.pages.size,
      confirmed: row.confirmedPages.size > 0,
      rules: [...row.rules].sort(),
    }))
    .sort((a, b) => Number(b.confirmed) - Number(a.confirmed) || b.occurrences - a.occurrences);
  return {
    checked: pages.filter(page => page.status === 'ok').length,
    skipped: pages.filter(page => page.status !== 'ok').length,
    rows,
    confirmedIds: new Set(rows.filter(row => row.confirmed).map(row => row.criterion.id)),
  };
}
