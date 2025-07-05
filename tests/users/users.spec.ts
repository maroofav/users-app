import { test, expect } from '@playwright/test'

// Reusable API URL pattern
const API_USERS_URL =
  '**/9e06da9a-97cf-4701-adfc-9b9a5713bbb9.mock.pstmn.io/users'

test.describe('Users Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users')
  })

  test('should display page header with title and description', async ({
    page,
  }) => {
    // Check if the header section exists
    const header = page.locator('h1:has-text("Users")')
    await expect(header).toBeVisible()

    // Check for description text
    await expect(
      page.getByText(
        'Manage and view user information across your organization',
      ),
    ).toBeVisible()

    // Check for People icon
    await expect(page.locator('[data-testid="PeopleIcon"]')).toBeVisible()
  })

  test('should show loading state initially', async ({ page }) => {
    // Intercept API call to delay response
    await page.route(API_USERS_URL, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/users')

    // Check for skeleton loaders using test ID - should show 6 by default
    await expect(page.locator('[data-testid="loading-skeleton"]')).toHaveCount(
      6,
    )
  })

  test('should display error state when API fails', async ({ page }) => {
    // Mock API failure
    await page.route(API_USERS_URL, (route) => route.abort())

    await page.goto('/users')

    // Check for error alert using test ID
    const errorAlert = page.locator('[data-testid="error-alert"]')
    await expect(errorAlert).toBeVisible()
    await expect(errorAlert).toContainText('Error Loading Users')
  })

  test('should display users when API succeeds', async ({ page }) => {
    // Mock successful API response with the correct structure
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [
              {
                id: '1',
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                role: 'Admin',
                join_date: '2023-01-01',
                description: 'Working at Test Corp in California, USA',
                avatar: 'https://example.com/photo.jpg',
              },
              {
                id: '2',
                firstname: 'Jane',
                lastname: 'Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                role: 'User',
                join_date: '2023-02-01',
                description: 'Working at Demo Inc in New York, USA',
                avatar: 'https://example.com/photo2.jpg',
              },
            ],
          },
        }),
      }),
    )

    await page.goto('/users')

    // Wait for loading to complete
    await expect(
      page.locator('[data-testid="loading-skeleton"]'),
    ).not.toBeVisible()

    // Check user count display using test ID
    const usersCount = page.locator('[data-testid="users-count"]')
    await expect(usersCount).toBeVisible()
    await expect(usersCount).toContainText('2 users found')

    // Check for user cards using test ID
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(2)

    // Check for specific user data using test IDs
    const userNames = page.locator('[data-testid="user-name"]')
    await expect(userNames.first()).toContainText('John Doe')
    await expect(userNames.nth(1)).toContainText('Jane Smith')
  })

  test('should display empty state when no users found', async ({ page }) => {
    // Mock empty API response
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

    await page.goto('/users')

    // Check for empty state using test ID
    const noUsersFound = page.locator('[data-testid="no-users-found"]')
    await expect(noUsersFound).toBeVisible()
    await expect(noUsersFound).toContainText('No users found')
    await expect(noUsersFound).toContainText('No users available at the moment')
    await expect(page.locator('[data-testid="PeopleIcon"]')).toHaveCount(2) // Header + empty state
  })

  test('should use Grid2 layout correctly', async ({ page }) => {
    // Mock API response with multiple users
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: Array.from({ length: 6 }, (_, i) => ({
              id: `${i + 1}`,
              firstname: `User`,
              lastname: `${i + 1}`,
              username: `user${i + 1}`,
              email: `user${i + 1}@example.com`,
              role: 'User',
              join_date: '2023-01-01',
              description: 'Working at Test Corp in California, USA',
              avatar: 'https://example.com/photo.jpg',
            })),
          },
        }),
      }),
    )

    await page.goto('/users')

    // Wait for users to load
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(6)

    // Check responsive grid sizing
    const grid = page.locator('.MuiGrid2-container').first()
    await expect(grid).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h1:has-text("Users")')
    await expect(mainHeading).toBeVisible()

    // Check container has proper landmark
    await expect(page.locator('.MuiContainer-root')).toBeVisible()
  })

  test('should interact with user cards correctly', async ({ page }) => {
    // Mock API response
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [
              {
                id: '1',
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                role: 'Admin',
                join_date: '2023-01-01',
                description: 'Working at Test Corp in California, USA',
                avatar: 'https://example.com/photo.jpg',
              },
            ],
          },
        }),
      }),
    )

    await page.goto('/users')
    await page.waitForSelector('[data-testid="user-card"]')

    // Check user card interaction
    const userCard = page.locator('[data-testid="user-card"]').first()
    await expect(userCard).toBeVisible()

    // Check View More button using test ID
    const viewMoreButton = page
      .locator('[data-testid="view-more-button"]')
      .first()
    await expect(viewMoreButton).toBeVisible()

    // Click View More button to open modal
    await viewMoreButton.click()

    // Check modal opens using test ID
    const modal = page.locator('[data-testid="user-modal"]')
    await expect(modal).toBeVisible()
  })

  test('should display pagination when users are available', async ({
    page,
  }) => {
    // Mock API response with enough users to trigger pagination
    await page.route(API_USERS_URL, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: Array.from({ length: 12 }, (_, i) => ({
              id: `${i + 1}`,
              firstname: `User`,
              lastname: `${i + 1}`,
              username: `user${i + 1}`,
              email: `user${i + 1}@example.com`,
              role: 'User',
              join_date: '2023-01-01',
              description: 'Working at Test Corp in California, USA',
              avatar: 'https://example.com/photo.jpg',
            })),
          },
        }),
      }),
    )

    await page.goto('/users')

    // Wait for pagination to be visible
    const pagination = page.locator('[data-testid="users-pagination"]')
    await expect(pagination).toBeVisible()

    // Check pagination info
    const paginationInfo = page.locator('[data-testid="pagination-info"]')
    await expect(paginationInfo).toContainText('Showing 1-6 of 12 items')

    // Check page info
    const pageInfo = page.locator('[data-testid="page-info"]')
    await expect(pageInfo).toContainText('Page 1 of 2')
  })
})
