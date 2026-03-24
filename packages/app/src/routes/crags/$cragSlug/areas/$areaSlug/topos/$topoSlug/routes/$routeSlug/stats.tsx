import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { getFn as getRouteLogsFn } from '@/data/actions/routes/logs/get';
import { logError } from '@/lib/log';
import RouteStats from '@/components/RouteStats';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/stats',
)({
  loader: async ({ params }) => {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
    try {
      const routeLogs = await getRouteLogsFn({ data: { cragSlug, areaSlug, topoSlug, routeSlug } });
      return { routeLogs };
    } catch (err) {
      logError('loader:routeLogs:stats', err, { cragSlug, areaSlug, topoSlug, routeSlug });
      throw err;
    }
  },
  component: RouteStatsTab,
});

function RouteStatsTab() {
  const { routeLogs } = Route.useLoaderData();
  const { route } = useLoaderData({
    from: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
  });

  if (!route) return null;

  return <RouteStats route={route} logs={routeLogs ?? []} />;
}
