<script setup lang="ts">
  import type { MovieSummary } from '#shared/types/movies'
  const props = defineProps<{ movie: MovieSummary }>()

  const { getImageUrl } = useTmdbImage()
  const posterUrl = computed(() => getImageUrl(props.movie.poster_path, 'w342'))

  const { formatDateShort } = useDate()
</script>

<template>
  <UCard>
    <div class="h-full flex flex-col overflow-hidden">
      <div class="relative aspect-2/3 overflow-hidden">
        <NuxtImg
          v-if="posterUrl"
          :src="posterUrl"
          :alt="movie.title"
          class="w-full h-full object-cover"
          loading="lazy"
        />

        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-slate-800 text-slate-300"
        >
          Aucune affiche
        </div>

        <UBadge
          variant="soft"
          class="absolute top-2 left-2 bg-black/60 text-xs"
        >
          ⭐ {{ movie.vote_average.toFixed(1) }}
        </UBadge>
      </div>

      <div class="flex-1 flex flex-col gap-2 mt-3">
        <h3 class="font-semibold line-clamp-2">
          {{ movie.title }}
        </h3>

        <time
          :datetime="movie.release_date"
          class="text-slate-400"
        >
          {{ formatDateShort(movie.release_date) }}
        </time>

        <p class="text-sm text-slate-300 line-clamp-3">
          {{ movie.overview || 'Pas de synopsis disponible.' }}
        </p>
      </div>

      <div class="mt-4 justify-self-end flex justify-between items-center">
        <UButton size="md" :to="`/movie/${movie.id}`">
          Détails
        </UButton>

        <FavoriteButton :movie="movie" />
      </div>
    </div>
  </UCard>
</template>
