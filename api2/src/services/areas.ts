import { areas, logs, routes, topos } from "../models";
import { AreaRequest, Area, Auth0UserPublicData } from "core/types";
import { crags } from ".";

export async function createArea(
  areaDetails: AreaRequest,
  user: Auth0UserPublicData
) {
  const crag = await crags.getCragBySlug(areaDetails.cragSlug, user);
  const areaVerified = crag.managedBy.sub === user.sub;
  const newArea = await areas.createArea(areaDetails, user, areaVerified);

  return newArea;
}

export async function getAreaBySlug(
  areaSlug: string,
  userSub?: string
): Promise<Area> {
  const area = (await areas.getAreaBySlug(areaSlug)) as Area;
  const [areaTopos, areaRoutes, userLogs] = await Promise.all([
    topos
      .getToposByCragArea(area.cragSlug, areaSlug)
      .then((res) =>
        res.filter(
          (topo) => topo.verified === true || topo.createdBy.sub === userSub
        )
      ),
    routes
      .getRoutesBySlug(area.cragSlug, areaSlug)
      .then((res) =>
        res.filter(
          (route) => route.verified === true || route.createdBy.sub === userSub
        )
      ),
    userSub ? logs.getLogsForUser(userSub, area.cragSlug, areaSlug) : [],
  ]);

  return {
    ...area,
    topos: areaTopos,
    routes: areaRoutes,
    userLogs,
  };
}

export async function decrementRouteCount(cragSlug: string, areaSlug: string) {
  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: "set #routeCount = #routeCount - :inc",
    ExpressionAttributeNames: {
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
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
      ":inc": 1,
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
      ":inc": -1,
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
      ":inc": 1,
    },
  });
}
