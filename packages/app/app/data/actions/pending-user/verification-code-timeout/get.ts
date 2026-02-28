'use server';

import { auth } from '@/app/actions';
import { getUserByEmail } from '@/app/data/models/users';

export async function get() {
  const subject = await auth();

  if (!subject) {
    throw new Error('not authorised');
  }

  const user = await getUserByEmail(subject.properties.email.toLowerCase().trim());

  if (!user) {
    throw new Error('User not found');
  }

  return user.verificationCodeExpiration ?? null;
}
