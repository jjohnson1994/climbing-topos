'use server';

import { verifyLogin } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';
import {
  enforceRateLimit,
  clearRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';
import { getClientIp } from '@/app/lib/client-info';

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  if (!email || !password) {
    return { error: 'Invalid email or password' };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const clientIp = await getClientIp();

    const { windowBucket: loginBucket } = await enforceRateLimit(RateLimitType.LOGIN, normalizedEmail);
    const { windowBucket: ipBucket } = await enforceRateLimit(RateLimitType.LOGIN_IP, clientIp);

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
      maxAge: 14 * 24 * 60 * 60,
    });

    await Promise.allSettled([
      clearRateLimit(RateLimitType.LOGIN, normalizedEmail, loginBucket),
      clearRateLimit(RateLimitType.LOGIN_IP, clientIp, ipBucket),
    ]);

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
