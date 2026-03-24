import { createFileRoute, Link, Outlet, useMatch } from '@tanstack/react-router';
import { gradingSystems } from '@climbingtopos/globals';
import { getFn as getRouteFn } from '@/data/actions/routes/get';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import { getListsContainingRouteFn } from '@/data/actions/lists/get';
import { logError } from '@/lib/log';
import { useGradeHelpers } from '@/api/grades';
import RatingStarsDisplay from '@/components/RatingStarsDisplay';
import ButtonLogRoute from '@/components/ButtonLogRoute';
import ButtonSaveToList from '@/components/ButtonSaveToList';
import SavedToListsIndicator from '@/components/SavedToListsIndicator';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
)({
  loader: async ({ params, context }) => {
    const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
    try {
      const user = context.user;
      const [route, crag] = await Promise.all([
        getRouteFn({ data: { cragSlug, areaSlug, topoSlug, routeSlug } }),
        getCragFn({ data: { cragSlug } }),
      ]);
      let listsContainingRoute: { listSlug: string; listTitle: string }[] = [];
      if (user) {
        listsContainingRoute = await getListsContainingRouteFn({ data: { routeSlug } });
      }
      const userSub = user ? user.properties.sub : undefined;
      const isAdmin = !!(crag?.managedBy?.sub && crag.managedBy.sub === userSub);
      const isAuthenticated = !!user;
      return { route, crag, listsContainingRoute, isAdmin, isAuthenticated };
    } catch (err) {
      logError('loader:route', err, { cragSlug, areaSlug, topoSlug, routeSlug });
      throw err;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.route) return { meta: [], links: [] };
    const { route } = loaderData;
    const canonicalUrl = `https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.slug}/`;
    const gradeLabel =
      gradingSystems
        .find(({ title }) => title === route.gradingSystem)
        ?.grades[route.gradeModal as number] ?? route.gradeModal;
    const descriptionParts = [
      gradeLabel ? `${gradeLabel}` : null,
      route.routeType,
      `at ${route.areaTitle}, ${route.cragTitle}.`,
      route.description || null,
      route.logCount ? `Logged ${route.logCount} times.` : null,
      route.tags?.length ? route.tags.join(', ') : null,
    ];
    const description = descriptionParts.filter(Boolean).join(' ');
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: route.cragTitle,
            item: `https://climbingtopos.com/crags/${route.cragSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: route.areaTitle,
            item: `https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: route.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: route.title,
        description: description || undefined,
        url: canonicalUrl,
        image: route.topo?.image || undefined,
        sport: 'Rock Climbing',
        ...(route.latitude && route.longitude
          ? {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: parseFloat(route.latitude),
                longitude: parseFloat(route.longitude),
              },
            }
          : {}),
        additionalProperty: [
          gradeLabel
            ? { '@type': 'PropertyValue', name: 'grade', value: gradeLabel }
            : null,
          route.routeType
            ? { '@type': 'PropertyValue', name: 'routeType', value: route.routeType }
            : null,
          route.rockType
            ? { '@type': 'PropertyValue', name: 'rockType', value: route.rockType }
            : null,
          route.logCount
            ? { '@type': 'PropertyValue', name: 'logCount', value: route.logCount }
            : null,
        ].filter(Boolean),
        ...(route.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: route.rating,
                bestRating: 3,
                reviewCount: route.logCount || 1,
              },
            }
          : {}),
      },
    ];
    return {
      meta: [
        { title: `${route.title} | ${route.areaTitle} | ClimbingTopos.com` },
        { name: 'description', content: description },
        ...(route.latitude && route.longitude
          ? [
              { name: 'geo.position', content: `${route.latitude};${route.longitude}` },
              { name: 'ICBM', content: `${route.latitude}, ${route.longitude}` },
              { name: 'geo.placename', content: `${route.title}, ${route.cragTitle}` },
            ]
          : []),
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${route.title} | ${route.areaTitle} | ClimbingTopos.com` },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: route.topo?.image },
        { 'script:ld+json': jsonLd },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    };
  },
  component: RouteLayout,
});

function RouteLayout() {
  const { route, listsContainingRoute, isAdmin, isAuthenticated } = Route.useLoaderData();
  const { cragSlug, areaSlug, topoSlug, routeSlug } = Route.useParams();
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  const detailsMatch = useMatch({
    from: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/',
    shouldThrow: false,
  });
  const statsMatch = useMatch({
    from: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/stats',
    shouldThrow: false,
  });

  if (!route) return null;

  return (
    <>
      <section className="section pt-5">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link to="/crags/$cragSlug" params={{ cragSlug: route.cragSlug }}>
                  {route.cragTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug: route.cragSlug, areaSlug: route.areaSlug }}
                >
                  {route.areaTitle}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="block">
            <div className="columns"></div>
            <div className="columns">
              <div className="column is-two-thirds">
                <h1 className="title is-spaced is-capitalized">{route.title}</h1>
                <h6 className="subtitle is-6">
                  {convertGradeValueToGradeLabel(route.gradeModal, route.gradingSystem)}
                  <span> </span>
                  {route.routeType}
                  <span> </span>
                  <RatingStarsDisplay stars={route.rating || 0} />
                </h6>
                <h6 className="subtitle is-6" style={{ whiteSpace: 'pre-wrap' }}>
                  {route.description}
                </h6>
                {isAdmin && (
                  <div className="buttons">
                    <Link
                      to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/edit"
                      params={{ cragSlug, areaSlug, topoSlug, routeSlug }}
                      className="button is-info"
                    >
                      <span className="icon">
                        <i className="fas fa-edit" aria-hidden="true"></i>
                      </span>
                      <span>Edit Route</span>
                    </Link>
                  </div>
                )}
              </div>
              <div className="column">
                <div
                  className="is-flex is-flex-direction-column is-justify-content-space-between"
                  style={{ height: '100%' }}
                >
                  <div className="is-flex is-justify-content-flex-end">
                    <div className="tags mb-1">
                      {route.verified === false && (
                        <span className="tag is-info">Awaiting Verification</span>
                      )}
                      <SavedToListsIndicator
                        lists={listsContainingRoute}
                        cragSlug={cragSlug}
                        areaSlug={areaSlug}
                        topoSlug={topoSlug}
                        routeSlug={routeSlug}
                      />
                      {(route.tags as string[]).map((tag: string) => (
                        <label key={tag} className="tag is-capitalize">
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="field has-addons has-addons-right is-horizontal">
                    <p className="control">
                      <ButtonLogRoute isAuthenticated={isAuthenticated} route={route} />
                    </p>
                    <p className="control">
                      <ButtonSaveToList isAuthenticated={isAuthenticated} route={route} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tabs mb-0">
        <ul>
          <li className={detailsMatch ? 'is-active' : ''}>
            <Link
              to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/"
              params={{ cragSlug, areaSlug, topoSlug, routeSlug }}
              preload="intent"
              activeProps={{ 'aria-current': 'page' }}
            >
              Details
            </Link>
          </li>
          {(route.logCount ?? 0) > 0 && (
            <li className={statsMatch ? 'is-active' : ''}>
              <Link
                to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug/stats"
                params={{ cragSlug, areaSlug, topoSlug, routeSlug }}
                preload="intent"
                activeProps={{ 'aria-current': 'page' }}
              >
                Stats
              </Link>
            </li>
          )}
        </ul>
      </div>

      <section className="section">
        <div className="container">
          <Outlet />
        </div>
      </section>
    </>
  );
}
