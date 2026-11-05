import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const PDF_CHECK_LIMIT = 3;
export const MAX_PDF_BYTES = 15 * 1024 * 1024;
const VERAPDF_TIMEOUT_MS = 60 * 1000;
const VERAPDF_BUFFER_BYTES = 32 * 1024 * 1024;
const LISTED_RULES = 5;

export async function extractPdfLinks(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map(anchor => anchor.href)
      .filter(href => {
        try {
          return new URL(href).pathname.toLowerCase().endsWith('.pdf');
        } catch {
          return false;
        }
      }),
  );
}

export function selectPdfs(links, { isSameSite, limit = PDF_CHECK_LIMIT }) {
  const picked = new Map();
  for (const link of links) {
    const url = new URL(link);
    url.hash = '';
    if (isSameSite(url.href) && !picked.has(url.href)) picked.set(url.href, url.href);
  }
  return [...picked.values()].slice(0, limit);
}

export function parseVerapdfReport(stdout) {
  const report = JSON.parse(stdout)?.report;
  const job = report?.jobs?.[0];
  if (!job) return { status: 'failed' };
  if (job.taskException || job.taskResult?.some?.(task => task.exception)) {
    return { status: 'unreadable' };
  }
  const validation = Array.isArray(job.validationResult)
    ? job.validationResult[0]
    : job.validationResult;
  if (!validation?.details) return { status: 'unreadable' };
  const failed = (validation.details.ruleSummaries ?? []).filter(
    rule => rule.ruleStatus === 'FAILED',
  );
  return {
    status: 'checked',
    passed: validation.compliant === true,
    failedRules: validation.details.failedRules ?? failed.length,
    failedChecks: validation.details.failedChecks ?? 0,
    rules: failed
      .sort((a, b) => (b.failedChecks ?? 0) - (a.failedChecks ?? 0))
      .slice(0, LISTED_RULES)
      .map(rule => ({
        clause: rule.clause,
        description: String(rule.description ?? '').slice(0, 300),
        failedChecks: rule.failedChecks ?? 0,
      })),
  };
}

export function runVerapdf(path, command = 'verapdf') {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      ['--format', 'json', '--flavour', 'ua1', '--maxfailuresdisplayed', '1', path],
      {
        timeout: VERAPDF_TIMEOUT_MS,
        maxBuffer: VERAPDF_BUFFER_BYTES,
        env: { ...process.env, JAVA_TOOL_OPTIONS: '-Xmx384m' },
      },
      (error, stdout) => {
        if (stdout?.trim()) resolve(stdout);
        else reject(error ?? new Error('verapdf-empty'));
      },
    );
  });
}

export async function checkPdfs(
  urls,
  { fetchBytes, deadline, guard, validate = runVerapdf, command },
) {
  const results = [];
  const directory = await mkdtemp(join(tmpdir(), 'pdf-check-'));
  try {
    for (const url of urls) {
      if (Date.now() >= deadline) {
        results.push({ url, status: 'out-of-time' });
        continue;
      }
      const download = await fetchBytes(url, {
        maxBytes: MAX_PDF_BYTES,
        guard,
        deadline: Math.min(deadline, Date.now() + 30_000),
      }).catch(() => null);
      if (!download?.body) {
        results.push({ url, status: download?.reason ?? 'unreachable' });
        continue;
      }
      if (download.body.subarray(0, 5).toString('latin1') !== '%PDF-') {
        results.push({ url, status: 'not-pdf' });
        continue;
      }
      const path = join(directory, `file-${results.length}.pdf`);
      try {
        await writeFile(path, download.body);
        results.push({ url, ...parseVerapdfReport(await validate(path, command)) });
      } catch (error) {
        results.push({ url, status: error.code === 'ENOENT' ? 'unavailable' : 'failed' });
      } finally {
        await rm(path, { force: true }).catch(() => {});
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true }).catch(() => {});
  }
  return results;
}
