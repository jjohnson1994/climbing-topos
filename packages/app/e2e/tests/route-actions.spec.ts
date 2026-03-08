import { test, expect } from '@playwright/test'

test.describe('Log a route (unauthenticated)', () => {
  test('clicking Log Book button redirects to login', async ({ page }) => {
    if (!process.env.E2E_TEST_ROUTE_URL) test.skip()

    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: /Log Book|Done/i }).click()

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Log a route (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL || !process.env.E2E_TEST_ROUTE_URL) testInfo.skip()
  })

  test('user can open the log route modal', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: /Log Book|Done/i }).click()

    await expect(page.getByRole('dialog', { name: 'Add Routes to Log Book' })).toBeVisible()
  })

  test('user can log a route by filling in the modal and submitting', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: /Log Book|Done/i }).click()

    const dialog = page.getByRole('dialog', { name: 'Add Routes to Log Book' })
    await expect(dialog).toBeVisible()

    await dialog.getByLabel('Rating').selectOption('3')
    await dialog.getByRole('button', { name: 'Save to Log Book' }).click()

    await expect(page.locator('.swal2-container, [class*="toast"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog', { name: 'Add Routes to Log Book' })).not.toBeVisible({ timeout: 5_000 })
  })

  test('user can cancel the log route modal without logging', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: /Log Book|Done/i }).click()

    const dialog = page.getByRole('dialog', { name: 'Add Routes to Log Book' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog', { name: 'Add Routes to Log Book' })).not.toBeVisible()
  })
})

test.describe('Save route to list (unauthenticated)', () => {
  test('clicking Save to List button redirects to login', async ({ page }) => {
    if (!process.env.E2E_TEST_ROUTE_URL) test.skip()

    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: 'Save to List' }).click()

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Save route to list (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL || !process.env.E2E_TEST_ROUTE_URL) testInfo.skip()
  })

  test('user can open the save to list modal', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: 'Save to List' }).click()

    await expect(page.getByRole('dialog', { name: 'Save Routes to List' })).toBeVisible()
  })

  test('user can save a route to a new list', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: 'Save to List' }).click()

    const dialog = page.getByRole('dialog', { name: 'Save Routes to List' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('radio', { name: 'New List' }).click()
    await dialog.getByLabel('Title').fill(`E2E Test List ${Date.now()}`)
    await dialog.getByRole('button', { name: 'Save to List' }).click()

    await expect(page.locator('.swal2-container, [class*="toast"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('dialog', { name: 'Save Routes to List' })).not.toBeVisible({ timeout: 5_000 })
  })

  test('user can cancel the save to list modal', async ({ page }) => {
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: 'Save to List' }).click()

    const dialog = page.getByRole('dialog', { name: 'Save Routes to List' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('dialog', { name: 'Save Routes to List' })).not.toBeVisible()
  })
})
