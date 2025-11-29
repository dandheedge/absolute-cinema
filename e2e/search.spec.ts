import { expect, test } from '@playwright/test'

test.describe('Movie Search', () => {
  test('should display search page', async ({ page }) => {
    await page.goto('/')

    // Check if search input is visible
    await expect(page.getByLabel('Search movies...')).toBeVisible()
  })

  test('should search for movies', async ({ page }) => {
    await page.goto('/')

    // Type in search box
    const searchInput = page.getByLabel('Search movies...')
    await searchInput.fill('matrix')

    // Wait for results (debounced)
    await page.waitForTimeout(500)

    // Check if movie cards are displayed
    await expect(page.locator('.movie-card').first()).toBeVisible({ timeout: 10_000 })
  })

  test('should navigate to movie detail page', async ({ page }) => {
    await page.goto('/')

    // Search for a movie
    await page.getByLabel('Search movies...').fill('matrix')
    await page.waitForTimeout(500)

    // Click on first movie card
    await page.locator('.movie-card').first().click()

    // Check if we're on the detail page
    await expect(page).toHaveURL(/\/movie\/tt\d+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should handle pagination', async ({ page }) => {
    await page.goto('/')

    // Search for movies
    await page.getByLabel('Search movies...').fill('love')
    await page.waitForTimeout(500)

    // Wait for pagination to appear
    await page.waitForSelector('.v-pagination', { timeout: 10_000 })

    // Click page 2 if available
    const page2Button = page.locator('.v-pagination button').nth(1)
    if (await page2Button.isVisible()) {
      await page2Button.click()
      await expect(page).toHaveURL(/page=2/)
    }
  })
})
