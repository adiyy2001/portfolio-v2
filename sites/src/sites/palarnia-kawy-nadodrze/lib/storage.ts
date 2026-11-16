type StorageKind = 'local' | 'session';

const resolve = (kind: StorageKind): Storage | null => {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const readStorage = (kind: StorageKind, key: string): string | null => {
  try {
    return resolve(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

export const writeStorage = (kind: StorageKind, key: string, value: string): boolean => {
  try {
    const storage = resolve(kind);
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const removeStorage = (kind: StorageKind, key: string): void => {
  try {
    resolve(kind)?.removeItem(key);
  } catch {
    return;
  }
};
