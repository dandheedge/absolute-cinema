/**
 * API Mocks
 * Mock data for testing
 */

import type { ImdbMovie, MoviesApiResponse } from '@/api/types'

export const mockMoviesApiResponse: MoviesApiResponse = {
  page: 1,
  per_page: 10,
  total: 25,
  total_pages: 3,
  data: [
    {
      Title: 'The Matrix',
      Year: 1999,
      imdbID: 'tt0133093',
    },
    {
      Title: 'The Matrix Reloaded',
      Year: 2003,
      imdbID: 'tt0234215',
    },
    {
      Title: 'The Matrix Revolutions',
      Year: 2003,
      imdbID: 'tt0242653',
    },
  ],
}

export const mockImdbMovie: ImdbMovie = {
  id: 'tt0133093',
  title: 'The Matrix',
  year: '1999',
  image: 'https://example.com/matrix.jpg',
  releaseDate: '1999-03-31',
  runtimeMinutes: 136,
  runtimeStr: '2h 16min',
  plot: 'A computer hacker learns about the true nature of reality.',
  directors: [
    { id: 'nm0905152', name: 'Lana Wachowski' },
    { id: 'nm0905154', name: 'Lilly Wachowski' },
  ],
  stars: [
    { id: 'nm0000206', name: 'Keanu Reeves' },
    { id: 'nm0000401', name: 'Laurence Fishburne' },
    { id: 'nm0000194', name: 'Carrie-Anne Moss' },
  ],
  genres: 'Action, Sci-Fi',
  genreList: [
    { key: 'action', value: 'Action' },
    { key: 'sci-fi', value: 'Sci-Fi' },
  ],
  contentRating: 'R',
  imDbRating: '8.7',
  imDbRatingVotes: '1,900,000',
  metacriticRating: '73',
}

export const mockMovieSearchResult = {
  Title: 'Inception',
  Year: 2010,
  imdbID: 'tt1375666',
}
