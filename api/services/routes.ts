import { routes, areas, topos } from "../models";
import { Route, RouteView } from "../../core/types";

export const createRoute = (routeDescription: Route) => {
  return routes.createRoute(routeDescription);
}

export async function getRouteBySlug(cragSlug: string, areaSlug: string, topoSlug: string, routeSlug: string): Promise<RouteView> {
  const route = await routes.getRouteBySlug(
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug
  );

  const [topo, area, siblingRoutes] = await Promise.all([
    topos.getTopoBySlug(route.topoSlug),
    areas.getAreaBySlug(route.areaSlug),
    routes.getRoutesByTopoSlug(cragSlug, areaSlug, topoSlug)
      .then(res => res.filter(route => route.slug !== routeSlug))
  ]);

  return {
    ...route,
    topo,
    area,
    siblingRoutes
  };
}
