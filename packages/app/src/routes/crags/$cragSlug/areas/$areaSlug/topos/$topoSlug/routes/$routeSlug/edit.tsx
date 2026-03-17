import { createFileRoute, redirect } from '@tanstack/react-router';
import { getFn as getRouteFn } from '@/data/actions/routes/get';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import EditRouteForm from '@/components/EditRouteForm';
import { logError } from '@/lib/log';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/edit',
)({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loader: async ({ params, context }) => {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
    try {
      const user = context.user as any;

      const [route, crag] = await Promise.all([
        getRouteFn({ data: { cragSlug, areaSlug, topoSlug, routeSlug } }),
        getCragFn({ data: { cragSlug } }),
      ]);

      if (crag.managedBy.sub !== user.properties.sub) {
        throw redirect({
          to: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
          params: { cragSlug, areaSlug, topoSlug, routeSlug },
        });
      }

      return { route, crag };
    } catch (err) {
      logError('loader:edit-route', err, { cragSlug, areaSlug, topoSlug, routeSlug })
      throw err
    }
  },
  component: EditRoutePage,
});

function EditRoutePage() {
  const { route } = Route.useLoaderData();
  const { cragSlug, areaSlug, topoSlug, routeSlug } = Route.useParams();

  return (
    <EditRouteForm
      route={route}
      cragSlug={cragSlug}
      areaSlug={areaSlug}
      topoSlug={topoSlug}
      routeSlug={routeSlug}
    />
  );
}
