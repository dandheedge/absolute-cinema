/**
 * Favorites Store Tests
 */

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockMovieSearchResult } from '@/tests/mocks/api'
import { useFavoritesStore } from '../favorites'

describe('Favorites Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty favorites', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toEqual([])
    expect(store.favoriteCount).toBe(0)
    expect(store.hasFavorites).toBe(false)
  })

  it('should add a movie to favorites', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)

    expect(store.favoriteCount).toBe(1)
    expect(store.hasFavorites).toBe(true)
    expect(store.isFavorite(mockMovieSearchResult.imdbID)).toBe(true)
  })

  it('should not add duplicate favorites', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)
    store.addFavorite(mockMovieSearchResult)

    expect(store.favoriteCount).toBe(1)
  })

  it('should remove a movie from favorites', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)
    expect(store.favoriteCount).toBe(1)

    store.removeFavorite(mockMovieSearchResult.imdbID)
    expect(store.favoriteCount).toBe(0)
    expect(store.isFavorite(mockMovieSearchResult.imdbID)).toBe(false)
  })

  it('should toggle favorite status', () => {
    const store = useFavoritesStore()

    // Add
    store.toggleFavorite(mockMovieSearchResult)
    expect(store.isFavorite(mockMovieSearchResult.imdbID)).toBe(true)

    // Remove
    store.toggleFavorite(mockMovieSearchResult)
    expect(store.isFavorite(mockMovieSearchResult.imdbID)).toBe(false)
  })

  it('should clear all favorites', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)
    store.addFavorite({ ...mockMovieSearchResult, imdbID: 'tt1234567' })

    expect(store.favoriteCount).toBe(2)

    store.clearFavorites()
    expect(store.favoriteCount).toBe(0)
    expect(store.favorites).toEqual([])
  })

  it('should get a favorite by imdbID', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)

    const favorite = store.getFavorite(mockMovieSearchResult.imdbID)
    expect(favorite).toBeDefined()
    expect(favorite?.imdbID).toBe(mockMovieSearchResult.imdbID)
  })

  it('should filter favorites by year', () => {
    const store = useFavoritesStore()
    store.addFavorite({ Title: 'Movie 1', Year: 2010, imdbID: 'tt1' })
    store.addFavorite({ Title: 'Movie 2', Year: 2020, imdbID: 'tt2' })

    const favorites2010 = store.getFavoritesByYear(2010)
    expect(favorites2010).toHaveLength(1)
    expect(favorites2010[0].Year).toBe(2010)
  })

  it('should sort favorites by title ascending', () => {
    const store = useFavoritesStore()
    store.addFavorite({ Title: 'Zebra', Year: 2020, imdbID: 'tt1' })
    store.addFavorite({ Title: 'Apple', Year: 2020, imdbID: 'tt2' })

    const sorted = store.getFavoritesSorted('title', 'asc')
    expect(sorted[0].Title).toBe('Apple')
    expect(sorted[1].Title).toBe('Zebra')
  })

  it('should sort favorites by title descending', () => {
    const store = useFavoritesStore()
    store.addFavorite({ Title: 'Apple', Year: 2020, imdbID: 'tt1' })
    store.addFavorite({ Title: 'Zebra', Year: 2020, imdbID: 'tt2' })

    const sorted = store.getFavoritesSorted('title', 'desc')
    expect(sorted[0].Title).toBe('Zebra')
    expect(sorted[1].Title).toBe('Apple')
  })

  it('should sort favorites by year', () => {
    const store = useFavoritesStore()
    store.addFavorite({ Title: 'New Movie', Year: 2020, imdbID: 'tt1' })
    store.addFavorite({ Title: 'Old Movie', Year: 1990, imdbID: 'tt2' })

    const sorted = store.getFavoritesSorted('year', 'asc')
    expect(sorted[0].Year).toBe(1990)
    expect(sorted[1].Year).toBe(2020)
  })

  it('should persist favorites to localStorage', () => {
    const store = useFavoritesStore()
    store.addFavorite(mockMovieSearchResult)

    // Create new store instance to test persistence
    const newStore = useFavoritesStore()
    expect(newStore.favoriteCount).toBe(1)
    expect(newStore.isFavorite(mockMovieSearchResult.imdbID)).toBe(true)
  })
})
