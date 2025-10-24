'use server';

import { auth } from '@/app/actions';
import { resendConfirmationCode } from '@/app/data/services/pending-users';
import {
  enforceRateLimit,
  recordAttempt,
  RateLimitType,
} from '@/app/lib/rate-limit';

export async function get() {
  const user = await auth();

  if (!user) {
    throw new Error('Not authorised');
  }

  const email = user.properties.email.toLowerCase().trim();

  // Rate limit resend requests to prevent email spam
  await enforceRateLimit(RateLimitType.RESEND_CODE, email);

  try {
    const expiration = await resendConfirmationCode(email);

    // Record successful resend (to prevent rapid successive requests)
    await recordAttempt(RateLimitType.RESEND_CODE, email);

    return expiration;
  } catch (error) {
    // Record failed attempt
    await recordAttempt(RateLimitType.RESEND_CODE, email);

    throw error;
  }
}
