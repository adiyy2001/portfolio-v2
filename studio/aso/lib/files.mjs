import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

export const ensureDir = dir => {
  mkdirSync(dir, { recursive: true });
  return dir;
};

export const writeFile = (path, data) => {
  ensureDir(dirname(path));
  writeFileSync(path, data);
  return path;
};

export const cleanDir = dir => {
  rmSync(dir, { recursive: true, force: true });
  return ensureDir(dir);
};

export const walk = (dir, filter = () => true) => {
  if (!existsSync(dir)) return [];
  const result = [];
  const visit = current => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (filter(path)) result.push(path);
    }
  };
  visit(dir);
  return result;
};

export const bytesOf = path => statSync(path).size;

export const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');

export const rel = (from, to) => relative(from, to).split('\\').join('/');

export const humanBytes = bytes => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
