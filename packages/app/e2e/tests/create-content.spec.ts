import { test, expect } from '@playwright/test'

test.describe('Create Crag (unauthenticated)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/create-crag')

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Create Crag (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL) testInfo.skip()
  })

  test('shows validation errors when submitting an empty crag form', async ({ page }) => {
    await page.goto('/create-crag')

    await page.getByRole('button', { name: 'Create Crag' }).click()

    await expect(page.locator('.help.is-danger').first()).toBeVisible()
  })

  test('user can fill in crag title and see it reflected in the field', async ({ page }) => {
    await page.goto('/create-crag')

    await page.getByLabel('Title').fill('My Test Crag')

    await expect(page.getByLabel('Title')).toHaveValue('My Test Crag')
  })

  test('user must agree to terms before creating a crag', async ({ page }) => {
    await page.goto('/create-crag')

    await page.getByLabel('Title').fill('My Test Crag')
    await page.getByLabel('Description').fill('A great test crag')
    await page.getByRole('button', { name: 'Create Crag' }).click()

    await expect(page.locator('.help.is-danger').first()).toBeVisible()
  })
})

test.describe('Create Area (unauthenticated)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG) test.skip()

    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/create-area`)

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Create Area (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL || !process.env.E2E_TEST_CRAG_SLUG) testInfo.skip()
  })

  test('user sees validation errors when submitting empty area form', async ({ page }) => {
    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/create-area`)

    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.help.is-danger').first()).toBeVisible()
  })

  test('user can fill in area details', async ({ page }) => {
    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/create-area`)

    await page.getByLabel('Title').fill('Test Area')
    await page.getByLabel('Description').fill('A great test area')
    await page.getByPlaceholder('Latitude').fill('53.3498')
    await page.getByPlaceholder('Longitude').fill('-6.2603')

    await expect(page.getByLabel('Title')).toHaveValue('Test Area')
    await expect(page.getByPlaceholder('Latitude')).toHaveValue('53.3498')
  })
})

test.describe('Create Topo (unauthenticated)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG || !process.env.E2E_TEST_AREA_SLUG) test.skip()

    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/create-topo/${process.env.E2E_TEST_AREA_SLUG}`)

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Create Topo (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.E2E_USER_EMAIL || !process.env.E2E_TEST_CRAG_SLUG || !process.env.E2E_TEST_AREA_SLUG) testInfo.skip()
  })

  test('shows error when submitting without an image', async ({ page }) => {
    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/create-topo/${process.env.E2E_TEST_AREA_SLUG}`)

    await page.getByRole('button', { name: /upload|create|submit/i }).click()

    await expect(page.locator('.swal2-container, .help.is-danger').first()).toBeVisible({ timeout: 5_000 })
  })
})

test.describe('Create Route (unauthenticated)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG || !process.env.E2E_TEST_AREA_SLUG || !process.env.E2E_TEST_TOPO_SLUG) test.skip()

    await page.goto(
      `/crags/${process.env.E2E_TEST_CRAG_SLUG}/areas/${process.env.E2E_TEST_AREA_SLUG}/topos/${process.env.E2E_TEST_TOPO_SLUG}/create-route`,
    )

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Create Route (authenticated)', () => {
  test.use({ storageState: 'e2e/.auth/user.json' })

  test.beforeEach(async ({}, testInfo) => {
    if (
      !process.env.E2E_USER_EMAIL ||
      !process.env.E2E_TEST_CRAG_SLUG ||
      !process.env.E2E_TEST_AREA_SLUG ||
      !process.env.E2E_TEST_TOPO_SLUG
    )
      testInfo.skip()
  })

  test('user sees validation errors when submitting empty route form', async ({ page }) => {
    const url = `/crags/${process.env.E2E_TEST_CRAG_SLUG}/areas/${process.env.E2E_TEST_AREA_SLUG}/topos/${process.env.E2E_TEST_TOPO_SLUG}/create-route`
    await page.goto(url)

    await page.getByRole('button', { name: /create|submit/i }).click()

    await expect(page.locator('.help.is-danger').first()).toBeVisible()
  })

  test('selecting a grading system reveals grade options', async ({ page }) => {
    const url = `/crags/${process.env.E2E_TEST_CRAG_SLUG}/areas/${process.env.E2E_TEST_AREA_SLUG}/topos/${process.env.E2E_TEST_TOPO_SLUG}/create-route`
    await page.goto(url)

    await page.getByLabel('Grading System').selectOption({ index: 1 })

    await expect(page.getByLabel('Grade')).toBeVisible()
  })

  test('user can fill in route title', async ({ page }) => {
    const url = `/crags/${process.env.E2E_TEST_CRAG_SLUG}/areas/${process.env.E2E_TEST_AREA_SLUG}/topos/${process.env.E2E_TEST_TOPO_SLUG}/create-route`
    await page.goto(url)

    await page.getByLabel('Title').fill('Test Route')

    await expect(page.getByLabel('Title')).toHaveValue('Test Route')
  })
})
