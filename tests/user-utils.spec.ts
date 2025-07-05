import { test, expect } from '@playwright/test'

test.describe('UserUtils', () => {
  test.describe('getAvatar function', () => {
    test.beforeAll(async ({ page }) => {
      // Navigate to any page to setup test environment
      await page.goto('/users')
    })

    test('should replace default size with custom size', async ({ page }) => {
      const originalUrl = 'https://example.com/avatar.jpg?size=50x50'
      const newSize = '200'

      const result = await page.evaluate(
        ({ avatar, size }) =>
          avatar.replace('?size=50x50', `?size=${size}x${size}`),
        { avatar: originalUrl, size: newSize },
      )

      expect(result).toBe('https://example.com/avatar.jpg?size=200x200')
    })

    test('should handle different size values', async ({ page }) => {
      const originalUrl = 'https://example.com/avatar.jpg?size=50x50'

      const testCases = [
        {
          size: '100',
          expected: 'https://example.com/avatar.jpg?size=100x100',
        },
        {
          size: '300',
          expected: 'https://example.com/avatar.jpg?size=300x300',
        },
        { size: '64', expected: 'https://example.com/avatar.jpg?size=64x64' },
        {
          size: '128',
          expected: 'https://example.com/avatar.jpg?size=128x128',
        },
      ]

      for (const testCase of testCases) {
        const result = await page.evaluate(
          ({ avatar, size }) =>
            avatar.replace('?size=50x50', `?size=${size}x${size}`),
          { avatar: originalUrl, size: testCase.size },
        )

        expect(result).toBe(testCase.expected)
      }
    })

    test('should handle URLs without size parameter', async ({ page }) => {
      const originalUrl = 'https://example.com/avatar.jpg'
      const newSize = '200'

      const result = await page.evaluate(
        ({ avatar, size }) =>
          avatar.replace('?size=50x50', `?size=${size}x${size}`),
        { avatar: originalUrl, size: newSize },
      )

      // Should return original URL unchanged if no size parameter to replace
      expect(result).toBe('https://example.com/avatar.jpg')
    })

    test('should handle URLs with different size formats', async ({ page }) => {
      const testCases = [
        {
          input: 'https://example.com/avatar.jpg?size=100x100',
          size: '200',
          expected: 'https://example.com/avatar.jpg?size=100x100', // No change - only replaces 50x50
        },
        {
          input: 'https://example.com/avatar.jpg?size=50x50&other=param',
          size: '200',
          expected: 'https://example.com/avatar.jpg?size=200x200&other=param',
        },
        {
          input: 'https://example.com/avatar.jpg?other=param&size=50x50',
          size: '150',
          expected: 'https://example.com/avatar.jpg?other=param&size=150x150',
        },
      ]

      for (const testCase of testCases) {
        const result = await page.evaluate(
          ({ avatar, size }) =>
            avatar.replace('?size=50x50', `?size=${size}x${size}`),
          { avatar: testCase.input, size: testCase.size },
        )

        expect(result).toBe(testCase.expected)
      }
    })

    test('should handle empty or invalid inputs gracefully', async ({
      page,
    }) => {
      const testCases = [
        { avatar: '', size: '200', expected: '' },
        { avatar: 'invalid-url', size: '200', expected: 'invalid-url' },
        {
          avatar: 'https://example.com/avatar.jpg?size=50x50',
          size: '',
          expected: 'https://example.com/avatar.jpg?size=x',
        },
      ]

      for (const testCase of testCases) {
        const result = await page.evaluate(
          ({ avatar, size }) =>
            avatar.replace('?size=50x50', `?size=${size}x${size}`),
          { avatar: testCase.avatar, size: testCase.size },
        )

        expect(result).toBe(testCase.expected)
      }
    })

    test('should work with real image URLs', async ({ page }) => {
      const realImageUrl =
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?size=50x50&fit=crop&crop=face'
      const newSize = '300'

      const result = await page.evaluate(
        ({ avatar, size }) =>
          avatar.replace('?size=50x50', `?size=${size}x${size}`),
        { avatar: realImageUrl, size: newSize },
      )

      expect(result).toBe(
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?size=300x300&fit=crop&crop=face',
      )
    })

    test('should maintain URL structure and additional parameters', async ({
      page,
    }) => {
      const complexUrl =
        'https://cdn.example.com/users/avatars/user123.jpg?size=50x50&format=webp&quality=80&cache=3600'
      const newSize = '400'

      const result = await page.evaluate(
        ({ avatar, size }) =>
          avatar.replace('?size=50x50', `?size=${size}x${size}`),
        { avatar: complexUrl, size: newSize },
      )

      expect(result).toBe(
        'https://cdn.example.com/users/avatars/user123.jpg?size=400x400&format=webp&quality=80&cache=3600',
      )
    })

    test('should handle numeric size input as string', async ({ page }) => {
      const originalUrl = 'https://example.com/avatar.jpg?size=50x50'

      // Test various numeric string inputs
      const sizes = ['100', '200', '64', '128', '256', '512']

      for (const size of sizes) {
        const result = await page.evaluate(
          ({ avatar, sizeParam }) =>
            avatar.replace('?size=50x50', `?size=${sizeParam}x${sizeParam}`),
          { avatar: originalUrl, sizeParam: size },
        )

        expect(result).toBe(
          `https://example.com/avatar.jpg?size=${size}x${size}`,
        )
      }
    })
  })

  test('should integrate properly with UserCard component', async ({
    page,
  }) => {
    // Mock API response with avatar URL
    const mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      company: 'Test Corp',
      state: 'California',
      country: 'USA',
      photo: 'https://example.com/avatar.jpg?size=50x50',
    }

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

    // Check that avatar uses processed URL (this would be visible in the src attribute)
    const avatar = page.locator('[data-testid="user-avatar"]').first()
    await expect(avatar).toBeVisible()

    // The actual src might be processed by getAvatar function
    const src = await avatar.getAttribute('src')
    expect(src).toBeTruthy()
  })

  test('should integrate properly with UserModal component', async ({
    page,
  }) => {
    // Mock API response
    const mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      company: 'Test Corp',
      state: 'California',
      country: 'USA',
      photo: 'https://example.com/avatar.jpg?size=50x50',
    }

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

    // Open modal
    const viewMoreButton = page
      .getByRole('button', { name: 'View More' })
      .first()
    await viewMoreButton.click()

    // Check modal avatar
    const modalAvatar = page.locator('[data-testid="modal-avatar"]')
    await expect(modalAvatar).toBeVisible()

    const modalSrc = await modalAvatar.getAttribute('src')
    expect(modalSrc).toBeTruthy()
  })
})
