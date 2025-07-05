import { test, expect } from '@playwright/test'

// Reusable API URL pattern
const API_USERS_URL =
  '**/9e06da9a-97cf-4701-adfc-9b9a5713bbb9.mock.pstmn.io/users'

test.describe('Users Pagination', () => {
  const mockUsers = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    firstname: `User`,
    lastname: `${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: 'User',
    join_date: '2023-01-01',
    description: `Description for user ${i + 1}`,
    avatar: `https://example.com/avatar${i + 1}.jpg`,
  }))

  test.beforeEach(async ({ page }) => {
    // Mock API response with multiple users
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: mockUsers,
          },
        }),
      }),
    )

    await page.goto('/users')
    await page.waitForSelector('[data-testid="users-pagination"]')
  })

  test('should display pagination controls', async ({ page }) => {
    const pagination = page.locator('[data-testid="users-pagination"]')
    await expect(pagination).toBeVisible()

    // Check for first page button
    const firstPageButton = page.locator('[data-testid="first-page-button"]')
    await expect(firstPageButton).toBeVisible()

    // Check for previous page button
    const previousPageButton = page.locator(
      '[data-testid="previous-page-button"]',
    )
    await expect(previousPageButton).toBeVisible()

    // Check for next page button
    const nextPageButton = page.locator('[data-testid="next-page-button"]')
    await expect(nextPageButton).toBeVisible()

    // Check for last page button
    const lastPageButton = page.locator('[data-testid="last-page-button"]')
    await expect(lastPageButton).toBeVisible()

    // Check for page numbers
    const pageNumbers = page.locator('[data-testid="page-numbers"]')
    await expect(pageNumbers).toBeVisible()
  })

  test('should display correct pagination information', async ({ page }) => {
    // Check pagination info
    const paginationInfo = page.locator('[data-testid="pagination-info"]')
    await expect(paginationInfo).toBeVisible()
    await expect(paginationInfo).toContainText('Showing 1-6 of 25 items')

    // Check page info
    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toBeVisible()
    await expect(pageInfo).toContainText('Page 1 of 5')
  })

  test('should display items per page selector', async ({ page }) => {
    const itemsPerPageSelect = page.locator(
      '[data-testid="items-per-page-select"]',
    )
    await expect(itemsPerPageSelect).toBeVisible()

    // Check label
    const itemsPerPageLabel = page.locator(
      '[data-testid="items-per-page-label"]',
    )
    await expect(itemsPerPageLabel).toBeVisible()
    await expect(itemsPerPageLabel).toContainText('Items per page')
  })

  test('should navigate to next page', async ({ page }) => {
    // Initially on page 1
    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 1 of 5')

    // Click next page
    const nextPageButton = page.locator('[data-testid="next-page-button"]')
    await nextPageButton.click()

    // Should be on page 2
    await expect(pageInfo).toContainText('Page 2 of 5')

    // Check pagination info updates
    const paginationInfo = page.locator('[data-testid="pagination-info"]')
    await expect(paginationInfo).toContainText('Showing 7-12 of 25 items')
  })

  test('should navigate to previous page', async ({ page }) => {
    // Go to page 2 first
    const nextPageButton = page.locator('[data-testid="next-page-button"]')
    await nextPageButton.click()

    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 2 of 5')

    // Click previous page
    const previousPageButton = page.locator(
      '[data-testid="previous-page-button"]',
    )
    await previousPageButton.click()

    // Should be back on page 1
    await expect(pageInfo).toContainText('Page 1 of 5')
  })

  test('should navigate to first page', async ({ page }) => {
    // Go to page 3
    const nextPageButton = page.locator('[data-testid="next-page-button"]')
    await nextPageButton.click()
    await nextPageButton.click()

    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 3 of 5')

    // Click first page
    const firstPageButton = page.locator('[data-testid="first-page-button"]')
    await firstPageButton.click()

    // Should be on page 1
    await expect(pageInfo).toContainText('Page 1 of 5')
  })

  test('should navigate to last page', async ({ page }) => {
    // Initially on page 1
    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 1 of 5')

    // Click last page
    const lastPageButton = page.locator('[data-testid="last-page-button"]')
    await lastPageButton.click()

    // Should be on last page
    await expect(pageInfo).toContainText('Page 5 of 5')

    // Check pagination info
    const paginationInfo = page.locator('[data-testid="pagination-info"]')
    await expect(paginationInfo).toContainText('Showing 25-25 of 25 items')
  })

  test('should change items per page', async ({ page }) => {
    // Initially showing 6 items per page
    const paginationInfo = page.locator('[data-testid="pagination-info"]')
    await expect(paginationInfo).toContainText('Showing 1-6 of 25 items')

    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 1 of 5')

    // Change to 12 items per page
    const itemsPerPageSelect = page.locator(
      '[data-testid="items-per-page-select"]',
    )
    await itemsPerPageSelect.click()
    await page.getByRole('option', { name: '12' }).click()

    // Should show 12 items and update page count
    await expect(paginationInfo).toContainText('Showing 1-12 of 25 items')
    await expect(pageInfo).toContainText('Page 1 of 3')

    // Check that user cards are updated
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(12)
  })

  test('should disable buttons appropriately', async ({ page }) => {
    // On first page, previous and first buttons should be disabled
    const firstPageButton = page.locator('[data-testid="first-page-button"]')
    const previousPageButton = page.locator(
      '[data-testid="previous-page-button"]',
    )

    await expect(firstPageButton).toBeDisabled()
    await expect(previousPageButton).toBeDisabled()

    // Go to last page
    const lastPageButton = page.locator('[data-testid="last-page-button"]')
    await lastPageButton.click()

    // On last page, next and last buttons should be disabled
    const nextPageButton = page.locator('[data-testid="next-page-button"]')

    await expect(nextPageButton).toBeDisabled()
    await expect(lastPageButton).toBeDisabled()
  })

  test('should handle empty state without showing pagination', async ({
    page,
  }) => {
    // Mock empty response
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [],
          },
        }),
      }),
    )

    await page.reload()

    // Should not show pagination
    const pagination = page.locator('[data-testid="users-pagination"]')
    await expect(pagination).not.toBeVisible()

    // Should show no users found message
    const noUsersFound = page.locator('[data-testid="no-users-found"]')
    await expect(noUsersFound).toBeVisible()
  })
})
