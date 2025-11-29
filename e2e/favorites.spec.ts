import { expect, test } from '@playwright/test'

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should add movie to favorites', async ({ page }) => {
    await page.goto('/')

    // Search for a movie
    await page.getByLabel('Search movies...').fill('inception')
    await page.waitForTimeout(500)

    // Wait for movie cards
    await page.waitForSelector('.movie-card', { timeout: 10_000 })

    // Click favorite button on first movie
    await page.locator('.movie-card__favorite-btn').first().click()

    // Check if favorites counter updated
    await expect(page.locator('.v-badge')).toBeVisible()
  })

  test('should view favorites page', async ({ page }) => {
    await page.goto('/')

    // Search and add a favorite
    await page.getByLabel('Search movies...').fill('matrix')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10_000 })
    await page.locator('.movie-card__favorite-btn').first().click()

    // Navigate to favorites page
    await page.getByRole('button', { name: /favorites/i }).click()

    // Check if we're on favorites page
    await expect(page).toHaveURL('/favorites')
    await expect(page.getByText('My Favorites')).toBeVisible()
  })

  test('should remove movie from favorites', async ({ page }) => {
    await page.goto('/')

    // Add a favorite
    await page.getByLabel('Search movies...').fill('matrix')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10_000 })
    await page.locator('.movie-card__favorite-btn').first().click()

    // Go to favorites
    await page.getByRole('button', { name: /favorites/i }).click()

    // Remove from favorites
    await page.locator('.movie-card__favorite-btn').first().click()

    // Check if empty state is shown
    await expect(page.getByText('No favorites yet')).toBeVisible()
  })

  test('should persist favorites after page reload', async ({ page }) => {
    await page.goto('/')

    // Add a favorite
    await page.getByLabel('Search movies...').fill('matrix')
    await page.waitForTimeout(500)
    await page.waitForSelector('.movie-card', { timeout: 10_000 })
    await page.locator('.movie-card__favorite-btn').first().click()

    // Reload page
    await page.reload()

    // Check if favorite persisted
    await expect(page.locator('.v-badge')).toBeVisible()

    // Go to favorites page
    await page.getByRole('button', { name: /favorites/i }).click()
    await expect(page.locator('.movie-card')).toHaveCount(1)
  })
})
