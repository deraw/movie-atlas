import type {
  TmdbCastMember,
  MovieVideo,
} from '#shared/types/tmdb'

export interface MovieSummary {
  id: number
  title: string
  overview: string
  vote_average: number
  release_date: string | null
  poster_path: string | null
  backdrop_path: string | null
}

export interface MovieDetails extends MovieSummary {
  tagline: string | null
  runtime: number | null
  genres: {
    id: number
    name: string
  }[]
  original_title: string
  original_language: string
  status: string
  spoken_languages: {
    english_name: string
    iso_639_1: string
  }[]
  budget: number
  revenue: number
}

export interface TrendingMoviesPayload {
  results: MovieSummary[]
}

export interface MovieDetailsPayload {
  movie: MovieDetails
  cast: TmdbCastMember[]
  recommendations: MovieSummary[]
  trailer: MovieVideo | null
}

export interface CataloguePayload {
  page: number
  total_pages: number
  total_results: number
  results: MovieSummary[]
}

export enum SortBy {
  Popularity = 'popularity.desc',
  VoteAverage = 'vote_average.desc',
  ReleaseDate = 'primary_release_date.desc',
}

export type SortByValue = `${SortBy}`
