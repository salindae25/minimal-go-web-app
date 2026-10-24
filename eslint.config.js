import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['web/app.js', 'bin/**', 'node_modules/**'] },
  js.configs.recommended,
  { files: ['web/**/*.js'], languageOptions: { globals: globals.browser } },
  {
    files: ['scripts/**/*.js', '*.config.js', '*.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'max-lines': ['error', { max: 1000 }],
    },
  },
];
