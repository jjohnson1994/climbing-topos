import { topos } from "../models";
import { TopoRequest } from "../../core/types";

export function createTopo(topoDetails: TopoRequest, userSub: string) {
  return topos.createTopo(topoDetails, userSub)
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
