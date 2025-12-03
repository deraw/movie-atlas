<script setup lang="ts">
  const route = useRoute()
  const config = useRuntimeConfig()
  const { getImageUrl } = useTmdbImage()

  const movieId = computed(() => route.params.id as string)

  const { data, pending, error } = await useFetch(`/api/movies/${movieId.value}`, {
    watch: [movieId]
  })

  const movie = computed(() => data.value?.movie)
  const cast = computed(() => data.value?.cast ?? [])
  const recommendations = computed(() => data.value?.recommendations ?? [])
  const trailer = computed(() => data.value?.trailer ?? null)

  const isTrailerOpen = ref(false)

  const openTrailer = () => {
    if (!trailer.value) {
      return
    }

    isTrailerOpen.value = true
  }

  const { isFavorite, toggleFavorite } = useFavorites()

  const toggleMovieFavorite = () => {
    if (!movie.value) {
      return
    }

    toggleFavorite(movie.value)
  }

  if (import.meta.server) {
    const defaultOgImage = `${config.public.appUrl}/og-default.jpg`

    useSeoMeta({
      title: () => movie.value
          ? `${movie.value.title} – MovieAtlas`
          : 'Détails du film – MovieAtlas',
      description: () =>
        movie.value?.overview ||
        'Découvrez les détails de ce film sur MovieAtlas : synopsis, note et recommandations.',
      ogTitle: () =>
        movie.value
          ? `${movie.value.title} – MovieAtlas`
          : 'Détails du film – MovieAtlas',

      ogDescription: () =>
        movie.value?.overview ||
        'Découvrez les détails de ce film sur MovieAtlas : synopsis, note et recommandations.',
      ogType: () => 'video.movie',
      ogUrl: () =>
        `${config.public.appUrl}/movie/${movieId.value}`,
      ogImage: () => {
        if (movie.value?.backdrop_path) {
          return getImageUrl(movie.value.backdrop_path, 'w1280') || defaultOgImage
        }

        return defaultOgImage
      },

      twitterCard: () => 'summary_large_image',
      twitterTitle: () =>
        movie.value
          ? `${movie.value.title} – MovieAtlas`
          : 'Détails du film – MovieAtlas',
      twitterDescription: () =>
        movie.value?.overview ||
        'Découvrez les détails de ce film sur MovieAtlas : synopsis, note et recommandations.',
      twitterImage: () => {
        if (movie.value?.backdrop_path) {
          return getImageUrl(movie.value.backdrop_path, 'w1280') || defaultOgImage
        }

        return defaultOgImage
      }
    })
  }
</script>

<template>
  <UContainer class="py-8 space-y-10">
    <section v-if="error">
      <UAlert
        variant="soft"
        title="Impossible de charger les détails du film"
        description="Une erreur est survenue lors du chargement. Veuillez réessayer plus tard."
      />
    </section>

    <section v-else-if="pending && !movie">
      <div class="space-y-6">
        <USkeleton class="h-[260px] sm:h-80 rounded-3xl" />

        <div class="space-y-3">
          <USkeleton class="h-6 w-40" />
          <USkeleton class="h-8 w-2/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
        </div>
      </div>
    </section>

    <section
      v-else-if="movie"
      class="space-y-10"
    >
      <BackButton />

      <MovieHero
        :title="movie.title"
        :backdrop="movie.backdrop_path"
        :poster="movie.poster_path"
        :tagline="movie.tagline"
        :status="movie.status"
        :runtime="movie.runtime"
        :release-date="movie.release_date"
        :genres="movie.genres"
        :vote="movie.vote_average"
        :overview="movie.overview"
      >
        <template #actions>
          <UButton
            v-if="trailer"
            variant="solid"
            icon="i-heroicons-play"
            @click="openTrailer"
          >
            Bande-annonce
          </UButton>

          <UButton
            :icon="isFavorite(movie.id) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :class="isFavorite(movie.id) ? 'text-red-500' : ''"
            variant="ghost"
            color="neutral"
            @click="toggleMovieFavorite"
          >
            <span class="sr-only sm:not-sr-only">
              {{ isFavorite(movie.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
            </span>
          </UButton>
        </template>
      </MovieHero>

      <section
        v-if="cast.length"
        class="space-y-4"
      >
        <h2 class="text-lg font-semibold">
          Distribution
        </h2>

        <div
          focusable
          class="flex gap-4 overflow-x-auto pb-2"
        >
          <div
            v-for="person in cast"
            :key="person.id"
            class="w-32 shrink-0"
          >
            <div class="relative aspect-2/3 rounded-xl overflow-hidden bg-slate-800">
              <NuxtImg
                v-if="person.profile_path"
                :src="getImageUrl(person.profile_path, 'w185')"
                :alt="person.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />

              <div
                v-else
                class="w-full h-full flex items-center justify-center text-xs text-slate-300"
              >
                Pas de photo
              </div>
            </div>

            <p class="mt-2 font-semibold line-clamp-2">
              {{ person.name }}
            </p>

            <p class="text-xs text-slate-400 line-clamp-2">
              {{ person.character }}
            </p>
          </div>
        </div>
      </section>

      <UModal
        v-model:open="isTrailerOpen"
        :ui="{ content: 'sm:max-w-5xl' }"
        title="Bande-annonce"
        description="Regardez la bande-annonce officielle du film."
      >
        <template #content>
          <div class="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              v-if="trailer"
              class="w-full h-full"
              :src="`https://www.youtube.com/embed/${trailer.key}`"
              title="Bande-annonce"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>
        </template>
      </UModal>

      <section
        v-if="recommendations.length"
        class="space-y-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Films recommandés
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MovieCard
            v-for="rec in recommendations"
            :key="rec.id"
            :movie="rec"
          />
        </div>
      </section>

      <div class="border-t border-white/10 flex justify-center py-6 sm:py-12">
        <UButton
          size="lg"
          color="neutral"
          variant="solid"
          class="px-6"
          to="/catalogue"
        >
          Voir le catalogue complet
        </UButton>
      </div>
    </section>
  </UContainer>
</template>
