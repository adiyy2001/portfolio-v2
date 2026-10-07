import type { Format } from './types';

export const canvas = { width: 443, height: 960, scale: 2 } as const;

export const formats: Record<Format, { width: number; height: number; label: string }> = {
  '9x16': { width: 1080, height: 1920, label: 'Reels, TikTok, Shorts' },
  '1x1': { width: 1080, height: 1080, label: 'post kwadratowy' },
  '16x9': { width: 1920, height: 1080, label: 'YouTube i Google Play' },
};

export const safe9x16 = { top: 220, bottom: 380, right: 140 } as const;

export const storeSafe = { top: 60, bottom: 80 } as const;
