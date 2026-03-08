import { test, expect } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Profile page', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL) testInfo.skip()
  })

  test('authenticated user can access the profile page', async ({ page }) => {
    await page.goto('/profile')

    await expect(page).toHaveURL('/profile')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('Stats tab is active by default', async ({ page }) => {
    await page.goto('/profile')

    await expect(page.locator('.tabs li.is-active')).toContainText('Stats')
  })

  test('user can switch to the Logs tab', async ({ page }) => {
    await page.goto('/profile')

    await page.getByRole('link', { name: 'Logs' }).click()

    await expect(page).toHaveURL(/tab=logs/)
  })

  test('Logs tab shows route log table or empty state message', async ({ page }) => {
    await page.goto('/profile?tab=logs')

    const hasTable = await page.getByRole('table').isVisible()
    const hasEmptyMessage = await page.getByText(/haven.*logged|no.*log/i).isVisible()

    expect(hasTable || hasEmptyMessage).toBeTruthy()
  })

  test('user can switch to the Lists tab', async ({ page }) => {
    await page.goto('/profile')

    await page.getByRole('link', { name: 'Lists' }).click()

    await expect(page).toHaveURL(/tab=lists/)
  })

  test('Stats tab shows logged climbs count or empty state', async ({ page }) => {
    await page.goto('/profile')

    const hasStats = await page.getByText(/Climbs Logged/i).isVisible()
    const hasEmptyState = await page.getByText(/no.*log|haven.*logged/i).isVisible()

    expect(hasStats || hasEmptyState).toBeTruthy()
  })

  test('when logs exist, log table rows link to route detail pages', async ({ page }) => {
    await page.goto('/profile?tab=logs')

    const table = page.getByRole('table')
    if (!(await table.isVisible())) {
      test.skip()
      return
    }

    const firstRouteLink = table.locator('tbody a').first()
    const href = await firstRouteLink.getAttribute('href')

    expect(href).toMatch(/\/crags\//)
  })
})
