const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const hooks = require('eslint-plugin-react-hooks');
const a11y = require('eslint-plugin-jsx-a11y');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  { ignores: ['public/', '.cache/', 'rebrand-explorations/', 'static/'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  hooks.configs.flat.recommended,
  a11y.flatConfigs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
    rules: { 'react/prop-types': 'off' },
  },
];
