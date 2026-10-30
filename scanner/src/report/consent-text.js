import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DEFAULT_LOCATIONS = [
  new URL('../../consent.json', import.meta.url),
  new URL('../../../src/scanner/consent.json', import.meta.url),
];

export function loadConsentTexts(explicitPath = '') {
  const candidates = [explicitPath, ...DEFAULT_LOCATIONS.map(url => fileURLToPath(url))].filter(
    Boolean,
  );
  for (const path of candidates) {
    try {
      const data = JSON.parse(readFileSync(path, 'utf8'));
      if (data?.pl?.disclaimer)
        return { version: data.version ?? '', disclaimer: data.pl.disclaimer };
    } catch {
      continue;
    }
  }
  throw new Error('consent.json with pl.disclaimer not found');
}
