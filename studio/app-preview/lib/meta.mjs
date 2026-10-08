import { join } from 'node:path';
import { loadTs } from './load-ts.mjs';
import { appPaths } from './paths.mjs';

export const loadMeta = async slug => (await loadTs(join(appPaths(slug).src, 'meta.ts'))).meta;
