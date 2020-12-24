import { logs } from "../models";
import { LogRequest } from "../../core/types";

export async function logRoutes(logRequests: LogRequest[]) {
  console.log(logRequests);
  const requests = logRequests
    .map(logRequest => logs.createRouteLog(logRequest));
  return Promise.all(requests);
}
