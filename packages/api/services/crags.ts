import { areas, crags, logs, routes, topos } from "../models";
import {
  Area,
  UserPublicData,
  Crag,
  CragBrief,
  CragPatch,
  Route,
  Topo,
} from "@climbingtopos/types";

export const createCrag = async (
  cragDetails: Crag,
  user: UserPublicData
) => {
  const newCrag = await crags.createCrag(cragDetails, user);
  return newCrag;
};

export async function getAllCrags(
  userSub: string,
  sortBy?: string,
  sortOrder?: string,
  limit?: number,
  offset?: number
): Promise<CragBrief[]> {
  const allCrags = await crags
    .getAllCrags(sortBy, sortOrder, limit, offset)
    .then(async (crags) => {
      const createCragViews = crags.map(
        (crag) =>
          new Promise<CragBrief>((resolve) => {
            Promise.all([
              userSub ? logs.getLogsForUser(userSub, crag.slug) : [],
            ]).then(([userLogs]) => {
              resolve({
                ...crag,
                userLogCount: userLogs.length,
              });
            });
          })
      );

      const cragViews = await Promise.all(createCragViews);

      return cragViews;
    });

  return allCrags;
}

export async function getCragBySlug(
  slug: string,
  userSub: string
): Promise<Crag> {
  const [crag, cragAreas, cragRoutes, cragTopos, userLogs] = await Promise.all([
    crags.getCragBySlug(slug),
    areas.getAreasByCragSlug(slug),
    routes.listRoutes(slug),
    topos.getToposByCragSlug(slug),
    userSub ? logs.getLogsForUser(userSub, slug) : [],
  ]);

  return {
    ...crag,
    areas: cragAreas,
    routes: cragRoutes,
    topos: cragTopos,
    userLogs,
  };
}

export async function getCragItemsAwaitingAproval(
  slug: string
): Promise<Array<Area | Route | Topo>> {
  const [pendingAreas, pendingRoutes, pendingTopos] = await Promise.all([
    areas
      .getAreasByCragSlug(slug)
      .then((res) => res.filter((area) => area.verified !== true)),
    routes
      .listRoutes(slug)
      .then((res) => res.filter((route) => route.verified !== true)),
    topos
      .getToposByCragSlug(slug)
      .then((res) => res.filter((topo) => topo.verified !== true)),
  ]);

  return [...pendingAreas, ...pendingRoutes, ...pendingTopos];
}

export function decrementAreaCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #areaCount = #areaCount - :inc",
    ExpressionAttributeNames: {
      "#areaCount": "areaCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export function incrementAreaCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #areaCount = #areaCount + :inc",
    ExpressionAttributeNames: {
      "#areaCount": "areaCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export function decrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #routeCount = #routeCount - :inc",
    ExpressionAttributeNames: {
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export function incrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #routeCount = #routeCount + :inc",
    ExpressionAttributeNames: {
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export function decrementLogCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1,
    },
  });
}

export function incrementLogCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
}

export async function updateCrag(cragSlug: string, cragPatch: CragPatch) {
  const expressionAttributeNames = Object.entries(cragPatch).reduce(
    (acc, [key]) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {}
  );

  const expressionAttributeValues = Object.entries(cragPatch).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value,
    }),
    {}
  );

  const updateExpression = Object.entries(cragPatch)
    .map(([key]) => {
      return `#${key} = :${key}`;
    })
    .join(", ");

  return crags.update(cragSlug, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
}
