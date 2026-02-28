'use server';

import { confirmPasswordReset } from '@/app/data/services/password-reset';
import {
  enforceRateLimit,
  clearRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';

export async function post(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const codeAsInt = parseInt(code, 10);

    if (!code || isNaN(codeAsInt)) {
      return { error: 'Invalid reset code' };
    }

    const { windowBucket } = await enforceRateLimit(
      RateLimitType.PASSWORD_RESET_CONFIRM,
      normalizedEmail,
    );

    await confirmPasswordReset(normalizedEmail, codeAsInt, newPassword);

    await clearRateLimit(
      RateLimitType.PASSWORD_RESET_CONFIRM,
      normalizedEmail,
      windowBucket,
    );

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
