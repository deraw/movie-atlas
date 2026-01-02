import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { SortBy, type SortByValue } from '#shared/types/movies'

type RouteStub = {
  query: Record<string, unknown>
}

type RouterStub = {
  push: (to: { query: Record<string, string> }) => Promise<void>
}

const route = reactive<RouteStub>({ query: {} })
const push = vi.fn<RouterStub['push']>(async () => {})

mockNuxtImport('useRoute', () => () => route)
mockNuxtImport('useRouter', () => () => ({ push }))

describe('useCatalogFilters', () => {
  async function getComposable() {
    const { useCatalogFilters } = await import('~/composables/useCatalogFilters')
    return useCatalogFilters
  }

  beforeEach(() => {
    vi.clearAllMocks()
    route.query = {}
  })

  describe('readFromRouteQuery', () => {
    it('reads search and page in SEARCH mode (and trims)', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      route.query = {
        mode: 'search',
        search: '  hello  ',
        page: '3',
      }

      c.readFromRouteQuery()

      expect(c.mode.value).toBe('search')
      expect(c.search.value).toBe('hello')
      expect(c.page.value).toBe(3)

      expect(c.applied.value.mode).toBe('search')
      expect(c.applied.value.search).toBe('hello')
    })

    it('falls back to page 1 when page is invalid', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      route.query = { mode: 'search', page: '0' }
      c.readFromRouteQuery()
      expect(c.page.value).toBe(1)

      route.query = { mode: 'search', page: 'abc' }
      c.readFromRouteQuery()
      expect(c.page.value).toBe(1)

      route.query = { mode: 'search', page: undefined }
      c.readFromRouteQuery()
      expect(c.page.value).toBe(1)
    })

    it('reads year/minVote/page and sortBy in FILTER mode', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      route.query = {
        mode: 'filter',
        year: ' 2023 ',
        minVote: '6',
        sortBy: SortBy.ReleaseDate as SortByValue,
        page: '2',
      }

      c.readFromRouteQuery()

      expect(c.mode.value).toBe('filter')
      expect(c.year.value).toBe('2023')
      expect(c.minVote.value).toBe('6')
      expect(c.page.value).toBe(2)
      expect(c.sortBy.value).toBe(SortBy.ReleaseDate)
    })

    it('defaults to SEARCH mode when route.query.mode is missing', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      route.query = {
        search: '  hello  ',
        page: '2',
      }

      c.readFromRouteQuery()

      expect(c.mode.value).toBe('search')
      expect(c.search.value).toBe('hello')
      expect(c.page.value).toBe(2)
    })

    it('falls back to defaults in FILTER mode when sortBy/year/minVote are missing or invalid', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      route.query = {
        mode: 'filter',
        sortBy: 'not-a-valid-sort',
        page: '4',
      }

      c.readFromRouteQuery()

      expect(c.mode.value).toBe('filter')
      expect(c.sortBy.value).toBe(SortBy.Popularity)
      expect(c.year.value).toBe('')
      expect(c.minVote.value).toBe('')
      expect(c.page.value).toBe(4)
    })
  })

  describe('query', () => {
    it('clamps page between 1 and 500', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.page.value = 0
      expect(c.query.value.page).toBe(1)

      c.page.value = 999
      expect(c.query.value.page).toBe(500)

      c.page.value = 42
      expect(c.query.value.page).toBe(42)
    })

    it('builds FILTER query with year/sortBy/minVote', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'filter'
      c.year.value = '2024'
      c.sortBy.value = SortBy.ReleaseDate
      c.minVote.value = '8'
      c.applyFilters()

      expect(c.query.value).toEqual({
        page: 1,
        year: '2024',
        sortBy: SortBy.ReleaseDate,
        minVote: '8',
      })
    })
  })

  describe('minVoteNumber', () => {
    it('syncs minVoteNumber into minVote as a string', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.minVoteNumber.value = 7
      await nextTick()
      expect(c.minVote.value).toBe('7')

      c.minVoteNumber.value = null
      await nextTick()
      expect(c.minVote.value).toBe('')
    })
  })

  describe('applyFilters', () => {
    it('applies trimmed inputs and resets page to 1', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'filter'
      c.search.value = '  ignored in filter  '
      c.year.value = ' 2024 '
      c.sortBy.value = SortBy.ReleaseDate
      c.minVote.value = ' 8 '
      c.page.value = 10

      c.applyFilters()

      expect(c.page.value).toBe(1)
      expect(c.applied.value).toEqual({
        mode: 'filter',
        search: 'ignored in filter',
        year: '2024',
        sortBy: SortBy.ReleaseDate,
        minVote: '8',
      })
    })
  })

  describe('resetFilters', () => {
    it('resets state to defaults and reapplies filters', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'filter'
      c.search.value = 'x'
      c.year.value = '2020'
      c.sortBy.value = SortBy.VoteAverage
      c.minVote.value = '9'
      c.minVoteNumber.value = 9
      c.page.value = 5

      c.resetFilters()
      await nextTick()

      expect(c.mode.value).toBe('search')
      expect(c.search.value).toBe('')
      expect(c.year.value).toBe('')
      expect(c.sortBy.value).toBe(SortBy.Popularity)
      expect(c.minVote.value).toBe('')
      expect(c.minVoteNumber.value).toBeNull()
      expect(c.page.value).toBe(1)

      expect(c.applied.value.mode).toBe('search')
      expect(c.applied.value.search).toBe('')
      expect(c.applied.value.year).toBe('')
      expect(c.applied.value.sortBy).toBe(SortBy.Popularity)
      expect(c.applied.value.minVote).toBe('')
    })
  })

  describe('setRouteQuery', () => {
    it('pushes SEARCH query and includes search when not empty', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'search'
      c.search.value = '  hello '
      c.applyFilters()

      await c.setRouteQuery()

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith({
        query: {
          mode: 'search',
          page: '1',
          search: 'hello',
        },
      })
    })

    it('pushes SEARCH query and omits search when empty', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'search'
      c.search.value = '   '
      c.applyFilters()

      await c.setRouteQuery()

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith({
        query: {
          mode: 'search',
          page: '1',
        },
      })
    })

    it('pushes FILTER query and includes year and minVote when provided', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'filter'
      c.year.value = '2024'
      c.sortBy.value = SortBy.VoteAverage
      c.minVote.value = '7'
      c.applyFilters()

      await c.setRouteQuery()

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith({
        query: {
          mode: 'filter',
          page: '1',
          sortBy: SortBy.VoteAverage,
          year: '2024',
          minVote: '7',
        },
      })
    })

    it('pushes FILTER query and omits year/minVote when empty', async () => {
      const useCatalogFilters = await getComposable()
      const c = useCatalogFilters()

      c.mode.value = 'filter'
      c.year.value = '   '
      c.sortBy.value = SortBy.Popularity
      c.minVote.value = '   '
      c.applyFilters()

      await c.setRouteQuery()

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith({
        query: {
          mode: 'filter',
          page: '1',
          sortBy: SortBy.Popularity,
        },
      })
    })
  })
})
