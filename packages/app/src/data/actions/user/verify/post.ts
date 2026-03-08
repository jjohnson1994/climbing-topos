import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { getAuthUser } from '@/lib/auth'
import { verifyUser } from '@/data/services/users'
import { createAccessTokenJwt } from '@/lib/jwt'
import { enforceRateLimit, clearRateLimit, RateLimitType } from '@/lib/rate-limit'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; verificationCode: string }) => data)
  .handler(async ({ data }): Promise<{ error?: string }> => {
    try {
      const user = await getAuthUser()

      if (!user) {
        return { error: 'Not authorised' }
      }

      const verificationCodeAsInt = parseInt(data.verificationCode, 10)

      if (!data.verificationCode || isNaN(verificationCodeAsInt)) {
        return { error: 'Verification code invalid' }
      }

      const normalizedEmail = user.properties.email.toLowerCase().trim()

      const { windowBucket } = await enforceRateLimit(
        RateLimitType.VERIFICATION,
        normalizedEmail,
      )

      const newUser = await verifyUser(normalizedEmail, verificationCodeAsInt)

      const newToken = await createAccessTokenJwt(newUser as any)

      setCookie('access_token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      })

      await clearRateLimit(RateLimitType.VERIFICATION, normalizedEmail, windowBucket)

      return {}
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Verification code mismatch' ||
          error.message === 'Verification code expired' ||
          error.message === 'User not found')
      ) {
        return { error: 'Invalid or expired verification code' }
      }

      return {
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong, please try again',
      }
    }
  })
