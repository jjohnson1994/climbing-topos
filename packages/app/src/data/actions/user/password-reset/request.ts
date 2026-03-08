import { createServerFn } from '@tanstack/react-start'
import { requestPasswordReset } from '@/data/services/password-reset'
import { sendTransactional } from '@/lib/email'
import { enforceRateLimit, RateLimitType } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-info'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string }) => data)
  .handler(
  async (ctx: { data: { email: string } }): Promise<{ error?: string }> => {
    try {
      const normalizedEmail = ctx.data.email.toLowerCase().trim()
      const ip = getClientIp()

      await Promise.all([
        enforceRateLimit(RateLimitType.PASSWORD_RESET_REQUEST, ip),
        enforceRateLimit(
          RateLimitType.PASSWORD_RESET_REQUEST,
          normalizedEmail,
        ),
      ])

      const resetCode = await requestPasswordReset(normalizedEmail)

      if (resetCode !== null) {
        await sendTransactional({
          subject: 'ClimbingTopos.com — your password reset code',
          content: `Your password reset code is: ${resetCode}\n\nThis code expires in 15 minutes.\n\nIf you did not request a password reset, you can ignore this email.`,
          recipientEmail: normalizedEmail,
        })
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
