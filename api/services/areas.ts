import { areas, logs, routes, topos } from "../models";
import { AreaRequest, Area } from "../../core/types";

export async function createArea(areaDetails: AreaRequest, userSub: string) {
  const newArea = await areas.createArea(areaDetails, userSub);

  return newArea;
}

export async function getAreaBySlug(areaSlug: string, userSub: string): Promise<Area> {
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

export async function decrementRouteCount(cragSlug: string, areaSlug: string) {
  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: "set #routeCount = #routeCount - :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}

export async function incrementRouteCount(cragSlug: string, areaSlug: string) {
  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: "set #routeCount = #routeCount + :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}

export async function incrementLogCount(cragSlug: string, areaSlug: string) {
  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}
