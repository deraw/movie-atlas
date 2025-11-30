<script setup lang="ts">
  import MovieCard from '~/components/movies/MovieCard.vue'

  const { data, pending, error } = await useFetch('/api/trending-movies')

  const movies = computed(() => data.value?.results ?? [])
  const heroMovie = computed(() => movies.value[0])
  const heroImageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px'

  const { getImageUrl } = useTmdbImage()
  const { formatDate } = useDate()

  if (import.meta.server) {
    useSeoMeta({
      title: 'Films tendance aujourd’hui | MovieAtlas',
      description: 'Top 10 des films tendance aujourd’hui grâce à TMDB.'
    })
  }
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <section v-if="error">
      <UAlert
        variant="soft"
        title="Impossible de charger les films tendance."
      />
    </section>

    <template v-else>
      <section
        v-if="heroMovie"
        class="relative overflow-hidden rounded-3xl bg-black"
      >
        <div
          class="
            relative
            h-[65vh]
            sm:h-auto
            sm:aspect-21/9
            sm:max-h-[700px]
            w-full
          "
        >
          <NuxtImg
            v-if="!pending && heroMovie.backdrop_path"
            :src="getImageUrl(heroMovie.backdrop_path, 'w1280')"
            :alt="heroMovie.title"
            :sizes="heroImageSizes"
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

          <div class="relative z-10 h-full flex items-end">
            <div class="p-6 md:p-10 space-y-4 text-white">
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

              <template v-else>
                <UBadge
                  variant="solid"
                  class="text-md"
                >
                  Top tendance aujourd’hui
                </UBadge>

                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {{ heroMovie.title }}
                </h1>

                <p class="md:text-base text-slate-200 line-clamp-3 md:line-clamp-4">
                  {{ heroMovie.overview || 'Pas de synopsis disponible.' }}
                </p>

                <div class="flex flex-wrap gap-4 items-center text-slate-200">
                  <time :datetime="heroMovie.release_date">
                    Sorti le {{ formatDate(heroMovie.release_date) }}
                  </time>

                  <span class="inline-flex items-center gap-1">
                    ⭐
                    <span class="font-semibold">
                      {{ heroMovie.vote_average.toFixed(1) }}
                    </span>
                    /10
                  </span>
                </div>

                <div class="flex flex-wrap gap-3 pt-2">
                  <UButton :to="`/movie/${heroMovie.id}`">
                    Voir les détails
                  </UButton>

                  <UButton
                    variant="ghost"
                    icon="i-heroicons-heart"
                  >
                    Ajouter aux favoris
                  </UButton>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            Top 10 des films tendance aujourd’hui
          </h2>

          <UButton variant="ghost" to="/movies">
            Voir le catalogue
          </UButton>
        </div>

        <div
          v-if="pending"
          class="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <USkeleton
            v-for="i in 10"
            :key="i"
            class="h-64 rounded-2xl"
          />
        </div>

        <div
          v-else-if="movies.length"
          class="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
          />
        </div>

        <p
          v-else
          class="text-sm text-slate-400"
        >
          Aucun film tendance disponible pour le moment.
        </p>
      </section>
    </template>
  </UContainer>
</template>
