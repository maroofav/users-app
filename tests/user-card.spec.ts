import { test, expect } from '@playwright/test'

test.describe('UserCard Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    company: 'Test Corporation',
    state: 'California',
    country: 'USA',
    photo:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  }

  test.beforeEach(async ({ page }) => {
    // Mock the API response
    await page.route('**/users', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [mockUser],
          },
        }),
      }),
    )

    await page.goto('/users')
    await page.waitForSelector('[data-testid="user-card"]')
  })

  test('should display user card with correct information', async ({
    page,
  }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check if card is visible
    await expect(userCard).toBeVisible()

    // Check user name display
    await expect(page.getByText('John Doe')).toBeVisible()

    // Check avatar is present
    const avatar = page.locator('[data-testid="user-avatar"]').first()
    await expect(avatar).toBeVisible()

    // Check View More button
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await expect(viewMoreButton).toBeVisible()
  })

  test('should display avatar with correct attributes', async ({ page }) => {
    const avatar = page.locator('[data-testid="user-avatar"]').first()

    // Check avatar has correct alt text
    await expect(avatar).toHaveAttribute('alt', 'johndoe')

    // Check avatar has user-card-avatar class
    await expect(avatar).toHaveClass(/user-card-avatar/)

    // Check fallback Person icon is available if image fails
    // The Person icon is rendered as fallback content inside the Avatar
  })

  test('should display description when available', async ({ page }) => {
    // Check for description text (transformed from API data)
    const descriptionText = page
      .locator('text=/Working at.*Test Corporation/')
      .first()
    await expect(descriptionText).toBeVisible()
  })

  test('should display fallback text when no description', async ({ page }) => {
    // Mock user without description-related data
    const userWithoutDescription = {
      id: '2',
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      company: '',
      state: '',
      country: '',
      photo: '',
    }

    await page.route('**/users', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [userWithoutDescription],
          },
        }),
      }),
    )

    await page.reload()
    await page.waitForSelector('[data-testid="user-card"]')

    // Should show fallback text
    await expect(page.getByText('No description available')).toBeVisible()
  })

  test('should open modal when View More button is clicked', async ({
    page,
  }) => {
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()

    // Click the View More button
    await viewMoreButton.click()

    // Check if modal opens
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Check modal title
    await expect(page.getByText('User Details')).toBeVisible()

    // Check modal contains user information
    await expect(modal.getByText('John Doe')).toBeVisible()
  })

  test('should close modal when close button is clicked', async ({ page }) => {
    // Open modal first
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await viewMoreButton.click()

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Click close button
    const closeButton = page.getByRole('button', { name: 'Close' })
    await closeButton.click()

    // Check modal is closed
    await expect(modal).not.toBeVisible()
  })

  test('should have hover effects on card', async ({ page }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check initial state
    await expect(userCard).toBeVisible()

    // Hover over the card
    await userCard.hover()

    // Note: Visual hover effects are tested through CSS classes
    // The actual transform and shadow effects would need visual testing
    await expect(userCard).toHaveClass(/hover:shadow-xl/)
  })

  test('should display gradient background section', async ({ page }) => {
    // Check for gradient section (GradientBox)
    const gradientSection = page.locator('.MuiBox-root').first()
    await expect(gradientSection).toBeVisible()

    // Avatar should be inside the gradient section
    const avatar = page.locator('[data-testid="user-avatar"]').first()
    await expect(avatar).toBeVisible()
  })

  test('should use correct typography variants', async ({ page }) => {
    // Check user name typography
    const userName = page.getByText('John Doe').first()
    await expect(userName).toBeVisible()

    // Check that typography is rendered as h2 element (component="h2")
    const nameHeading = page
      .locator('h2')
      .filter({ hasText: 'John Doe' })
      .first()
    await expect(nameHeading).toBeVisible()
  })

  test('should handle long user names properly', async ({ page }) => {
    const longNameUser = {
      id: '3',
      name: 'Very Long First Name Very Long Last Name',
      username: 'longnameuser',
      email: 'longname@example.com',
      company: 'Test Corp',
      state: 'California',
      country: 'USA',
      photo: '',
    }

    await page.route('**/users', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            users: [longNameUser],
          },
        }),
      }),
    )

    await page.reload()
    await page.waitForSelector('[data-testid="user-card"]')

    // Check long name is displayed
    await expect(
      page.getByText('Very Long First Name Very Long Last Name'),
    ).toBeVisible()
  })

  test('should maintain card structure and spacing', async ({ page }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check card has proper Material-UI structure
    const cardContent = userCard.locator('.MuiCardContent-root')
    await expect(cardContent).toBeVisible()

    const cardActions = userCard.locator('.MuiCardActions-root')
    await expect(cardActions).toBeVisible()

    // Check button is centered
    const button = cardActions.locator('button')
    await expect(button).toBeVisible()
  })
})
