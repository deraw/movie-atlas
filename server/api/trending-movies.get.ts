import type { TmdbTrendingResponse } from '#shared/types/tmdb'
import type { TrendingMoviesPayload } from '#shared/types/movies'

export default defineEventHandler(async (): Promise<TrendingMoviesPayload> => {
  const config = useRuntimeConfig()

  // @see https://developer.themoviedb.org/reference/trending-movies
  const data = await $fetch<TmdbTrendingResponse>(`${config.tmdbApiUrl}/trending/movie/day`, {
    headers: {
      Authorization: `Bearer ${config.tmdbToken}`
    },
    params: {
      language: config.public.appLocale
    }
  })

  // Keep only necessary fields and limit to 10 results
  const results = data.results.slice(0, 10).map(movie => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path
  }))

  return { results }
})
