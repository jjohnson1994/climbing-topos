import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { getFn as getRouteLogsFn } from '@/data/actions/routes/logs/get';
import { logError } from '@/lib/log';
import { useGradeHelpers } from '@/api/grades';
import TopoImage from '@/components/TopoImage';
import RouteLogs from '@/components/RouteLogs';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/',
)({
  loader: async ({ params }) => {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
    try {
      const routeLogs = await getRouteLogsFn({ data: { cragSlug, areaSlug, topoSlug, routeSlug } });
      return { routeLogs };
    } catch (err) {
      logError('loader:routeLogs', err, { cragSlug, areaSlug, topoSlug, routeSlug });
      throw err;
    }
  },
  component: RouteDetailsTab,
});

function RouteDetailsTab() {
  const { routeLogs } = Route.useLoaderData();
  const { route } = useLoaderData({
    from: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
  });
  const { cragSlug, areaSlug, topoSlug } = Route.useParams();
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  if (!route) return null;

  return (
    <>
      <div className="block">
        {route.drawing ? (
          <TopoImage
            routes={[route, ...route.siblingRoutes]}
            highlightedRouteSlug={route.slug}
            background={`${route.topo?.image}`}
          />
        ) : null}
      </div>
      {route.siblingRoutes?.length > 0 && (
        <div className="block">
          <h2 className="title is-6">Routes on this topo</h2>
          <ul>
            {[route, ...route.siblingRoutes].map((r) => (
              <li key={r.slug}>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
                  params={{ cragSlug, areaSlug, topoSlug, routeSlug: r.slug }}
                  className={r.slug === route.slug ? 'has-text-weight-bold' : ''}
                >
                  {r.title}
                </Link>
                {' '}
                <span className="has-text-grey-light">
                  {convertGradeValueToGradeLabel(r.gradeModal, r.gradingSystem)}
                  {' '}
                  {r.routeType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {routeLogs && (
        <div className="block">
          <RouteLogs logs={routeLogs} />
        </div>
      )}
    </>
  );
}
