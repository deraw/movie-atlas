import type {
  TmdbCastMember,
  MovieVideo,
} from '#shared/types/tmdb'

export interface MovieSummary {
  id: number
  title: string
  overview: string
  vote_average: number
  release_date: string
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
