import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import * as runtime from '~/utils/runtime'

type MovieSummary = {
  id: number
  title: string
}

const STORAGE_KEY = 'movieatlas:favorites'

const makeMovie = (id: number): MovieSummary => ({
  id,
  title: `Movie ${id}`,
})

const hoisted = vi.hoisted(() => {
  type StateRef<T> = ReturnType<typeof ref<T>>
  const store = new Map<string, StateRef<unknown>>()

  const resetStore = () => {
    store.clear()
  }

  const useStateMock = vi.fn(<T>(key: string, init: () => T): StateRef<T> => {
    if (!store.has(key)) {
      store.set(key, ref(init()) as StateRef<T>)
    }
    return store.get(key) as StateRef<T>
  })

  return { resetStore, useStateMock }
})

mockNuxtImport('useState', () => hoisted.useStateMock)

async function getComposable() {
  const { useFavorites } = await import('~/composables/useFavorites')
  return useFavorites
}

async function mountHarness(useFavorites: Awaited<ReturnType<typeof getComposable>>) {
  const Harness = defineComponent({
    setup() {
      return { fav: useFavorites() }
    },
    template: '<div />',
  })

  const wrapper = mount(Harness)
  await nextTick()
  return wrapper
}

describe('useFavorites', () => {
  let originalLocalStorage: Storage

  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.resetStore()

    vi.spyOn(runtime, 'isClient').mockReturnValue(true)

    originalLocalStorage = window.localStorage

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(originalLocalStorage.getItem.bind(originalLocalStorage)),
        setItem: vi.fn(originalLocalStorage.setItem.bind(originalLocalStorage)),
        removeItem: vi.fn(originalLocalStorage.removeItem.bind(originalLocalStorage)),
        clear: vi.fn(originalLocalStorage.clear.bind(originalLocalStorage)),
        key: vi.fn(originalLocalStorage.key.bind(originalLocalStorage)),
        get length() {
          return originalLocalStorage.length
        },
      } satisfies Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear' | 'key' | 'length'>,
      configurable: true,
    })

    window.localStorage.clear()
  })

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
  })

  describe('initialization (onMounted)', () => {
    it('initializes with empty favorites and isReady=false before mount', async () => {
      const useFavorites = await getComposable()
      const fav = useFavorites()

      expect(fav.favorites.value).toEqual([])
      expect(fav.isReady.value).toBe(false)
    })

    it('loads favorites from localStorage on mount', async () => {
      const stored = [makeMovie(1), makeMovie(2)]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

      const useFavorites = await getComposable()
      const wrapper = await mountHarness(useFavorites)

      expect(wrapper.vm.fav.favorites.value).toEqual(stored)
      expect(wrapper.vm.fav.isReady.value).toBe(true)
    })

    it('handles invalid JSON in localStorage and still sets isReady on mount', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      window.localStorage.setItem(STORAGE_KEY, 'not-json')

      const useFavorites = await getComposable()
      const wrapper = await mountHarness(useFavorites)

      expect(wrapper.vm.fav.favorites.value).toEqual([])
      expect(wrapper.vm.fav.isReady.value).toBe(true)
      expect(errorSpy).toHaveBeenCalled()

      errorSpy.mockRestore()
    })

    it('does not read localStorage on mount when not client', async () => {
      vi.spyOn(runtime, 'isClient').mockReturnValue(false)

      const stored = [makeMovie(1)]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

      const getItemSpy = vi.spyOn(window.localStorage, 'getItem')

      const useFavorites = await getComposable()
      const wrapper = await mountHarness(useFavorites)

      expect(getItemSpy).not.toHaveBeenCalled()
      expect(wrapper.vm.fav.favorites.value).toEqual([])

      expect(wrapper.vm.fav.isReady.value).toBe(false)

      getItemSpy.mockRestore()
    })
  })

  describe('helpers', () => {
    it('checks isFavorite', async () => {
      const useFavorites = await getComposable()
      const fav = useFavorites()

      expect(fav.isFavorite(1)).toBe(false)

      fav.addFavorite(makeMovie(1))
      await nextTick()

      expect(fav.isFavorite(1)).toBe(true)
    })

    it('adds a favorite only once', async () => {
      const useFavorites = await getComposable()
      const fav = useFavorites()

      fav.addFavorite(makeMovie(1))
      fav.addFavorite(makeMovie(1))
      await nextTick()

      expect(fav.favorites.value).toEqual([makeMovie(1)])
    })

    it('removes a favorite', async () => {
      const useFavorites = await getComposable()
      const fav = useFavorites()

      fav.addFavorite(makeMovie(1))
      fav.addFavorite(makeMovie(2))
      await nextTick()

      fav.removeFavorite(1)
      await nextTick()

      expect(fav.favorites.value).toEqual([makeMovie(2)])
    })

    it('toggles favorite', async () => {
      const useFavorites = await getComposable()
      const fav = useFavorites()

      fav.toggleFavorite(makeMovie(1))
      await nextTick()
      expect(fav.favorites.value).toEqual([makeMovie(1)])

      fav.toggleFavorite(makeMovie(1))
      await nextTick()
      expect(fav.favorites.value).toEqual([])
    })
  })

  describe('watch persistence', () => {
    it('persists favorites to localStorage when favorites changes', async () => {
      const useFavorites = await getComposable()

      const setItemSpy = vi.spyOn(window.localStorage, 'setItem')
      const wrapper = await mountHarness(useFavorites)

      wrapper.vm.fav.addFavorite(makeMovie(1))
      await nextTick()
      await nextTick()

      expect(setItemSpy).toHaveBeenCalled()

      const lastCall = setItemSpy.mock.calls.at(-1)
      expect(lastCall?.[0]).toBe(STORAGE_KEY)
      expect(JSON.parse(String(lastCall?.[1]))).toEqual([makeMovie(1)])

      setItemSpy.mockRestore()
    })

    it('does not persist to localStorage when not client', async () => {
      vi.spyOn(runtime, 'isClient').mockReturnValue(false)

      const useFavorites = await getComposable()
      const setItemSpy = vi.spyOn(window.localStorage, 'setItem')

      const wrapper = await mountHarness(useFavorites)

      wrapper.vm.fav.addFavorite(makeMovie(1))
      await nextTick()
      await nextTick()

      expect(setItemSpy).not.toHaveBeenCalled()

      setItemSpy.mockRestore()
    })

    it('handles localStorage setItem errors gracefully', async () => {
      const useFavorites = await getComposable()

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const setItemSpy = vi
        .spyOn(window.localStorage, 'setItem')
        .mockImplementation(() => {
          throw new Error('quota exceeded')
        })

      const wrapper = await mountHarness(useFavorites)

      wrapper.vm.fav.addFavorite(makeMovie(1))
      await nextTick()
      await nextTick()

      expect(errorSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })
})
