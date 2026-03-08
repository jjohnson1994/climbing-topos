import { test as setup } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const authFile = 'e2e/.auth/user.json'

setup('authenticate as test user', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL
  const password = process.env.E2E_USER_PASSWORD

  const dir = path.dirname(authFile)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!email || !password) {
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }))
    return
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
  await page.waitForURL('/profile')

  await page.context().storageState({ path: authFile })
})
