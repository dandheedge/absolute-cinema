/**
 * Application Constants
 */

// API Configuration
export const API_CONFIG = {
  MOVIES_BASE_URL: 'https://jsonmock.hackerrank.com/api',
  IMDB_BASE_URL: 'https://api.imdbapi.dev',
  REQUEST_TIMEOUT: 10000,
  RETRY_LIMIT: 2,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_PAGES: 5,
} as const

// Search
export const SEARCH = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 1,
  DEFAULT_QUERY: '',
} as const

// Filters
export const FILTERS = {
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear() + 1,
  DEFAULT_SORT: 'title-asc',
} as const

export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'year-asc', label: 'Year (Oldest First)' },
  { value: 'year-desc', label: 'Year (Newest First)' },
] as const

// LocalStorage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'movie-favorites',
  THEME: 'app-theme',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  FAVORITES: '/favorites',
  MOVIE_DETAIL: '/movie',
} as const

// Messages
export const MESSAGES = {
  NO_RESULTS: 'No movies found. Try a different search term.',
  NO_FAVORITES: 'You haven\'t added any favorites yet.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  LOADING: 'Loading...',
  RETRY: 'Retry',
} as const

// Images
export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x450'

