"use client"

import Head from "next/head"
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { Crag, Log, Route } from "@climbingtopos/types";
import { routes, logs, crags } from "@/app/api";
import { useGradeHelpers } from "@/app/api/grades";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RatingStarsDisplay from "@/app/components/RatingStarsDisplay";
import { RouteLogContext } from "@/app/components/RouteLogContext";
import TopoImage from "@/app/components/TopoImage";
import RouteLogs from "@/app/components/RouteLogs";
import { popupError, popupSuccess } from "@/app/helpers/alerts";
import { usePageTitle } from "@/app/helpers/pageTitle";
import Button, { Color } from "@/app/elements/Button";
import useUser from "@/app/api/user";

function RoutePage({ params }: { params: { cragSlug: string, areaSlug: string, topoSlug: string, routeSlug: string } }) {
  const router = useRouter();
  const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
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
      router.push("/login");
    } else if (route) {
      context.onSingleRouteDone(route);
    }
  };

  const btnSaveToListOnClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
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
          {route && crag && (
            <Head>
              <title>{route.title} | {route.areaTitle} | ClimbingTopos.com</title>
              <link rel="canonical" href={`https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}/topo/${route.topoSlug}/routes/${route.slug}` }/>
              <meta name="description" content={`${route.title}, ${route.areaTitle}, ${route.cragTitle} climbing guide and topo`}/>
              <meta property="og:type" content="website" />
              <meta property="og:title" content={`${route.title} | ${route.areaTitle} | ClimbingTopos.com`} />
              <meta property="og:url" content={`https://climbingtopos.com/crags/${route.cragSlug}/areas/${route.areaSlug}/topo/${route.topoSlug}/routes/${route.slug}` } />
              <meta property="og:description" content={`${route.title}, ${route.areaTitle}, ${route.cragTitle} climbing guide and topo`} />
              <meta property="og:image" content={`${crag.image}`} />
            </Head>
          )}
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

