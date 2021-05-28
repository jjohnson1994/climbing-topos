import { areas, crags, logs, routes, topos } from '../models';
import { Auth0User, Crag, CragBrief } from 'core/types';

export const createCrag = async (cragDetails: Crag, user: Auth0User) => {
  const newCrag = await crags.createCrag(cragDetails, user);
  return newCrag;
}

export async function getAllCrags(
  user: Auth0User,
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
      const createCragViews = crags.map(crag => new Promise<CragBrief>((resolve) => {
        Promise.all([
          user
            ? logs.getLogsForUser(user.sub, crag.slug)
            : []
        ])
          .then(([userLogs]) => {
            resolve({
              ...crag,
              userLogCount: userLogs.length,
            });
          });
      }));

      const cragViews = await Promise.all(
        createCragViews
      );

      return cragViews;
    });

  return allCrags;
}

export async function getCragBySlug(slug: string, user: Auth0User): Promise<Crag> {
  const [crag, cragAreas, cragRoutes, cragTopos, userLogs] = await Promise.all([
    crags.getCragBySlug(slug),
    areas.getAreasByCragSlug(slug),
    routes.getRoutesByCragSlug(slug),
    topos.getToposByCragSlug(slug),
    user.sub
      ? logs.getLogsForUser(user.sub, slug)
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

export function decrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #routeCount = #routeCount - :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
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
