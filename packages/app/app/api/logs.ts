import { Log, LogRequest } from "@climbingtopos/types";
import { queryStringFromObject } from "@/app/helpers/queryString";
import { API } from "aws-amplify";

export function logRoutes(logs: LogRequest[]) {
  return API.post("climbingtopos2-api", `/logs`, {
    body: { logs },
  });
}

export function getProfileLogs(
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  const queryString = queryStringFromObject({
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug,
  });

  return API.get("climbingtopos2-api", `/profile/logs${queryString}`, {});
}

export function getUserLogs(
  userSub: string,
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  return API.get(
    "climbingtopos2-api",
    `/${userSub}?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`,
    {}
  );
}

export function getRouteLogs(
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  return API.get("climbingtopos2-api", "/routes/logs", {
    queryStringParameters: { cragSlug, areaSlug, topoSlug, routeSlug },
  });
}
