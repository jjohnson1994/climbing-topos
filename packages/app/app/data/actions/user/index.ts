'use server';

import { verifyLogin } from '@/app/data/services/users';
import { createAccessTokenJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new Error('invalid request');
  }

  const user = await verifyLogin(email, password);

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
}
