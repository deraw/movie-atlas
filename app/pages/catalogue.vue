<script setup lang="ts">
  const config = useRuntimeConfig()

  if (import.meta.server) {
    useSeoMeta({
      title: 'Catalogue – MovieAtlas',
      description: 'Parcourez le catalogue complet de films disponibles sur MovieAtlas.',
      ogTitle: 'Catalogue – MovieAtlas',
      ogDescription: 'Découvrez tous les films disponibles dans le catalogue MovieAtlas.',
      ogUrl: `${config.public.appUrl}/catalogue`
    })
  }
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <BackButton />
  </UContainer>
</template>
