import { criteriaFromTags, impactRank, isBestPracticeOnly } from './mapping.js';
import { describeRule } from './rules-pl.js';
import { criterionSort } from './wcag-pl.js';

function mergePassesInto(map, record, pass, kind) {
  for (const rule of pass[kind]) {
    const key = `${rule.id}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        ruleId: rule.id,
        impact: rule.impact,
        help: rule.help,
        helpUrl: rule.helpUrl,
        description: rule.description,
        tags: rule.tags,
        pages: new Map(),
      };
      map.set(key, entry);
    }
    if (impactRank(rule.impact) > impactRank(entry.impact)) entry.impact = rule.impact;
    let page = entry.pages.get(record.url);
    if (!page) {
      page = { url: record.url, count: 0, nodes: new Map(), views: new Set() };
      entry.pages.set(record.url, page);
    }
    page.views.add(record.view);
    page.count = Math.max(page.count, rule.nodeCount);
    for (const node of rule.nodes) {
      let known = page.nodes.get(node.target);
      if (!known) {
        known = {
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
          phases: new Set(),
          views: new Set(),
        };
        page.nodes.set(node.target, known);
      }
      known.phases.add(pass.phase);
      known.views.add(record.view);
    }
  }
}

function finalizeEntry(entry, screenshots) {
  const pages = [...entry.pages.values()]
    .map(page => ({
      url: page.url,
      count: page.count,
      views: [...page.views].sort(),
      nodes: [...page.nodes.values()].map(node => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary,
        phases: [...node.phases],
        views: [...node.views].sort(),
      })),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
  const criteria = criteriaFromTags(entry.tags);
  const shot = screenshots.find(item => item.ruleId === entry.ruleId) ?? null;
  return {
    ruleId: entry.ruleId,
    impact: entry.impact,
    help: entry.help,
    helpUrl: entry.helpUrl,
    description: entry.description,
    info: describeRule(entry.ruleId, entry),
    criteria,
    bestPractice: isBestPracticeOnly(entry.tags),
    pages,
    occurrences: pages.reduce((sum, page) => sum + page.count, 0),
    screenshot: shot,
  };
}

function bySeverity(a, b) {
  return (
    impactRank(b.impact) - impactRank(a.impact) ||
    b.occurrences - a.occurrences ||
    b.pages.length - a.pages.length ||
    a.ruleId.localeCompare(b.ruleId)
  );
}

export function aggregate(records, screenshots = []) {
  const violations = new Map();
  const incomplete = new Map();
  for (const record of records) {
    for (const pass of record.passes ?? []) {
      mergePassesInto(violations, record, pass, 'violations');
      mergePassesInto(incomplete, record, pass, 'incomplete');
    }
  }
  const confirmed = [...violations.values()].map(entry => finalizeEntry(entry, screenshots));
  const manual = [...incomplete.values()].map(entry => finalizeEntry(entry, [])).sort(bySeverity);
  const errors = confirmed.filter(entry => !entry.bestPractice).sort(bySeverity);
  const recommendations = confirmed.filter(entry => entry.bestPractice).sort(bySeverity);

  const groupMap = new Map();
  for (const entry of errors) {
    const primary = entry.criteria[0];
    let group = groupMap.get(primary.id);
    if (!group) {
      group = { criterion: primary, entries: [] };
      groupMap.set(primary.id, group);
    }
    group.entries.push(entry);
  }
  const groups = [...groupMap.values()].sort((a, b) =>
    criterionSort(a.criterion.id, b.criterion.id),
  );

  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  let findings = 0;
  for (const entry of errors) {
    findings += entry.pages.length;
    if (counts[entry.impact] !== undefined) counts[entry.impact] += entry.pages.length;
  }
  const affectedPages = new Set(errors.flatMap(entry => entry.pages.map(page => page.url)));
  const incompleteFindings = manual.reduce((sum, entry) => sum + entry.pages.length, 0);

  return {
    errors,
    groups,
    manual,
    recommendations,
    totals: {
      findings,
      ...counts,
      affectedPages: affectedPages.size,
      incomplete: incompleteFindings,
      occurrences: errors.reduce((sum, entry) => sum + entry.occurrences, 0),
    },
    top: errors.slice(0, 3),
  };
}
