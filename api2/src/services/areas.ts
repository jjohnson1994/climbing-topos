import { areas, logs, routes, topos } from "../models";
import { AreaRequest, Area, Auth0UserPublicData, AreaPatch } from "core/types";
import { crags } from ".";
import { getAuth0UserPublicDataFromEvent } from "../utils/auth";

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
      .listRoutes(area.cragSlug, areaSlug)
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

export async function updateArea(
  cragSlug: string,
  areaSlug: string,
  areaPatch: AreaPatch,
) {
  const expressionAttributeNames = Object.entries(areaPatch).reduce(
    (acc, [key]) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {}
  );

  const expressionAttributeValues = Object.entries(areaPatch).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value,
    }),
    {}
  );

  const updateExpression = Object.entries(areaPatch).map(
    ([key]) => {
      return `#${key} = :${key}`;
    }
  ).join(', ');

  return areas.update(cragSlug, areaSlug, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
}
