import { SortBy, type SortByValue, type QueryParamsSearch, type QueryParamsFilter } from '#shared/types/movies'

export enum Modes {
  SEARCH = 'search',
  FILTER = 'filter',
}

export interface FiltersApplied {
  mode: Modes
  search: string
  year: string
  sortBy: SortByValue
  minVote: string
}

function toInt(value: unknown, fallback = 1) {
  const number = Number.parseInt(String(value ?? ''), 10)

  return Number.isFinite(number) && number >= 1 ? number : fallback
}

function isSortBy(value: unknown): value is SortByValue {
  return value === SortBy.Popularity || value === SortBy.VoteAverage || value === SortBy.ReleaseDate
}

export const useCatalogFilters = () => {
  const route = useRoute()
  const router = useRouter()

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

  const applied = ref<FiltersApplied>({
    mode: Modes.SEARCH,
    search: '',
    year: '',
    sortBy: SortBy.Popularity,
    minVote: '',
  })

  function readFromRouteQuery() {
    const routeQuery = route.query

    applied.value.mode = routeQuery.mode as Modes ?? Modes.SEARCH

    if (applied.value.mode === Modes.SEARCH) {
      applied.value.search = String(routeQuery.search ?? '').trim()
    } else {
      applied.value.sortBy = isSortBy(routeQuery.sortBy) ? routeQuery.sortBy : SortBy.Popularity
      applied.value.year = String(routeQuery.year ?? '').trim()
      applied.value.minVote = String(routeQuery.minVote ?? '')
    }

    mode.value = applied.value.mode
    search.value = applied.value.search
    year.value = applied.value.year
    sortBy.value = applied.value.sortBy
    minVote.value = applied.value.minVote
    page.value = toInt(routeQuery.page, 1)
  }

  function getRouteQuery() {
    const routeQuery: Record<string, string> = {
      mode: mode.value,
      page: String(page.value),
    }

    if (mode.value === Modes.SEARCH) {
      if (applied.value.search) {
        routeQuery.search = applied.value.search
      }
    } else {
      routeQuery.sortBy = applied.value.sortBy

      if (applied.value.year) {
        routeQuery.year = applied.value.year
      }

      if (applied.value.minVote) {
        routeQuery.minVote = applied.value.minVote
      }
    }

    return routeQuery
  }

  async function setRouteQuery() {
    await router.push({ query: getRouteQuery() })
  }

  const query = computed<QueryParamsSearch | QueryParamsFilter>(() => {
    const params = {
      page: Math.max(1, Math.min(500, page.value)),
    } as QueryParamsSearch & QueryParamsFilter

    if (applied.value.mode === 'search') {
      params.search = applied.value.search
    } else {
      params.year = applied.value.year
      params.sortBy = applied.value.sortBy
      params.minVote = applied.value.minVote
    }

    return params
  })

  const applyFilters = () => {
    applied.value = {
      search: search.value.trim(),
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
    minVote.value = ''
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

    applied,
    query,

    readFromRouteQuery,
    setRouteQuery,
    applyFilters,
    resetFilters,
  }
}
