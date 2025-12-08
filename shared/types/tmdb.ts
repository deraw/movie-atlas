// Movie List
export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string | null
  vote_average: number
  vote_count: number
  popularity: number

  media_type?: string
  adult?: boolean
  original_language?: string
  genre_ids?: number[]
}

export interface TmdbMovieListResponse {
  page: number
  total_pages: number
  total_results: number
  results: TmdbMovie[]
}

// Trending Movies
export interface TmdbTrendingMovie {
  adult: boolean
  backdrop_path: string | null
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  media_type?: string
  original_language: string
  genre_ids?: number[]
  popularity: number
  release_date: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TmdbTrendingResponse {
  page: number
  results: TmdbTrendingMovie[]
  total_pages: number
  total_results: number
}

// Recommendations
export interface TmdbRecommendations {
  page: number
  results: TmdbMovie[]
  total_pages: number
  total_results: number
}

// Videos
export interface MovieVideo {
  id: string
  key: string
  name: string
  site: 'YouTube' | 'Vimeo'
  type:
    | 'Trailer'
    | 'Teaser'
    | 'Clip'
    | 'Featurette'
    | 'Behind the Scenes'
    | 'Bloopers'
    | 'Opening Credits'
    | 'Other'
  official?: boolean
  published_at?: string
}

export interface TmdbVideos {
  results: MovieVideo[]
}

// Credits
export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbCredits {
  id: number
  cast: TmdbCastMember[]
}

// Movie Full
export interface TmdbMovieDetails {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: {
    id: number
  } | null
  budget: number
  genres: {
    id: number
    name: string
  }[]
  homepage: string | null
  id: number
  imdb_id: string | null
  original_language: string
  original_title: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: {
    id: number
    name: string
    logo_path: string | null
    origin_country: string
  }[]
  production_countries: {
    iso_3166_1: string
    name: string
  }[]
  release_date: string
  revenue: number
  runtime: number | null
  spoken_languages: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status: string
  tagline: string | null
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

// Full Movie Response (details + credits + recommendations + videos)
export interface TmdbMovieResponse extends TmdbMovieDetails {
  credits: TmdbCredits
  recommendations: TmdbRecommendations
  videos: TmdbVideos
}
