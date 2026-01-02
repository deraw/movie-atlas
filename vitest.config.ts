import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json', 'json-summary'],
      reportsDirectory: '../coverage',
      include: [
        'components/**/*.vue',
        'composables/**/*.ts',
        'server/**/*.ts',
        'shared/**/*.ts',
        'utils/**/*.ts',
      ],
      exclude: [
        'utils/runtime.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/.nuxt/**',
        '**/dist/**',
        '**/coverage/**',
      ],
    },
  },
})
