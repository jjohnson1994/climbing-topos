import {useAuth0} from "@auth0/auth0-react";
import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Route} from "../../../../core/types";
import {routes} from "../../api";
import RoutesAddToLogModal from "../../components/RoutesAddToLogModal";
import { RouteLogContext } from '../../components/RouteLogContext';
import TopoImage from "../../components/TopoImage";
import {popupError} from "../../helpers/alerts";
import {usePageTitle} from "../../helpers/pageTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUserPreferences } from "../../api/profile";


function RoutePage() {
  const { getAccessTokenSilently, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { cragSlug, areaSlug, topoSlug, routeSlug } = useParams<{ cragSlug: string; areaSlug: string; topoSlug: string; routeSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>();
  const [routeJustLogged, setRouteJustLogged] = useState<Boolean>(false); 
  const { convertGradeToUserPreference } = useUserPreferences();

  const context = useContext(RouteLogContext);

  usePageTitle(route?.title);

  useEffect(() => {
    const doGetRoute = async () => {
      try {
        setLoading(true);
        const token = isAuthenticated
          ? await getAccessTokenSilently()
          : "";
        const newRoute = await routes.getRoute(token, cragSlug, areaSlug, topoSlug, routeSlug);
        setRoute(newRoute);
      } catch (error) {
        console.error("Error loading route", error);
        popupError("Oh dear, there was a problem loading this route");
      } finally {
        setLoading(false);
      }
    }

    if (isLoading === false) {
      doGetRoute();
    }
  }, [routeSlug, isAuthenticated, isLoading]);

  const btnDoneOnClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect(); 
    } else if (route) {
      context.onSingleRouteDone(route);
    }
  }

  const btnSaveToListOnClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect(); 
    } else if (route) {
      context.onSingleRouteAddToList(route);
    }
  }

  const hasUserLoggedRoute = () => {
    if (route) {
      return route.userLogs.length
        || context.routesJustLogged.findIndex(route => route.slug === routeSlug) !== -1;
    }

    return false;
  }

  return (
    <>
      { loading && (
        <section className="section">
          <LoadingSpinner />
        </section>
      )}
      <section className={ `section ${ loading ? "is-hidden" : "" }` }>
        <div className="container">
          <div className="block">
            <div className="columns">
              <div className="column is-two-thirds">
                <h1 className="title is-spaced is-capitalized">{ route?.title }</h1>
                <h6 className="subtitle is-6">
                  { route ? convertGradeToUserPreference(parseInt(route.grade), route.routeType) : "" }
                  <span> </span>
                  { route?.routeType }
                </h6>
                <h6 className="subtitle is-6">{ route?.description }</h6>
              </div>
              <div className="column">
                <div className="is-flex is-flex-direction-column is-justify-content-space-between" style={{ height: "100%" }}>
                  <div className="is-flex is-justify-content-flex-end">
                    <div className="tags mb-1">
                      {route?.tags.map(tag => (
                        <label key={ tag } className="tag is-primary is-capitalize">
                          { tag }
                        </label>
                      ))} 
                    </div>
                  </div>
                  <div className="field has-addons has-addons-right is-horizontal">
                    <p className="control">
                      <button className="button" onClick={ btnDoneOnClick }>
                        { hasUserLoggedRoute()
                          ? (
                            <>
                              <span className="icon is-small">
                                <i className="fas fw fa-check"></i>
                              </span>
                              <span>Done</span>
                            </>
                          )
                          : (
                            <>
                              <span className="icon is-small">
                                <i className="fas fw fa-plus"></i>
                              </span>
                              <span>Log Book</span>
                            </>
                          )
                        }
                      </button>
                    </p>
                    <p className="control">
                      <button className="button" onClick={ btnSaveToListOnClick }>
                        <span className="icon is-small">
                          <i className="fas fw fa-list"></i>
                        </span>
                        <span>Save to List</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block">
            { route?.drawing
              ? <TopoImage
                  routes={[route, ...route.siblingRoutes]}
                  highlightedRouteSlug={ route.slug }
                  background={ `${route?.topo?.image}` }
                />
              : ""
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default RoutePage;
