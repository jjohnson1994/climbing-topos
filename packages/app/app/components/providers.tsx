'use client';

import RouteLogContext from '@/app/components/RouteLogContext';
import { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return <RouteLogContext>{children}</RouteLogContext>;
}
