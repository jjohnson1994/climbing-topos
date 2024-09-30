import { API } from "aws-amplify";
import { RouteRequest, Route, RoutePatch } from "core/types";

export function createRoute(
  routeDescription: RouteRequest
): Promise<{ routeSlug: string }> {
  return API.post("climbingtopos2-api", `/routes`, {
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
    "climbingtopos2-api",
    `/routes?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`,
    {}
  );
}

export function updateRoute(
  routeSlug: string,
  patch: RoutePatch
): Promise<{ success: boolean }> {
  return API.patch(
    "climbingtopos2-api",
    `/routes/${routeSlug}`,
    {
      body: patch,
    }
  );
}
