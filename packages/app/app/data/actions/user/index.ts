'use server';

import { verifyLogin } from '@/app/data/services/users';
import { createJwt } from '@/app/lib/jwt';
import { cookies as getCookies } from 'next/headers';

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new Error('invalid request');
  }

  const user = await verifyLogin(email, password);

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
