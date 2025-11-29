/**
 * Movies API Service
 * Handles HackerRank Movies API requests
 */

import type { MoviesApiResponse } from './types'
import { HTTPError } from 'ky'
import { moviesApiClient } from './client'
import { ApiError, isMoviesApiResponse } from './types'

export interface SearchMoviesParams {
  title: string
  page?: number
}

/**
 * Search movies by title
 * @param params - Search parameters
 * @returns Promise with movies search results
 * @throws ApiError if request fails or response is invalid
 */
export async function searchMovies (
  params: SearchMoviesParams,
): Promise<MoviesApiResponse> {
  try {
    const searchParams = new URLSearchParams({
      Title: params.title,
      page: String(params.page || 1),
    })

    const response = await moviesApiClient
      .get(`movies/search?${searchParams.toString()}`)
      .json()

    // Validate response structure
    if (!isMoviesApiResponse(response)) {
      throw new ApiError('Invalid API response format')
    }

    return response
  } catch (error) {
    if (error instanceof HTTPError) {
      const statusCode = error.response.status
      let message = 'Failed to search movies'

      if (statusCode === 404) {
        message = 'No movies found'
      } else if (statusCode === 429) {
        message = 'Too many requests. Please try again later'
      } else if (statusCode >= 500) {
        message = 'Server error. Please try again later'
      }

      throw new ApiError(message, statusCode, error.response)
    }

    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError('Network error. Please check your connection')
  }
}

/**
 * Get all movies (default search)
 * @param page - Page number
 * @returns Promise with movies search results
 */
export async function getAllMovies (page = 1): Promise<MoviesApiResponse> {
  return searchMovies({ title: '', page })
}
