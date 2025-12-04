<script setup lang="ts">
  const { data, pending, error } = await useFetch('/api/trending-movies')

  const movies = computed(() => data.value?.results ?? [])
  const heroMovie = computed(() => movies.value[0])

  usePageSeo({
    title: 'Films tendance aujourd’hui',
    description: 'Top des films populaires du moment, avec synopsis, notes et recommandations.'
  })
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <section v-if="error">
      <UAlert
        variant="soft"
        title="Impossible de charger les films tendance."
        description="Une erreur est survenue lors du chargement. Veuillez réessayer plus tard."
      />
    </section>

    <template v-else>
      <section v-if="heroMovie">
        <template v-if="pending">
          <USkeleton class="h-6 w-40 rounded-full" />
          <USkeleton class="h-8 md:h-10 w-3/4 md:w-2/3" />
          <USkeleton class="h-4 w-full md:w-3/4" />
          <USkeleton class="h-4 w-5/6 md:w-2/3" />

          <div class="flex gap-3 pt-4">
            <USkeleton class="h-9 w-28 rounded-full" />
            <USkeleton class="h-9 w-32 rounded-full" />
          </div>
        </template>

        <MovieHero
          v-else
          :title="heroMovie.title"
          :backdrop="heroMovie.backdrop_path"
          :poster="heroMovie.poster_path"
          :release-date="heroMovie.release_date"
          :vote="heroMovie.vote_average"
          :overview="heroMovie.overview"
          clamp-overview
        >
          <template #badge>
            <UBadge
              variant="solid"
            >
              Top tendance aujourd’hui
            </UBadge>
          </template>

          <template #actions>
            <UButton :to="`/movie/${heroMovie.id}`">
              Voir les détails
            </UButton>

            <FavoriteButton
              :movie="heroMovie"
              show-label
            />
          </template>
        </MovieHero>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold">
          Top 10 des films tendance aujourd’hui
        </h2>

        <div
          v-if="pending"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
        >
          <USkeleton
            v-for="i in 10"
            :key="i"
            class="h-64 rounded-2xl"
          />
        </div>

        <MovieGrid
          v-else-if="movies.length"
          :movies="movies"
        />

        <p
          v-else
          class="text-sm text-slate-400"
        >
          Aucun film tendance disponible pour le moment.
        </p>
      </section>

      <CatalogButton />
    </template>
  </UContainer>
</template>
