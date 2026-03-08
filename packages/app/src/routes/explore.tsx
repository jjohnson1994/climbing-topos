import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

const CragsMap = lazy(() => import('@/components/CragsMap'));

export const Route = createFileRoute('/explore')({
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <ClientOnly>
      <Suspense fallback={<div />}>
        <CragsMap />
      </Suspense>
    </ClientOnly>
  );
}
