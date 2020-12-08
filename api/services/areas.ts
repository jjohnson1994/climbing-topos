import { areas, topos } from "../models";
import { Area } from "../../core/types";

export const createArea = (areaDetails: Area) => {
  return areas.createArea(areaDetails);
}

export const getAreaBySlug = async (slug: string) => {
  const area = await areas.getAreaBySlug(slug);
  const areaTopos = await topos.getToposByAreaSlug(area.hk, area.slug);

  return {
    ...area,
    topos: areaTopos
  };
}
