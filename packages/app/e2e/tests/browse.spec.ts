import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('shows the welcome heading and a link to explore crags', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /crags/i })).toBeVisible()
  })
})

test.describe('Crags list', () => {
  test('user can browse the crags list', async ({ page }) => {
    await page.goto('/crags')

    await expect(page.getByRole('heading', { name: /crags/i })).toBeVisible()
  })

  test('user can navigate to a crag detail page', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG) test.skip()

    await page.goto('/crags')
    const cragLink = page.getByRole('link', { name: new RegExp(process.env.E2E_TEST_CRAG_SLUG!, 'i') }).first()
    await cragLink.click()

    await expect(page).toHaveURL(new RegExp(process.env.E2E_TEST_CRAG_SLUG!))
  })

  test('crag detail page shows areas', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG) test.skip()

    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}`)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Area detail page', () => {
  test('area detail page shows routes table', async ({ page }) => {
    if (!process.env.E2E_TEST_CRAG_SLUG || !process.env.E2E_TEST_AREA_SLUG) test.skip()

    await page.goto(`/crags/${process.env.E2E_TEST_CRAG_SLUG}/areas/${process.env.E2E_TEST_AREA_SLUG}`)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
  })
})

test.describe('Route detail page', () => {
  test('route detail page shows route name and action buttons', async ({ page }) => {
    if (!process.env.E2E_TEST_ROUTE_URL) test.skip()

    await page.goto(process.env.E2E_TEST_ROUTE_URL!)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /Log Book|Done/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save to List' })).toBeVisible()
  })
})

test.describe('Explore page', () => {
  test('explore page renders the map', async ({ page }) => {
    await page.goto('/explore')

    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Search', () => {
  test('user can type in the search box and see results', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"]')).first()
    await searchInput.fill('test')

    await expect(searchInput).toHaveValue('test')
  })
})
