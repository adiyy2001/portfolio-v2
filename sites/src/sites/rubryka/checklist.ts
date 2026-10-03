export const checklistStorageKey = 'rubryka-ksef-checklist';

export const parseChecked = (raw: string | null, validIds: readonly string[]): Set<string> => {
  if (raw === null) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((id): id is string => typeof id === 'string' && validIds.includes(id)),
    );
  } catch {
    return new Set();
  }
};

export const serializeChecked = (checked: ReadonlySet<string>): string =>
  JSON.stringify([...checked]);

export const withChecked = (checked: ReadonlySet<string>, id: string, on: boolean): Set<string> => {
  const next = new Set(checked);
  if (on) next.add(id);
  else next.delete(id);
  return next;
};

export const progressText = (done: number, total: number): string =>
  done === total ? `Wszystko zrobione: ${total} z ${total}` : `Zrobione: ${done} z ${total}`;
