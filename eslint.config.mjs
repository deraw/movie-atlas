import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],

      'vue/max-attributes-per-line': ['error', {
        singleline: 1,
        multiline: 1,
      }],
      'vue/script-indent': ['error', 2, {
        baseIndent: 1,
        switchCase: 1,
      }],

      '@stylistic/indent': ['error', 2],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      '@stylistic/indent': 'off',
    },
  },
)
