import Tippy from '@tippyjs/react';
import { ChangeEvent, useContext } from "react";
import { Link } from "react-router-dom";
import { Log, Route } from "core/types";
import { RouteLogContext } from './RouteLogContext';
import { useGradeHelpers } from '../api/grades';
import { useAuth0 } from '@auth0/auth0-react';
import RatingStarsDisplay from './RatingStarsDisplay';

interface Props {
  routes: Route[] | undefined;
  loggedRoutes: Log[];
}

function AreaRoutesTable({ routes, loggedRoutes, }: Props) {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const context = useContext(RouteLogContext);

  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  const chkRouteOnChange = (event: ChangeEvent<HTMLInputElement>, route: Route) => {
    if (context.selectedRoutes.findIndex(({ slug }) => slug === route.slug) > -1) {
      context.onRouteDeselected(route);
    } else {
      context.onRouteSelected(route);
    }
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

  const hasUserLoggedRoute = (routeSlug: string) => {
    return loggedRoutes.findIndex(log => log.routeSlug === routeSlug) !== -1
      || context.routesJustLogged.findIndex(route => route.slug === routeSlug) !== -1;
  }

  return (
    <>
    <div>
      {routes?.map((route, index) => (
        <div className="box block is-flex" key={ index }>
          <div className="is-flex mr-4 is-justify-content-center is-align-items-center">
            <span>{ index + 1 }</span>
          </div>
          <div className="is-flex is-flex-direction-column is-flex-grow-1">
            <span className="mb-2">
              <Link to={ `/crags/${route.cragSlug}/areas/${route.areaSlug}/topo/${route.topoSlug}/routes/${route.slug}` } className={ hasUserLoggedRoute(String(route.slug)) ? "line-through" : "" }>{ route.title }</Link>
              <span className="mr-2"></span>
              <RatingStarsDisplay stars={ route.rating } />
            </span>
            <div className="tags">
              {route.verified !== true && (
                <span className="tag is-info">Not Verified</span>
              )}
              <span className="tag">{ convertGradeValueToGradeLabel(route.gradeModal, route.gradingSystem) }</span>
              <span className="tag">{ route.routeType }</span>
              <span className="tag">{ route.logCount } Ticks</span>
            </div>
          </div>
          <div>
            <span>{ context.isSelectingMultiple
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
            </span>
          </div>
        </div>
      ))}
    </div>
  </>
  )
}

export default AreaRoutesTable;
