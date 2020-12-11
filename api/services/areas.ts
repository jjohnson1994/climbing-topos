import { areas, routes, topos } from "../models";
import { Area } from "../../core/types";

export const createArea = (areaDetails: Area) => {
  return areas.createArea(areaDetails);
}

export const getAreaBySlug = async (slug: string) => {
  const area = await areas.getAreaBySlug(slug);
  const areaTopos = await topos.getToposByCragArea(area.hk, area.slug)
  const areaRoutes = await routes
    .getRoutesByCragSlug(area.hk)
    .then(routes => routes.filter(route => route.areaSlug === slug));

  return {
    ...area,
    topos: areaTopos,
    routes: areaRoutes
  };
}
