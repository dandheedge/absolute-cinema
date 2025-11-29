/**
 * Movies Store
 * Manages movie search results, pagination, and loading states
 */

import type { MoviesApiResponse, MovieSearchResult } from '@/api/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAllMovies, searchMovies } from '@/api/movies'
import { getMultipleMovieDetails } from '@/api/imdb'
import { ApiError } from '@/api/types'
import { sanitizeInput } from '@/utils/validators'

export const useMoviesStore = defineStore('movies', () => {
  // State
  const movies = ref<MovieSearchResult[]>([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalResults = ref(0)
  const perPage = ref(10)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasMovies = computed(() => movies.value.length > 0)
  const hasError = computed(() => error.value !== null)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  // Actions
  async function fetchMovies (query: string, page = 1) {
    loading.value = true
    error.value = null

    try {
      const sanitizedQuery = sanitizeInput(query)
      const response: MoviesApiResponse = await (sanitizedQuery
        ? searchMovies({
            title: sanitizedQuery,
            page,
          })
        : getAllMovies(page))

      // Fetch IMDb images for all movies in parallel
      const imdbIds = response.data.map(movie => movie.imdbID)
      const imdbDetails = await getMultipleMovieDetails(imdbIds)
      
      // Merge image URLs with movie data
      movies.value = response.data.map((movie, index) => ({
        ...movie,
        imageUrl: imdbDetails[index]?.primaryImage?.url || undefined,
      }))

      currentPage.value = response.page
      totalPages.value = response.total_pages
      totalResults.value = response.total
      perPage.value = response.per_page
      searchQuery.value = sanitizedQuery
    } catch (error_) {
      error.value = error_ instanceof ApiError ? error_.message : 'An unexpected error occurred'
      movies.value = []
      totalPages.value = 0
      totalResults.value = 0
    } finally {
      loading.value = false
    }
  }

  async function searchMoviesByTitle (query: string) {
    currentPage.value = 1
    await fetchMovies(query, 1)
  }

  async function goToPage (page: number) {
    if (page < 1 || page > totalPages.value) {
      return
    }
    await fetchMovies(searchQuery.value, page)
  }

  async function nextPage () {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  async function previousPage () {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1)
    }
  }

  function clearError () {
    error.value = null
  }

  function reset () {
    movies.value = []
    currentPage.value = 1
    totalPages.value = 0
    totalResults.value = 0
    searchQuery.value = ''
    loading.value = false
    error.value = null
  }

  return {
    // State
    movies,
    currentPage,
    totalPages,
    totalResults,
    perPage,
    searchQuery,
    loading,
    error,

    // Computed
    hasMovies,
    hasError,
    hasNextPage,
    hasPreviousPage,

    // Actions
    fetchMovies,
    searchMoviesByTitle,
    goToPage,
    nextPage,
    previousPage,
    clearError,
    reset,
  }
})
