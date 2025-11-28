/**
 * Movie Details Store
 * Manages detailed movie information from IMDb API
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ImdbMovie } from '@/api/types'
import { getMovieDetails } from '@/api/imdb'
import { ApiError } from '@/api/types'

export const useMovieDetailsStore = defineStore('movieDetails', () => {
  // State
  const movieDetails = ref<Map<string, ImdbMovie>>(new Map())
  const currentMovie = ref<ImdbMovie | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasCurrentMovie = computed(() => currentMovie.value !== null)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchMovieDetails(imdbId: string, forceRefresh = false) {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && movieDetails.value.has(imdbId)) {
      currentMovie.value = movieDetails.value.get(imdbId)!
      return currentMovie.value
    }

    loading.value = true
    error.value = null

    try {
      const details = await getMovieDetails(imdbId)
      
      // Cache the result
      movieDetails.value.set(imdbId, details)
      currentMovie.value = details

      return details
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else {
        error.value = 'Failed to load movie details'
      }
      currentMovie.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  function getMovieFromCache(imdbId: string): ImdbMovie | undefined {
    return movieDetails.value.get(imdbId)
  }

  function clearCurrentMovie() {
    currentMovie.value = null
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  function clearCache() {
    movieDetails.value.clear()
  }

  return {
    // State
    currentMovie,
    loading,
    error,

    // Computed
    hasCurrentMovie,
    hasError,

    // Actions
    fetchMovieDetails,
    getMovieFromCache,
    clearCurrentMovie,
    clearError,
    clearCache,
  }
})

