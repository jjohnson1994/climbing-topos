import { logs } from "../repositories";
import { LogRequest } from "../../core/types";

export async function logRoutes(logRequests: LogRequest[], userSub: string) {
  return logs.createRouteLogs(logRequests, userSub);
}

export async function getUserLogs(userSub: string) {
  return logs.getLogsForUser(userSub);
}
