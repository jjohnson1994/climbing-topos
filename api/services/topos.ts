import { topos } from "../models";
import { Topo } from "../../core/types";

export function createTopo(topoDetails: Topo) {
  return topos.createTopo(topoDetails)
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
