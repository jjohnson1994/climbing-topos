'use server';

import { cookies as getCookies } from 'next/headers';
import { createPendingUser } from '@/app/data/services/pending-users';

import { sendTransactional } from '@/app/lib/email';
import { createJwt } from '@/app/lib/jwt';

export async function post(email: string, password: string) {
  const verificationCode = await createPendingUser(email, password);

  await sendTransactional({
    subject:
      "Welcome to ClimbingTopos.com, here's your sign up verification code",
    content: `Your verification code is: ${verificationCode}`,
    recipientEmail: email,
  });

  const newToken = await createJwt({
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
    maxAge: 34560000,
  });
}
