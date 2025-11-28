/**
 * IMDb API Service
 * Handles IMDb API requests for detailed movie information
 */

import { HTTPError } from 'ky'
import { imdbApiClient } from './client'
import type { ImdbMovie } from './types'
import { ApiError, isImdbMovie } from './types'

/**
 * Get detailed movie information by IMDb ID
 * @param imdbId - IMDb ID (e.g., 'tt0234282')
 * @returns Promise with detailed movie information
 * @throws ApiError if request fails or response is invalid
 */
export async function getMovieDetails(imdbId: string): Promise<ImdbMovie> {
  try {
    // Validate imdbId format
    if (!imdbId || !imdbId.startsWith('tt')) {
      throw new ApiError('Invalid IMDb ID format')
    }

    const response = await imdbApiClient.get(`titles/${imdbId}`).json()

    // Check for API error message in response
    if (
      response &&
      typeof response === 'object' &&
      'errorMessage' in response &&
      response.errorMessage
    ) {
      throw new ApiError(
        String(response.errorMessage),
        404,
        response,
      )
    }

    // Validate response structure
    if (!isImdbMovie(response)) {
      throw new ApiError('Invalid movie data received')
    }

    return response
  } catch (error) {
    if (error instanceof HTTPError) {
      const statusCode = error.response.status
      let message = 'Failed to fetch movie details'

      if (statusCode === 404) {
        message = 'Movie not found'
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
 * Get multiple movie details in parallel
 * @param imdbIds - Array of IMDb IDs
 * @returns Promise with array of movie details (null for failed requests)
 */
export async function getMultipleMovieDetails(
  imdbIds: string[],
): Promise<Array<ImdbMovie | null>> {
  const requests = imdbIds.map(async (id) => {
    try {
      return await getMovieDetails(id)
    } catch {
      return null
    }
  })

  return Promise.all(requests)
}

