'use server';

import { requestPasswordReset } from '@/app/data/services/password-reset';
import { sendTransactional } from '@/app/lib/email';
import { enforceRateLimit, RateLimitType } from '@/app/lib/rate-limit';
import { getClientIp } from '@/app/lib/client-info';

export async function post(email: string): Promise<{ error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const ip = await getClientIp();

    await Promise.all([
      enforceRateLimit(RateLimitType.PASSWORD_RESET_REQUEST, ip),
      enforceRateLimit(RateLimitType.PASSWORD_RESET_REQUEST, normalizedEmail),
    ]);

    const resetCode = await requestPasswordReset(normalizedEmail);

    if (resetCode !== null) {
      await sendTransactional({
        subject: 'ClimbingTopos.com — your password reset code',
        content: `Your password reset code is: ${resetCode}\n\nThis code expires in 15 minutes.\n\nIf you did not request a password reset, you can ignore this email.`,
        recipientEmail: normalizedEmail,
      });
    }

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
