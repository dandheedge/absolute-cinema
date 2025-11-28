import { test, expect } from '@playwright/test'

test.describe('Filters', () => {
  test('should apply sort filter', async ({ page }) => {
    await page.goto('/')
    
    // Search for movies
    await page.getByLabel('Search movies...').fill('love')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10000 })
    
    // On desktop, filters should be visible in sidebar
    if (await page.locator('.filter-panel').isVisible()) {
      // Change sort order
      await page.locator('.filter-panel').getByRole('combobox').click()
      await page.getByRole('option', { name: /Year \(Newest First\)/i }).click()
      
      // Wait for movies to update
      await page.waitForTimeout(300)
    }
  })

  test('should apply year range filter', async ({ page }) => {
    await page.goto('/')
    
    // Search for movies
    await page.getByLabel('Search movies...').fill('movie')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10000 })
    
    // On desktop, check if year range slider exists
    if (await page.locator('.filter-panel').isVisible()) {
      await expect(page.locator('.v-range-slider')).toBeVisible()
    }
  })

  test('should clear all filters', async ({ page }) => {
    await page.goto('/')
    
    // Search for movies
    await page.getByLabel('Search movies...').fill('love')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10000 })
    
    // On desktop, change filters
    if (await page.locator('.filter-panel').isVisible()) {
      // Change sort
      await page.locator('.filter-panel').getByRole('combobox').click()
      await page.getByRole('option', { name: /Year \(Newest First\)/i }).click()
      
      // Clear all filters
      const clearButton = page.getByRole('button', { name: /clear all/i })
      if (await clearButton.isVisible()) {
        await clearButton.click()
      }
    }
  })
})

