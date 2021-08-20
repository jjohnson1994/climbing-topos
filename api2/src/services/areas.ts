import { areas, logs, routes, topos } from "../models";
import { AreaRequest, Area, Auth0UserPublicData } from "core/types";

export async function createArea(areaDetails: AreaRequest, user: Auth0UserPublicData) {
  const newArea = await areas.createArea(areaDetails, user);

  return newArea;
}

export async function getAreaBySlug(areaSlug: string, userSub: string | undefined): Promise<Area> {
  const area = await areas.getAreaBySlug(areaSlug) as Area;
  const [areaTopos, areaRoutes, userLogs] = await Promise.all([
    topos.getToposByCragArea(area.cragSlug, areaSlug),
    routes.getRoutesByCragSlug(area.cragSlug)
      .then(routes => routes.filter(route => route.areaSlug === areaSlug)),
    userSub
      ? logs.getLogsForUser(userSub, area.cragSlug, areaSlug)
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

export async function decrementLogCount(cragSlug: string, areaSlug: string) {
  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1
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
