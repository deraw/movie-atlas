<script setup lang="ts">
  import { SortBy, type SortByValue } from '#shared/types/movies'
  import { useCatalogFilters, Modes } from '~/composables/useCatalogFilters'

  const config = useRuntimeConfig()

  const {
    mode,
    search,
    year,
    sortBy,
    minVoteNumber,
    page,
    query,
    applyFilters,
    resetFilters,
  } = useCatalogFilters()

  const sortItems: { label: string, value: SortByValue }[] = [
    { label: 'Popularité', value: SortBy.Popularity },
    { label: 'Note moyenne', value: SortBy.VoteAverage },
    { label: 'Date de sortie', value: SortBy.ReleaseDate },
  ]

  const currentYear = new Date().getFullYear()
  const yearItems = Array.from({ length: 60 }, (_, i) => String(currentYear - i))

  const { data, pending, error } = await useFetch('/api/movies/catalogue', {
    params: query,
    watch: [query],
  })

  const movies = computed(() => data.value?.results ?? [])
  const totalPages = computed(() => data.value?.total_pages ?? 1)
  const maxPage = computed(() => Math.min(totalPages.value, 500))
  const totalResults = computed(() => data.value?.total_results ?? 0)

  const totalResultsText = computed(() => {
    if (totalResults.value === 1) {
      return '1 résultat'
    }

    return `${totalResults.value.toLocaleString(config.public.appLocale)} résultats`
  })

  const onSubmit = () => {
    if (mode.value === 'search') {
      year.value = ''
      minVoteNumber.value = null
      page.value = 1
    }

    if (mode.value === 'filter') {
      search.value = ''
      page.value = 1
    }

    applyFilters()
  }

  usePageSeo({
    title: 'Catalogue',
    description: 'Parcourez le catalogue complet de films disponibles sur MovieAtlas.',
    path: '/catalogue',
  })
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <header class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">
          Catalogue de films
        </h1>

        <p class="text-slate-300">
          Recherchez un film par titre ou filtrez par année, tri ou note minimale, puis parcourez le
          catalogue complet.
        </p>
      </div>

      <p
        v-if="totalResults"
        class="text-xs text-slate-400"
        aria-live="polite"
      >
        {{ totalResultsText }}
      </p>
    </header>

    <UForm class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-full p-1">
        <UButton
          :variant="mode === 'search' ? 'solid' : 'ghost'"
          color="neutral"
          class="px-3"
          @click="mode = Modes.SEARCH"
        >
          Rechercher par titre
        </UButton>

        <UButton
          :variant="mode === Modes.FILTER ? 'solid' : 'ghost'"
          color="neutral"
          class="px-3"
          @click="mode = Modes.FILTER"
        >
          Filtrer le catalogue
        </UButton>
      </div>

      <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <UFormField
          v-if="mode === 'search'"
          :ui="{ labelWrapper: 'sr-only' }"
          label="Titre du film"
        >
          <UInput
            v-model="search"
            type="search"
            placeholder="Titre du film"
            autocomplete="off"
            class="w-full sm:w-auto sm:min-w-[320px]"
          />
        </UFormField>

        <template v-if="mode === 'filter'">
          <UFormField
            :ui="{ labelWrapper: 'sr-only' }"
            label="Année de sortie"
          >
            <USelectMenu
              v-model="year"
              :items="yearItems"
              placeholder="Année"
              class="w-full sm:w-auto min-w-[120px]"
            />
          </UFormField>

          <UFormField
            :ui="{ labelWrapper: 'sr-only' }"
            label="Trier par"
          >
            <USelect
              v-model="sortBy"
              :items="sortItems"
              placeholder="Trier par"
              class="w-full sm:w-auto min-w-40"
            />
          </UFormField>

          <UFormField
            :ui="{ labelWrapper: 'sr-only' }"
            label="Note minimale"
          >
            <UInputNumber
              v-model="minVoteNumber"
              :min="0"
              :max="10"
              :step="0.5"
              placeholder="Note min."
              orientation="vertical"
              autocomplete="off"
              class="w-full sm:w-[120px]"
            />
          </UFormField>
        </template>
      </div>

      <div class="flex gap-3 mt-2">
        <UButton
          type="reset"
          color="neutral"
          variant="ghost"
          @click.prevent="resetFilters"
        >
          Réinitialiser
        </UButton>

        <UButton
          type="submit"
          color="primary"
          @click.prevent="onSubmit"
        >
          Rechercher
        </UButton>
      </div>
    </UForm>

    <section class="space-y-4">
      <h2 class="sr-only">
        Résultats du catalogue
      </h2>

      <UAlert
        v-if="error"
        variant="soft"
        title="Une erreur est survenue"
        description="Impossible de charger le catalogue pour le moment. Veuillez réessayer plus tard."
      />

      <div
        v-else-if="pending"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <USkeleton
          v-for="i in 10"
          :key="i"
          class="h-[260px] rounded-2xl"
        />
      </div>

      <div
        v-else-if="movies.length"
        class="space-y-10"
      >
        <MovieGrid :movies="movies" />

        <div class="flex justify-center pt-2">
          <UPagination
            v-model:page="page"
            :items-per-page="20"
            :total="maxPage * 20"
            aria-label="Pagination du catalogue de films"
          />
        </div>
      </div>

      <p
        v-else
        class="text-slate-300"
      >
        Aucun film ne correspond à votre recherche pour le moment.<br>
        Modifiez les filtres ou essayez un autre titre.
      </p>
    </section>
  </UContainer>
</template>
