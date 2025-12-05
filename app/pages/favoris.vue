<script setup lang="ts">
  const { favorites, isReady } = useFavorites()

  usePageSeo({
    title: 'Vos favoris',
    description: 'Retrouvez ici tous les films que vous avez ajoutés à vos favoris sur MovieAtlas.',
    path: '/favoris',
  })
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

    <MovieGrid
      v-else
      :movies="favorites"
    />

    <CatalogButton />
  </UContainer>
</template>
