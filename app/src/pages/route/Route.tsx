import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Crag, Log, Route } from "core/types";
import { routes, logs, crags } from "../../api";
import { useGradeHelpers } from "../../api/grades";
import LoadingSpinner from "../../components/LoadingSpinner";
import RatingStarsDisplay from "../../components/RatingStarsDisplay";
import { RouteLogContext } from "../../components/RouteLogContext";
import TopoImage from "../../components/TopoImage";
import RouteLogs from "../../components/RouteLogs";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { usePageTitle } from "../../helpers/pageTitle";
import Button, { Color } from "../../elements/Button";
import useUser from "../../api/user";

function RoutePage() {
  const history = useHistory();
  const { cragSlug, areaSlug, topoSlug, routeSlug } =
    useParams<{
      cragSlug: string;
      areaSlug: string;
      topoSlug: string;
      routeSlug: string;
    }>();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>();
  const [crag, setCrag] = useState<Crag>();
  const [routeLogs, setRouteLogs] = useState<Log[]>();
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);
  const { convertGradeValueToGradeLabel } = useGradeHelpers();
  const { userCredentials, isAuthenticating, isAuthenticated } = useUser()
  const context = useContext(RouteLogContext);

  usePageTitle(route?.title);

  useEffect(() => {
    const doGetRoute = async () => {
      try {
        setLoading(true);

        const [newRoute, newCrag] = await Promise.all([
          routes.getRoute(cragSlug, areaSlug, topoSlug, routeSlug),
          crags.getCragBySlug(cragSlug),
        ]);
        setRoute(newRoute);
        setCrag(newCrag);
      } catch (error) {
        console.error("Error loading route", error);
        popupError("Oh dear, there was a problem loading this route");
      } finally {
        setLoading(false);
      }
    };

    const doGetRouteLogs = async () => {
      try {
        const newRouteLogs = await logs.getRouteLogs(
          cragSlug,
          areaSlug,
          topoSlug,
          routeSlug
        );
        setRouteLogs(newRouteLogs);
      } catch (error) {
        console.error("Error loading route logs", error);
      }
    };

    if (isAuthenticating === false) {
      doGetRoute();
      doGetRouteLogs();
    }
  }, [routeSlug, cragSlug, areaSlug, topoSlug, isAuthenticating ]);

  useEffect(() => {
    if (!crag?.managedBy.sub || !userCredentials?.identityId) {
      setIsAdmin(false);
    } else if (crag.managedBy.sub === userCredentials.identityId) {
      setIsAdmin(true);
    }
  }, [userCredentials, crag]);

  const btnVerifyOnClick = async () => {
    try {
      if (!route) {
        return;
      }

      const verify = window.confirm(
        "Are you sure you want to verify this route?"
      );

      if (verify) {
        await routes.updateRoute(route.slug, { verified: true }, );
        setRoute({
          ...route,
          verified: true,
        });
        popupSuccess("Route Verified");
      }
    } catch (error) {
      console.error("error updating area", error);
    }
  };

  const btnDoneOnClick = () => {
    if (!isAuthenticated) {
      history.push("/login");
    } else if (route) {
      context.onSingleRouteDone(route);
    }
  };

  const btnSaveToListOnClick = () => {
    if (!isAuthenticated) {
      history.push("/login");
    } else if (route) {
      context.onSingleRouteAddToList(route);
    }
  };

  const hasUserLoggedRoute = () => {
    if (route) {
      return (
        route.userLogs.length ||
        context.routesJustLogged.findIndex(
          (route) => route.slug === routeSlug
        ) !== -1
      );
    }

    return false;
  };

  return (
    <>
      {loading && (
        <section className="section">
          <LoadingSpinner />
        </section>
      )}
      {!loading && (
        <>
          <section className="section pt-5">
            <div className="container">
              <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <a href={`/crags/${route?.cragSlug}`}>{route?.cragTitle}</a>
                  </li>
                  <li>
                    <a
                      href={`/crags/${route?.cragSlug}/areas/${route?.areaSlug}`}
                    >
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
                            route.gradingSystem
                          )
                        : ""}
                      <span> </span>
                      {route?.routeType}
                      <span> </span>
                      <RatingStarsDisplay stars={route?.rating || 0} />
                    </h6>
                    <h6 className="subtitle is-6">{route?.description}</h6>
                    {isAdmin === true && route?.verified === false && (
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
                  <div className="column">
                    <div
                      className="is-flex is-flex-direction-column is-justify-content-space-between"
                      style={{ height: "100%" }}
                    >
                      <div className="is-flex is-justify-content-flex-end">
                        <div className="tags mb-1">
                          {route?.verified === false && (
                            <span className="tag is-info">
                              Awaiting Verification
                            </span>
                          )}
                          {route?.tags.map((tag) => (
                            <label key={tag} className="tag is-capitalize">
                              {tag}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="field has-addons has-addons-right is-horizontal">
                        <p className="control">
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
                        </p>
                        <p className="control">
                          <button
                            className="button"
                            onClick={btnSaveToListOnClick}
                          >
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
                  ""
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
      )}
    </>
  );
}

export default RoutePage;
