import { areas, crags, logs, routes, topos } from '../models';
import { Crag, CragBrief } from '../../core/types';
import { algolaIndex } from "../db/algolia";

export const createCrag = async (cragDetails: Crag, userSub: string) => {
  const newCrag = await crags.createCrag(cragDetails, userSub);

  algolaIndex
    .saveObject({
      ...cragDetails,
      model: "crag" ,
      objectID: newCrag.slug,
      slug: newCrag.slug
    })
    .catch(error => {
      console.error("Error saving new crag to algolia", error);
    });

  return newCrag;
}

export async function getAllCrags(user: string): Promise<CragBrief[]> {
  const allCrags = await crags
    .getAllCrags()
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

export async function incrementAreaCount(cragSlug: string) {
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

export async function incrementRouteCount(cragSlug: string) {
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

export async function incrementLogCount(cragSlug: string) {
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
