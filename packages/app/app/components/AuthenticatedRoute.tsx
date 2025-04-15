'use server';

import { PropsWithChildren } from 'react';
import { auth, login } from '@/app/actions';

async function AuthenticaedRoute({ children }: PropsWithChildren) {
  const subject = await auth();

  if (!subject) {
    return login();
  }

  return <>{children}</>;
}

export default AuthenticaedRoute;
