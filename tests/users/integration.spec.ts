import { test, expect } from '@playwright/test'

// Reusable API URL pattern
const API_USERS_URL =
  '**/9e06da9a-97cf-4701-adfc-9b9a5713bbb9.mock.pstmn.io/users'

test.describe('Users App Integration Tests', () => {
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      company: 'Tech Corporation',
      state: 'California',
      country: 'USA',
      phone: '+1-555-123-4567',
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?size=50x50&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      company: 'Design Studio',
      state: 'New York',
      country: 'USA',
      phone: '+1-555-987-6543',
      photo:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?size=50x50&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: 'mikejohnson',
      email: 'mike.j@example.com',
      company: 'Marketing Agency',
      state: 'Texas',
      country: 'USA',
      phone: '+1-555-456-7890',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?size=50x50&fit=crop&crop=face',
    },
  ]

  test.beforeEach(async ({ page }) => {
    // Mock successful API response
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
  })

  test('complete user workflow: load users → view card → open modal → view details → close modal', async ({
    page,
  }) => {
    // 1. Navigate to users page
    await page.goto('/users')

    // 2. Wait for users to load and verify page structure
    await expect(page.getByText('Users')).toBeVisible()
    await expect(
      page.getByText(
        'Manage and view user information across your organization',
      ),
    ).toBeVisible()

    // 3. Verify user count and cards are displayed
    await expect(page.getByText('3 users found')).toBeVisible()
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3)

    // 4. Verify first user card content
    const firstCard = page.locator('[data-testid="user-card"]').first()
    await expect(firstCard.getByText('John Doe')).toBeVisible()
    await expect(
      firstCard.getByRole('button', { name: 'View More' }),
    ).toBeVisible()

    // 5. Click on first user's "View More" button
    await firstCard.getByRole('button', { name: 'View More' }).click()

    // 6. Verify modal opens with correct content
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('User Details')).toBeVisible()
    await expect(modal.getByText('John Doe')).toBeVisible()

    // 7. Verify personal information in modal
    await expect(modal.getByText('Personal Information')).toBeVisible()
    await expect(modal.getByText('johndoe')).toBeVisible()
    await expect(modal.getByText('john.doe@example.com')).toBeVisible()

    // 8. Verify description section
    await expect(modal.getByText('Description')).toBeVisible()

    // 9. Close modal
    await modal.getByRole('button', { name: 'Close' }).click()
    await expect(modal).not.toBeVisible()

    // 10. Verify we're back to the users list
    await expect(page.getByText('3 users found')).toBeVisible()
  })

  test('should handle multiple user interactions', async ({ page }) => {
    await page.goto('/users')

    // Test interaction with different users
    const userCards = page.locator('[data-testid="user-card"]')
    await expect(userCards).toHaveCount(3)

    // Test first user
    await userCards.nth(0).getByRole('button', { name: 'View More' }).click()
    let modal = page.locator('[role="dialog"]')
    await expect(modal.getByText('John Doe')).toBeVisible()
    await modal.getByRole('button', { name: 'Close' }).click()

    // Test second user
    await userCards.nth(1).getByRole('button', { name: 'View More' }).click()
    modal = page.locator('[role="dialog"]')
    await expect(modal.getByText('Jane Smith')).toBeVisible()
    await modal.getByRole('button', { name: 'Close' }).click()

    // Test third user
    await userCards.nth(2).getByRole('button', { name: 'View More' }).click()
    modal = page.locator('[role="dialog"]')
    await expect(modal.getByText('Mike Johnson')).toBeVisible()
    await page.keyboard.press('Escape') // Test closing with keyboard
    await expect(modal).not.toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Override the mock to simulate API error
    await page.route(API_USERS_URL, (route) => route.abort())

    await page.goto('/users')

    // Should show error state
    await expect(page.getByText('Error Loading Users')).toBeVisible()
    await expect(page.locator('.MuiAlert-standardError')).toBeVisible()

    // Should not show user cards
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(0)
  })

  test('should show empty state when no users returned', async ({ page }) => {
    // Override mock to return empty users array
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

    // Should show empty state
    await expect(page.getByText('No users found')).toBeVisible()
    await expect(
      page.getByText('No users available at the moment'),
    ).toBeVisible()

    // Should not show user count or cards
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(0)
  })

  test('should maintain state during navigation', async ({ page }) => {
    await page.goto('/users')

    // Wait for users to load
    await expect(page.getByText('3 users found')).toBeVisible()

    // Open modal for first user
    await page
      .locator('[data-testid="user-card"]')
      .first()
      .getByRole('button', { name: 'View More' })
      .click()
    const modal = page.locator('[role="dialog"]')
    await expect(modal.getByText('John Doe')).toBeVisible()

    // Close modal
    await modal.getByRole('button', { name: 'Close' }).click()

    // Verify users are still there (Redux state maintained)
    await expect(page.getByText('3 users found')).toBeVisible()
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3)
  })

  test('should handle responsive design elements', async ({ page }) => {
    await page.goto('/users')

    // Test on desktop size
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3)

    // Test on tablet size
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3)

    // Test on mobile size
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(3)

    // Modal should still work on mobile
    await page
      .locator('[data-testid="user-card"]')
      .first()
      .getByRole('button', { name: 'View More' })
      .click()
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('John Doe')).toBeVisible()
  })

  test('should handle avatar loading with getAvatar utility', async ({
    page,
  }) => {
    await page.goto('/users')

    // Check that avatars are loaded
    const avatars = page.locator('[data-testid="user-avatar"]')
    await expect(avatars).toHaveCount(3)

    // Check first avatar has src attribute
    const firstAvatar = avatars.first()
    const src = await firstAvatar.getAttribute('src')
    expect(src).toBeTruthy()

    // Open modal and check modal avatar
    await page
      .locator('[data-testid="user-card"]')
      .first()
      .getByRole('button', { name: 'View More' })
      .click()
    const modalAvatar = page.locator('[data-testid="modal-avatar"]')
    await expect(modalAvatar).toBeVisible()

    const modalSrc = await modalAvatar.getAttribute('src')
    expect(modalSrc).toBeTruthy()
  })

  test('should properly transform API data to User interface format', async ({
    page,
  }) => {
    await page.goto('/users')

    // Wait for users to load
    await expect(page.getByText('3 users found')).toBeVisible()

    // Check that names are properly split from API name field
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText('Jane Smith')).toBeVisible()
    await expect(page.getByText('Mike Johnson')).toBeVisible()

    // Open modal to check transformed data
    await page
      .locator('[data-testid="user-card"]')
      .first()
      .getByRole('button', { name: 'View More' })
      .click()
    const modal = page.locator('[role="dialog"]')

    // Check username is preserved
    await expect(modal.getByText('johndoe')).toBeVisible()

    // Check email is preserved
    await expect(modal.getByText('john.doe@example.com')).toBeVisible()

    // Check description includes company info
    const descriptionText = modal.locator('text=/Working at.*Tech Corporation/')
    await expect(descriptionText).toBeVisible()
  })

  test('should handle theme integration properly', async ({ page }) => {
    await page.goto('/users')

    // Check gradient header
    const header = page.locator('div').filter({ hasText: 'Users' }).first()
    await expect(header).toBeVisible()

    // Check cards have proper styling
    const cards = page.locator('[data-testid="user-card"]')
    await expect(cards.first()).toHaveClass(/user-card/)

    // Check gradient boxes in cards
    const gradientBoxes = page.locator('.MuiBox-root')
    await expect(gradientBoxes.first()).toBeVisible()
  })

  test('should handle concurrent modal operations', async ({ page }) => {
    await page.goto('/users')

    // Rapidly open and close modals
    for (let i = 0; i < 3; i++) {
      const card = page.locator('[data-testid="user-card"]').nth(i)
      await card.getByRole('button', { name: 'View More' }).click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      await modal.getByRole('button', { name: 'Close' }).click()
      await expect(modal).not.toBeVisible()
    }

    // Should still show all users
    await expect(page.getByText('3 users found')).toBeVisible()
  })
})
