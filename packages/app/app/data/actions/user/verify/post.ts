'use server';

import { verifyUser } from '@/app/data/services/users';
import { createJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';

export async function post(email: string, verificationCode: string) {
  const verificationCodeAsInt = parseInt(verificationCode, 10);

  if (!verificationCode) {
    throw new Error('Verification code invalid');
  }

  const user = await verifyUser(email, verificationCodeAsInt);

  const newToken = await createJwt(user);

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
