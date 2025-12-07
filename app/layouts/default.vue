<script setup lang="ts">
  import { fr } from '@nuxt/ui/locale'

  const config = useRuntimeConfig()

  if (import.meta.server) {
    useSeoMeta({
      title: 'MovieAtlas – Explorez les films tendance',
      description: 'MovieAtlas vous permet de découvrir les films tendance, leurs détails, bandes-annonces et recommandations, propulsé par TMDB.',

      ogTitle: 'MovieAtlas – Explorez les films tendance',
      ogDescription: 'Découvrez les films populaires, leurs fiches détaillées et bandes-annonces sur MovieAtlas.',
      ogType: 'website',
      ogSiteName: 'MovieAtlas',
      ogUrl: config.public.appUrl,
      ogImage: `${config.public.appUrl}/og-default.jpg`,

      twitterCard: 'summary_large_image',
      twitterTitle: 'MovieAtlas',
      twitterDescription: 'Découvrez les films tendance et leurs détails sur MovieAtlas.',
    })
  }
</script>

<template>
  <UApp :locale="fr">
    <SkipToContent />
    <AppHeader />

    <UMain
      id="main-content"
      as="main"
    >
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
</template>
