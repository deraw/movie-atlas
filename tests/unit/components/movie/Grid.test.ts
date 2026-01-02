import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MoviesGrid from '~/components/movie/Grid.vue'
import type { MovieSummary } from '#shared/types/movies'

const MovieCardStub = {
  name: 'MovieCard',
  props: ['movie'],
  template: '<div data-testid="movie-card">{{ movie.title }}</div>',
}

describe('MoviesGrid.vue', () => {
  const movies = [
    { id: 1, title: 'Movie One' },
    { id: 2, title: 'Movie Two' },
    { id: 3, title: 'Movie Three' },
  ]

  function mountComponent(overrides = {}) {
    return mount(MoviesGrid, {
      props: {
        movies: movies as MovieSummary[],
      },
      global: {
        stubs: {
          MovieCard: MovieCardStub,
        },
      },
      ...overrides,
    })
  }

  it('renders the grid container', () => {
    const wrapper = mountComponent()
    expect(wrapper.classes()).toContain('grid')
    expect(wrapper.classes()).toContain('grid-cols-1')
  })

  it('renders one MovieCard per movie', () => {
    const wrapper = mountComponent()
    const cards = wrapper.findAll('[data-testid="movie-card"]')
    expect(cards).toHaveLength(movies.length)
  })

  it('passes the correct movie prop to each MovieCard', () => {
    const wrapper = mountComponent()

    const cards = wrapper.findAllComponents(MovieCardStub)
    expect(cards).toHaveLength(movies.length)

    cards.forEach((card, index) => {
      expect(card.props('movie')).toEqual(movies[index])
    })
  })

  it('renders nothing when movies array is empty', () => {
    const wrapper = mountComponent({
      props: { movies: [] },
    })

    expect(wrapper.findAll('[data-testid="movie-card"]')).toHaveLength(0)
  })
})
