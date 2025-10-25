import { areas, crags, logs, routes, topos } from '../models';
import {
  Area,
  UserPublicData,
  Crag,
  CragBrief,
  CragPatch,
  Route,
  Topo,
} from '@climbingtopos/types';

export const createCrag = async (cragDetails: Crag, user: UserPublicData) => {
  const newCrag = await crags.createCrag(cragDetails, user);
  return newCrag;
};

export async function getAllCrags(
  userSub: string,
  sortBy?: string,
  sortOrder?: 'DESC' | 'ASC',
  limit?: number,
  offset?: number,
): Promise<CragBrief[]> {
  // Fetch all crags - we need them all to add userLogCount and for sorting
  let allCrags: Crag[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined = undefined;

  // Paginate through all results
  do {
    const response = await crags.getAllCrags(undefined, lastEvaluatedKey);
    allCrags = allCrags.concat(response.items);
    lastEvaluatedKey = response.lastEvaluatedKey;
  } while (lastEvaluatedKey);

  // Add userLogCount to each crag
  const createCragViews = allCrags.map(
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
      }),
  );

  let cragViews = await Promise.all(createCragViews);

  // Apply sorting if requested
  if (sortBy) {
    cragViews = cragViews.sort((cragA, cragB) => {
      const valueA = cragA[sortBy as keyof CragBrief];
      const valueB = cragB[sortBy as keyof CragBrief];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'DESC' ? valueB - valueA : valueA - valueB;
      }
      return 0;
    });
  }

  // Apply pagination if requested
  if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
    cragViews = cragViews.slice(offset, offset + limit);
  } else if (typeof offset !== 'undefined') {
    cragViews = cragViews.slice(offset);
  } else if (typeof limit !== 'undefined') {
    cragViews = cragViews.slice(0, limit);
  }

  return cragViews;
}

export async function getCragBySlug(
  slug: string,
  userSub: string,
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
  slug: string,
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
    UpdateExpression: 'set #areaCount = #areaCount - :inc',
    ExpressionAttributeNames: {
      '#areaCount': 'areaCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export function incrementAreaCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: 'set #areaCount = #areaCount + :inc',
    ExpressionAttributeNames: {
      '#areaCount': 'areaCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export function decrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: 'set #routeCount = #routeCount - :inc',
    ExpressionAttributeNames: {
      '#routeCount': 'routeCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export function incrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: 'set #routeCount = #routeCount + :inc',
    ExpressionAttributeNames: {
      '#routeCount': 'routeCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export function decrementLogCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: 'set #logCount = #logCount + :inc',
    ExpressionAttributeNames: {
      '#logCount': 'logCount',
    },
    ExpressionAttributeValues: {
      ':inc': -1,
    },
  });
}

export function incrementLogCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: 'set #logCount = #logCount + :inc',
    ExpressionAttributeNames: {
      '#logCount': 'logCount',
    },
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  });
}

export async function updateCrag(cragSlug: string, cragPatch: CragPatch) {
  const expressionAttributeNames = Object.entries(cragPatch).reduce(
    (acc, [key]) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {},
  );

  const expressionAttributeValues = Object.entries(cragPatch).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value,
    }),
    {},
  );

  const updateExpression = Object.entries(cragPatch)
    .map(([key]) => {
      return `#${key} = :${key}`;
    })
    .join(', ');

  return crags.update(cragSlug, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
}
