import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import FavoriteButton from '~/components/FavoriteButton.vue'
import type { MovieSummary } from '#shared/types/movies'

const isFavoriteMock = vi.fn<(id: number) => boolean>()
const toggleFavoriteMock = vi.fn<(movie: MovieSummary) => void>()

vi.mock('~/composables/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: isFavoriteMock,
    toggleFavorite: toggleFavoriteMock,
  }),
}))

vi.mock('#imports', () => ({
  useFavorites: () => ({
    isFavorite: isFavoriteMock,
    toggleFavorite: toggleFavoriteMock,
  }),
}))

vi.mock('#app', () => ({
  useFavorites: () => ({
    isFavorite: isFavoriteMock,
    toggleFavorite: toggleFavoriteMock,
  }),
}))

const UButtonStub = {
  name: 'UButton',
  props: ['icon', 'ariaLabel', 'size'],
  emits: ['click'],
  template: `
    <button
      data-testid="btn"
      :data-icon="icon"
      :data-size="size"
      :aria-label="ariaLabel"
      @click="$emit('click')"
    >
      <slot />
    </button>
  `,
}

describe('FavoriteButton.vue', () => {
  const movie = { id: 42, title: 'Test Movie' } as MovieSummary

  function mountComponent(overrides: { showLabel?: boolean, size?: 'xs' | 'sm' | 'md' | 'lg' } = {}) {
    return mount(FavoriteButton, {
      props: {
        movie,
        ...overrides,
      },
      global: {
        stubs: {
          UButton: UButtonStub,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    isFavoriteMock.mockReturnValue(false)
  })

  it('renders non-favorite state when showLabel is false/omitted', () => {
    const wrapper = mountComponent()

    const btn = wrapper.get('[data-testid="btn"]')
    expect(btn.attributes('data-icon')).toBe('i-heroicons-heart')
    expect(btn.attributes('aria-label')).toBe('Ajouter aux favoris')

    const span = wrapper.get('span')
    expect(span.attributes('style')).toContain('display: none')
  })

  it('renders favorite state when movie is already favorite', () => {
    isFavoriteMock.mockReturnValue(true)
    const wrapper = mountComponent()

    const btn = wrapper.get('[data-testid="btn"]')
    expect(btn.attributes('data-icon')).toBe('i-heroicons-heart-solid')
    expect(btn.attributes('aria-label')).toBe('Retirer des favoris')
  })

  it('renders label text and removes aria-label when showLabel is true', () => {
    isFavoriteMock.mockReturnValue(false)
    const wrapper = mountComponent({ showLabel: true })

    const btn = wrapper.get('[data-testid="btn"]')
    expect(btn.attributes('aria-label')).toBeUndefined()

    const label = wrapper.get('span')
    expect(label.text()).toBe('Ajouter aux favoris')
  })

  it('updates label text when favorite and showLabel is true', () => {
    isFavoriteMock.mockReturnValue(true)
    const wrapper = mountComponent({ showLabel: true })

    const label = wrapper.get('span')
    expect(label.text()).toBe('Retirer des favoris')
  })

  it('defaults size to md when not provided', () => {
    const wrapper = mountComponent()
    const btn = wrapper.get('[data-testid="btn"]')
    expect(btn.attributes('data-size')).toBe('md')
  })

  it('passes provided size to UButton', () => {
    const wrapper = mountComponent({ size: 'lg' })
    const btn = wrapper.get('[data-testid="btn"]')
    expect(btn.attributes('data-size')).toBe('lg')
  })

  it('calls toggleFavorite with movie on click', async () => {
    const wrapper = mountComponent()

    await wrapper.get('[data-testid="btn"]').trigger('click')

    expect(toggleFavoriteMock).toHaveBeenCalledTimes(1)
    expect(toggleFavoriteMock).toHaveBeenCalledWith(movie)
  })
})
