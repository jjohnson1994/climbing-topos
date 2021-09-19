import { topos } from "../models";
import { crags } from "../services";
import { Auth0UserPublicData, TopoRequest } from "core/types";

export async function createTopo(topoDetails: TopoRequest, user: Auth0UserPublicData) {
  const crag = await crags.getCragBySlug(topoDetails.cragSlug, user);
  const topoVerified = crag.managedBy.sub === user.sub;

  return topos.createTopo(topoDetails, user, topoVerified);
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
