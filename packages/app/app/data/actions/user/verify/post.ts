'use server';

import { auth } from '@/app/actions';
import { verifyUser } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';
import {
  enforceRateLimit,
  clearRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';

export async function post(email: string, verificationCode: string): Promise<{ error?: string }> {
  try {
    const user = await auth();

    if (!user) {
      return { error: 'Not authorised' };
    }

    const verificationCodeAsInt = parseInt(verificationCode, 10);

    if (!verificationCode || isNaN(verificationCodeAsInt)) {
      return { error: 'Verification code invalid' };
    }

    const normalizedEmail = user.properties.email.toLowerCase().trim();

    const { windowBucket } = await enforceRateLimit(RateLimitType.VERIFICATION, normalizedEmail);

    const newUser = await verifyUser(normalizedEmail, verificationCodeAsInt);

    const newToken = await createAccessTokenJwt(newUser);

    const cookies = await getCookies();

    cookies.set({
      name: 'access_token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 14 * 24 * 60 * 60,
    });

    await clearRateLimit(RateLimitType.VERIFICATION, normalizedEmail, windowBucket);

    return {};
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Verification code mismatch' ||
        error.message === 'Verification code expired' ||
        error.message === 'User not found')
    ) {
      return { error: 'Invalid or expired verification code' };
    }

    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
