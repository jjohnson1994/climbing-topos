'use server';

import { auth } from '@/app/actions';
import { verifyUser } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';

export async function post(email: string, verificationCode: string) {
  const user = await auth();

  if (!user) {
    throw new Error('Not authorised');
  }

  const verificationCodeAsInt = parseInt(verificationCode, 10);

  if (!verificationCode) {
    throw new Error('Verification code invalid');
  }

  const newUser = await verifyUser(
    user.properties.email,
    verificationCodeAsInt,
  );

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
}
