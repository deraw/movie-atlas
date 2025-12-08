import type { TmdbMovieListResponse } from '#shared/types/tmdb'
import {
  type SortByValue,
  type CataloguePayload,
  type MovieSummary,
  SortBy,
} from '#shared/types/movies'

export default defineEventHandler(async (event): Promise<CataloguePayload> => {
  const config = useRuntimeConfig()

  const query = getQuery(event) as Partial<{
    page: string
    query: string
    year: string
    sortBy: SortByValue
    minVote: string
  }>

  const rawPage = query.page ? Number.parseInt(query.page, 10) : 1
  let page = Number.isFinite(rawPage) ? rawPage : 1

  if (page < 1) {
    page = 1
  }

  if (page > 500) {
    page = 500
  }

  const year = query.year || undefined
  const sortBy = query.sortBy ?? SortBy.Popularity
  const minVote = query.minVote ? Number.parseFloat(query.minVote) : undefined
  const searchQuery = query.query?.trim() || undefined

  const isSearch = Boolean(searchQuery)
  const endpoint = isSearch ? '/search/movie' : '/discover/movie'

  const tmdbQuery: Record<string, string | number | boolean | undefined> = {
    page,
    include_adult: false,
    language: config.public.appLocale,
  }

  if (isSearch) {
    tmdbQuery.query = searchQuery
  } else {
    tmdbQuery.sort_by = sortBy
    tmdbQuery['vote_average.gte'] = minVote
    tmdbQuery.include_video = false

    if (year) {
      tmdbQuery.primary_release_year = year
    }
  }

  const url = config.tmdbApiUrl + endpoint

  // @see https://developer.themoviedb.org/reference/discover-movie
  const tmdbResponse = await $fetch<TmdbMovieListResponse>(url, {
    query: tmdbQuery,
    headers: {
      Authorization: `Bearer ${config.tmdbToken}`,
    },
  })

  const results: MovieSummary[] = tmdbResponse.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  }))

  return {
    page: tmdbResponse.page,
    total_pages: tmdbResponse.total_pages,
    total_results: tmdbResponse.total_results,
    results,
  }
})
