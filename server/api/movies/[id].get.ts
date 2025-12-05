import type { TmdbMovieResponse } from '#shared/types/tmdb'

import type { MovieDetailsPayload, MovieDetails, MovieSummary } from '#shared/types/movies'

export default defineEventHandler(async (event): Promise<MovieDetailsPayload> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing movie id',
    })
  }

  // @see https://developer.themoviedb.org/reference/movie-details
  const data = await $fetch<TmdbMovieResponse>(
    `${config.tmdbApiUrl}/movie/${id}`,
    {
      headers: {
        Authorization: `Bearer ${config.tmdbToken}`,
      },
      params: {
        language: config.public.appLocale,
        append_to_response: 'credits,recommendations,videos',
      },
    },
  )

  const movie: MovieDetails = {
    id: data.id,
    title: data.title,
    overview: data.overview ?? '',
    vote_average: data.vote_average,
    release_date: data.release_date,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    tagline: data.tagline,
    runtime: data.runtime,
    genres: data.genres,
    original_title: data.original_title,
    original_language: data.original_language,
    status: data.status,
    spoken_languages: data.spoken_languages.map(language => ({
      english_name: language.english_name,
      iso_639_1: language.iso_639_1,
    })),
    budget: data.budget,
    revenue: data.revenue,
  }

  const cast: TmdbCastMember[]
    = data.credits?.cast?.slice(0, 12) ?? []

  const recommendations: MovieSummary[] = data.recommendations?.results?.slice(0, 10)
    .map((movie: TmdbTrendingMovie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    })) ?? []

  const videos: MovieVideo[] = data.videos?.results ?? []

  const trailer = videos.find(
    video => video.site === 'YouTube' && video.type === 'Trailer',
  ) ?? null

  return {
    movie,
    cast,
    recommendations,
    trailer,
  }
})
