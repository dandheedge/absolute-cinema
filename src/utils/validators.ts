/**
 * Validation Utilities
 */

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput (input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 200) // Limit length
}

/**
 * Validate IMDb ID format
 */
export function isValidImdbId (id: string): boolean {
  return /^tt\d{7,}$/.test(id)
}

/**
 * Validate year range
 */
export function isValidYear (year: number): boolean {
  const currentYear = new Date().getFullYear()
  return year >= 1900 && year <= currentYear + 5
}

/**
 * Validate page number
 */
export function isValidPage (page: number): boolean {
  return Number.isInteger(page) && page > 0
}

/**
 * Validate search query
 */
export function isValidSearchQuery (query: string): boolean {
  const sanitized = sanitizeInput(query)
  return sanitized.length >= 0 && sanitized.length <= 200
}

/**
 * Safely parse JSON from localStorage
 */
export function safeJsonParse<T> (json: string | null, fallback: T): T {
  if (!json) {
    return fallback
  }

  try {
    const parsed = JSON.parse(json)
    return parsed as T
  } catch {
    return fallback
  }
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString (value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validate and parse sort option
 */
export function isValidSortOption (
  value: string,
): value is 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc' {
  return ['title-asc', 'title-desc', 'year-asc', 'year-desc'].includes(value)
}
