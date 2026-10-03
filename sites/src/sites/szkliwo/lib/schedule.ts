const dayIndex: Record<string, number> = {
  pon: 1,
  wt: 2,
  sr: 3,
  czw: 4,
  pt: 5,
  sob: 6,
};

export const weekdayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'] as const;

const normalizeDay = (text: string) => text.trim().toLowerCase().replace('ś', 's');

export const parseDays = (text: string) => {
  const days = new Set<number>();
  text.split(',').forEach(part => {
    const [from, to] = part.split('-').map(normalizeDay);
    const start = dayIndex[from ?? ''];
    const end = to === undefined ? start : dayIndex[to];
    if (start === undefined || end === undefined) return;
    for (let day = start; day <= end; day += 1) days.add(day);
  });
  return Array.from(days).sort((first, second) => first - second);
};
