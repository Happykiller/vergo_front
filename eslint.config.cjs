/** @type {import('eslint').Linter.FlatConfig[]} */
const js = require('@eslint/js');
const globals = require('globals');
const parserTs = require('@typescript-eslint/parser');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginTs = require('@typescript-eslint/eslint-plugin');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: Object.fromEntries(
        Object.entries({
          ...globals.browser,
          ...globals.node,
        }).filter(([key]) => key === key.trim())
      ),
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // La règle core ne comprend ni les parameter properties ni les types TS
      // (faux positifs sur `private inversify: Inversify`) : on délègue à la
      // version typescript-eslint.
      'no-unused-vars': 'off',
      // Inutile en TypeScript : le compilateur vérifie déjà les identifiants
      // (faux positifs sur les globals de types comme `NodeJS` ou `React`).
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
