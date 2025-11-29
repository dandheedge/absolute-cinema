/**
 * API Types
 * Type definitions exported from Zod schemas for runtime validation
 */

// Re-export types inferred from Zod schemas
export type { 
  MovieSearchResult,
  MoviesApiResponse,
  ImdbMovie,
} from './schemas'

// Re-export schemas for validation
export {
  MovieSearchResultSchema,
  MoviesApiResponseSchema,
  ImdbMovieSchema,
  parseWithSchema,
} from './schemas'

// API Error Types
export class ApiError extends Error {
  constructor (
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

