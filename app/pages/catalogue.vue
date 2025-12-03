<script setup lang="ts">
  usePageSeo({
    title: 'Catalogue',
    description: 'Parcourez le catalogue complet de films disponibles sur MovieAtlas.',
    path: '/catalogue'
  })
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <BackButton />

    <p>
      Le catalogue complet des films sera bientôt disponible. Vous pourrez prochainement
      parcourir l’ensemble des films populaires, filtrer par genre, année ou note, et
      explorer une base enrichie grâce à l’API TMDB.
    </p>

    <p>
      Cette section est en cours de développement et sera mise à jour prochainement.
    </p>
  </UContainer>
</template>
