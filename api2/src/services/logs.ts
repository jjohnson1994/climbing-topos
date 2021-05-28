import { logs } from "../models";
import { Auth0User, LogRequest } from "core/types";

export async function logRoutes(logRequests: LogRequest[], user: Auth0User) {
  const requests = logRequests
    .map(logRequest => logs.createRouteLog(logRequest, user));
  return Promise.all(requests);
}

export async function getUserLogs(userSub: string, cragSlug: string, areaSlug: string, topoSlug: string, routeSlug: string) {
  return logs.getLogsForUser(userSub, cragSlug, areaSlug, topoSlug, routeSlug);
}
