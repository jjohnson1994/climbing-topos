import { logs } from "../models";
import { UserPublicData, Log, LogRequest } from "@climbingtopos/types";

export async function logRoutes(logRequests: LogRequest[], user: UserPublicData) {
  const requests = logRequests
    .map(logRequest => logs.createRouteLog(logRequest, user));
  return Promise.all(requests);
}

export async function getUserLogs(userSub: string, cragSlug: string, areaSlug: string, topoSlug: string, routeSlug: string) {
  return logs.getLogsForUser(userSub, cragSlug, areaSlug, topoSlug, routeSlug);
}

export async function getLogs(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string,
): Promise<Log[]> {
  return logs.getLogs(cragSlug, areaSlug, topoSlug, routeSlug);
}
