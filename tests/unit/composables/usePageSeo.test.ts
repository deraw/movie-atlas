import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

type SeoPayload = Record<string, unknown>
const seoMetaMock = vi.fn<(payload: SeoPayload) => void>()

const runtimeConfigMock = {
  public: {
    appUrl: 'https://movieatlas.test',
  },
} as const

mockNuxtImport('useRuntimeConfig', () => () => runtimeConfigMock)
mockNuxtImport('useSeoMeta', () => (payload: SeoPayload) => seoMetaMock(payload))

describe('usePageSeo', () => {
  async function getComposable() {
    const mod = await import('~/composables/usePageSeo')
    return mod.usePageSeo
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useSeoMeta with defaults and appends title suffix', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Catalogue',
      description: 'Browse movies',
    })

    expect(seoMetaMock).toHaveBeenCalledTimes(1)

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>

    expect(payload.title).toBe('Catalogue – MovieAtlas')
    expect(payload.description).toBe('Browse movies')

    expect(payload.ogTitle).toBe('Catalogue – MovieAtlas')
    expect(payload.ogDescription).toBe('Browse movies')
    expect(payload.ogType).toBe('website')
    expect(payload.ogUrl).toBe('https://movieatlas.test/')
    expect(payload.ogImage).toBe('https://movieatlas.test/og-default.jpg')

    expect(payload.twitterCard).toBe('summary_large_image')
    expect(payload.twitterTitle).toBe('Catalogue – MovieAtlas')
    expect(payload.twitterDescription).toBe('Browse movies')
    expect(payload.twitterImage).toBe('https://movieatlas.test/og-default.jpg')
  })

  it('does not append suffix when already present', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Catalogue – MovieAtlas',
      description: 'Browse movies',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.title).toBe('Catalogue – MovieAtlas')
  })

  it('keeps empty title unchanged', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: '',
      description: 'Desc',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.title).toBe('')
  })

  it('supports title as function (suffix applied to result)', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: () => 'Movie detail',
      description: 'Desc',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>

    expect(typeof payload.title).toBe('function')
    const titleFn = payload.title as () => string
    expect(titleFn()).toBe('Movie detail – MovieAtlas')

    expect(payload.ogTitle).toBe(payload.title)
    expect(payload.twitterTitle).toBe(payload.title)
  })

  it('supports path as function (ogUrl becomes a function)', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Page',
      description: 'Desc',
      path: () => '/movie/42',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>

    expect(typeof payload.ogUrl).toBe('function')
    const urlFn = payload.ogUrl as () => string
    expect(urlFn()).toBe('https://movieatlas.test/movie/42')
  })

  it('uses custom type when provided', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Article',
      description: 'Desc',
      type: 'article',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.ogType).toBe('article')
  })

  it('uses custom ogImage when provided (string)', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Page',
      description: 'Desc',
      ogImage: '/custom.jpg',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.ogImage).toBe('/custom.jpg')
    expect(payload.twitterImage).toBe('/custom.jpg')
  })

  it('uses custom ogImage when provided (function)', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Page',
      description: 'Desc',
      ogImage: () => '/dynamic.jpg',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>

    expect(typeof payload.ogImage).toBe('function')
    const imgFn = payload.ogImage as () => string
    expect(imgFn()).toBe('/dynamic.jpg')

    expect(payload.twitterImage).toBe(payload.ogImage)
  })

  it('builds absolute url when path is a string', async () => {
    const usePageSeo = await getComposable()

    usePageSeo({
      title: 'Page',
      description: 'Desc',
      path: '/catalogue',
    })

    const payload = seoMetaMock.mock.calls[0]![0] as Record<string, unknown>
    expect(payload.ogUrl).toBe('https://movieatlas.test/catalogue')
  })
})
