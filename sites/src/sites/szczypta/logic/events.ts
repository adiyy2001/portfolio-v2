import type { EventRule } from '../data/events';

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const dayInMonth = (rule: EventRule, year: number, month: number) => {
  if (rule.nth === -1) {
    const last = new Date(year, month + 1, 0);
    const back = (last.getDay() - rule.weekday + 7) % 7;
    return new Date(year, month, last.getDate() - back);
  }
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = (rule.weekday - firstWeekday + 7) % 7;
  return new Date(year, month, 1 + offset + (rule.nth - 1) * 7);
};

export const nextOccurrence = (rule: EventRule, from: Date) => {
  const today = startOfDay(from);
  for (let step = 0; step < 3; step += 1) {
    const candidate = dayInMonth(rule, today.getFullYear(), today.getMonth() + step);
    if (candidate >= today) return candidate;
  }
  return dayInMonth(rule, today.getFullYear(), today.getMonth() + 3);
};

export const isoDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
