import { areas, logs, routes, topos } from "../models";
import { AreaRequest, Area } from "../../core/types";
import { algolaIndex } from "../db/algolia";

export async function createArea(areaDetails: AreaRequest, userSub: string) {
  const newArea = await areas.createArea(areaDetails, userSub);

  algolaIndex
    .saveObject({
      ...areaDetails,
      model: "area" ,
      objectID: newArea.slug,
      slug: newArea.slug
    })
    .catch(error => {
      console.error("Error saving new area to algolia", error);
    });

  return newArea;
}

export async function getAreaBySlug(areaSlug: string, userSub: string): Promise<Area> {
  const area = await areas.getAreaBySlug(areaSlug);
  const [areaTopos, areaRoutes, userLogs] = await Promise.all([
    topos.getToposByCragArea(area.hk, areaSlug),
    routes.getRoutesByCragSlug(area.hk)
      .then(routes => routes.filter(route => route.areaSlug === areaSlug)),
    userSub
      ? logs.getLogsForUser(userSub, area.hk, areaSlug)
      : []
  ]);

  return {
    ...area,
    topos: areaTopos,
    routes: areaRoutes,
    userLogs
  };
}
