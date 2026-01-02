import { describe, it, expect, vi } from 'vitest'

import { useTmdbImage } from '~/composables/useTmdbImage'

vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      tmdbImageBase: 'https://image.tmdb.org/t/p',
    },
  }),
}))

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      tmdbImageBase: 'https://image.tmdb.org/t/p',
    },
  }),
}))

describe('useTmdbImage', () => {
  it('returns undefined when path is null or undefined', () => {
    const { getImageUrl } = useTmdbImage()

    expect(getImageUrl(null)).toBeUndefined()
    expect(getImageUrl(undefined)).toBeUndefined()
  })

  it('builds image URL with default size (original)', () => {
    const { getImageUrl } = useTmdbImage()

    const url = getImageUrl('/poster.jpg')
    expect(url).toBe('https://image.tmdb.org/t/p/original/poster.jpg')
  })

  it('builds image URL with provided size', () => {
    const { getImageUrl } = useTmdbImage()

    const url = getImageUrl('/backdrop.jpg', 'w1280')
    expect(url).toBe('https://image.tmdb.org/t/p/w1280/backdrop.jpg')
  })
})
