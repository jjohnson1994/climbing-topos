import { createFileRoute, redirect, ClientOnly } from '@tanstack/react-router';
import CreateRouteForm from '@/components/CreateRouteForm';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/create-route',
)({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  component: CreateRoutePage,
});

function CreateRoutePage() {
  const { cragSlug, areaSlug, topoSlug } = Route.useParams();

  return (
    <CreateRouteForm
      topoSlug={topoSlug}
      cragSlug={cragSlug}
      areaSlug={areaSlug}
    />
  );
}
