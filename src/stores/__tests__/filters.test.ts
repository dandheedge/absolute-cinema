/**
 * Filters Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFiltersStore } from '../filters'
import { FILTERS } from '@/utils/constants'

describe('Filters Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useFiltersStore()
    expect(store.sortBy).toBe('title-asc')
    expect(store.yearRange).toEqual([FILTERS.MIN_YEAR, FILTERS.MAX_YEAR])
    expect(store.hasActiveFilters).toBe(false)
  })

  it('should change sort option', () => {
    const store = useFiltersStore()
    store.setSortBy('year-desc')
    expect(store.sortBy).toBe('year-desc')
  })

  it('should change year range', () => {
    const store = useFiltersStore()
    store.setYearRange(2000, 2020)
    expect(store.yearRange).toEqual([2000, 2020])
  })

  it('should detect active filters when year range changes', () => {
    const store = useFiltersStore()
    expect(store.hasActiveFilters).toBe(false)

    store.setYearRange(2000, 2020)
    expect(store.hasActiveFilters).toBe(true)
  })

  it('should detect active filters when sort changes', () => {
    const store = useFiltersStore()
    expect(store.hasActiveFilters).toBe(false)

    store.setSortBy('year-desc')
    expect(store.hasActiveFilters).toBe(true)
  })

  it('should clear all filters', () => {
    const store = useFiltersStore()
    store.setSortBy('year-desc')
    store.setYearRange(2000, 2020)

    expect(store.hasActiveFilters).toBe(true)

    store.clearFilters()
    expect(store.sortBy).toBe('title-asc')
    expect(store.yearRange).toEqual([FILTERS.MIN_YEAR, FILTERS.MAX_YEAR])
    expect(store.hasActiveFilters).toBe(false)
  })

  it('should filter movies by year range', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'Movie 1', Year: 1990, imdbID: 'tt1' },
      { Title: 'Movie 2', Year: 2000, imdbID: 'tt2' },
      { Title: 'Movie 3', Year: 2010, imdbID: 'tt3' },
    ]

    store.setYearRange(1995, 2005)
    const filtered = store.applyFilters(movies)

    expect(filtered).toHaveLength(1)
    expect(filtered[0].Year).toBe(2000)
  })

  it('should sort movies by title ascending', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'Zebra', Year: 2020, imdbID: 'tt1' },
      { Title: 'Apple', Year: 2020, imdbID: 'tt2' },
    ]

    store.setSortBy('title-asc')
    const sorted = store.applyFilters(movies)

    expect(sorted[0].Title).toBe('Apple')
    expect(sorted[1].Title).toBe('Zebra')
  })

  it('should sort movies by title descending', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'Apple', Year: 2020, imdbID: 'tt1' },
      { Title: 'Zebra', Year: 2020, imdbID: 'tt2' },
    ]

    store.setSortBy('title-desc')
    const sorted = store.applyFilters(movies)

    expect(sorted[0].Title).toBe('Zebra')
    expect(sorted[1].Title).toBe('Apple')
  })

  it('should sort movies by year ascending', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'New', Year: 2020, imdbID: 'tt1' },
      { Title: 'Old', Year: 1990, imdbID: 'tt2' },
    ]

    store.setSortBy('year-asc')
    const sorted = store.applyFilters(movies)

    expect(sorted[0].Year).toBe(1990)
    expect(sorted[1].Year).toBe(2020)
  })

  it('should sort movies by year descending', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'Old', Year: 1990, imdbID: 'tt1' },
      { Title: 'New', Year: 2020, imdbID: 'tt2' },
    ]

    store.setSortBy('year-desc')
    const sorted = store.applyFilters(movies)

    expect(sorted[0].Year).toBe(2020)
    expect(sorted[1].Year).toBe(1990)
  })

  it('should get year range from movies', () => {
    const store = useFiltersStore()
    const movies = [
      { Title: 'Movie 1', Year: 1990, imdbID: 'tt1' },
      { Title: 'Movie 2', Year: 2000, imdbID: 'tt2' },
      { Title: 'Movie 3', Year: 2020, imdbID: 'tt3' },
    ]

    const range = store.getYearRangeFromMovies(movies)
    expect(range).toEqual([1990, 2020])
  })

  it('should return default range for empty movies array', () => {
    const store = useFiltersStore()
    const range = store.getYearRangeFromMovies([])
    expect(range).toEqual([FILTERS.MIN_YEAR, FILTERS.MAX_YEAR])
  })

  it('should clamp year range to valid bounds', () => {
    const store = useFiltersStore()
    store.setYearRange(1800, 3000)

    expect(store.yearRange[0]).toBeGreaterThanOrEqual(FILTERS.MIN_YEAR)
    expect(store.yearRange[1]).toBeLessThanOrEqual(FILTERS.MAX_YEAR)
  })
})

