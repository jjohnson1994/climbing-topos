import { areas, logs, routes, topos } from "../models";
import { Area, AreaView } from "../../core/types";

export function createArea(areaDetails: Area, userSub: string) {
  return areas.createArea(areaDetails, userSub);
}

export async function getAreaBySlug(areaSlug: string, userSub: string): Promise<AreaView> {
  const area = await areas.getAreaBySlug(areaSlug);
  const [areaTopos, areaRoutes, userLogs] = await Promise.all([
    topos.getToposByCragArea(area.hk, areaSlug),
    routes.getRoutesByCragSlug(area.hk)
      .then(routes => routes.filter(route => route.areaSlug === areaSlug)),
    userSub
      ? logs.getLogsForUser(userSub, area.hk, areaSlug)
      : []
  ]);

  return {
    ...area,
    topos: areaTopos,
    routes: areaRoutes,
    userLogs
  };
}
