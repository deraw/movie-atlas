import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

const isCI = Boolean(process.env.CI)

const devicesToTest = [
  'Desktop Chrome',
] satisfies Array<string | typeof devices[string]>

export default defineConfig<ConfigOptions>({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 120000,
  reporter: isCI ? 'github' : 'html',
  use: {
    trace: 'on-first-retry',
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      build: false,
      buildDir: '.output',
      nuxtConfig: {
        nitro: {
          output: {
            dir: '.output',
          },
        },
      },
    },
  },
  projects: devicesToTest.map(p => typeof p === 'string' ? ({ name: p, use: devices[p] }) : p),
})
