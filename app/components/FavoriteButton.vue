<script setup lang="ts">
  import type { MovieSummary } from '#shared/types/movies'

  const props = defineProps<{
    movie: MovieSummary
    showLabel?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }>()

  const { isFavorite, toggleFavorite } = useFavorites()

  const ariaLabel = computed(() =>
    props.showLabel
      ? undefined
      : isFavorite(props.movie.id)
        ? 'Retirer des favoris'
        : 'Ajouter aux favoris',
  )

  const handleClick = () => {
    toggleFavorite(props.movie)
  }
</script>

<template>
  <UButton
    :icon="isFavorite(movie.id) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
    :class="isFavorite(movie.id) ? 'text-red-500' : ''"
    :aria-label="ariaLabel"
    :size="size ?? 'md'"
    color="neutral"
    variant="ghost"
    @click="handleClick"
  >
    <span
      v-if="showLabel"
      class="sr-only sm:not-sr-only"
    >
      {{ isFavorite(movie.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
    </span>
  </UButton>
</template>
