'use server';

import { cookies as getCookies } from 'next/headers';
import { createPendingUser } from '@/app/data/services/pending-users';
import { sendTransactional } from '@/app/lib/email';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import {
  enforceRateLimit,
  recordAttempt,
  RateLimitType,
} from '@/app/lib/rate-limit';
import { getClientIp } from '@/app/lib/client-info';

export async function post(email: string, password: string) {
  // Rate limit signup by IP address to prevent spam
  const clientIp = await getClientIp();
  await enforceRateLimit(RateLimitType.SIGNUP, clientIp);

  try {
    const verificationCode = await createPendingUser(email, password);

    await sendTransactional({
      subject:
        "Welcome to ClimbingTopos.com, here's your sign up verification code",
      content: `Your verification code is: ${verificationCode}`,
      recipientEmail: email,
    });

    const newToken = await createAccessTokenJwt({
      email,
      status: 'pending',
    });

    const cookies = await getCookies();

    cookies.set({
      name: 'access_token',
      value: newToken,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Record failed signup attempt
    await recordAttempt(RateLimitType.SIGNUP, clientIp);

    // Use generic error message for user enumeration prevention
    if (error instanceof Error && error.message === 'User exists') {
      throw new Error('Unable to create account. Please try logging in instead.');
    }

    throw error;
  }
}
