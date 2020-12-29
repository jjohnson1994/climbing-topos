import {CragView} from '../../core/types';
import { areas, crags, logs, routes } from '../models';
import { Crag } from '../types';

export const createCrag = async (cragDetails: Crag) => {
  const newCrag = await crags.createCrag(cragDetails);
  return newCrag;
}

export async function getAllCrags(user): Promise<CragView[]> {
  const allCrags = await crags
    .getAllCrags()
    .then(async crags => {
      const cragViews = await Promise.all(
        crags.map(crag => new Promise<CragView>(async (resolve) => {
          const [cragAreas, cragRoutes, cragLogs, userLogs] = await Promise.all([
            areas.getAreasByCragSlug(crag.slug),
            routes.getRoutesByCragSlug(crag.slug),
            logs.getLogsByCragSlug(crag.slug),
            user
              ? logs.getLogsForUserAtCrag(user.sub, crag.slug)
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

export async function getCragBySlug(slug: string, user): Promise<CragView> {
  const [crag, cragAreas, cragRoutes, cragLogs, userLogs] = await Promise.all([
    crags.getCragBySlug(slug),
    areas.getAreasByCragSlug(slug),
    routes.getRoutesByCragSlug(slug),
    logs.getLogsByCragSlug(slug),
    user
      ? logs.getLogsForUserAtCrag(user.sub, slug)
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
