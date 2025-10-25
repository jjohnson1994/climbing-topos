import Head from 'next/head';
import { Crag, Log, Route } from '@climbingtopos/types';
import { useGradeHelpers } from '@/app/api/grades';
import RatingStarsDisplay from '@/app/components/RatingStarsDisplay';
import TopoImage from '@/app/components/TopoImage';
import RouteLogs from '@/app/components/RouteLogs';
import ButtonLogRoute from '@/app/components/ButtonLogRoute';
import ButtonSaveToList from '@/app/components/ButtonSaveToList';
import SavedToListsIndicator from '@/app/components/SavedToListsIndicator';
import { popupSuccess } from '@/app/helpers/alerts';
import Button, { Color } from '@/app/elements/Button';
import { auth } from '@/app/actions';
import { get as getRoutes } from '@/app/data/actions/routes/get';
import { get as getCrags } from '@/app/data/actions/crags/get';
import { get as getLogs } from '@/app/data/actions/routes/logs/get';
import { getListsContainingRoute } from '@/app/data/actions/lists/get';
import Link from 'next/link';

async function RoutePage({
  params,
}: {
  params: {
    cragSlug: string;
    areaSlug: string;
    topoSlug: string;
    routeSlug: string;
  };
}) {
  const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
  const user = await auth();

  let route: Route;
  let crag: Crag;
  let routeLogs: Log[];
  let listsContainingRoute: { listSlug: string; listTitle: string }[] = [];
  let isAdmin = false;
  const isAuthenticated = !!user;
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  const doGetRoute = async () => {
    try {
      const newRoute = await getRoutes(cragSlug, areaSlug, topoSlug, routeSlug);

      const newCrag = await getCrags(cragSlug);

      route = newRoute;
      crag = newCrag;
    } catch (error) {
      console.error('Error loading route', error);
      // TODO error page
    }
  };

  const doGetRouteLogs = async () => {
    try {
      const newRouteLogs = await getLogs(
        cragSlug,
        areaSlug,
        topoSlug,
        routeSlug,
      );
      routeLogs = newRouteLogs;
    } catch (error) {
      console.error('Error loading route logs', error);
      // TODO error page
    }
  };

  await doGetRoute();
  await doGetRouteLogs();

  if (user) {
    try {
      listsContainingRoute = await getListsContainingRoute(routeSlug);
    } catch (error) {
      console.error('Error loading lists containing route', error);
    }
  }

  if (crag.managedBy.sub === user?.id) {
    isAdmin = true;
  }

  const btnVerifyOnClick = async () => {
    try {
      if (!route) {
        return;
      }

      const verify = window.confirm(
        'Are you sure you want to verify this route?',
      );

      if (verify) {
        await routes.updateRoute(route.slug, { verified: true });
        setRoute({
          ...route,
          verified: true,
        });
        popupSuccess('Route Verified');
      }
    } catch (error) {
      console.error('error updating area', error);
    }
  };

  return (
    <>
      <Head>
        <title>
          {route.title} | {route.areaTitle} | ClimbingTopos.com
        </title>
        <link
          rel="canonical"
          href={`https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.slug}`}
        />
        <meta
          name="description"
          content={`${route.title}, ${route.areaTitle}, ${route.cragTitle} climbing guide and topo`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${route.title} | ${route.areaTitle} | ClimbingTopos.com`}
        />
        <meta
          property="og:url"
          content={`https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.slug}`}
        />
        <meta
          property="og:description"
          content={`${route.title}, ${route.areaTitle}, ${route.cragTitle} climbing guide and topo`}
        />
        <meta property="og:image" content={`${crag.image}`} />
      </Head>
      <section className="section pt-5">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a href={`/crags/${route?.cragSlug}`}>{route?.cragTitle}</a>
              </li>
              <li>
                <a href={`/crags/${route?.cragSlug}/areas/${route?.areaSlug}`}>
                  {route?.areaTitle}
                </a>
              </li>
            </ul>
          </nav>
          <div className="block">
            <div className="columns"></div>
            <div className="columns">
              <div className="column is-two-thirds">
                <h1 className="title is-spaced is-capitalized">
                  {route?.title}
                </h1>
                <h6 className="subtitle is-6">
                  {route
                    ? convertGradeValueToGradeLabel(
                        route.gradeModal,
                        route.gradingSystem,
                      )
                    : ''}
                  <span> </span>
                  {route?.routeType}
                  <span> </span>
                  <RatingStarsDisplay stars={route?.rating || 0} />
                </h6>
                <h6 className="subtitle is-6">{route?.description}</h6>
                {isAdmin === true && (
                  <div className="buttons">
                    <Link
                      href={`/crags/${cragSlug}/areas/${areaSlug}/topos/${topoSlug}/routes/${routeSlug}/edit`}
                      className="button is-info"
                    >
                      <span className="icon">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span>Edit Route</span>
                    </Link>
                    {route?.verified === false && (
                      <Button
                        color={Color.isSuccess}
                        onClick={btnVerifyOnClick}
                      >
                        <span className="icon">
                          <i className="fas fa-check"></i>
                        </span>
                        <span>Verify</span>
                      </Button>
                    )}
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
                      {route?.verified === false && (
                        <span className="tag is-info">
                          Awaiting Verification
                        </span>
                      )}
                      <SavedToListsIndicator
                        lists={listsContainingRoute}
                        cragSlug={cragSlug}
                        areaSlug={areaSlug}
                        topoSlug={topoSlug}
                        routeSlug={routeSlug}
                      />
                      {route?.tags.map((tag) => (
                        <label key={tag} className="tag is-capitalize">
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="field has-addons has-addons-right is-horizontal">
                    <p className="control">
                      <ButtonLogRoute
                        isAuthenticated={isAuthenticated}
                        route={route}
                      />
                    </p>
                    <p className="control">
                      <ButtonSaveToList
                        isAuthenticated={isAuthenticated}
                        route={route}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="block">
            {route?.drawing ? (
              <TopoImage
                routes={[route, ...route.siblingRoutes]}
                highlightedRouteSlug={route.slug}
                background={`${route?.topo?.image}`}
              />
            ) : (
              ''
            )}
          </div>
          {routeLogs && (
            <div className="block">
              <RouteLogs logs={routeLogs} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default RoutePage;
