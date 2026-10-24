export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern':
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$',
    'selector-max-id': 0,
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    // State-specific component selectors intentionally follow their base styles.
    'no-descending-specificity': null,
  },
  overrides: [
    {
      files: ['web/themes/*.css'],
      rules: { 'color-no-hex': null, 'function-disallowed-list': null },
    },
  ],
};
