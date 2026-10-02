export default {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSameLine: true,
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
