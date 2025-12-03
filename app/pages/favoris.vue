<script setup lang="ts">
  const config = useRuntimeConfig()
  const { favorites, isReady } = useFavorites()

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

    <h1 class="text-2xl font-semibold">
      Vos favoris
    </h1>

    <div v-if="!isReady">
      <USkeleton class="h-6 w-32 mb-4" />

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <USkeleton
          v-for="n in 5"
          :key="n"
          class="h-[260px] rounded-2xl"
        />
      </div>
    </div>

    <div
      v-else-if="favorites.length === 0"
      class="text-sm text-slate-300"
    >
      Vous n’avez encore ajouté aucun film en favori.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      <MovieCard
        v-for="movie in favorites"
        :key="movie.id"
        :movie="movie"
      />
    </div>

    <CatalogButton />
  </UContainer>
</template>
