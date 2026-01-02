import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

import Hero from '~/components/movie/Hero.vue'

import { mockComposables } from '../../mocks/composables'

mockComposables()

type Genre = {
  id: number
  name: string
}

type HeroProps = {
  title: string
  backdrop: string | null
  poster?: string | null
  tagline?: string | null
  status?: string | null
  runtime?: number | null
  releaseDate?: string | null
  vote?: number
  genres?: Genre[]
  overview?: string | null
}

const NuxtImgStub = {
  name: 'NuxtImg',
  props: ['src', 'alt'],
  template: '<img :src="src" :alt="alt" />',
}

const UBadgeStub = {
  name: 'UBadge',
  template: '<span data-testid="badge"><slot /></span>',
}

describe('Hero.vue', () => {
  const defaultProps: HeroProps = {
    title: 'Test Movie',
    backdrop: '/backdrop.jpg',
    poster: '/poster.jpg',
    tagline: 'A great movie',
    status: 'Released',
    runtime: 120,
    releaseDate: '2024-01-15',
    vote: 8.5,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Drama' },
    ],
    overview: 'This is a test overview for the movie',
  }

  // Track wrappers to avoid leaking resize listeners between tests
  let wrappers: VueWrapper[] = []

  let rafId = 0
  let rafSpy: ReturnType<typeof vi.spyOn> | null = null
  let cafSpy: ReturnType<typeof vi.spyOn> | null = null

  function mountComponent(props: HeroProps = defaultProps) {
    const wrapper = mount(Hero, {
      props,
      global: {
        stubs: {
          NuxtImg: NuxtImgStub,
          UBadge: UBadgeStub,
        },
      },
    })

    wrappers.push(wrapper)

    return wrapper
  }

  beforeEach(() => {
    // Reset mocks and provide deterministic requestAnimationFrame behavior
    // to reliably test resize / overflow logic without relying on real timing.
    vi.clearAllMocks()
    rafId = 0

    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafId += 1
        // Execute immediately to avoid async / timing-related flakiness in tests
        cb(performance.now())

        return rafId
      })

    cafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers = []

    rafSpy?.mockRestore()
    cafSpy?.mockRestore()
  })

  it('renders hero with core content', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('h1').text()).toBe('Test Movie')
    expect(wrapper.text()).toContain('A great movie')
    expect(wrapper.text()).toContain('120 min')
    expect(wrapper.text()).toContain('Released')
  })

  it('renders backdrop image when provided', () => {
    const wrapper = mountComponent()
    const imgs = wrapper.findAll('img')
    expect(imgs.some(i => i.attributes('src') === 'https://image.tmdb.org/t/p/w1280/backdrop.jpg')).toBe(true)
  })

  it('does not render backdrop image when backdrop is null', () => {
    const wrapper = mountComponent({ ...defaultProps, backdrop: null })
    const imgs = wrapper.findAll('img')
    expect(imgs.some(i => i.attributes('src')?.includes('/backdrop.jpg'))).toBe(false)
  })

  it('renders poster image when provided', () => {
    const wrapper = mountComponent()
    const imgs = wrapper.findAll('img')
    expect(imgs.some(i => i.attributes('src') === 'https://image.tmdb.org/t/p/w342/poster.jpg')).toBe(true)
  })

  it('renders empty state when poster is missing', () => {
    const wrapper = mountComponent({ ...defaultProps, poster: null })
    expect(wrapper.text()).toContain('Aucune image')
  })

  it('hides tagline when not provided', () => {
    const wrapper = mountComponent({ ...defaultProps, tagline: null })
    expect(wrapper.text()).not.toContain('A great movie')
  })

  it('hides status badge when not provided', () => {
    const wrapper = mountComponent({ ...defaultProps, status: null })
    expect(wrapper.text()).not.toContain('Released')
  })

  it('displays runtime when provided', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('120 min')
  })

  it('hides runtime when not provided', () => {
    const wrapper = mountComponent({ ...defaultProps, runtime: null })
    expect(wrapper.text()).not.toContain('min')
  })

  it('formats and displays release date when provided', () => {
    const wrapper = mountComponent()
    const time = wrapper.find('time')
    expect(time.exists()).toBe(true)
    expect(time.attributes('datetime')).toBe('2024-01-15')
    expect(time.text().length).toBeGreaterThan(0)
  })

  it('hides release date when not provided', () => {
    const wrapper = mountComponent({ ...defaultProps, releaseDate: null })
    expect(wrapper.find('time').exists()).toBe(false)
  })

  it('displays vote with one decimal and /10', () => {
    const wrapper = mountComponent({ ...defaultProps, vote: 8.55 })
    expect(wrapper.text()).toContain('8.6')
    expect(wrapper.text()).toContain('/10')
  })

  it('hides vote display when undefined', () => {
    const wrapper = mountComponent({ ...defaultProps, vote: undefined })
    expect(wrapper.text()).not.toContain('/10')
  })

  it('displays genres', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Action')
    expect(wrapper.text()).toContain('Drama')
  })

  it('does not render genres when empty array', () => {
    const wrapper = mountComponent({ ...defaultProps, genres: [] })
    expect(wrapper.text()).not.toContain('Action')
    expect(wrapper.text()).not.toContain('Drama')
  })

  it('renders overview and clamps by default', () => {
    const wrapper = mountComponent()

    const overviewText = defaultProps.overview as string
    const paragraphs = wrapper.findAll('p')
    const overviewP = paragraphs.find(p => p.text() === overviewText)

    expect(overviewP, 'Overview paragraph not found').toBeTruthy()
    expect(overviewP!.classes()).toContain('line-clamp-3')
  })

  it('toggles overview expansion and removes clamp', async () => {
    const wrapper = mountComponent()

    const overviewText = defaultProps.overview as string
    const getOverviewP = () => {
      const overviewP = wrapper.findAll('p').find(el => el.text() === overviewText)

      if (!overviewP) {
        throw new Error('Overview paragraph not found')
      }

      return overviewP
    }

    expect(getOverviewP().classes()).toContain('line-clamp-3')

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('Afficher plus')

    await btn.trigger('click')

    expect(wrapper.find('button').text()).toContain('Afficher moins')
    expect(getOverviewP().classes()).not.toContain('line-clamp-3')
  })

  it('does not render overview section when overview is null', () => {
    const wrapper = mountComponent({ ...defaultProps, overview: null })
    expect(wrapper.text()).not.toContain('Afficher plus')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('hides expand button when computed lineHeight is 0 (covers lineHeight branch)', async () => {
    const getComputedStyleSpy = vi
      .spyOn(globalThis, 'getComputedStyle')
      .mockImplementation(() => ({ lineHeight: '0px' }) as unknown as CSSStyleDeclaration)

    const wrapper = mountComponent()

    await nextTick()

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.classes()).toContain('opacity-0')
    expect(btn.classes()).toContain('pointer-events-none')
    expect(btn.classes()).toContain('select-none')

    getComputedStyleSpy.mockRestore()
  })

  it('covers overflow calculation: sets isOverflowing=true when scrollHeight exceeds 3 lines', async () => {
    const getComputedStyleSpy = vi
      .spyOn(globalThis, 'getComputedStyle')
      .mockImplementation(() => ({ lineHeight: '10px' }) as unknown as CSSStyleDeclaration)

    const wrapper = mountComponent()
    await nextTick()

    const overviewText = defaultProps.overview as string
    const overviewEl = wrapper
      .findAll('p')
      .find(p => p.text() === overviewText)
      ?.element as HTMLElement | undefined

    expect(overviewEl).toBeTruthy()

    // maxHeight = 10 * 3 = 30, so scrollHeight 100 => overflow true
    Object.defineProperty(overviewEl!, 'scrollHeight', {
      configurable: true,
      get: () => 100,
    })

    // force checkOverflow via resize
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.classes()).toContain('opacity-100')

    getComputedStyleSpy.mockRestore()
  })

  it('covers overflow calculation: sets isOverflowing=false when scrollHeight does not exceed 3 lines', async () => {
    const getComputedStyleSpy = vi
      .spyOn(globalThis, 'getComputedStyle')
      .mockImplementation(() => ({ lineHeight: '10px' }) as unknown as CSSStyleDeclaration)

    const wrapper = mountComponent()
    await nextTick()

    const overviewText = defaultProps.overview as string
    const overviewEl = wrapper
      .findAll('p')
      .find(p => p.text() === overviewText)
      ?.element as HTMLElement | undefined

    expect(overviewEl).toBeTruthy()

    // maxHeight = 30 ; fullHeight = 30 => 30 > 31 ? false
    Object.defineProperty(overviewEl!, 'scrollHeight', {
      configurable: true,
      get: () => 30,
    })

    window.dispatchEvent(new Event('resize'))
    await nextTick()

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.classes()).toContain('opacity-0')

    getComputedStyleSpy.mockRestore()
  })

  it('cancels previous animation frame before requesting a new one on resize', () => {
    mountComponent()

    vi.mocked(window.cancelAnimationFrame).mockClear()
    vi.mocked(window.requestAnimationFrame).mockClear()

    window.dispatchEvent(new Event('resize')) // id = 1
    window.dispatchEvent(new Event('resize')) // cancel 1, id = 2

    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1)
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  it('removes resize listener on unmount', () => {
    const wrapper = mountComponent()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('cancels scheduled animation frame on unmount when one exists', () => {
    const wrapper = mountComponent()

    window.dispatchEvent(new Event('resize')) // schedule => id=1
    wrapper.unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('renders slot content for badge', () => {
    const w = mount(Hero, {
      props: defaultProps,
      slots: { badge: '<span>Custom Badge</span>' },
      global: { stubs: { NuxtImg: NuxtImgStub, UBadge: UBadgeStub } },
    })

    wrappers.push(w)

    expect(w.text()).toContain('Custom Badge')
    expect(w.text()).not.toContain('Released')
  })

  it('renders slot content for actions', () => {
    const w = mount(Hero, {
      props: defaultProps,
      slots: { actions: '<button>Watch Now</button>' },
      global: { stubs: { NuxtImg: NuxtImgStub, UBadge: UBadgeStub } },
    })

    wrappers.push(w)

    expect(w.text()).toContain('Watch Now')
  })

  it('renders with minimal props', () => {
    const wrapper = mountComponent({ title: 'Minimal', backdrop: null })
    expect(wrapper.find('h1').text()).toBe('Minimal')
  })
})
