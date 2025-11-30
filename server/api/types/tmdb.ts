export interface TmdbTrendingMovie {
  adult: boolean
  backdrop_path: string | null
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  media_type: 'movie'
  original_language: string
  genre_ids: number[]
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

export interface TrendingMoviesPayload {
  results: {
    id: number
    title: string
    overview: string
    vote_average: number
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
  }[]
}
