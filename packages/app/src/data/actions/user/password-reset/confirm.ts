import { createServerFn } from '@tanstack/react-start'
import { confirmPasswordReset } from '@/data/services/password-reset'
import { enforceRateLimit, clearRateLimit, RateLimitType } from '@/lib/rate-limit'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; code: string; newPassword: string }) => data)
  .handler(
  async (ctx: {
    data: { email: string; code: string; newPassword: string }
  }): Promise<{ error?: string }> => {
    try {
      const normalizedEmail = ctx.data.email.toLowerCase().trim()

      const codeAsInt = parseInt(ctx.data.code, 10)

      if (!ctx.data.code || isNaN(codeAsInt)) {
        return { error: 'Invalid reset code' }
      }

      const { windowBucket } = await enforceRateLimit(
        RateLimitType.PASSWORD_RESET_CONFIRM,
        normalizedEmail,
      )

      await confirmPasswordReset(normalizedEmail, codeAsInt, ctx.data.newPassword)

      await clearRateLimit(
        RateLimitType.PASSWORD_RESET_CONFIRM,
        normalizedEmail,
        windowBucket,
      )

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
