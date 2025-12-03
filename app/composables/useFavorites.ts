import { computed, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'movieatlas:favorites'

export const useFavorites = () => {
  const favorites = useState<MovieSummary[]>('favorites', () => [])
  const isReady = ref(false)

  onMounted(() => {
    if (!import.meta.client) {
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (raw) {
        const parsed = JSON.parse(raw) as MovieSummary[]
        favorites.value = parsed
      }
    } catch (e) {
      console.error('Failed to parse favorites from localStorage', e)
    } finally {
      isReady.value = true
    }
  })

  watch(
    favorites,
    (value) => {
      if (!import.meta.client) {
        return
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e)
      }
    },
    { deep: true }
  )

  const ids = computed(() => new Set(favorites.value.map(m => m.id)))

  const isFavorite = (id: number) => ids.value.has(id)

  const addFavorite = (movie: MovieSummary) => {
    if (isFavorite(movie.id)) {
      return
    }

    favorites.value.push(movie)
  }

  const removeFavorite = (id: number) => {
    favorites.value = favorites.value.filter(m => m.id !== id)
  }

  const toggleFavorite = (movie: MovieSummary) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  return {
    favorites,
    isReady,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  }
}
