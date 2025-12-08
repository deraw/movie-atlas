import { SortBy, type SortByValue } from '#shared/types/movies'

export enum Modes {
  SEARCH = 'search',
  FILTER = 'filter',
}

export interface FiltersApplied {
  query: string
  year: string
  sortBy: SortByValue
  minVote: string
  mode: Modes
}

export interface QueryParamsSearch {
  page: number
  query: string
}

export interface QueryParamsFilter {
  page: number
  year: string
  sortBy: SortByValue
  minVote: string
}

export const useCatalogFilters = () => {
  const mode = ref<Modes>(Modes.SEARCH)

  const search = ref('')
  const year = ref('')
  const sortBy = ref<SortByValue>(SortBy.Popularity)
  const minVote = ref('')

  const minVoteNumber = ref<number | null>(null)

  watch(minVoteNumber, (val) => {
    minVote.value = val !== null ? String(val) : ''
  })

  const page = ref(1)

  const appliedFilters = ref<FiltersApplied>({
    query: '',
    year: '',
    sortBy: SortBy.Popularity,
    minVote: '',
    mode: Modes.SEARCH,
  })

  const query = computed<QueryParamsSearch | QueryParamsFilter>(() => {
    const params = {} as QueryParamsSearch & QueryParamsFilter

    if (appliedFilters.value.mode === 'search') {
      params.query = appliedFilters.value.query
    } else {
      params.year = appliedFilters.value.year
      params.sortBy = appliedFilters.value.sortBy
      params.minVote = appliedFilters.value.minVote
    }

    return params
  })

  const applyFilters = () => {
    appliedFilters.value = {
      query: search.value.trim(),
      year: year.value.trim(),
      sortBy: sortBy.value,
      minVote: minVote.value.trim(),
      mode: mode.value,
    }

    page.value = 1
  }

  const resetFilters = () => {
    search.value = ''
    year.value = ''
    sortBy.value = SortBy.Popularity
    minVoteNumber.value = null
    mode.value = Modes.SEARCH

    applyFilters()
  }

  return {
    mode,
    search,
    year,
    sortBy,
    minVote,
    minVoteNumber,

    page,

    appliedFilters,
    query,

    applyFilters,
    resetFilters,
  }
}
