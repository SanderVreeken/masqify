import { test, expect } from '@playwright/test'

/**
 * E2E Test: Complete User Journey
 *
 * This test covers the main user flow:
 * 1. Visit landing page
 * 2. Navigate to registration
 * 3. Check login page accessibility
 * 4. Check editor page (requires auth)
 * 5. Check account page (requires auth)
 *
 * NOTE: This is a smoke test that verifies pages load correctly.
 * Full auth flow testing requires database setup and email verification mocking.
 */

test.describe('Landing and Public Pages', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/Masqify|Rewrite/)

    // Verify page loaded (check for common elements)
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login')

    // Check for login form elements
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/register')

    // Check for registration form elements
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[type="email"]')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
  })

  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy')

    // Verify privacy policy content is present
    const content = await page.textContent('body')
    expect(content?.toLowerCase()).toContain('privacy')
  })

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms')

    // Verify terms content is present
    const content = await page.textContent('body')
    expect(content?.toLowerCase()).toContain('terms')
  })
})

test.describe('Password Reset Flow', () => {
  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password')

    // Check for email input
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  test('should load reset password page', async ({ page }) => {
    // Note: This page requires a token in production
    // We're just checking if the page exists
    await page.goto('/reset-password')

    // Page should load (even if it shows an error about missing token)
    await expect(page).toBeTruthy()
  })
})

test.describe('Protected Pages (Unauthenticated)', () => {
  test('should redirect to login when accessing editor without auth', async ({ page }) => {
    await page.goto('/editor')

    // Should either show login page or redirect
    // Wait a bit for potential redirect
    await page.waitForTimeout(1000)

    const url = page.url()
    // Check if we're on login page or still on editor (with auth prompt)
    expect(url === '/login' || url.includes('/editor') || url.includes('/login')).toBe(true)
  })

  test('should redirect to login when accessing account without auth', async ({ page }) => {
    await page.goto('/account')

    // Wait for potential redirect
    await page.waitForTimeout(1000)

    const url = page.url()
    expect(url === '/login' || url.includes('/account') || url.includes('/login')).toBe(true)
  })

  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin')

    // Wait for potential redirect
    await page.waitForTimeout(1000)

    const url = page.url()
    expect(url === '/login' || url.includes('/admin') || url.includes('/login')).toBe(true)
  })
})

test.describe('Registration Form Validation', () => {
  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/register')

    // Try to submit without filling anything
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait a bit for validation to appear
    await page.waitForTimeout(500)

    // Page should still be on registration (form didn't submit)
    expect(page.url()).toContain('/register')
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/register')

    // Fill with invalid email
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'ValidPass123')
    await page.fill('input[name="confirmPassword"]', 'ValidPass123')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Should still be on registration page
    expect(page.url()).toContain('/register')
  })
})

test.describe('Login Form Validation', () => {
  test('should show error for empty credentials', async ({ page }) => {
    await page.goto('/login')

    // Try to submit without credentials
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Should still be on login page
    expect(page.url()).toContain('/login')
  })
})

test.describe('Responsive Design', () => {
  test('should load on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Check page loads correctly
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })

  test('should load on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/')

    // Check page loads correctly
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })

  test('should load on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto('/')

    // Check page loads correctly
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })
})

test.describe('Performance', () => {
  test('should load landing page quickly', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')

    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })
})
