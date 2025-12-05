const APP_LOCALE = 'fr-FR'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxt/ui', '@nuxt/image'],
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      title: 'MovieAtlas - Catalogue de films TMDB',
      meta: [
        { name: 'description', content: 'Catalogue de films basé sur TMDB avec Nuxt 4 + Nuxt UI' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' },
      ],
      htmlAttrs: {
        lang: APP_LOCALE,
      },
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tmdbApiUrl: 'https://api.themoviedb.org/3',
    tmdbToken: process.env.TMDB_TOKEN,
    public: {
      tmdbImageBase: 'https://image.tmdb.org/t/p',
      appLocale: APP_LOCALE,
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },
  routeRules: {
    '/': {
      isr: 60,
    },
    '/movie/**': {
      isr: 3600,
    },
    '/catalogue': {
      isr: 300,
    },

    '/favoris': {
      prerender: true,
    },
    'a-propos': {
      prerender: true,
    },

    '/api/trending-movies': {
      isr: 60,
    },
    '/api/movies/**': {
      isr: 3600,
    },
  },
  compatibilityDate: '2025-07-15',
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
