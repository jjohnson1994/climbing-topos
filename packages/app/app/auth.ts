import { cookies as getCookies } from 'next/headers';
import { object, string, optional } from 'valibot';
import { createSubjects } from '@openauthjs/openauth/subject';

export const subjects = createSubjects({
  user: object({
    id: string(),
    sub: string(),
    email: string(),
    picture: optional(string()),
    nickname: optional(string()),
  }),
});

export async function setTokens(access: string) {
  const cookies = await getCookies();

  cookies.set({
    name: 'access_token',
    value: access,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 14 * 24 * 60 * 60,
  });
}
