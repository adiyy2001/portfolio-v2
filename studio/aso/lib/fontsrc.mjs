import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ensureDir } from './files.mjs';
import { fontsSrcRoot } from './paths.mjs';

export const polish = 'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ';

const rawBase = 'https://raw.githubusercontent.com/google/fonts/main/ofl';

const download = async (url, path, attempts = 4) => {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url}: ${res.status}`);
      writeFileSync(path, Buffer.from(await res.arrayBuffer()));
      return path;
    } catch (error) {
      lastError = error;
      await new Promise(done => setTimeout(done, 2000 * 2 ** i));
    }
  }
  throw lastError;
};

export const fetchFamily = async (dir, files) => {
  const target = ensureDir(join(fontsSrcRoot(), dir));
  for (const name of [...new Set([...files, 'OFL.txt'])]) {
    const path = join(target, name);
    if (!existsSync(path)) await download(`${rawBase}/${dir}/${encodeURIComponent(name)}`, path);
  }
  return target;
};
