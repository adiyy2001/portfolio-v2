import { WCAG_PL } from './wcag-pl.js';

const criterionPattern = /^\d\.\d{1,2}\.\d{1,2}$/;

export function levelAaCriteria(requirements) {
  const ids = new Set();
  for (const requirement of requirements) {
    const chapter = requirement.toJSON().chapter;
    if (criterionPattern.test(chapter ?? '') && WCAG_PL[chapter]) ids.add(chapter);
  }
  return [...ids];
}

export function summarizeOutcomes(failedOutcomes) {
  const byRule = new Map();
  for (const outcome of failedOutcomes) {
    const rule = outcome.rule.uri.split('/').pop();
    const criteria = levelAaCriteria(outcome.rule.requirements);
    if (criteria.length === 0) continue;
    const row = byRule.get(rule) ?? { rule, criteria, count: 0 };
    row.count += 1;
    byRule.set(rule, row);
  }
  return [...byRule.values()];
}
