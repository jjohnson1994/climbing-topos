import Link from 'next/link';
import { Log, Route } from '@climbingtopos/types';
import { useGradeHelpers } from '@/app/api/grades';
import RatingStarsDisplay from '@/app/components/RatingStarsDisplay';
import AreaRouteTableMenu from './AreaRouteTableMenu';
import { auth } from '../actions';

interface Props {
  routes: Route[] | undefined;
  loggedRoutes: Log[];
}

async function AreaRoutesTable({ routes, loggedRoutes }: Props) {
  const subject = await auth();
  const isAuthenticated = !!subject;
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  const hasUserLoggedRoute = (routeSlug: string) => {
    return (
      // TODO
      //loggedRoutes.findIndex((log) => log.routeSlug === routeSlug) !== -1 ||
      //context.routesJustLogged.findIndex(
      //  (route) => route.slug === routeSlug,
      //) !== -1
      loggedRoutes.findIndex((log) => log.routeSlug === routeSlug) !== -1
    );
  };

  return (
    <>
      <div>
        {routes?.map((route, index) => (
          <div className="box block is-flex" key={index}>
            <div className="is-flex mr-4 is-justify-content-center is-align-items-center">
              <span>{index + 1}</span>
            </div>
            <div className="is-flex is-flex-direction-column is-flex-grow-1">
              <span className="mb-2">
                <Link
                  href={`/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.slug}`}
                  className={
                    hasUserLoggedRoute(String(route.slug)) ? 'line-through' : ''
                  }
                >
                  {route.title}
                </Link>
                <span className="mr-2"></span>
                <RatingStarsDisplay stars={route.rating} />
              </span>
              <div className="tags">
                {route.verified !== true && (
                  <span className="tag is-info">Not Verified</span>
                )}
                <span className="tag">
                  {convertGradeValueToGradeLabel(
                    route.gradeModal,
                    route.gradingSystem,
                  )}
                </span>
                <span className="tag">{route.routeType}</span>
                <span className="tag">{route.logCount} Ticks</span>
              </div>
            </div>
            <div>
              <AreaRouteTableMenu
                isAuthenticated={isAuthenticated}
                route={route}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AreaRoutesTable;
