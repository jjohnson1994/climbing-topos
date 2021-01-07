import { topos } from "../models";
import { Topo } from "../../core/types";

export function createTopo(topoDetails: Topo, userSub: string) {
  return topos.createTopo(topoDetails, userSub)
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
