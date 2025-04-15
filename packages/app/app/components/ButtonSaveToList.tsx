'use client';

import { useContext } from 'react';
import { RouteLogContext } from '@/app/components/RouteLogContext';
import { Route } from '@climbingtopos/types';

import { login } from '@/app/actions';

export default function ButtonLogRoute({
  isAuthenticated,
  route,
}: {
  isAuthenticated: boolean;
  hasUserLoggedRoute: boolean;
  route: Route;
}) {
  const context = useContext(RouteLogContext);

  const btnSaveToListOnClick = () => {
    if (!isAuthenticated) {
      login();
    } else if (route) {
      context.onSingleRouteAddToList(route);
    }
  };

  return (
    <button className="button" onClick={btnSaveToListOnClick}>
      <span className="icon is-small">
        <i className="fas fw fa-list"></i>
      </span>
      <span>Save to List</span>
    </button>
  );
}
