import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail } from '@/data/models/users'

export const getFn = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const subject = await getAuthUser()

    if (!subject) {
      throw new Error('Not authorised')
    }

    const user = await getUserByEmail(
      subject.properties.email.toLowerCase().trim(),
    )

    if (!user) {
      throw new Error('User not found')
    }

    return user.verificationCodeExpiration ?? null
  } catch (err) {
    logError('action:pending-user/verification-code-timeout/get', err)
    throw err
  }
})
