import { describe, expect, it } from 'vitest';
import { headScript, sealFontProbe, sealReleaseDelay, sealStorageKey } from './head-script';

interface Setup {
  reducedMotion?: boolean;
  stored?: boolean;
  storageThrows?: boolean;
  fonts?: 'resolves' | 'rejects' | 'pending' | 'missing';
}

const run = ({
  reducedMotion = false,
  stored = false,
  storageThrows = false,
  fonts = 'pending',
}: Setup = {}) => {
  const classes = new Set<string>();
  const written: Record<string, string> = {};
  const timers: { callback: () => void; delay: number }[] = [];
  const loaded: string[] = [];

  const document = {
    documentElement: { classList: { add: (name: string) => classes.add(name) } },
    fonts:
      fonts === 'missing'
        ? undefined
        : {
            load: (probe: string) => {
              loaded.push(probe);
              if (fonts === 'resolves') return Promise.resolve();
              if (fonts === 'rejects') return Promise.reject(new Error('blocked'));
              return new Promise<void>(() => undefined);
            },
          },
  };
  const matchMedia = () => ({ matches: reducedMotion });
  const sessionStorage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('denied');
      return stored ? '1' : (written[key] ?? null);
    },
    setItem: (key: string, value: string) => {
      if (storageThrows) throw new Error('denied');
      written[key] = value;
    },
  };
  const setTimeout = (callback: () => void, delay: number) => {
    timers.push({ callback, delay });
    return timers.length;
  };

  new Function('document', 'matchMedia', 'sessionStorage', 'setTimeout', headScript)(
    document,
    matchMedia,
    sessionStorage,
    setTimeout,
  );
  return { classes, written, timers, loaded };
};

describe('headScript', () => {
  it('marks the page as scripted and stamps on the first view of a session', () => {
    const { classes, written } = run();
    expect(classes.has('js')).toBe(true);
    expect(classes.has('seal-stamp')).toBe(true);
    expect(written[sealStorageKey]).toBe('1');
  });

  it('keeps the seal still on later views', () => {
    const { classes, written } = run({ stored: true });
    expect(classes.has('js')).toBe(true);
    expect(classes.has('seal-stamp')).toBe(false);
    expect(written[sealStorageKey]).toBeUndefined();
  });

  it('keeps the seal still when motion is reduced and does not use up the first view', () => {
    const { classes, written } = run({ reducedMotion: true });
    expect(classes.has('js')).toBe(true);
    expect(classes.has('seal-stamp')).toBe(false);
    expect(written[sealStorageKey]).toBeUndefined();
  });

  it('keeps the seal still when storage is not available', () => {
    const { classes } = run({ storageThrows: true });
    expect(classes.has('js')).toBe(true);
    expect(classes.has('seal-stamp')).toBe(false);
  });

  it('keeps the seal hidden until the font has loaded', () => {
    const { classes, loaded } = run({ fonts: 'pending' });
    expect(loaded).toEqual([sealFontProbe]);
    expect(classes.has('seal-ready')).toBe(false);
  });

  it('releases the seal when the font has loaded', async () => {
    const { classes } = run({ fonts: 'resolves' });
    await Promise.resolve();
    expect(classes.has('seal-ready')).toBe(true);
  });

  it('releases the seal when the font fails to load', async () => {
    const { classes } = run({ fonts: 'rejects' });
    await Promise.resolve();
    await Promise.resolve();
    expect(classes.has('seal-ready')).toBe(true);
  });

  it('releases the seal after a timeout when the font never settles', () => {
    const { classes, timers } = run({ fonts: 'pending' });
    expect(timers).toHaveLength(1);
    expect(timers[0]?.delay).toBe(sealReleaseDelay);
    timers[0]?.callback();
    expect(classes.has('seal-ready')).toBe(true);
  });

  it('works when the font loading api is missing', () => {
    const { classes, timers } = run({ fonts: 'missing' });
    expect(classes.has('seal-stamp')).toBe(true);
    timers[0]?.callback();
    expect(classes.has('seal-ready')).toBe(true);
  });

  it('contains no line breaks or dashes that could break inlining', () => {
    expect(headScript).not.toMatch(/[\n\u2013\u2014]/);
  });
});
