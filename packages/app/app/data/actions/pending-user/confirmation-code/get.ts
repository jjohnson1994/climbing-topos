'use server';

import { auth } from '@/app/actions';
import { resendConfirmationCode } from '@/app/data/services/pending-users';

export async function get() {
  const user = await auth();

  if (!user) {
    throw new Error('Not authorised');
  }

  const email = user.properties.email;

  const expiration = await resendConfirmationCode(email);

  return expiration;
}
