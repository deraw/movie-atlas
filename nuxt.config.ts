const APP_LOCALE = 'fr-FR'

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
  app: {
    head: {
      title: 'MovieAtlas - Catalogue de films TMDB',
      meta: [
        { name: 'description', content: 'Catalogue de films basé sur TMDB avec Nuxt 4 + Nuxt UI' },
      ],
      htmlAttrs: {
        lang: APP_LOCALE,
      },
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
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
  runtimeConfig: {
    tmdbApiUrl: 'https://api.themoviedb.org/3',
    tmdbToken: process.env.TMDB_V4_TOKEN,
    public: {
      tmdbImageBase: 'https://image.tmdb.org/t/p',
      appLocale: APP_LOCALE,
    },
  },
})
