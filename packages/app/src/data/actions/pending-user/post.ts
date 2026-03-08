import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { createPendingUser } from '@/data/services/pending-users'
import { sendTransactional } from '@/lib/email'
import { createAccessTokenJwt } from '@/lib/jwt'
import { enforceRateLimit, RateLimitType } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-info'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(
  async (ctx: { data: { email: string; password: string } }) => {
    try {
      const clientIp = getClientIp()
      await enforceRateLimit(RateLimitType.SIGNUP, clientIp)

      const normalizedEmail = ctx.data.email.toLowerCase().trim()

      try {
        const verificationCode = await createPendingUser(
          normalizedEmail,
          ctx.data.password,
        )

        await sendTransactional({
          subject:
            "Welcome to ClimbingTopos.com, here's your sign up verification code",
          content: `Your verification code is: ${verificationCode}`,
          recipientEmail: normalizedEmail,
        })

        const newToken = await createAccessTokenJwt({
          email: normalizedEmail,
          status: 'pending',
        })

        setCookie('access_token', newToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 14 * 24 * 60 * 60,
        })
      } catch (innerError) {
        if (innerError instanceof Error && innerError.message === 'User exists') {
          await sendTransactional({
            subject: 'ClimbingTopos.com sign up attempt',
            content:
              'Someone tried to sign up with your email address. If this was not you, no action is needed. If you already have an account, you can log in at climbingtopos.com.',
            recipientEmail: ctx.data.email.toLowerCase().trim(),
          }).catch(() => {})

          return { error: 'Unable to create account.' }
        }

        throw innerError
      }

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
