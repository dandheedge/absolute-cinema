/**
 * API Types
 * Type definitions for HackerRank and IMDb API responses
 */

// HackerRank Movies API Types
export interface MovieSearchResult {
  Title: string
  Year: number
  imdbID: string
}

export interface MoviesApiResponse {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: MovieSearchResult[]
}

// IMDb API Types
export interface ImdbRating {
  source: string
  value: number | string
}

export interface ImdbMovie {
  id: string
  title: string
  originalTitle?: string
  fullTitle?: string
  type?: string
  year: string
  image?: string
  releaseDate?: string
  runtimeMinutes?: number
  runtimeStr?: string
  plot?: string
  plotLocal?: string
  plotLocalIsRtl?: boolean
  awards?: string
  directors?: string
  directorList?: Array<{ id: string; name: string }>
  writers?: string
  writerList?: Array<{ id: string; name: string }>
  stars?: string
  starList?: Array<{ id: string; name: string }>
  actorList?: Array<{ id: string; name: string; asCharacter?: string }>
  genres?: string
  genreList?: Array<{ key: string; value: string }>
  companies?: string
  companyList?: Array<{ id: string; name: string }>
  countries?: string
  countryList?: Array<{ key: string; value: string }>
  languages?: string
  languageList?: Array<{ key: string; value: string }>
  contentRating?: string
  imDbRating?: string
  imDbRatingVotes?: string
  metacriticRating?: string
  ratings?: {
    imDbId?: string
    imDb?: string
    metacritic?: string
    theMovieDb?: string
    rottenTomatoes?: string
    filmAffinity?: string
  }
  wikipedia?: {
    plotShort?: {
      plainText?: string
      html?: string
    }
    plotFull?: {
      plainText?: string
      html?: string
    }
    errorMessage?: string
  }
  posters?: {
    imDbId?: string
    title?: string
    fullTitle?: string
    type?: string
    year?: string
    posters?: Array<{
      id: string
      link: string
      aspectRatio?: number
      language?: string
      width?: number
      height?: number
    }>
    backdrops?: Array<{
      id: string
      link: string
      aspectRatio?: number
      language?: string
      width?: number
      height?: number
    }>
    errorMessage?: string
  }
  images?: {
    imDbId?: string
    title?: string
    fullTitle?: string
    type?: string
    year?: string
    items?: Array<{
      title: string
      image: string
    }>
    errorMessage?: string
  }
  trailer?: {
    imDbId?: string
    title?: string
    fullTitle?: string
    type?: string
    year?: string
    videoId?: string
    videoUrl?: string
    errorMessage?: string
  }
  boxOffice?: {
    budget?: string
    openingWeekendUSA?: string
    grossUSA?: string
    cumulativeWorldwideGross?: string
  }
  tagline?: string
  keywords?: string
  keywordList?: string[]
  similars?: Array<{
    id: string
    title: string
    image?: string
    imDbRating?: string
  }>
  tvSeriesInfo?: unknown
  tvEpisodeInfo?: unknown
  errorMessage?: string
}

// API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Type guards
export function isMoviesApiResponse(data: unknown): data is MoviesApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'page' in data &&
    'per_page' in data &&
    'total' in data &&
    'total_pages' in data &&
    'data' in data &&
    Array.isArray((data as MoviesApiResponse).data)
  )
}

export function isImdbMovie(data: unknown): data is ImdbMovie {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  )
}

