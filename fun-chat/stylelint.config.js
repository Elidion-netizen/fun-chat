/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'declaration-property-unit-allowed-list': {
      '/^border;/': ['px'],
      '/^padding|^gap|^margin/': ['rem', 'em'],
    },
    'color-named': 'never',
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'hwb', 'lch', 'rgba'],
    'import-notation': 'string',
  },
};
