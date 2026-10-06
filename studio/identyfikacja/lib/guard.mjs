import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';
import { repoRoot, sitesRoot } from './paths.mjs';

const ts = createRequire(join(sitesRoot, 'package.json'))('typescript');

const textExt = new Set(['.mjs', '.js', '.ts', '.tsx', '.json', '.css', '.astro', '.html', '.md', '.svg', '.txt', '.yml', '.yaml']);
const codeExt = new Set(['.mjs', '.js', '.ts', '.tsx']);
const skipPath = path => /node_modules|\/dist\/|\.astro-cache|\.vite-cache|\/\.astro\/|studio\/out\/|\/OFL[^/]*\.txt$|yarn\.lock$|REBRAND\.md$/.test(path);

export const isGuarded = path => textExt.has(extname(path)) && !skipPath(path);

export const findDashes = text => {
  const hits = [];
  text.split('\n').forEach((line, index) => {
    if (/[\u2013\u2014]/.test(line)) hits.push({ line: index + 1, kind: 'dash', text: line.trim().slice(0, 100) });
  });
  return hits;
};

const lineOf = (text, pos) => text.slice(0, pos).split('\n').length;

const tsComments = (text, fileName, startLine = 1) => {
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const seen = new Set();
  const hits = [];
  const add = ranges => {
    for (const range of ranges ?? []) {
      if (seen.has(range.pos)) continue;
      seen.add(range.pos);
      hits.push({ line: lineOf(text, range.pos) + startLine - 1, kind: 'comment', text: text.slice(range.pos, range.end).slice(0, 80) });
    }
  };
  const visit = node => {
    add(ts.getLeadingCommentRanges(text, node.pos));
    add(ts.getTrailingCommentRanges(text, node.end));
    ts.forEachChild(node, visit);
  };
  visit(source);
  return hits;
};

const cssComments = (text, startLine = 1) => {
  const hits = [];
  let quote = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '/' && text[i + 1] === '*') hits.push({ line: lineOf(text, i) + startLine - 1, kind: 'comment', text: text.slice(i, i + 60) });
  }
  return hits;
};

export const findComments = (path, text) => {
  const ext = extname(path);
  if (codeExt.has(ext)) return tsComments(text, path);
  if (ext === '.css') return cssComments(text);
  if (ext === '.astro' || ext === '.html') {
    const hits = [];
    const html = [...text.matchAll(/<!--/g)];
    for (const match of html) hits.push({ line: lineOf(text, match.index), kind: 'comment', text: '<!--' });
    const fm = text.startsWith('---') ? text.match(/^---\n([\s\S]*?)\n---/) : null;
    if (fm) hits.push(...tsComments(fm[1], 'frontmatter.ts', 2));
    for (const match of text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
      if (/type="application\/(ld\+)?json"/.test(match[0].slice(0, match[0].indexOf('>')))) continue;
      hits.push(...tsComments(match[1], 'inline.ts', lineOf(text, match.index)));
    }
    for (const match of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) hits.push(...cssComments(match[1], lineOf(text, match.index)));
    return hits;
  }
  return [];
};

export const checkFile = path => {
  const text = readFileSync(path, 'utf8');
  return [...findDashes(text), ...findComments(path, text)];
};

export const changedFiles = () => {
  const run = args => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).split('\n').filter(Boolean);
  const names = new Set([...run(['diff', '--name-only', 'HEAD']), ...run(['ls-files', '--others', '--exclude-standard'])]);
  return [...names].map(name => join(repoRoot, name)).filter(isGuarded);
};
