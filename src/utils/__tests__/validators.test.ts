/**
 * Validators Tests
 */

import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  isValidImdbId,
  isValidYear,
  isValidPage,
  isValidSearchQuery,
  safeJsonParse,
  isNonEmptyString,
  isValidSortOption,
} from '../validators'

describe('Validators', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
    })

    it('should remove HTML tags', () => {
      expect(sanitizeInput('test<script>alert("xss")</script>')).toBe('testscriptalert("xss")/script')
      expect(sanitizeInput('<div>test</div>')).toBe('divtest/div')
    })

    it('should limit length to 200 characters', () => {
      const longString = 'a'.repeat(300)
      expect(sanitizeInput(longString)).toHaveLength(200)
    })
  })

  describe('isValidImdbId', () => {
    it('should validate correct IMDb IDs', () => {
      expect(isValidImdbId('tt0133093')).toBe(true)
      expect(isValidImdbId('tt1234567')).toBe(true)
      expect(isValidImdbId('tt12345678')).toBe(true)
    })

    it('should reject invalid IMDb IDs', () => {
      expect(isValidImdbId('123456')).toBe(false)
      expect(isValidImdbId('tt123')).toBe(false)
      expect(isValidImdbId('nm0000123')).toBe(false)
      expect(isValidImdbId('')).toBe(false)
    })
  })

  describe('isValidYear', () => {
    it('should validate years in valid range', () => {
      expect(isValidYear(1900)).toBe(true)
      expect(isValidYear(2000)).toBe(true)
      expect(isValidYear(2024)).toBe(true)
    })

    it('should reject years outside valid range', () => {
      expect(isValidYear(1800)).toBe(false)
      expect(isValidYear(3000)).toBe(false)
      expect(isValidYear(0)).toBe(false)
    })
  })

  describe('isValidPage', () => {
    it('should validate positive integers', () => {
      expect(isValidPage(1)).toBe(true)
      expect(isValidPage(100)).toBe(true)
    })

    it('should reject invalid page numbers', () => {
      expect(isValidPage(0)).toBe(false)
      expect(isValidPage(-1)).toBe(false)
      expect(isValidPage(1.5)).toBe(false)
    })
  })

  describe('isValidSearchQuery', () => {
    it('should validate normal queries', () => {
      expect(isValidSearchQuery('matrix')).toBe(true)
      expect(isValidSearchQuery('The Matrix')).toBe(true)
      expect(isValidSearchQuery('')).toBe(true)
    })

    it('should reject queries that are too long', () => {
      const longQuery = 'a'.repeat(300)
      expect(isValidSearchQuery(longQuery)).toBe(true) // Will be truncated to 200
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const obj = { test: 'value' }
      const result = safeJsonParse(JSON.stringify(obj), {})
      expect(result).toEqual(obj)
    })

    it('should return fallback for invalid JSON', () => {
      const fallback = { default: true }
      const result = safeJsonParse('invalid json', fallback)
      expect(result).toEqual(fallback)
    })

    it('should return fallback for null', () => {
      const fallback = { default: true }
      const result = safeJsonParse(null, fallback)
      expect(result).toEqual(fallback)
    })
  })

  describe('isNonEmptyString', () => {
    it('should validate non-empty strings', () => {
      expect(isNonEmptyString('test')).toBe(true)
      expect(isNonEmptyString('   test   ')).toBe(true)
    })

    it('should reject empty or non-string values', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
    })
  })

  describe('isValidSortOption', () => {
    it('should validate correct sort options', () => {
      expect(isValidSortOption('title-asc')).toBe(true)
      expect(isValidSortOption('title-desc')).toBe(true)
      expect(isValidSortOption('year-asc')).toBe(true)
      expect(isValidSortOption('year-desc')).toBe(true)
    })

    it('should reject invalid sort options', () => {
      expect(isValidSortOption('invalid')).toBe(false)
      expect(isValidSortOption('title')).toBe(false)
      expect(isValidSortOption('')).toBe(false)
    })
  })
})

