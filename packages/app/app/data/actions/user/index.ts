'use server';

import { verifyLogin } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';
import {
  enforceRateLimit,
  recordAttempt,
  clearRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';
import { getClientIp } from '@/app/lib/client-info';

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Invalid email or password');
  }

  // Normalize email to lowercase for consistent rate limiting
  const normalizedEmail = email.toLowerCase().trim();

  // Get client IP for IP-based rate limiting
  const clientIp = await getClientIp();

  // Check rate limits before attempting login (both email and IP)
  await enforceRateLimit(RateLimitType.LOGIN, normalizedEmail);
  await enforceRateLimit(RateLimitType.LOGIN_IP, clientIp);

  try {
    const user = await verifyLogin(normalizedEmail, password);

    const newAccessToken = await createAccessTokenJwt(user);

    const cookies = await getCookies();

    cookies.set({
      name: 'access_token',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    // Clear rate limits on successful login (both email and IP)
    await clearRateLimit(RateLimitType.LOGIN, normalizedEmail);
    await clearRateLimit(RateLimitType.LOGIN_IP, clientIp);
  } catch (error) {
    // Record failed attempts for both email and IP
    await recordAttempt(RateLimitType.LOGIN, normalizedEmail);
    await recordAttempt(RateLimitType.LOGIN_IP, clientIp);

    // Use generic error message to prevent user enumeration
    if (
      error instanceof Error &&
      (error.message === 'User not found' || error.message === 'invalid password')
    ) {
      throw new Error('Invalid email or password');
    }

    throw error;
  }
}
