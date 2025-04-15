import { Resource } from 'sst';
import { createClient } from '@openauthjs/openauth/client';
import { cookies as getCookies } from 'next/headers';
import { object, string } from 'valibot';
import { createSubjects } from '@openauthjs/openauth/subject';

export const client = createClient({
  clientID: 'nextjs',
  issuer: Resource.ClimbingToposOpenAuth.url,
});

// TODO share with issuer
export const subjects = createSubjects({
  user: object({
    id: string(),
    sub: string(),
    email: string(),
    picture: string(),
    nickname: string(),
  }),
});

export async function setTokens(access: string, refresh: string) {
  const cookies = await getCookies();

  cookies.set({
    name: 'access_token',
    value: access,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 34560000,
  });
  cookies.set({
    name: 'refresh_token',
    value: refresh,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 34560000,
  });
}
