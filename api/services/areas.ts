import { areas, logs, routes, topos } from "../models";
import { Area, AreaView } from "../../core/types";

export function createArea(areaDetails: Area) {
  return areas.createArea(areaDetails);
}

export async function getAreaBySlug(areaSlug: string, user): Promise<AreaView> {
  const area = await areas.getAreaBySlug(areaSlug);
  const [areaTopos, areaRoutes, userLogs] = await Promise.all([
    topos.getToposByCragArea(area.hk, areaSlug),
    routes.getRoutesByCragSlug(area.hk)
      .then(routes => routes.filter(route => route.areaSlug === areaSlug)),
    user
      ? logs.getLogsForUserAtArea(user.sub, area.cragSlug, areaSlug)
      : []
  ]);

  return {
    ...area,
    topos: areaTopos,
    routes: areaRoutes,
    userLogs
  };
}
