'use server';

import { redirect } from 'next/navigation';
import { cookies as getCookies } from 'next/headers';
import { JwtPayload, createAccessTokenJwt, verifyJwt } from '@/app/lib/jwt';

export async function auth(): Promise<false | JwtPayload> {
  const cookies = await getCookies();
  const accessToken = cookies.get('access_token');

  if (!accessToken?.value) {
    return false;
  }

  const verified = await verifyJwt(accessToken.value).catch(async () => {
    try {
      cookies.delete('access_token');
    } catch (_error) {}

    return false;
  });

  if (!verified) {
    return false;
  }

  try {
    const newAccessToken = await createAccessTokenJwt(verified.properties);

    cookies.set({
      name: 'access_token',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 14 * 24 * 60 * 60,
    });
  } catch (error) {}

  return verified;
}

export async function login() {
  redirect('/login');
}

export async function logout() {
  const cookies = await getCookies();

  cookies.delete('access_token');

  redirect('/');
}
