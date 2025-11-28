/**
 * Movies Store
 * Manages movie search results, pagination, and loading states
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MovieSearchResult, MoviesApiResponse } from '@/api/types'
import { searchMovies, getAllMovies } from '@/api/movies'
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
  async function fetchMovies(query: string, page = 1) {
    loading.value = true
    error.value = null

    try {
      const sanitizedQuery = sanitizeInput(query)
      let response: MoviesApiResponse

      if (sanitizedQuery) {
        response = await searchMovies({
          title: sanitizedQuery,
          page,
        })
      } else {
        response = await getAllMovies(page)
      }

      movies.value = response.data
      currentPage.value = response.page
      totalPages.value = response.total_pages
      totalResults.value = response.total
      perPage.value = response.per_page
      searchQuery.value = sanitizedQuery
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      movies.value = []
      totalPages.value = 0
      totalResults.value = 0
    } finally {
      loading.value = false
    }
  }

  async function searchMoviesByTitle(query: string) {
    currentPage.value = 1
    await fetchMovies(query, 1)
  }

  async function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return
    await fetchMovies(searchQuery.value, page)
  }

  async function nextPage() {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  async function previousPage() {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1)
    }
  }

  function clearError() {
    error.value = null
  }

  function reset() {
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

