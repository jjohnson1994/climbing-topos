import { areas, crags, logs, routes } from '../models';
import { Crag } from '../../core/types';
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

export async function getAllCrags(user: string): Promise<Crag[]> {
  const allCrags = await crags
    .getAllCrags()
    .then(async crags => {
      const cragViews = await Promise.all(
        crags.map(crag => new Promise<Crag>(async (resolve) => {
          const [cragAreas, cragRoutes, cragLogs, userLogs] = await Promise.all([
            areas.getAreasByCragSlug(crag.slug),
            routes.getRoutesByCragSlug(crag.slug),
            logs.getLogsByCragSlug(crag.slug),
            user
              ? logs.getLogsForUser(user.sub, crag.slug)
              : []
          ]);

          resolve({
            ...crag,
            areas: cragAreas,
            routes: cragRoutes,
            logsCount: cragLogs.length,
            userLogs
          });
        }))
      );

      return cragViews;
    });

  return allCrags;
}

export async function getCragBySlug(slug: string, userSub: string): Promise<Crag> {
  const [crag, cragAreas, cragRoutes, cragLogs, userLogs] = await Promise.all([
    crags.getCragBySlug(slug),
    areas.getAreasByCragSlug(slug),
    routes.getRoutesByCragSlug(slug),
    logs.getLogsByCragSlug(slug),
    userSub
      ? logs.getLogsForUser(userSub, slug)
      : []
  ]);

  return {
    ...crag,
    areas: cragAreas,
    routes: cragRoutes,
    logsCount: cragLogs.length,
    userLogs
  };
}

export async function incrementAreaCount(cragSlug: string) {
  return crags.incrementCragAreaCount(cragSlug);
}
