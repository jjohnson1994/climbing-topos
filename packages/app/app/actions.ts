'use server';

import { redirect } from 'next/navigation';
import { cookies as getCookies } from 'next/headers';
import { UserPublicData } from '@climbingtopos/types';
import { createAccessTokenJwt, verifyJwt } from '@/app/lib/jwt';

export async function auth(): Promise<false | { properties: UserPublicData }> {
  const cookies = await getCookies();
  const accessToken = cookies.get('access_token');

  if (!accessToken?.value) {
    return false;
  }

  const verified = await verifyJwt(accessToken.value).catch(async (error) => {
    console.error('Could not verify access token', error.code);

    if (error.code === 'ERR_JWT_EXPIRED') {
      try {
        cookies.delete('access_token');
        console.log('expired token removed');
      } catch (_error) {}
    }

    return false;
  });

  if (!verified) {
    return false;
  }

  // TODO does this work?
  try {
    const newAccessToken = await createAccessTokenJwt(verified.properties);

    cookies.set({
      name: 'access_token',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
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
