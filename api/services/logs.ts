import { logs } from "../models";
import { LogRequest } from "../../core/types";

export async function logRoutes(logRequests: LogRequest[], user) {
  const requests = logRequests
    .map(logRequest => logs.createRouteLog(logRequest, user));
  return Promise.all(requests);
}
