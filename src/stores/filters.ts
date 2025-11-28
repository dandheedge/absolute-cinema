/**
 * Filters Store
 * Manages search filters and sorting options
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FILTERS } from '@/utils/constants'
import type { MovieSearchResult } from '@/api/types'
import type { FavoriteMovie } from './favorites'

export type SortOption = 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc'

export const useFiltersStore = defineStore('filters', () => {
  // State
  const sortBy = ref<SortOption>('title-asc')
  const yearRange = ref<[number, number]>([FILTERS.MIN_YEAR, FILTERS.MAX_YEAR])
  const activeFiltersCount = ref(0)

  // Computed
  const hasActiveFilters = computed(() => {
    const isYearFiltered =
      yearRange.value[0] !== FILTERS.MIN_YEAR ||
      yearRange.value[1] !== FILTERS.MAX_YEAR
    const isSortChanged = sortBy.value !== FILTERS.DEFAULT_SORT
    return isYearFiltered || isSortChanged
  })

  // Actions
  function setSortBy(sort: SortOption) {
    sortBy.value = sort
  }

  function setYearRange(min: number, max: number) {
    yearRange.value = [
      Math.max(FILTERS.MIN_YEAR, min),
      Math.min(FILTERS.MAX_YEAR, max),
    ]
  }

  function clearFilters() {
    sortBy.value = FILTERS.DEFAULT_SORT as SortOption
    yearRange.value = [FILTERS.MIN_YEAR, FILTERS.MAX_YEAR]
  }

  function applyFilters<T extends MovieSearchResult | FavoriteMovie>(
    movies: T[],
  ): T[] {
    let filtered = [...movies]

    // Filter by year range
    filtered = filtered.filter(
      (movie) =>
        movie.Year >= yearRange.value[0] && movie.Year <= yearRange.value[1],
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'title-asc':
          return a.Title.localeCompare(b.Title)
        case 'title-desc':
          return b.Title.localeCompare(a.Title)
        case 'year-asc':
          return a.Year - b.Year
        case 'year-desc':
          return b.Year - a.Year
        default:
          return 0
      }
    })

    return filtered
  }

  function getYearRangeFromMovies(
    movies: (MovieSearchResult | FavoriteMovie)[],
  ): [number, number] {
    if (movies.length === 0) {
      return [FILTERS.MIN_YEAR, FILTERS.MAX_YEAR]
    }

    const years = movies.map((m) => m.Year)
    return [Math.min(...years), Math.max(...years)]
  }

  return {
    // State
    sortBy,
    yearRange,
    activeFiltersCount,

    // Computed
    hasActiveFilters,

    // Actions
    setSortBy,
    setYearRange,
    clearFilters,
    applyFilters,
    getYearRangeFromMovies,
  }
})

