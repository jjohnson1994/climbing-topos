'use client';

import RouteLogContext from '@/app/components/RouteLogContext';
import { UserProvider } from '@/app/components/UserContext';
import { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return <RouteLogContext>{children}</RouteLogContext>;
}
