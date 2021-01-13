import {RouteRequest, Route} from "../../core/types";
import {areas, logs, routes, topos} from "../models";

export const createRoute = (routeDescription: RouteRequest, userId: string) => {
  return routes.createRoute(routeDescription, userId);
}

export async function getRouteBySlug(
  userSub: string,
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
): Promise<Route> {
  const route = await routes.getRouteBySlug(
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug
  );

  const [topo, area, siblingRoutes, userLogs] = await Promise.all([
    topos.getTopoBySlug(route.topoSlug),
    areas.getAreaBySlug(route.areaSlug),
    routes.getRoutesByTopoSlug(cragSlug, areaSlug, topoSlug)
      .then(res => res.filter(route => route.slug !== routeSlug)),
    userSub
      ? logs.getLogsForUser(userSub, cragSlug, areaSlug, topoSlug, routeSlug)
      : [],
  ]);

  return {
    ...route,
    topo,
    area,
    siblingRoutes,
    userLogs
  };
}
