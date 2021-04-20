import { areas, crags, logs, routes, topos } from '../models';
import { Crag, CragBrief } from '../../core/types';

export const createCrag = async (cragDetails: Crag, userSub: string) => {
  const newCrag = await crags.createCrag(cragDetails, userSub);
  return newCrag;
}

export async function getAllCrags(
  user: string,
  sortBy?: string,
  sortOrder?: string,
  limit?: number,
  offset?: number
): Promise<CragBrief[]> {
  const allCrags = await crags
    .getAllCrags(
      sortBy,
      sortOrder,
      limit,
      offset
    )
    .then(async crags => {
      const cragViews = await Promise.all(
        crags.map(crag => new Promise<CragBrief>(async (resolve) => {
          const [userLogs] = await Promise.all([
            user
              ? logs.getLogsForUser(user.sub, crag.slug)
              : []
          ]);

          resolve({
            ...crag,
            userLogCount: userLogs.length,
          });
        }))
      );

      return cragViews;
    });

  return allCrags;
}

export async function getCragBySlug(slug: string, userSub: string): Promise<Crag> {
  const [crag, cragAreas, cragRoutes, cragTopos, userLogs] = await Promise.all([
    crags.getCragBySlug(slug),
    areas.getAreasByCragSlug(slug),
    routes.getRoutesByCragSlug(slug),
    topos.getToposByCragSlug(slug),
    userSub
      ? logs.getLogsForUser(userSub, slug)
      : []
  ]);

  return {
    ...crag,
    areas: cragAreas,
    routes: cragRoutes,
    topos: cragTopos,
    userLogs
  };
}

export function incrementAreaCount(cragSlug: string) {
  console.log({ cragSlug })
  return crags.update(cragSlug, {
    UpdateExpression: "set #areaCount = #areaCount + :inc",
    ExpressionAttributeNames: { 
      "#areaCount": "areaCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
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
      ":inc": 1
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
      ":inc": 1
    },
  });
}
