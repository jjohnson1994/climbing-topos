import { routes, areas, topos } from "../models";
import { Route, RouteView } from "../../core/types";

export const createRoute = (routeDescription: Route) => {
  return routes.createRoute(routeDescription);
}

export async function getRouteBySlug(routeSlug: string): Promise<RouteView> {
  const route = await routes.getRouteBySlug(routeSlug);
  const [topo, area] = await Promise.all([
    topos.getTopoBySlug(route.topoSlug),
    areas.getAreaBySlug(route.areaSlug)
  ]);

  return {
    ...route,
    topo,
    area
  };
}
