import { logs } from "../services";
import { LogRequest, Route } from "../../core/types";
import { routes } from "../models";

async function validateRoutes(logRequests: LogRequest[]) {
  const loggingRoutes: Route[] = await Promise.all(logRequests.map(
    log => routes.getRouteBySlug(
      log.cragSlug,
      log.areaSlug,
      log.topoSlug,
      log.routeSlug
    ))
  );

  const undefinedRoutes = loggingRoutes.filter(route => !route.slug);

  if (undefinedRoutes.length === 0) {
    return true;
  } else {
    return false;
  }
}

export async function postLogs(req, res) {
  try {
    const logsDetails = req.body.logs as LogRequest[];
    const allRoutesAreValid = await validateRoutes(logsDetails);

    if (allRoutesAreValid === false) {
      return res.status(400).json({ errorL: true });
    }

    const { user } = req;

    await logs.logRoutes(logsDetails, user);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error logging routes", error);
    res.status(500).json({ error: true });
  }
}
