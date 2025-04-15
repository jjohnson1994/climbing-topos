'use client';

import Tippy from '@tippyjs/react';
import { ChangeEvent, useContext } from 'react';
import { Route } from '@climbingtopos/types';
import { RouteLogContext } from './RouteLogContext';
import { useRouter } from 'next/navigation';

function AreaRouteTableMenu({
  isAuthenticated,
  route,
}: {
  isAuthenticated: boolean;
  route: Route;
}) {
  const router = useRouter();

  const context = useContext(RouteLogContext);
  const chkRouteOnChange = (
    _event: ChangeEvent<HTMLInputElement>,
    route: Route,
  ) => {
    if (
      context.selectedRoutes.findIndex(({ slug }) => slug === route.slug) > -1
    ) {
      context.onRouteDeselected(route);
    } else {
      context.onRouteSelected(route);
    }
  };

  const btnSingleRouteDoneOnClick = (route: Route) => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      context.onSingleRouteDone(route);
    }
  };

  const btnSingleRouteAddToListOnClick = (route: Route) => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      context.onSingleRouteAddToList(route);
    }
  };
  return (
    <span>
      {context.isSelectingMultiple ? (
        <input
          type="checkbox"
          checked={
            context.selectedRoutes.findIndex(
              ({ slug }) => slug === route.slug,
            ) !== -1
          }
          onChange={(e) => chkRouteOnChange(e, route)}
        />
      ) : (
        <Tippy
          trigger="click"
          interactive={true}
          theme="light-border"
          placement="bottom-end"
          hideOnClick={true}
          content={
            <div className="dropdown is-active">
              <div className="dropdown-menu" style={{ position: 'relative' }}>
                <div className="dropdown-content">
                  <button
                    className="dropdown-item button is-white is-cursor-pointer"
                    onClick={() => {
                      btnSingleRouteDoneOnClick(route);
                    }}
                  >
                    <span className="icon">
                      <i className="fas fw fa-check"></i>
                    </span>
                    <span>Done</span>
                  </button>
                  <button
                    className="dropdown-item button is-white is-cursor-pointer"
                    onClick={() => {
                      btnSingleRouteAddToListOnClick(route);
                    }}
                  >
                    <span className="icon">
                      <i className="fas fw fa-list"></i>
                    </span>
                    <span>Save to List</span>
                  </button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item button is-white is-cursor-pointer"
                    onClick={() => context.onInitSelectMultiple(true, route)}
                  >
                    <span className="icon">
                      <i className="far fw fa-check-square"></i>
                    </span>
                    <span>Select Multiple</span>
                  </button>
                </div>
              </div>
            </div>
          }
        >
          <i className="fas fa-ellipsis-h"></i>
        </Tippy>
      )}
    </span>
  );
}

export default AreaRouteTableMenu;
