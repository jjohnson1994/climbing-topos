import { API } from "aws-amplify";
import { RouteRequest, Route, RoutePatch } from "core/types";

export function createRoute(
  routeDescription: RouteRequest
): Promise<{ routeSlug: string }> {
  return API.post("climbing-topos", `/routes`, {
    body: routeDescription,
  });
}

export function getRoute(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
): Promise<Route> {
  return API.get(
    "climbing-topos",
    `/routes?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`,
    {}
  );
}

export function updateRoute(
  routeSlug: string,
  patch: RoutePatch
): Promise<{ success: boolean }> {
  return API.patch(
    "climbing-topos",
    `/routes/${routeSlug}`,
    {
      body: patch,
    }
  );
}
