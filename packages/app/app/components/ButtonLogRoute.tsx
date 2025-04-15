'use client';

import { useContext } from 'react';
import { RouteLogContext } from '@/app/components/RouteLogContext';
import { useParams } from 'next/navigation';
import { Route } from '@climbingtopos/types';

import { login } from '@/app/actions';

export default function ButtonLogRoute({
  isAuthenticated,
  route,
}: {
  isAuthenticated: boolean;
  route: Route;
}) {
  const context = useContext(RouteLogContext);
  const params = useParams<{ areaSlug: string }>();

  const btnDoneOnClick = () => {
    if (!isAuthenticated) {
      login();
    } else if (route) {
      context.onSingleRouteDone(route);
    }
  };

  const hasUserLoggedRoute = () => {
    if (route) {
      return (
        route.userLogs.length ||
        context.routesJustLogged.findIndex(
          (route) => route.slug === params.areaSlug,
        ) !== -1
      );
    }

    return false;
  };

  return (
    <button className="button" onClick={btnDoneOnClick}>
      {hasUserLoggedRoute() ? (
        <>
          <span className="icon is-small">
            <i className="fas fw fa-check"></i>
          </span>
          <span>Done</span>
        </>
      ) : (
        <>
          <span className="icon is-small">
            <i className="fas fw fa-plus"></i>
          </span>
          <span>Log Book</span>
        </>
      )}
    </button>
  );
}
