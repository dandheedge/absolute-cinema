/**
 * Zod Schemas for API Validation
 * Runtime validation and type inference for HackerRank and IMDb APIs
 */

import { z } from 'zod'

// ============================================================================
// HackerRank Movies API Schemas
// ============================================================================

export const MovieSearchResultSchema = z.object({
  Title: z.string(),
  Year: z.number(),
  imdbID: z.string().startsWith('tt'),
})

export const MoviesApiResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(MovieSearchResultSchema),
})

// ============================================================================
// IMDb API Schemas
// ============================================================================

export const ImdbImageSchema = z.object({
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const ImdbPersonSchema = z.object({
  id: z.string(),
  displayName: z.string().optional(),
  name: z.string().optional(),
  alternativeNames: z.array(z.string()).optional(),
  primaryImage: ImdbImageSchema.optional(),
  primaryProfessions: z.array(z.string()).optional(),
})

export const ImdbRatingSchema = z.object({
  aggregateRating: z.number().optional(),
  voteCount: z.number().optional(),
})

export const ImdbMetacriticSchema = z.object({
  score: z.number().optional(),
  reviewCount: z.number().optional(),
})

export const ImdbCountrySchema = z.object({
  code: z.string(),
  name: z.string(),
})

export const ImdbLanguageSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export const ImdbInterestSchema = z.object({
  id: z.string(),
  name: z.string(),
  isSubgenre: z.boolean().optional(),
})

export const ImdbMovieSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  primaryTitle: z.string().optional(),
  title: z.string().optional(),
  primaryImage: ImdbImageSchema.optional(),
  originalTitle: z.string().optional(),
  fullTitle: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  startYear: z.number().optional(),
  runtimeSeconds: z.number().optional(),
  runtimeMinutes: z.number().optional(),
  runtimeStr: z.string().optional(),
  plot: z.string().optional(),
  genres: z.union([z.array(z.string()), z.string()]).optional(),
  rating: ImdbRatingSchema.optional(),
  metacritic: ImdbMetacriticSchema.optional(),
  directors: z.array(ImdbPersonSchema).optional(),
  writers: z.array(ImdbPersonSchema).optional(),
  stars: z.array(ImdbPersonSchema).optional(),
  originCountries: z.array(ImdbCountrySchema).optional(),
  spokenLanguages: z.array(ImdbLanguageSchema).optional(),
  interests: z.array(ImdbInterestSchema).optional(),
  // Legacy fields for backward compatibility
  image: z.string().optional(),
  releaseDate: z.string().optional(),
  plotLocal: z.string().optional(),
  plotLocalIsRtl: z.boolean().optional(),
  awards: z.string().optional(),
  directorList: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  writerList: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  starList: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  actorList: z.array(z.object({ 
    id: z.string(), 
    name: z.string(),
    asCharacter: z.string().optional(),
  })).optional(),
  genreList: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  companies: z.string().optional(),
  companyList: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  countries: z.string().optional(),
  countryList: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  languages: z.string().optional(),
  languageList: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  contentRating: z.string().optional(),
  imDbRating: z.string().optional(),
  imDbRatingVotes: z.string().optional(),
  metacriticRating: z.string().optional(),
  ratings: z.object({
    imDbId: z.string().optional(),
    imDb: z.string().optional(),
    metacritic: z.string().optional(),
    theMovieDb: z.string().optional(),
    rottenTomatoes: z.string().optional(),
    filmAffinity: z.string().optional(),
  }).optional(),
  tagline: z.string().optional(),
  keywords: z.string().optional(),
  keywordList: z.array(z.string()).optional(),
  errorMessage: z.string().optional(),
})

// Export inferred types
export type MovieSearchResult = z.infer<typeof MovieSearchResultSchema> & {
  imageUrl?: string // Extended with our custom field for fetched images
}

export type MoviesApiResponse = z.infer<typeof MoviesApiResponseSchema>
export type ImdbMovie = z.infer<typeof ImdbMovieSchema>

// ============================================================================
// Validation helpers
// ============================================================================

/**
 * Safely parse and validate data with a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param errorMessage - Custom error message
 */
export function parseWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Invalid data format',
): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    console.error('Validation error:', result.error.format())
    throw new Error(`${errorMessage}: ${result.error.message}`)
  }
  
  return result.data
}

