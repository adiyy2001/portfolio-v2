import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
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

export const pngSize = path => {
  const buf = readFileSync(path);
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${path} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), hasAlpha: [4, 6].includes(buf[25]) };
};

export const icoSizes = path => {
  const buf = readFileSync(path);
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) throw new Error(`${path} is not an ICO`);
  const count = buf.readUInt16LE(4);
  return Array.from({ length: count }, (_, i) => {
    const w = buf[6 + i * 16];
    const h = buf[7 + i * 16];
    return { width: w === 0 ? 256 : w, height: h === 0 ? 256 : h };
  });
};

export const rel = (from, to) => relative(from, to).split('\\').join('/');

export const humanBytes = bytes => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
