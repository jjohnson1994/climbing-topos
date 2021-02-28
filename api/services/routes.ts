import {RouteRequest, Route} from "../../core/types";
import {areas, logs, routes, topos} from "../models";
import { algolaIndex } from "../db/algolia";

export async function createRoute(routeDescription: RouteRequest, userId: string) {
  const newRoute = await routes.createRoute(routeDescription, userId);

  algolaIndex
    .saveObject({
      ...routeDescription,
      model: "route",
      objectID: newRoute.slug,
      slug: newRoute.slug,
    })
    .catch(error => {
      console.error("Error saving new route to algolia", error);
    });

  return newRoute;
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

export async function incrementLogCount(
  cragSlug: string, 
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
) {
  return routes.update(cragSlug, areaSlug, topoSlug, routeSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}
