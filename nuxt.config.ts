export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
