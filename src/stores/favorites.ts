/**
 * Favorites Store
 * Manages user's favorite movies with localStorage persistence
 */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { MovieSearchResult } from '@/api/types'
import { useLocalStorage } from '@vueuse/core'
import { STORAGE_KEYS } from '@/utils/constants'

export interface FavoriteMovie extends MovieSearchResult {
  addedAt: number // timestamp
}

export const useFavoritesStore = defineStore('favorites', () => {
  // State - persisted to localStorage
  const favorites = useLocalStorage<FavoriteMovie[]>(STORAGE_KEYS.FAVORITES, [])

  // Computed
  const favoriteCount = computed(() => favorites.value.length)
  const hasFavorites = computed(() => favorites.value.length > 0)
  const favoriteIds = computed(() =>
    new Set(favorites.value.map((f) => f.imdbID)),
  )

  // Actions
  function isFavorite(imdbId: string): boolean {
    return favoriteIds.value.has(imdbId)
  }

  function addFavorite(movie: MovieSearchResult) {
    if (isFavorite(movie.imdbID)) return

    const favoriteMovie: FavoriteMovie = {
      ...movie,
      addedAt: Date.now(),
    }

    favorites.value = [favoriteMovie, ...favorites.value]
  }

  function removeFavorite(imdbId: string) {
    favorites.value = favorites.value.filter((f) => f.imdbID !== imdbId)
  }

  function toggleFavorite(movie: MovieSearchResult) {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID)
    } else {
      addFavorite(movie)
    }
  }

  function clearFavorites() {
    favorites.value = []
  }

  function getFavorite(imdbId: string): FavoriteMovie | undefined {
    return favorites.value.find((f) => f.imdbID === imdbId)
  }

  function getFavoritesByYear(year: number): FavoriteMovie[] {
    return favorites.value.filter((f) => f.Year === year)
  }

  function getFavoritesSorted(
    sortBy: 'title' | 'year' | 'addedAt',
    order: 'asc' | 'desc' = 'asc',
  ): FavoriteMovie[] {
    const sorted = [...favorites.value].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.Title.localeCompare(b.Title)
          break
        case 'year':
          comparison = a.Year - b.Year
          break
        case 'addedAt':
          comparison = a.addedAt - b.addedAt
          break
      }

      return order === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  return {
    // State
    favorites,

    // Computed
    favoriteCount,
    hasFavorites,
    favoriteIds,

    // Actions
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavorite,
    getFavoritesByYear,
    getFavoritesSorted,
  }
})

