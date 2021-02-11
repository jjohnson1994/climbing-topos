import { areas, crags, globals, logs, routes, topos } from "../repositories";
import { AreaRequest, Area } from "../../core/types";
import { algolaIndex } from "../db/algolia";

export async function createArea(areaDetails: AreaRequest, userSub: string) {
  const newArea = await areas.createArea(areaDetails, userSub);

  try {
    const crag = await crags.getCragBySlug(areaDetails.cragSlug, userSub);
    const { areaTags } = await globals.getAllGlobals();

    algolaIndex
      .saveObject({
        title: areaDetails.title,
        tags: areaTags
          .filter(({ id }) => areaDetails.tags.includes(`${id}`))
          .map(({ title }) => title),
        osmData: crag.osmData,
        rockType: crag.rockTypeTitle,
        model: "area" ,
        objectID: newArea.slug,
        slug: newArea.slug,
        cragSlug: crag.slug
      })
      .catch(error => {
        console.error("Error saving new area to algolia", error);
      });
  } catch(error) {
    console.error("Error saving new area to algolia", error);
  }

  return newArea;
}

export async function getAreaBySlug(areaSlug: string, userSub: string): Promise<Area> {
  return areas.getAreaBySlug(areaSlug, userSub);
}
