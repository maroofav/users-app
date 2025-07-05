import { test, expect } from '@playwright/test'

test.describe('UserModal Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    company: 'Tech Corporation',
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

    // Open the modal by clicking View More
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await viewMoreButton.click()
    await page.waitForSelector('[role="dialog"]')
  })

  test('should display modal with correct title and structure', async ({
    page,
  }) => {
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Check modal title
    await expect(page.getByText('User Details')).toBeVisible()

    // Check close button in header
    const closeButton = modal
      .locator('button[aria-label="close"]')
      .or(modal.locator('button').filter({ hasText: /close/i }))
    await expect(closeButton.first()).toBeVisible()
  })

  test('should display user profile section with avatar and basic info', async ({
    page,
  }) => {
    const modal = page.locator('[role="dialog"]')

    // Check avatar
    const modalAvatar = modal.locator('[data-testid="modal-avatar"]')
    await expect(modalAvatar).toBeVisible()
    await expect(modalAvatar).toHaveAttribute('alt', 'johndoe')

    // Check user name
    await expect(modal.getByText('John Doe')).toBeVisible()

    // Check role chip
    const roleChip = modal.locator('.MuiChip-root')
    await expect(roleChip).toBeVisible()
  })

  test('should display personal information section', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')

    // Check section title
    await expect(modal.getByText('Personal Information')).toBeVisible()

    // Check username field
    await expect(modal.getByText('Username')).toBeVisible()
    await expect(modal.getByText('johndoe')).toBeVisible()

    // Check email field
    await expect(modal.getByText('Email')).toBeVisible()
    await expect(modal.getByText('john.doe@example.com')).toBeVisible()

    // Check role field
    await expect(modal.getByText('Role')).toBeVisible()

    // Check join date field
    await expect(modal.getByText('Join Date')).toBeVisible()
  })

  test('should display description section', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')

    // Check description section title
    await expect(modal.getByText('Description')).toBeVisible()

    // Check description content (either actual description or fallback)
    const descriptionSection = modal
      .locator('text=/Working at.*Tech Corporation/')
      .or(modal.locator('text=No description available'))
    await expect(descriptionSection.first()).toBeVisible()
  })

  test('should display appropriate icons for each information field', async ({
    page,
  }) => {
    const modal = page.locator('[role="dialog"]')

    // Check for Material-UI icons (these might be rendered as SVGs)
    // AccountCircle icon for username
    const accountIcon = modal.locator('[data-testid="AccountCircleIcon"]')
    await expect(accountIcon).toBeVisible()

    // Email icon
    const emailIcon = modal.locator('[data-testid="EmailIcon"]')
    await expect(emailIcon).toBeVisible()

    // Assignment icon for role
    const assignmentIcon = modal.locator('[data-testid="AssignmentIcon"]')
    await expect(assignmentIcon).toBeVisible()

    // Calendar icon for join date
    const calendarIcon = modal.locator('[data-testid="CalendarTodayIcon"]')
    await expect(calendarIcon).toBeVisible()
  })

  test('should close modal when close button is clicked', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Click close button
    const closeButton = page.getByRole('button', { name: 'Close' })
    await closeButton.click()

    // Modal should close
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when X button in header is clicked', async ({
    page,
  }) => {
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Click X button in header
    const headerCloseButton = modal.locator('button').first()
    await headerCloseButton.click()

    // Modal should close
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when clicking outside (backdrop)', async ({
    page,
  }) => {
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Click outside the modal (on backdrop)
    await page.mouse.click(50, 50)

    // Modal should close
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when pressing Escape key', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Press Escape key
    await page.keyboard.press('Escape')

    // Modal should close
    await expect(modal).not.toBeVisible()
  })

  test('should display user without description gracefully', async ({
    page,
  }) => {
    // Close current modal first
    await page.getByRole('button', { name: 'Close' }).click()

    const userWithoutDescription = {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
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

    // Open modal for new user
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await viewMoreButton.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Check fallback description
    await expect(modal.getByText('No description available')).toBeVisible()
  })

  test('should use correct typography variants', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')

    // Check main title uses h2 variant
    const mainTitle = modal.locator('h2').filter({ hasText: 'User Details' })
    await expect(mainTitle).toBeVisible()

    // Check user name uses h2 variant
    const userName = modal.locator('h2').filter({ hasText: 'John Doe' })
    await expect(userName).toBeVisible()

    // Check section headers use h3 variant
    await expect(modal.getByText('Personal Information')).toBeVisible()
    await expect(modal.getByText('Description')).toBeVisible()
  })

  test('should display responsive grid layout', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')

    // Check Grid2 container
    const gridContainer = modal.locator('.MuiGrid2-container')
    await expect(gridContainer).toBeVisible()

    // Check profile section (left column)
    const profileSection = modal.locator('.MuiGrid2-root').first()
    await expect(profileSection).toBeVisible()

    // Check details section (right column)
    const detailsSection = modal.locator('.MuiGrid2-root').nth(1)
    await expect(detailsSection).toBeVisible()
  })

  test('should handle long user information gracefully', async ({ page }) => {
    // Close current modal
    await page.getByRole('button', { name: 'Close' }).click()

    const userWithLongInfo = {
      id: '3',
      name: 'Very Long First Name Very Long Last Name',
      username: 'verylongusernamethatmightoverflow',
      email: 'verylongemailaddress@verylongdomainname.com',
      company: 'Very Long Company Name That Might Cause Layout Issues',
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
            users: [userWithLongInfo],
          },
        }),
      }),
    )

    await page.reload()
    await page.waitForSelector('[data-testid="user-card"]')

    // Open modal
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await viewMoreButton.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Check long information is displayed
    await expect(
      modal.getByText('Very Long First Name Very Long Last Name'),
    ).toBeVisible()
    await expect(
      modal.getByText('verylongusernamethatmightoverflow'),
    ).toBeVisible()
    await expect(
      modal.getByText('verylongemailaddress@verylongdomainname.com'),
    ).toBeVisible()
  })

  test('should have proper modal sizing and positioning', async ({ page }) => {
    const modal = page.locator('[role="dialog"]')

    // Check modal has proper Material-UI classes
    await expect(modal).toHaveClass(/MuiDialog-paper/)

    // Check modal has rounded corners
    const modalPaper = modal.locator('.MuiDialog-paper')
    await expect(modalPaper).toBeVisible()

    // Check modal has minimum height
    await expect(modalPaper).toHaveCSS('min-height', /500px/)
  })
})
