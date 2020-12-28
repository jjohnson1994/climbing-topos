import {CragView} from '../../core/types';
import { areas, crags, logs, routes } from '../models';
import { Crag } from '../types';

export const createCrag = async (cragDetails: Crag) => {
  const newCrag = await crags.createCrag(cragDetails);
  return newCrag;
}

export async function getAllCrags(): Promise<CragView[]> {
  const allCrags = await crags
    .getAllCrags()
    .then(async crags => {
      const cragViews = await Promise.all(
        crags.map(crag => new Promise<CragView>(async (resolve) => {
          const [cragAreas, cragRoutes, cragLogs] = await Promise.all([
            areas.getAreasByCragSlug(crag.slug),
            routes.getRoutesByCragSlug(crag.slug),
            logs.getLogsByCragSlug(crag.slug)
          ]);

          resolve({
            ...crag,
            areas: cragAreas,
            routes: cragRoutes,
            logsCount: cragLogs.length
          });
        }))
      );

      return cragViews;
    });

  return allCrags;
}

export async function getCragBySlug(slug: string) {
  const crag = await crags.getCragBySlug(slug);

  const [cragAreas, cragRoutes] = await Promise.all([
    areas.getAreasByCragSlug(crag.slug),
    routes.getRoutesByCragSlug(crag.slug),
  ]);


  return {
    ...crag,
    areas: cragAreas,
    routes: cragRoutes
  };
}
