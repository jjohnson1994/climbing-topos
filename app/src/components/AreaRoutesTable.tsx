import Tippy from '@tippyjs/react';
import React, { ChangeEvent, useContext } from "react";
import { Link } from "react-router-dom";
import { Log, Route } from "../../../core/types";
import { RouteLogContext } from './RouteLogContext';
import { useUserPreferences } from '../api/profile';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {
  loggedRoutes: Log[];
  routes: Route[] | undefined;
  showIndex?: boolean,
}

function AreaRoutesTable({ showIndex = true, routes, loggedRoutes, }: Props) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const context = useContext(RouteLogContext);

  const { convertGradeToUserPreference } = useUserPreferences();

  const chkRouteOnChange = (event: ChangeEvent<HTMLInputElement>, route: Route) => {
    if (context.selectedRoutes.findIndex(({ slug }) => slug === route.slug) > -1) {
      context.onRouteDeselected(route);
    } else {
      context.onRouteSelected(route);
    }
  }

  const hasUserLoggedRoute = (routeSlug: string) => {
    return loggedRoutes.findIndex(log => log.routeSlug === routeSlug) !== -1
      || context.routesJustLogged.findIndex(route => route.slug === routeSlug) !== -1;
  }

  const btnSingleRouteDoneOnClick = (route: Route) => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      context.onSingleRouteDone(route)
    }
  }

  const btnSingleRouteAddToListOnClick = (route: Route) => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      context.onSingleRouteAddToList(route);
    }
  }

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          { showIndex && (
            <th></th>
          )}
          <th>Title</th>
          <th>Grade</th>
          <th>Rating</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {routes?.map((route, index) => (
          <tr key={ route.title } className={ hasUserLoggedRoute(String(route.slug)) ? "line-through" : "" }>
            { showIndex && (
              <td>{ index + 1 }</td>
            )}
            <td className="is-capitalized">
              <Link to={ `/crags/${route.cragSlug}/areas/${route.areaSlug}/topo/${route.topoSlug}/routes/${route.slug}` }>{ route.title }</Link>
            </td>
            <td>{ convertGradeToUserPreference(parseInt(route.gradeIndex), route.gradingSystemId, route.routeTypeId) }</td>
            <td>{ route.rating !== -1 ? route.rating : "" }</td>
            <td> { context.isSelectingMultiple
              ? (
                  <input
                    type="checkbox"
                    checked={ context.selectedRoutes.findIndex(({ slug }) => slug === route.slug) !== -1 }
                    onChange={ (e) => chkRouteOnChange(e, route) }
                  />
                )
              : (
                  <Tippy
                    trigger="click"
                    interactive={ true }
                    theme="light-border"
                    placement="bottom-end"
                    hideOnClick={ true }
                    content={
                      <div className="dropdown is-active">
                        <div className="dropdown-menu" style={{ position: "relative" }}>
                          <div className="dropdown-content">
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => { btnSingleRouteDoneOnClick(route) } }
                            >
                              <span className="icon">
                                <i className="fas fw fa-check"></i>
                              </span>
                              <span>Done</span>
                            </button>
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => { btnSingleRouteAddToListOnClick(route) } }
                            >
                              <span className="icon">
                                <i className="fas fw fa-list"></i>
                              </span>
                              <span>Save to List</span>
                            </button>
                            <hr className="dropdown-divider" />
                            <button
                              className="dropdown-item button is-white is-cursor-pointer"
                              onClick={ () => context.onInitSelectMultiple(true, route) }
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
                )
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AreaRoutesTable;
