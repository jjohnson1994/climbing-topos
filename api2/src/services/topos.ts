import { topos } from "../models";
import { Auth0UserPublicData, TopoRequest } from "core/types";

export function createTopo(topoDetails: TopoRequest, user: Auth0UserPublicData) {
  return topos.createTopo(topoDetails, user)
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
