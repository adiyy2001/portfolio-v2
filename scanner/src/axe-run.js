import AxeBuilder from '@axe-core/playwright';
import { impactRank } from './mapping.js';

export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const MAX_NODES_PER_RULE = 30;
const MAX_HTML = 300;
const SCREENSHOT_MAX_WIDTH = 600;
const SCREENSHOT_MAX_HEIGHT = 1600;
const SCREENSHOT_BUDGET = 8;
const SCREENSHOT_SOFT_BUDGET = 5;

export function formatTarget(target) {
  return target.map(part => (Array.isArray(part) ? part.join(' ') : part)).join(' > ');
}

export function truncate(text, limit) {
  const value = String(text ?? '');
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

function compactRule(rule) {
  return {
    id: rule.id,
    impact: rule.impact ?? rule.nodes.find(node => node.impact)?.impact ?? 'minor',
    help: rule.help,
    helpUrl: rule.helpUrl,
    description: rule.description,
    tags: rule.tags,
    nodeCount: rule.nodes.length,
    nodes: rule.nodes.slice(0, MAX_NODES_PER_RULE).map(node => ({
      target: formatTarget(node.target),
      rawTarget: node.target,
      html: truncate(node.html, MAX_HTML),
      failureSummary: truncate(node.failureSummary ?? '', 600),
      impact: node.impact ?? rule.impact ?? null,
    })),
  };
}

export async function runAxe(page) {
  const results = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .options({ rules: { 'target-size': { enabled: true } } })
    .analyze();
  return {
    engineVersion: results.testEngine?.version ?? '',
    title: await page.title().catch(() => ''),
    violations: results.violations.map(compactRule),
    incomplete: results.incomplete.map(compactRule),
  };
}

export function createScreenshotBudget() {
  return { taken: 0, rules: new Set(), items: [] };
}

function pngWidth(buffer) {
  return buffer.length > 24 && buffer.toString('ascii', 1, 4) === 'PNG'
    ? buffer.readUInt32BE(16)
    : 0;
}

async function downscale(scaler, buffer) {
  if (pngWidth(buffer) <= SCREENSHOT_MAX_WIDTH) return buffer.toString('base64');
  const data = await scaler.evaluate(
    async ({ base64, maxWidth }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const ratio = Math.min(1, maxWidth / image.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png').split(',')[1];
    },
    { base64: buffer.toString('base64'), maxWidth: SCREENSHOT_MAX_WIDTH },
  );
  return data;
}

function singleSelector(rawTarget) {
  if (rawTarget.length !== 1) return null;
  const part = rawTarget[0];
  return Array.isArray(part) ? part.join(' ') : part;
}

export async function captureScreenshots(page, violations, budget, scaler, pageUrl) {
  const ordered = [...violations].sort((a, b) => impactRank(b.impact) - impactRank(a.impact));
  for (const rule of ordered) {
    if (budget.taken >= SCREENSHOT_BUDGET) return;
    if (budget.rules.has(rule.id)) continue;
    const severe = impactRank(rule.impact) >= impactRank('serious');
    if (!severe && budget.taken >= SCREENSHOT_SOFT_BUDGET) continue;
    const node = rule.nodes.find(candidate => singleSelector(candidate.rawTarget));
    if (!node) continue;
    const selector = singleSelector(node.rawTarget);
    if (selector === 'html' || selector === 'body') continue;
    try {
      const locator = page.locator(selector).first();
      const box = await locator.boundingBox({ timeout: 2000 });
      if (!box || box.width < 2 || box.height < 2 || box.height > SCREENSHOT_MAX_HEIGHT) continue;
      const buffer = await locator.screenshot({ type: 'png', scale: 'css', timeout: 4000 });
      const image = await downscale(scaler, buffer);
      budget.taken += 1;
      budget.rules.add(rule.id);
      budget.items.push({ ruleId: rule.id, target: node.target, pageUrl, image });
    } catch {
      continue;
    }
  }
}
