import { topos } from "../models";
import { Topo } from "../../core/types";

export async function createTopo(topoDetails: Topo) {
  await topos.createTopo(topoDetails)
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}
