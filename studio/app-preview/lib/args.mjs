import { slugs } from './paths.mjs';

export const parseArgs = (argv = process.argv.slice(2)) => {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item.startsWith('--')) {
      const [key, inline] = item.slice(2).split('=');
      if (inline !== undefined) flags[key] = inline;
      else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) {
        flags[key] = argv[i + 1];
        i += 1;
      } else flags[key] = true;
    } else positional.push(item);
  }
  return { positional, flags };
};

export const requireSlug = (argv = process.argv.slice(2)) => {
  const { positional, flags } = parseArgs(argv);
  const slug = positional[0];
  if (!slug || !slugs.includes(slug)) {
    console.error(`usage: <script> <slug> [options]; slug is one of ${slugs.join(', ')}`);
    process.exit(2);
  }
  return { slug, flags, rest: positional.slice(1) };
};

export const listFlag = (value, all) => (value ? String(value).split(',') : all);
