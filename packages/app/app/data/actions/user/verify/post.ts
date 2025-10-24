'use server';

import { auth } from '@/app/actions';
import { verifyUser } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';
import {
  enforceRateLimit,
  recordAttempt,
  clearRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';

export async function post(email: string, verificationCode: string) {
  const user = await auth();

  if (!user) {
    throw new Error('Not authorised');
  }

  const verificationCodeAsInt = parseInt(verificationCode, 10);

  if (!verificationCode || isNaN(verificationCodeAsInt)) {
    throw new Error('Verification code invalid');
  }

  // Normalize email for consistent rate limiting
  const normalizedEmail = user.properties.email.toLowerCase().trim();

  // Check rate limit before attempting verification
  await enforceRateLimit(RateLimitType.VERIFICATION, normalizedEmail);

  try {
    const newUser = await verifyUser(normalizedEmail, verificationCodeAsInt);

    const newToken = await createAccessTokenJwt(newUser);

    const cookies = await getCookies();

    cookies.set({
      name: 'access_token',
      value: newToken,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    // Clear rate limit on successful verification
    await clearRateLimit(RateLimitType.VERIFICATION, normalizedEmail);
  } catch (error) {
    // Record failed verification attempt
    await recordAttempt(RateLimitType.VERIFICATION, normalizedEmail);

    // Use generic error message to prevent enumeration
    if (
      error instanceof Error &&
      (error.message === 'Verification code mismatch' ||
        error.message === 'Verification code expired' ||
        error.message === 'User not found')
    ) {
      throw new Error('Invalid or expired verification code');
    }

    throw error;
  }
}
