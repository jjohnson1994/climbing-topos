'use server';

import { auth } from '@/app/actions';
import { resendConfirmationCode } from '@/app/data/services/pending-users';
import {
  enforceRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';

export async function get(): Promise<{ data?: string; error?: string }> {
  try {
    const user = await auth();

    if (!user) {
      return { error: 'Not authorised' };
    }

    const email = user.properties.email.toLowerCase().trim();

    await enforceRateLimit(RateLimitType.RESEND_CODE, email);

    const data = await resendConfirmationCode(email);

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
