import { test, expect } from '@playwright/test'

// Reusable API URL pattern
const API_USERS_URL =
  '**/9e06da9a-97cf-4701-adfc-9b9a5713bbb9.mock.pstmn.io/users'

test.describe('UserCard Component', () => {
  const mockUser = {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'Admin',
    join_date: '2023-01-01',
    description: 'Working at Test Corporation in California, USA',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  }

  test.beforeEach(async ({ page }) => {
    // Mock the API response
    await page.route(API_USERS_URL, (route) =>
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

    // Check user name display using test ID
    const userName = page.locator('[data-testid="user-name"]').first()
    await expect(userName).toBeVisible()
    await expect(userName).toContainText('John Doe')

    // Check avatar is present
    const avatar = page.locator('[data-testid="user-avatar"]').first()
    await expect(avatar).toBeVisible()

    // Check View More button using test ID
    const viewMoreButton = page
      .locator('[data-testid="view-more-button"]')
      .first()
    await expect(viewMoreButton).toBeVisible()
    await expect(viewMoreButton).toContainText('View More')
  })

  test('should display avatar with correct attributes', async ({ page }) => {
    // Wait for avatar to be fully loaded
    const avatar = page.locator('[data-testid="user-avatar"]').first()
    await expect(avatar).toBeVisible()

    // Check avatar has correct alt text - wait for it to be set
    await page.waitForFunction(
      () => {
        const avatarElement = document.querySelector(
          '[data-testid="user-avatar"]',
        )
        return avatarElement && avatarElement.getAttribute('alt') === 'johndoe'
      },
      { timeout: 5000 },
    )

    // Now check the alt attribute
    await expect(avatar).toHaveAttribute('alt', 'johndoe')

    // Check avatar has user-card-avatar class
    await expect(avatar).toHaveClass(/user-card-avatar/)

    // Check fallback Person icon is available if image fails
    // The Person icon is rendered as fallback content inside the Avatar
  })

  test('should display description when available', async ({ page }) => {
    // Check for description using test ID
    const description = page.locator('[data-testid="user-description"]').first()
    await expect(description).toBeVisible()
    await expect(description).toContainText('Working at Test Corporation')
  })

  test('should display fallback text when no description', async ({ page }) => {
    // Mock user without description
    const userWithoutDescription = {
      ...mockUser,
      id: '2',
      firstname: 'Jane',
      lastname: 'Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      description: '',
    }

    await page.route(API_USERS_URL, (route) =>
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

    // Should show fallback text using test ID
    const description = page.locator('[data-testid="user-description"]').first()
    await expect(description).toBeVisible()
    await expect(description).toContainText('No description available')
  })

  test('should open modal when View More button is clicked', async ({
    page,
  }) => {
    const viewMoreButton = page
      .locator('[data-testid="view-more-button"]')
      .first()

    // Click the View More button
    await viewMoreButton.click()

    // Check if modal opens using test ID
    const modal = page.locator('[data-testid="user-modal"]')
    await expect(modal).toBeVisible()

    // Check modal title using test ID
    const modalTitle = page.locator('[data-testid="modal-title"]')
    await expect(modalTitle).toBeVisible()
    await expect(modalTitle).toContainText('User Details')

    // Check modal contains user information using test ID
    const modalUserName = page.locator('[data-testid="modal-user-name"]')
    await expect(modalUserName).toBeVisible()
    await expect(modalUserName).toContainText('John Doe')
  })

  test('should close modal when close button is clicked', async ({ page }) => {
    // Open modal first
    const viewMoreButton = page
      .locator('[data-testid="view-more-button"]')
      .first()
    await viewMoreButton.click()

    // Wait for modal to be visible
    const modal = page.locator('[data-testid="user-modal"]')
    await expect(modal).toBeVisible()

    // Click close button using test ID
    const closeButton = page.locator('[data-testid="close-modal-button"]')
    await closeButton.click()

    // Check modal is closed
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when action close button is clicked', async ({
    page,
  }) => {
    // Open modal first
    const viewMoreButton = page
      .locator('[data-testid="view-more-button"]')
      .first()
    await viewMoreButton.click()

    // Wait for modal to be visible
    const modal = page.locator('[data-testid="user-modal"]')
    await expect(modal).toBeVisible()

    // Click action close button using test ID
    const actionCloseButton = page.locator('[data-testid="modal-close-button"]')
    await actionCloseButton.click()

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
    // Check user name typography using test ID
    const userName = page.locator('[data-testid="user-name"]').first()
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
      ...mockUser,
      id: '3',
      firstname: 'Very Long First Name',
      lastname: 'Very Long Last Name',
      username: 'longnameuser',
      email: 'longname@example.com',
    }

    await page.route(API_USERS_URL, (route) =>
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

    // Check long name is displayed using test ID
    const userName = page.locator('[data-testid="user-name"]').first()
    await expect(userName).toBeVisible()
    await expect(userName).toContainText(
      'Very Long First Name Very Long Last Name',
    )
  })

  test('should maintain card structure and spacing', async ({ page }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check card has proper Material-UI structure
    const cardContent = userCard.locator('.MuiCardContent-root')
    await expect(cardContent).toBeVisible()

    const cardActions = userCard.locator('.MuiCardActions-root')
    await expect(cardActions).toBeVisible()

    // Check button is in card actions using test ID
    const button = page.locator('[data-testid="view-more-button"]').first()
    await expect(button).toBeVisible()
    await expect(
      cardActions.locator('[data-testid="view-more-button"]'),
    ).toBeVisible()
  })
})

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

    // Check for skeleton loaders using test ID
    await expect(page.locator('[data-testid="loading-skeleton"]')).toHaveCount(
      6,
    )
  })
})
