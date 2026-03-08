import { test, expect } from '@playwright/test'
import MailSlurp from 'mailslurp-client'

const VERIFICATION_EMAIL_TIMEOUT = 30_000

test.describe('Sign up, verify email, and log a climb', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (!process.env.MAILSLURP_API_KEY || !process.env.E2E_TEST_ROUTE_URL) {
      testInfo.skip()
    }
  })

  test('user can sign up, verify their email, set up their profile, and log a climb', async ({ page }) => {
    const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! })

    // Arrange: create a real throwaway inbox for this test run
    const inbox = await mailslurp.createInbox()
    const testEmail = inbox.emailAddress!
    const testPassword = 'TestPassword123!'
    const testUsername = `e2e-user-${Date.now()}`

    // --- Sign up ---
    await page.goto('/signup')
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Password').fill(testPassword)
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page).toHaveURL('/signup-confirm')

    // --- Receive and extract verification code ---
    const email = await mailslurp.waitForLatestEmail(
      inbox.id!,
      VERIFICATION_EMAIL_TIMEOUT,
      true,
    )
    const code = email.body?.match(/\d{6}/)?.[0]
    expect(code, 'Verification code not found in email body').toBeTruthy()

    // --- Verify account ---
    await page.getByLabel('Confirmation Code').fill(code!)
    await page.getByRole('button', { name: 'Verify' }).click()

    // Success popup appears, then redirects to /first-login (no picture yet)
    await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 8_000 })
    await page.locator('.swal2-confirm').click()
    await expect(page).toHaveURL('/first-login', { timeout: 8_000 })

    // --- Set up profile (username required, picture optional) ---
    await page.getByLabel('Username').fill(testUsername)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page).toHaveURL('/profile', { timeout: 8_000 })

    // --- Log a climb ---
    await page.goto(process.env.E2E_TEST_ROUTE_URL!)
    await page.getByRole('button', { name: /Log Book|Done/i }).click()

    const dialog = page.getByRole('dialog', { name: 'Add Routes to Log Book' })
    await expect(dialog).toBeVisible()

    await dialog.getByLabel('Rating').selectOption('4')
    await dialog.getByRole('button', { name: 'Save to Log Book' }).click()

    await expect(page.locator('.swal2-container, [class*="toast"]')).toBeVisible({ timeout: 10_000 })
    await expect(dialog).not.toBeVisible({ timeout: 5_000 })

    // --- Assert the climb appears in the profile logs ---
    await page.goto('/profile?tab=logs')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr').first()).toBeVisible()
  })
})
