import { Route, RouteRequest } from "../../core/types";
import { algolaIndex } from "../db/algolia";
import { areas, crags, routes, topos, globals } from "../repositories";

export async function createRoute(routeDescription: RouteRequest, userSub: string) {
  const newRouteSlug = await routes.createRoute(routeDescription, userSub);

  try {
    const topo = await topos.getTopoBySlug(routeDescription.topoSlug);
    const area = await areas.getAreaBySlug(topo.areaSlug, userSub);
    const crag = await crags.getCragBySlug(area.cragSlug, userSub);
    const { gradingSystems, routeTags } = await globals.getAllGlobals();

    algolaIndex
      .saveObject({
        title: routeDescription.title,
        grade: gradingSystems
          ?.find(({ id }) => `${id}` === `${routeDescription.gradingSystemId}`)
          ?.grades[parseInt(routeDescription.gradeIndex, 10)],
        tags: routeTags
          .filter(({ id }) => routeDescription.tags.includes(`${id}`))
          .map(({ title }) => title),
        rockType: crag.rockTypeTitle,
        orientation: topo.orientationTitle,
        model: "route",
        objectID: newRouteSlug,
        slug: newRouteSlug,
        cragSlug: crag.slug,
        areaSlug: area.slug,
        toposSlug: topo.slug
      });
  } catch(error) {
    console.error("Error saving new route to algolia", error);
  }

  return newRouteSlug;
}

export function getRouteBySlug(userSub: string, routeSlug: string): Promise<Route> {
  return routes.getRouteBySlug(routeSlug, userSub);
}
