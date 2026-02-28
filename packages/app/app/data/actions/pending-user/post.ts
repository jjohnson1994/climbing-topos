'use server';

import { cookies as getCookies } from 'next/headers';
import { createPendingUser } from '@/app/data/services/pending-users';
import { sendTransactional } from '@/app/lib/email';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import {
  enforceRateLimit,
  RateLimitType,
} from '@/app/lib/rate-limit';
import { getClientIp } from '@/app/lib/client-info';

export async function post(email: string, password: string): Promise<{ error?: string }> {
  try {
    const clientIp = await getClientIp();
    await enforceRateLimit(RateLimitType.SIGNUP, clientIp);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const verificationCode = await createPendingUser(normalizedEmail, password);

      await sendTransactional({
        subject:
          "Welcome to ClimbingTopos.com, here's your sign up verification code",
        content: `Your verification code is: ${verificationCode}`,
        recipientEmail: normalizedEmail,
      });

      const newToken = await createAccessTokenJwt({
        email: normalizedEmail,
        status: 'pending',
      });

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
    } catch (innerError) {
      if (innerError instanceof Error && innerError.message === 'User exists') {
        await sendTransactional({
          subject: 'ClimbingTopos.com sign up attempt',
          content:
            'Someone tried to sign up with your email address. If this was not you, no action is needed. If you already have an account, you can log in at climbingtopos.com.',
          recipientEmail: email.toLowerCase().trim(),
        }).catch(() => {});

        return { error: 'Unable to create account.' };
      }

      throw innerError;
    }

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
