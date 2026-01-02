import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import Card from '~/components/movie/Card.vue'
import type { MovieSummary } from '#shared/types/movies'

import { mockComposables } from '../../mocks/composables'

mockComposables()

const mockMovie: MovieSummary = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  release_date: '2024-01-15',
  vote_average: 8.5,
  overview: 'This is a test movie overview.',
  backdrop_path: '/test-backdrop.jpg',
}

const mockMovieNoPoster: MovieSummary = {
  ...mockMovie,
  poster_path: null,
}

const mockMovieNoDate: MovieSummary = {
  ...mockMovie,
  release_date: null,
}

const mockMovieNoOverview: MovieSummary = {
  ...mockMovie,
  overview: '',
}

describe('Card.vue', () => {
  function mountComponent(props = { movie: mockMovie }) {
    return mount(Card, {
      props,
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
          NuxtImg: {
            props: ['src', 'alt'],
            template: '<img :src="src" :alt="alt" />',
          },
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie title', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Test Movie')
  })

  it('displays vote average with one decimal', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('8.5')
  })

  it('renders movie overview', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('This is a test movie overview.')
  })

  it('shows placeholder text when no overview available', () => {
    const wrapper = mountComponent({ movie: mockMovieNoOverview })
    expect(wrapper.text()).toContain('Pas de synopsis disponible.')
  })

  it('shows placeholder text when no release date available', () => {
    const wrapper = mountComponent({ movie: mockMovieNoDate })
    expect(wrapper.text()).toContain('Date inconnue')
  })

  it('shows placeholder when no poster available', () => {
    const wrapper = mountComponent({ movie: mockMovieNoPoster })
    expect(wrapper.text()).toContain('Aucune affiche')
  })

  it('renders details button with correct link', () => {
    const wrapper = mountComponent()
    const button = wrapper.findComponent({ name: 'UButton' })
    expect(button.props('to')).toBe('/movie/1')
    expect(button.text()).toBe('Détails')
  })

  it('renders FavoriteButton with movie prop', () => {
    const wrapper = mountComponent()
    const favoriteBtn = wrapper.findComponent({ name: 'FavoriteButton' })
    expect(favoriteBtn.props('movie')).toEqual(mockMovie)
  })

  it('renders poster image with correct src', () => {
    const wrapper = mountComponent()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('/test-poster.jpg')
  })

  it('handles vote average of 0', () => {
    const wrapper = mountComponent({
      movie: { ...mockMovie, vote_average: 0 },
    })

    expect(wrapper.text()).toContain('0')
  })

  it('renders card with all required components', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'UButton' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FavoriteButton' }).exists()).toBe(true)
  })
})
