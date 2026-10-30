import { WCAG_22_LABEL, WCAG_21_LABEL, WCAG_PL } from './wcag-pl.js';

export function criterionFromTag(tag) {
  const match = /^wcag([1-4])(\d)(\d{1,2})$/.exec(tag);
  if (!match) return null;
  return `${match[1]}.${match[2]}.${match[3]}`;
}

export function mapCriterion(id) {
  const known = WCAG_PL[id];
  const isNew22 = known?.since === '2.2';
  return {
    id,
    name: known?.name ?? `Kryterium ${id}`,
    level: known?.level ?? '',
    clause: `9.${id}`,
    isNew22,
    standardLabel: isNew22 ? WCAG_22_LABEL : WCAG_21_LABEL,
  };
}

export function criteriaFromTags(tags = []) {
  const ids = [];
  for (const tag of tags) {
    const id = criterionFromTag(tag);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids.map(mapCriterion);
}

export function isBestPracticeOnly(tags = []) {
  return criteriaFromTags(tags).length === 0;
}

export const IMPACT_ORDER = ['minor', 'moderate', 'serious', 'critical'];

export function impactRank(impact) {
  const index = IMPACT_ORDER.indexOf(impact);
  return index < 0 ? 0 : index;
}

export const IMPACT_PL = {
  critical: 'krytyczny',
  serious: 'poważny',
  moderate: 'umiarkowany',
  minor: 'drobny',
};
