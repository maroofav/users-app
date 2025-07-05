import { test, expect } from '@playwright/test'

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
    await page.route('**/users', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.reload()

    // Check for skeleton loaders
    await expect(page.locator('.MuiSkeleton-circular')).toHaveCount(6)
    await expect(page.locator('.MuiSkeleton-text')).toBeVisible()
    await expect(page.locator('.MuiSkeleton-rectangular')).toBeVisible()
  })

  test('should display error state when API fails', async ({ page }) => {
    // Mock API failure
    await page.route('**/users', (route) => route.abort())

    await page.reload()

    // Check for error alert
    await expect(page.locator('.MuiAlert-standardError')).toBeVisible()
    await expect(page.getByText('Error Loading Users')).toBeVisible()
  })

  test('should display users when API succeeds', async ({ page }) => {
    // Mock successful API response
    await page.route('**/users', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [
              {
                id: '1',
                name: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                company: 'Test Corp',
                state: 'California',
                country: 'USA',
                photo: 'https://example.com/photo.jpg',
              },
              {
                id: '2',
                name: 'Jane Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                company: 'Demo Inc',
                state: 'New York',
                country: 'USA',
                photo: 'https://example.com/photo2.jpg',
              },
            ],
          },
        }),
      }),
    )

    await page.reload()

    // Wait for loading to complete
    await expect(page.locator('.MuiSkeleton-circular')).toHaveCount(0)

    // Check user count display
    await expect(page.getByText('2 users found')).toBeVisible()

    // Check for user cards
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(2)

    // Check for specific user data
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText('Jane Smith')).toBeVisible()
  })

  test('should display empty state when no users found', async ({ page }) => {
    // Mock empty API response
    await page.route('**/users', (route) =>
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

    // Check for empty state
    await expect(page.getByText('No users found')).toBeVisible()
    await expect(
      page.getByText('No users available at the moment'),
    ).toBeVisible()
    await expect(page.locator('[data-testid="PeopleIcon"]')).toHaveCount(2) // Header + empty state
  })

  test('should use Grid2 layout correctly', async ({ page }) => {
    // Mock API response with multiple users
    await page.route('**/users', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: Array.from({ length: 6 }, (_, i) => ({
              id: `${i + 1}`,
              name: `User ${i + 1}`,
              username: `user${i + 1}`,
              email: `user${i + 1}@example.com`,
              company: 'Test Corp',
              state: 'California',
              country: 'USA',
              photo: 'https://example.com/photo.jpg',
            })),
          },
        }),
      }),
    )

    await page.reload()

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
})
