/**
 * API Client
 * Configured Ky HTTP client instances
 */

import ky from 'ky'

// HackerRank Movies API client
export const moviesApiClient = ky.create({
  prefixUrl: 'https://jsonmock.hackerrank.com/api',
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      error => {
        const { response } = error
        if (response) {
          error.message = `Request failed with status ${response.status}: ${response.statusText}`
        }
        return error
      },
    ],
  },
})

// IMDb API client
export const imdbApiClient = ky.create({
  prefixUrl: 'https://api.imdbapi.dev',
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      error => {
        const { response } = error
        if (response) {
          error.message = `Request failed with status ${response.status}: ${response.statusText}`
        }
        return error
      },
    ],
  },
})
