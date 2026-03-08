import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('user can log in with valid credentials and is redirected to profile', async ({ page }) => {
    if (!process.env.E2E_USER_EMAIL) test.skip()

    await page.goto('/login')
    await page.getByLabel('Email').fill(process.env.E2E_USER_EMAIL!)
    await page.getByLabel('Password').fill(process.env.E2E_USER_PASSWORD!)
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page).toHaveURL('/profile')
  })

  test('shows error popup when credentials are wrong', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 8_000 })
  })

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Required').first()).toBeVisible()
  })
})

test.describe('Logout', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test('user can log out and is returned to home page', async ({ page }) => {
    if (!process.env.E2E_USER_EMAIL) test.skip()

    await page.goto('/profile')
    await page.getByRole('button', { name: 'Logout' }).click()

    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('Sign up', () => {
  test('shows validation errors when submitting empty signup form', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('button', { name: 'Sign up' }).click()

    await expect(page.getByText('Required').first()).toBeVisible()
  })

  test('redirects to login page from login link on signup page', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('link', { name: 'Login' }).click()

    await expect(page).toHaveURL('/login')
  })
})

test.describe('Protected routes', () => {
  test('unauthenticated user visiting /profile is redirected to login', async ({ page }) => {
    await page.goto('/profile')

    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting create-crag is redirected to login', async ({ page }) => {
    await page.goto('/create-crag')

    await expect(page).toHaveURL(/\/login/)
  })
})
