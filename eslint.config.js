import js from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';

export default [
  { ignores: ['web/dist/**', 'bin/**', 'node_modules/**'] },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  { files: ['web/src/**/*.js', 'web/src/**/*.vue'], languageOptions: { globals: globals.browser } },
  {
    files: ['scripts/**/*.js', 'web/tests/**/*.js', '*.config.js', '*.config.mjs'],
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
