import { createServerFn } from '@tanstack/react-start'
import { getAuthUser } from '@/lib/auth'
import { resendConfirmationCode } from '@/data/services/pending-users'
import { enforceRateLimit, RateLimitType } from '@/lib/rate-limit'

export const getFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ data?: string; error?: string }> => {
    try {
      const user = await getAuthUser()

      if (!user) {
        return { error: 'Not authorised' }
      }

      const email = user.properties.email.toLowerCase().trim()

      await enforceRateLimit(RateLimitType.RESEND_CODE, email)

      const data = await resendConfirmationCode(email)

      return { data }
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
