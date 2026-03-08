import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { verifyLogin } from '@/data/services/users'
import { createAccessTokenJwt } from '@/lib/jwt'
import { enforceRateLimit, clearRateLimit, RateLimitType } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-info'

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(
  async (ctx: {
    data: { email: string; password: string }
  }): Promise<{ error?: string }> => {
    const { email, password } = ctx.data

    if (!email || !password) {
      return { error: 'Invalid email or password' }
    }

    const normalizedEmail = email.toLowerCase().trim()

    try {
      const clientIp = getClientIp()

      const { windowBucket: loginBucket } = await enforceRateLimit(
        RateLimitType.LOGIN,
        normalizedEmail,
      )
      const { windowBucket: ipBucket } = await enforceRateLimit(
        RateLimitType.LOGIN_IP,
        clientIp,
      )

      const user = await verifyLogin(normalizedEmail, password)

      const newAccessToken = await createAccessTokenJwt(user)

      setCookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      })

      await Promise.allSettled([
        clearRateLimit(RateLimitType.LOGIN, normalizedEmail, loginBucket),
        clearRateLimit(RateLimitType.LOGIN_IP, clientIp, ipBucket),
      ])

      return {}
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong, please try again',
      }
    }
  },
)
